/*
 * Configuration file for Water Monitoring System
 * Adjust these values based on your requirements
 */

#ifndef CONFIG_H
#define CONFIG_H

// System Configuration
#define SYSTEM_NAME "Water Monitor v1.0"
#define DEVICE_ID "WM001"

// Sensor Calibration
#define TDS_CALIBRATION_FACTOR 0.5
#define FLOW_CALIBRATION_FACTOR 5.5 // Adjust based on your turbine sensor

// Thresholds
#define TDS_MIN_THRESHOLD 50.0        // Minimum TDS in ppm
#define TDS_MAX_THRESHOLD 500.0       // Maximum TDS in ppm
#define FLOW_DEVIATION_THRESHOLD 20.0 // Percentage deviation allowed

// Timing Configuration
#define SEND_INTERVAL 15000          // Send data every 15 seconds (ms)
#define NOTIFICATION_COOLDOWN 300000 // 5 minutes between notifications (ms)

// Pin Definitions
#define TDS_SENSOR_PIN A0
#define FLOW_SENSOR_PIN D6      // Flow turbine with IR sensor
#define LEAK_SENSOR_PIN D5      // Water leak detection (short circuit)
#define LED_PIN LED_BUILTIN

// Temperature (if not using temp sensor)
#define DEFAULT_TEMPERATURE 25.0

#endif