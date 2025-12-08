/*
 * Water Quality Monitoring & Leakage Detection System
 * NodeMCU ESP8266 Based IoT Project
 *
 * Features:
 * - TDS measurement for water quality
 * - Flow rate measurement using turbine + IR sensor
 * - Leakage detection by comparing with expected flow
 * - Real-time data upload to Firebase & ThingSpeak
 * - Notifications on abnormalities
 */

#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <time.h>
#include "config.h"
#include "secrets.h"

// Firebase objects
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// TDS Sensor Variables
float tdsValue = 0;
float voltage = 0;
float temperature = DEFAULT_TEMPERATURE; // From config.h

// Flow Sensor Variables
volatile int pulseCount = 0;
unsigned long oldTime = 0;
float flowRate = 0;
float totalMilliLitres = 0;
float expectedFlowRate = 0; // Will be fetched from Firebase

// Leak Detection Variables
bool leakDetected = false;
bool previousLeakState = false;
unsigned long leakDetectedTime = 0;

// Timing Variables
unsigned long lastSendTime = 0;
unsigned long lastNotificationTime = 0;

// Status flags
bool systemInitialized = false;
bool wifiConnected = false;
bool firebaseConnected = false;

// Function declarations
void ICACHE_RAM_ATTR pulseCounter();

void setup()
{
    Serial.begin(115200);
    Serial.println("\n\nWater Monitoring System Starting...");

    // Pin setup
    pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
    pinMode(LEAK_SENSOR_PIN, INPUT_PULLUP);
    pinMode(LED_PIN, OUTPUT);
    pinMode(TDS_SENSOR_PIN, INPUT);

    // Attach interrupt for flow sensor
    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);

    // Connect to WiFi
    connectWiFi();

    // Configure time (needed for timestamps)
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");

    // Initialize Firebase
    initFirebase();

    // Get expected flow rate from Firebase
    fetchExpectedFlowRate();

    systemInitialized = true;
    Serial.println("System initialized successfully!");
    blinkLED(3);
}

void loop()
{
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED)
    {
        wifiConnected = false;
        connectWiFi();
    }
    else
    {
        wifiConnected = true;
    }

    // Read sensors
    readTDSSensor();
    calculateFlowRate();
    checkLeakSensor();

    // Send data at regular intervals
    if (millis() - lastSendTime >= SEND_INTERVAL)
    {
        lastSendTime = millis();

        // Send to Firebase
        sendDataToFirebase();

        // Send to ThingSpeak
        sendDataToThingSpeak();

        // Check for abnormalities and send notifications
        checkAbnormalities();

        // Print to Serial for debugging
        printSensorData();
    }

    delay(100);
}

// Interrupt service routine for pulse counting
void ICACHE_RAM_ATTR pulseCounter()
{
    pulseCount++;
}

void connectWiFi()
{
    Serial.print("Connecting to WiFi: ");
    Serial.println(WIFI_SSID);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\nWiFi connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        wifiConnected = true;
        digitalWrite(LED_PIN, HIGH); // Turn on LED when connected
    }
    else
    {
        Serial.println("\nWiFi connection failed!");
        wifiConnected = false;
        digitalWrite(LED_PIN, LOW); // Turn off LED when disconnected
    }
}

void initFirebase()
{
    Serial.println("Initializing Firebase...");

    // Assign the API key
    config.api_key = FIREBASE_API_KEY;

    // Assign the user sign in credentials
    auth.user.email = FIREBASE_USER_EMAIL;
    auth.user.password = FIREBASE_USER_PASSWORD;

    // Assign the RTDB URL
    config.database_url = FIREBASE_DATABASE_URL;

    // Initialize Firebase
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    // Set read/write timeout
    firebaseData.setBSSLBufferSize(1024, 1024);
    firebaseData.setResponseSize(1024);

    Serial.println("Firebase initialized!");
    firebaseConnected = true;
}

void readTDSSensor()
{
    // Read analog value
    int sensorValue = analogRead(TDS_SENSOR_PIN);

    // Convert to voltage (NodeMCU ADC is 0-1V for 0-1023)
    voltage = sensorValue * (3.3 / 1024.0);

    // Calculate TDS value with temperature compensation
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensationVoltage = voltage / compensationCoefficient;

    // Convert voltage to TDS (ppm)
    tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * TDS_CALIBRATION_FACTOR;

    // Ensure non-negative
    if (tdsValue < 0)
        tdsValue = 0;
}

void calculateFlowRate()
{
    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - oldTime;

    if (elapsedTime >= 1000)
    { // Calculate every second
        // Disable interrupts while reading pulse count
        detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));

        // Calculate flow rate (L/min)
        // Formula: Flow (L/min) = (Pulse frequency × 60) / calibration factor
        // Calibration factor from config.h
        flowRate = ((1000.0 / elapsedTime) * pulseCount) / FLOW_CALIBRATION_FACTOR;

        // Calculate total volume (mL)
        totalMilliLitres += (flowRate / 60.0) * (elapsedTime / 1000.0) * 1000.0;

        // Reset variables
        pulseCount = 0;
        oldTime = currentTime;

        // Re-enable interrupts
        attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
    }
}

void checkLeakSensor()
{
    // Read leak sensor (LOW = short circuit detected = water present)
    int leakSensorValue = digitalRead(LEAK_SENSOR_PIN);

    if (leakSensorValue == HIGH)
    {
        if (!leakDetected)
        {
            // New leak detected
            leakDetected = true;
            leakDetectedTime = millis();
            Serial.println("*** LEAK DETECTED - Water drop detected on sensor! ***");

            // Send immediate notification
            sendNotification("LEAK ALERT: Water drops detected on leak sensor!");

            // Log to Firebase
            if (firebaseConnected)
            {
                Firebase.setBool(firebaseData, "/system/leakDetected", true);
                Firebase.setInt(firebaseData, "/system/leakDetectedTime", (int)time(nullptr));
            }

            // Flash LED rapidly
            blinkLED(15);
        }
    }
    else
    {
        if (leakDetected)
        {
            // Leak cleared
            Serial.println("Leak sensor cleared");
            leakDetected = false;

            if (firebaseConnected)
            {
                Firebase.setBool(firebaseData, "/system/leakDetected", false);
            }
        }
    }
}

void fetchExpectedFlowRate()
{
    if (!firebaseConnected)
        return;

    Serial.println("Fetching expected flow rate from Firebase...");

    if (Firebase.getFloat(firebaseData, "/system/expectedFlowRate"))
    {
        expectedFlowRate = firebaseData.floatData();
        Serial.print("Expected flow rate: ");
        Serial.print(expectedFlowRate);
        Serial.println(" L/min");
    }
    else
    {
        Serial.println("Failed to fetch expected flow rate, using default: 2.0 L/min");
        expectedFlowRate = 2.0; // Default value
    }
}

void sendDataToFirebase()
{
    if (!firebaseConnected || !wifiConnected)
        return;

    // Get current timestamp
    time_t now = time(nullptr);

    // Create JSON object
    FirebaseJson json;
    json.set("tds", tdsValue);
    json.set("flowRate", flowRate);
    json.set("totalVolume", totalMilliLitres / 1000.0); // Convert to liters
    json.set("expectedFlow", expectedFlowRate);
    json.set("dropLeakage", leakDetected); // Physical leak sensor (D5)
    json.set("timestamp", (int)now);
    json.set("status", getSystemStatus());

    // Send to current readings
    String path = "/readings/current";
    if (Firebase.setJSON(firebaseData, path, json))
    {
        Serial.println("Data sent to Firebase successfully!");
    }
    else
    {
        Serial.println("Failed to send data to Firebase");
        Serial.println(firebaseData.errorReason());
    }

    // Also add to history with timestamp
    String historyPath = "/readings/history/" + String((int)now);
    Firebase.setJSON(firebaseData, historyPath, json);

    // Update device status
    Firebase.setString(firebaseData, "/system/lastUpdate", String((int)now));
    Firebase.setBool(firebaseData, "/system/online", true);
}

void sendDataToThingSpeak()
{
    if (!wifiConnected)
        return;

    WiFiClient client;

    // Prepare ThingSpeak URL
    String url = "http://api.thingspeak.com/update?api_key=";
    url += THINGSPEAK_API_KEY;
    url += "&field1=" + String(tdsValue);
    url += "&field2=" + String(flowRate);
    url += "&field3=" + String(expectedFlowRate);
    url += "&field4=" + String(totalMilliLitres / 1000.0);

    HTTPClient http;
    http.begin(client, url);

    int httpCode = http.GET();

    if (httpCode > 0)
    {
        Serial.println("Data sent to ThingSpeak successfully!");
    }
    else
    {
        Serial.println("Failed to send data to ThingSpeak");
    }

    http.end();
}

void checkAbnormalities()
{
    bool anomalyDetected = false;
    String alertMessage = "";

    // Check for physical leak detection first (highest priority)
    if (leakDetected)
    {
        anomalyDetected = true;
        alertMessage += "CRITICAL: Physical leak detected by sensor! ";
    }

    // Check TDS levels
    if (tdsValue < TDS_MIN_THRESHOLD || tdsValue > TDS_MAX_THRESHOLD)
    {
        anomalyDetected = true;
        alertMessage += "Water quality issue: TDS = " + String(tdsValue) + " ppm. ";
    }

    // Check for leakage (flow rate deviation)
    if (expectedFlowRate > 0)
    {
        float deviation = abs(flowRate - expectedFlowRate) / expectedFlowRate * 100.0;

        if (deviation > FLOW_DEVIATION_THRESHOLD)
        {
            anomalyDetected = true;
            alertMessage += "Possible leakage: Flow rate = " + String(flowRate) + " L/min (Expected: " + String(expectedFlowRate) + " L/min). ";
        }
    }

    // Send notification if anomaly detected and cooldown period has passed
    if (anomalyDetected && (millis() - lastNotificationTime >= NOTIFICATION_COOLDOWN))
    {
        sendNotification(alertMessage);
        lastNotificationTime = millis();

        // Log alert to Firebase
        FirebaseJson alertJson;
        alertJson.set("message", alertMessage);
        alertJson.set("timestamp", (int)time(nullptr));
        alertJson.set("tds", tdsValue);
        alertJson.set("flowRate", flowRate);

        String alertPath = "/alerts/" + String((int)time(nullptr));
        Firebase.setJSON(firebaseData, alertPath, alertJson);
    }
}

void sendNotification(String message)
{
    Serial.println("ALERT: " + message);

    // Update Firebase notification field
    if (firebaseConnected)
    {
        Firebase.setString(firebaseData, "/notifications/latest", message);
        Firebase.setInt(firebaseData, "/notifications/timestamp", (int)time(nullptr));
        Firebase.setBool(firebaseData, "/notifications/unread", true);
    }

    // Blink LED rapidly
    blinkLED(10);
}

String getSystemStatus()
{
    // Physical leak detection has highest priority
    if (leakDetected)
    {
        return "DROP_LEAKAGE_DETECTED";
    }

    if (tdsValue < TDS_MIN_THRESHOLD || tdsValue > TDS_MAX_THRESHOLD)
    {
        return "WATER_QUALITY_ISSUE";
    }

    if (expectedFlowRate > 0)
    {
        float deviation = abs(flowRate - expectedFlowRate) / expectedFlowRate * 100.0;
        if (deviation > FLOW_DEVIATION_THRESHOLD)
        {
            return "LEAKAGE_DETECTED";
        }
    }

    return "NORMAL";
}

void printSensorData()
{
    Serial.println("\n========== Sensor Readings ==========");
    Serial.print("TDS Value: ");
    Serial.print(tdsValue);
    Serial.println(" ppm");
    Serial.print("Flow Rate: ");
    Serial.print(flowRate);
    Serial.println(" L/min");
    Serial.print("Expected Flow: ");
    Serial.print(expectedFlowRate);
    Serial.println(" L/min");
    Serial.print("Total Volume: ");
    Serial.print(totalMilliLitres / 1000.0);
    Serial.println(" L");
    Serial.print("Leak Sensor: ");
    Serial.println(leakDetected ? "LEAK DETECTED!" : "Normal");
    Serial.print("Status: ");
    Serial.println(getSystemStatus());
    Serial.println("====================================\n");
}

void blinkLED(int times)
{
    for (int i = 0; i < times; i++)
    {
        digitalWrite(LED_PIN, LOW);
        delay(100);
        digitalWrite(LED_PIN, HIGH);
        delay(100);
    }
}