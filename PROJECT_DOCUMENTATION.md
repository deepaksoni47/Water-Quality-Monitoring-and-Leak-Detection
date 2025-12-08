# Water Quality Monitoring & Leak Detection System

## Complete Project Documentation for AI Report Generation

---

## 📋 PROJECT OVERVIEW

### Project Title

**Real-time Water Quality Monitoring and Intelligent Leak Detection System**

### Project Type

**IoT-enabled Full-Stack Web Application with Hardware Integration**

### Development Timeline

- **Start Date:** 2024
- **Current Version:** 1.0
- **Last Updated:** December 8, 2025
- **Status:** Production Ready

### Project Purpose

An intelligent IoT system that monitors water quality in real-time, tracks flow rates, and detects leaks using both physical sensors and flow deviation analysis. The system provides a modern Progressive Web App (PWA) dashboard with glassmorphism UI design, enabling users to monitor water parameters from any device with instant notifications for critical alerts.

---

## 🎯 CORE OBJECTIVES

1. **Water Quality Monitoring**: Continuous TDS (Total Dissolved Solids) measurement with temperature compensation to ensure water safety
2. **Flow Rate Tracking**: Precise flow measurement using turbine sensors with volume calculation
3. **Dual Leak Detection**:
   - Physical drop detection using short-circuit sensor (D5)
   - Flow-based leak detection through deviation analysis
4. **Real-time Notifications**: Instant alerts for water quality issues and leak detection
5. **Cloud Data Storage**: Historical data logging and analytics via Firebase and ThingSpeak
6. **Modern User Interface**: Glassmorphism-styled PWA dashboard with dark theme

---

## 🏗️ SYSTEM ARCHITECTURE

### Architecture Pattern

**Three-Tier IoT Architecture:**

1. **Hardware Layer** (ESP8266 NodeMCU)
2. **Cloud Layer** (Firebase Realtime Database + ThingSpeak)
3. **Presentation Layer** (Next.js PWA Dashboard)

### Technology Stack

#### **Frontend (Dashboard)**

- **Framework**: Next.js 16.0.7 (React 19.2.1)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4 with custom glassmorphism theme
- **UI Library**: Lucide React (icons)
- **Animation**: Framer Motion 12.23.25
- **Charts**: Recharts 3.3.0
- **State Management**: React Hooks (useState, useEffect)
- **Date Handling**: date-fns 4.1.0
- **Build Tool**: Turbopack (Next.js 16 default)

#### **Backend/IoT (Hardware)**

- **Microcontroller**: ESP8266 NodeMCU (ESP-12E Module)
- **Language**: C++ (Arduino Framework)
- **Libraries**:
  - `ESP8266WiFi` - WiFi connectivity
  - `FirebaseESP8266` - Firebase integration
  - `ESP8266HTTPClient` - HTTP requests to ThingSpeak
  - `WiFiClientSecure` - Secure connections
  - `time.h` - NTP time synchronization

#### **Cloud Services**

- **Primary Database**: Firebase Realtime Database (Asia Southeast 1)
- **Authentication**: Firebase Auth (Email/Password)
- **Analytics Platform**: ThingSpeak
- **Hosting**: Vercel (recommended for Next.js)

#### **Hardware Components**

1. **TDS Sensor** (Analog) - Connected to A0
2. **Flow Sensor** (Turbine + IR) - Connected to D6
3. **Leak Sensor** (Short-circuit based) - Connected to D5
4. **LED Indicator** (Built-in LED) - LED_BUILTIN constant
5. **Power Supply**: 5V for flow sensor, 3.3V for TDS sensor

---

## 📊 DETAILED FEATURE BREAKDOWN

### 1. Water Quality Monitoring (TDS Measurement)

**Technical Implementation:**

- **Sensor Type**: Analog TDS probe measuring electrical conductivity
- **Pin**: A0 (Analog input)
- **Voltage Range**: 0-3.3V (NodeMCU ADC)
- **Resolution**: 10-bit (0-1023)
- **Calibration Factor**: 0.5 (configurable in `config.h`)

**Algorithm:**

```cpp
// Temperature compensation formula
compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0)
compensationVoltage = voltage / compensationCoefficient
tdsValue = (133.42 * compensationVoltage³ - 255.86 * compensationVoltage² + 857.39 * compensationVoltage) * calibrationFactor
```

**Thresholds:**

- **Too Low**: < 50 ppm (insufficient minerals)
- **Good Quality**: 50-500 ppm (safe drinking water)
- **Poor Quality**: > 500 ppm (excessive dissolved solids)

**Dashboard Visualization:**

- Metric card showing current TDS value in ppm
- Color-coded status (Green/Yellow/Red)
- Line chart tracking TDS trends over time
- Purple gradient icon (Droplet symbol)

---

### 2. Flow Rate Tracking

**Technical Implementation:**

- **Sensor Type**: Turbine flow meter with IR pulse counter
- **Pin**: D6 (Digital input with interrupt)
- **Measurement Method**: Pulse counting via hardware interrupt
- **Calibration Factor**: 5.5 pulses per liter (adjustable)
- **Update Interval**: 1 second

**Algorithm:**

```cpp
flowRate (L/min) = (pulseCount / calibrationFactor) / (timeElapsed / 60000)
totalVolume (L) = totalMilliLitres / 1000
```

**Features:**

- Real-time flow rate display (L/min)
- Cumulative volume tracking (session total)
- Expected vs actual flow comparison
- Deviation percentage calculation
- Pink-red gradient icon (Wind symbol)

**Flow Status Indicators:**

- **Normal Flow**: Deviation ≤ 10%
- **Minor Deviation**: 10% < Deviation ≤ 20%
- **Possible Leakage**: Deviation > 20%

---

### 3. Physical Drop Leak Detection (NEW FEATURE)

**Technical Implementation:**

- **Sensor Type**: Short-circuit based water drop sensor
- **Pin**: D5 (Digital input with pull-up)
- **Detection Method**: When water drops fall, they create a short circuit between terminals
- **Reading Logic**: `digitalRead(D5) == LOW` indicates leak detected

**Trigger Behavior:**

```cpp
if (leakDetected && !previousLeakState) {
    // First detection
    sendNotification("LEAK ALERT: Water drops detected on leak sensor!")
    Firebase.setBool("/system/leakDetected", true)
    Firebase.setInt("/system/leakDetectedTime", timestamp)
    blinkLED(15) // Rapid flash
}
```

**Dashboard Display:**

- Dedicated "Drop Leakage" metric card
- Shows "DETECTED" or "NONE" status
- Red-orange gradient icon (AlertTriangle symbol)
- Info label: "Physical sensor (D5)"
- Color-coded status (Red for detected, Green for none)

**Status Priority:**

- Highest priority status (overrides flow and TDS alerts)
- Returns `DROP_LEAKAGE_DETECTED` system status

---

### 4. Flow-Based Leak Detection

**Technical Implementation:**

- **Method**: Compares actual flow rate with expected flow rate
- **Expected Flow Source**: Fetched from Firebase (`/system/expectedFlowRate`)
- **Threshold**: 20% deviation (configurable)

**Algorithm:**

```cpp
deviation = abs(flowRate - expectedFlowRate) / expectedFlowRate * 100
if (deviation > 20%) {
    status = "LEAKAGE_DETECTED"
}
```

**Use Case:**

- Detects pipe leaks, valve failures, or unauthorized consumption
- Continuous monitoring even without physical sensor
- Complements physical drop detection

---

### 5. Progressive Web App (PWA)

**Implementation:**

- **Service Worker**: `public/sw.js` handles background notifications
- **Manifest**: `public/manifest.json` defines app metadata
- **Icons**: Custom water drop icon (`drop.png`) - 192x192 and 512x512
- **Install Prompt**: NotificationPermission component guides users

**PWA Features:**

- **Installable**: Add to home screen on mobile/desktop
- **Offline Capable**: Service worker caches assets
- **Background Notifications**: Works when app is closed
- **App-like Experience**: Full-screen mode, splash screen

**Browser Support:**

- Chrome/Edge (Android, Windows, macOS)
- Safari (iOS 16.4+)
- Firefox (limited PWA support)

---

### 6. Notification System

**Architecture:**

```
Arduino → Firebase → Dashboard → Service Worker → Browser Notification API
```

**Implementation Layers:**

**Layer 1: Arduino Notification Trigger**

```cpp
Firebase.setString("/notifications/latest", message)
Firebase.setInt("/notifications/timestamp", timestamp)
Firebase.setBool("/notifications/unread", true)
```

**Layer 2: React Hook (`useNotifications.ts`)**

- Listens to Firebase notification path
- Checks browser notification permission
- Triggers service worker notification
- Plays alert sound
- De-duplicates based on status-timestamp combination

**Layer 3: Service Worker (`sw.js`)**

```javascript
self.registration.showNotification(title, {
  body: message,
  icon: "https://source.unsplash.com/200x200/?water,drop",
  badge: "/drop.png",
  vibrate: [200, 100, 200],
  requireInteraction: true,
});
```

**Notification Types:**

1. **Water Quality Alert**: TDS out of range
2. **Physical Leak Alert**: Drop sensor triggered
3. **Flow Leak Alert**: Flow deviation detected
4. **System Status**: Online/offline notifications

**Anti-Spam Features:**

- 5-minute cooldown between Arduino notifications
- Sound de-duplication using `lastStatusNotified` state
- Prevents continuous sound on app refresh

---

### 7. Glassmorphism UI Design

**Design System:**

- **Background**: `bg-gradient-to-br from-black via-gray-900 to-black`
- **Cards**: `bg-white/5 backdrop-blur-md border border-white/20`
- **Theme**: Pure black (#000000) - no light theme support
- **Typography**: System font stack with Tailwind defaults
- **Spacing**: Consistent 6-unit gap (1.5rem)

**Color Palette:**

- **Primary**: Cyan-blue tones
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Gradient Icons**: Each metric has unique gradient

**Animation:**

- **Library**: Framer Motion
- **Entry Animations**: Staggered fade-in with 0.1s delays
- **Hover Effects**: `scale(1.02)` on cards, `scale(1.01)` on charts
- **Transitions**: `duration: 0.5s, ease: "easeOut"`

**Components:**

- `MetricCard`: Displays single metric with icon, value, status
- `SystemStatus`: Shows connection, status, last update
- `AlertsList`: Chronological alert history
- `TDSChart` / `FlowChart`: Recharts line graphs
- `SettingsPanel`: Update expected flow rate
- `NotificationSettings`: Toggle notification preferences

---

## 🔧 HARDWARE CONFIGURATION

### Pin Assignments

```cpp
TDS_SENSOR_PIN    = A0           // Analog input (0-1023)
FLOW_SENSOR_PIN   = D6           // Digital interrupt (pulse counter)
LEAK_SENSOR_PIN   = D5           // Digital input (short-circuit detection)
LED_PIN           = LED_BUILTIN  // Onboard LED (D4 on NodeMCU)
```

### Wiring Diagram

**TDS Sensor:**

```
VCC (Red)    → 3.3V
GND (Black)  → GND
Signal (Blue)→ A0
```

**Flow Sensor (Turbine + IR):**

```
VCC (Red)    → 5V (external recommended)
GND (Black)  → GND
Signal (Yellow) → D6
```

**Leak Sensor (Drop Detection):**

```
Terminal 1   → D5
Terminal 2   → GND
(Forms short circuit when water drops detected)
```

**LED (Built-in):**

```
- Controlled via LED_BUILTIN constant
- Turns ON when WiFi connected
- Blinks rapidly during leak alerts
```

### Power Requirements

- **NodeMCU**: 5V via USB or VIN pin (3.3V regulated internally)
- **TDS Sensor**: 3.3V (max 5mA)
- **Flow Sensor**: 5V (max 15mA)
- **Leak Sensor**: Passive (powered via pullup resistor)
- **Total Current**: ~100mA (safe for USB power)

---

## 📡 DATA FLOW & COMMUNICATION

### Arduino → Firebase (Every 15 seconds)

**Data Packet Structure:**

```json
{
  "tds": 245.5,
  "flowRate": 1.85,
  "expectedFlow": 2.0,
  "totalVolume": 15.5,
  "dropLeakage": false,
  "timestamp": 1733702400,
  "status": "NORMAL"
}
```

**Sent to Paths:**

- `/readings/current` - Latest reading (overwrite)
- `/readings/history/{timestamp}` - Historical record (append)
- `/system/lastUpdate` - Timestamp for online detection
- `/system/online` - Boolean flag
- `/system/leakDetected` - Drop leak status

### Arduino → ThingSpeak (Every 15 seconds)

**HTTP GET Request:**

```
http://api.thingspeak.com/update?api_key={KEY}
  &field1={tds}
  &field2={flowRate}
  &field3={expectedFlowRate}
  &field4={totalVolume}
```

**ThingSpeak Channels:**

- Field 1: TDS (ppm)
- Field 2: Flow Rate (L/min)
- Field 3: Expected Flow (L/min)
- Field 4: Total Volume (L)

### Firebase → Dashboard (Real-time)

**React Hooks:**

1. **useRealtimeData**: Subscribes to `/readings/current`
2. **useSystemStatus**: Subscribes to `/system/*` and `/notifications/latest`
3. **useAlerts**: Subscribes to `/alerts/*`
4. **useNotifications**: Triggers browser notifications

**Firebase Listeners:**

```typescript
const readingsRef = ref(database, "/readings/current");
onValue(readingsRef, (snapshot) => {
  setData(snapshot.val() as SensorReading);
});
```

**Update Frequency:**

- Firebase push updates: Instant (WebSocket)
- Dashboard re-render: 15 seconds (matches Arduino send interval)
- Chart data refresh: On new reading

---

## 🔐 SECURITY & AUTHENTICATION

### Firebase Authentication

- **Method**: Email/Password
- **User Credentials**: Stored in `arduino/water_monitoring_system/secrets.h`
- **Database Rules**: `firebase/database.rules.json`

**Example Rules:**

```json
{
  "rules": {
    "readings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "system": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Credential Management

- **Arduino**: `secrets.h` (gitignored, template in `secrets.h.example`)
- **Dashboard**: Environment variables (`.env.local`)
- **Firebase Config**: Public config in `src/lib/firebase.ts` (safe for frontend)

**Required Credentials:**

```cpp
// Arduino secrets.h
WIFI_SSID
WIFI_PASSWORD
FIREBASE_API_KEY
FIREBASE_DATABASE_URL
FIREBASE_USER_EMAIL
FIREBASE_USER_PASSWORD
THINGSPEAK_API_KEY
```

```bash
# Dashboard .env.local
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL
```

---

## 📱 DASHBOARD FEATURES

### 5 Metric Cards (Top Row)

1. **Water Quality (TDS)**

   - Value: XXX ppm
   - Status: Good Quality / Poor Quality / Too Low
   - Icon: Purple gradient droplet

2. **Flow Rate**

   - Value: X.XX L/min
   - Status: Normal Flow / Minor Deviation / Possible Leakage
   - Icon: Pink-red gradient wind

3. **Drop Leakage** ⭐ NEW

   - Value: DETECTED / NONE
   - Status: Drop Detected / No Drops
   - Icon: Red-orange gradient alert triangle
   - Info: Physical sensor (D5)

4. **Expected Flow**

   - Value: X.XX L/min
   - Info: Reference flow rate
   - Icon: Blue-cyan gradient trending up

5. **Total Volume**
   - Value: XX.XX L
   - Info: Session total
   - Icon: Green-teal gradient database

### Charts Section

**TDS Chart:**

- Type: Line chart (Recharts)
- X-axis: Time (formatted with date-fns)
- Y-axis: TDS (ppm)
- Data Source: `/readings/history/*`
- Update: Real-time on new readings

**Flow Chart:**

- Type: Line chart with dual lines
- Lines: Actual Flow (blue) vs Expected Flow (dotted orange)
- X-axis: Time
- Y-axis: Flow Rate (L/min)

### System Status Panel

**Displays:**

- **Connection Status**: Online/Offline (with WiFi icon)
- **System Status**: Normal / Water Quality Alert / Leakage Detected / Drop Leak Detected
- **Last Update**: Formatted timestamp
- **Expected Flow Rate**: Configured value

**Online Detection Logic:**

```typescript
const currentTime = Date.now();
const timeSinceUpdate = (currentTime - systemInfo.lastUpdate) / 1000;
const isOnline = timeSinceUpdate < 60 && systemInfo.online;
```

### Settings Panel

**Features:**

- Update expected flow rate (real-time sync to Firebase)
- Input validation (min 0.1, max 100 L/min)
- Instant feedback on save
- Used for flow deviation calculations

### Notification Settings

**Options:**

- Enable/Disable browser notifications
- Test notification button
- Permission request UI
- Explains PWA installation benefits

### Alerts List

**Display:**

- Chronological list of all alerts
- Icons for different alert types (droplet/wind/alert)
- Color coding (red for leaks, yellow for quality)
- Timestamps with relative time
- Metric values included in alert messages

---

## 🔄 SYSTEM STATUS TYPES

### Status Hierarchy (Priority Order)

1. **DROP_LEAKAGE_DETECTED** (Highest Priority)

   - Trigger: `leakDetected == true` (D5 sensor short circuit)
   - Color: Red
   - Action: Immediate critical alert + LED flash
   - Message: "LEAK ALERT: Water drops detected on leak sensor!"

2. **WATER_QUALITY_ISSUE**

   - Trigger: `TDS < 50 || TDS > 500`
   - Color: Yellow
   - Message: "Water quality issue: TDS = XXX ppm"

3. **LEAKAGE_DETECTED**

   - Trigger: Flow deviation > 20%
   - Color: Red
   - Message: "Possible leakage: Flow rate = X.XX L/min (Expected: X.XX L/min)"

4. **NORMAL** (Default)
   - All parameters within thresholds
   - Color: Green

---

## 🎨 USER INTERFACE SPECIFICATIONS

### Color Scheme

```css
/* Background */
background: linear-gradient(to bottom right, #000000, #111827, #000000);

/* Card Glass Effect */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--primary: #06b6d4;
```

### Typography

- **Headings**: font-bold, text-2xl (32px)
- **Body**: text-base (16px)
- **Labels**: text-sm (14px)
- **Values**: font-semibold, text-xl (20px)

### Responsive Breakpoints

```css
/* Mobile First */
grid-cols-1               /* < 768px */
md:grid-cols-2           /* ≥ 768px */
lg:grid-cols-5           /* ≥ 1024px (5 metric cards) */
```

### Animations

```javascript
// Staggered Entry
delay: 0.1s, 0.2s, 0.3s, 0.4s, 0.5s

// Hover Scale
whileHover: { scale: 1.02 }
transition: { duration: 0.2 }

// Loading Spinner
animate-spin (Tailwind default)
```

---

## 🛠️ CONFIGURATION FILES

### Arduino Configuration (`config.h`)

```cpp
// Calibration
TDS_CALIBRATION_FACTOR = 0.5
FLOW_CALIBRATION_FACTOR = 5.5

// Thresholds
TDS_MIN_THRESHOLD = 50.0 ppm
TDS_MAX_THRESHOLD = 500.0 ppm
FLOW_DEVIATION_THRESHOLD = 20.0%

// Timing
SEND_INTERVAL = 15000 ms (15 seconds)
NOTIFICATION_COOLDOWN = 300000 ms (5 minutes)

// Temperature
DEFAULT_TEMPERATURE = 25.0°C
```

### Firebase Database Structure

```json
{
  "readings": {
    "current": {
      /* Latest reading */
    },
    "history": {
      "1733702400": {
        /* Timestamped readings */
      }
    }
  },
  "alerts": {
    "-O9xK4KlMnO": {
      "type": "drop_leak",
      "message": "Drop leak detected!",
      "timestamp": 1733701200000
    }
  },
  "system": {
    "expectedFlowRate": 2.0,
    "lastUpdate": 1733702400,
    "online": true,
    "leakDetected": false,
    "leakDetectedTime": null
  },
  "notifications": {
    "latest": "LEAK ALERT: Water drops detected!",
    "timestamp": 1733702400,
    "unread": true
  }
}
```

---

## 📦 PROJECT STRUCTURE

```
Water Quality Monitoring/
├── arduino/
│   └── water_monitoring_system/
│       ├── water_monitoring_system.ino  (Main firmware - 492 lines)
│       ├── config.h                     (Hardware config)
│       ├── secrets.h                    (Credentials - gitignored)
│       └── secrets.h.example            (Template)
│
├── water-monitor-dashboard/
│   ├── public/
│   │   ├── drop.png                     (App icon)
│   │   ├── manifest.json                (PWA manifest)
│   │   └── sw.js                        (Service worker)
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css              (Glassmorphism styles)
│   │   │   ├── layout.tsx               (Root layout + metadata)
│   │   │   └── page.tsx                 (Main dashboard - 319 lines)
│   │   ├── components/
│   │   │   ├── Charts/
│   │   │   │   ├── TDSChart.tsx
│   │   │   │   └── FlowChart.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── SystemStatus.tsx
│   │   │   │   ├── AlertsList.tsx
│   │   │   │   ├── AlertBanner.tsx
│   │   │   │   └── SettingsPanel.tsx
│   │   │   └── Notifications/
│   │   │       ├── NotificationPermission.tsx
│   │   │       ├── NotificationSettings.tsx
│   │   │       └── NotificationInitializer.tsx
│   │   ├── hooks/
│   │   │   ├── useRealtimeData.ts       (Firebase current readings)
│   │   │   ├── useSystemStatus.ts       (Online/offline detection)
│   │   │   ├── useAlerts.ts             (Alert history)
│   │   │   └── useNotifications.ts      (Browser notifications)
│   │   └── lib/
│   │       ├── firebase.ts              (Firebase initialization)
│   │       └── types.ts                 (TypeScript interfaces)
│   ├── package.json                     (Dependencies)
│   ├── next.config.ts                   (Next.js config)
│   ├── tailwind.config.ts               (Tailwind config)
│   └── tsconfig.json                    (TypeScript config)
│
├── firebase/
│   ├── database.rules.json              (Security rules)
│   ├── firebase.json                    (Firebase config)
│   └── sample-data.json                 (Test data)
│
├── thingspeak/
│   ├── README.md                        (ThingSpeak setup)
│   └── channel-config.txt               (Channel fields)
│
├── docs/
│   ├── api-documentation.md             (API reference)
│   ├── calibration-guide.md             (Sensor calibration)
│   └── hardware-setup.md                (Wiring guide)
│
└── README.md                            (Project documentation)
```

---

## 🚀 INSTALLATION & DEPLOYMENT

### Prerequisites

**Hardware:**

- ESP8266 NodeMCU board
- TDS sensor module
- Flow sensor (turbine + IR)
- Water drop leak sensor
- Jumper wires, breadboard

**Software:**

- Arduino IDE 1.8.19+ or PlatformIO
- Node.js 18+ and npm/yarn
- Firebase account (free tier)
- ThingSpeak account (optional)

### Step 1: Arduino Setup

```bash
# Install ESP8266 board package
# In Arduino IDE → Preferences → Additional Board Manager URLs:
http://arduino.esp8266.com/stable/package_esp8266com_index.json

# Install libraries via Library Manager:
- Firebase ESP8266 Client
- ESP8266WiFi
- ESP8266HTTPClient

# Configure credentials
cd arduino/water_monitoring_system/
cp secrets.h.example secrets.h
# Edit secrets.h with your WiFi and Firebase credentials

# Upload to NodeMCU
# Tools → Board: "NodeMCU 1.0 (ESP-12E Module)"
# Tools → Port: Select COM port
# Sketch → Upload
```

### Step 2: Firebase Setup

```bash
# 1. Create Firebase project at console.firebase.google.com
# 2. Enable Realtime Database (Asia Southeast 1)
# 3. Create user via Authentication → Email/Password
# 4. Deploy database rules:

cd firebase/
firebase deploy --only database

# 5. Import sample data (optional):
# Firebase Console → Database → Import JSON → sample-data.json
```

### Step 3: Dashboard Setup

```bash
cd water-monitor-dashboard/

# Install dependencies
npm install

# Configure Firebase credentials
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Development
npm run dev          # Standard mode
npm run dev:turbo    # Turbopack mode (faster)

# Production build
npm run build
npm start

# Deploy to Vercel
vercel --prod
```

### Step 4: PWA Installation

```bash
# On mobile (Chrome/Safari):
1. Open dashboard URL
2. Tap "Add to Home Screen"
3. Allow notifications when prompted

# On desktop (Chrome/Edge):
1. Click install icon in address bar
2. Click "Install"
3. Allow notifications
```

---

## 🧪 TESTING & CALIBRATION

### TDS Sensor Calibration

```cpp
// 1. Test with known TDS solutions (e.g., 500 ppm)
// 2. Read raw voltage
// 3. Adjust TDS_CALIBRATION_FACTOR in config.h
// 4. Formula: calibration = measuredTDS / calculatedTDS * currentFactor
```

### Flow Sensor Calibration

```cpp
// 1. Measure known volume (e.g., 1 liter)
// 2. Count pulses during flow
// 3. Calculate: FLOW_CALIBRATION_FACTOR = totalPulses / volumeInLiters
// 4. Update config.h
```

### Leak Sensor Testing

```bash
# 1. Dry test: Sensor should read HIGH (no leak)
# 2. Wet test: Add water drops between terminals
# 3. Should read LOW and trigger notification
# 4. LED should blink rapidly (15 times)
```

### Dashboard Testing

```bash
# 1. Check real-time updates (15-second interval)
# 2. Verify charts populate correctly
# 3. Test notification permissions
# 4. Trigger test notification
# 5. Check online/offline detection (60-second timeout)
# 6. Test settings panel (update expected flow)
```

---

## 📈 PERFORMANCE METRICS

### Arduino Performance

- **Boot Time**: ~5 seconds (WiFi + Firebase init)
- **Loop Execution**: ~100ms per cycle
- **Data Send Interval**: 15 seconds
- **Memory Usage**: ~40% (ESP8266 80KB RAM)
- **Flash Usage**: ~350KB / 4MB

### Dashboard Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+ (Performance)
- **Bundle Size**: ~500KB (gzipped)
- **Data Transfer**: ~10KB per update

### Network Requirements

- **Arduino Upload**: ~2KB per 15 seconds (1KB Firebase + 1KB ThingSpeak)
- **Dashboard Download**: ~2KB per update (Firebase push)
- **Monthly Data Usage**: ~500MB (continuous operation)

---

## 🐛 TROUBLESHOOTING

### Common Issues

**Arduino won't connect to WiFi:**

- Check SSID/password in secrets.h
- Ensure 2.4GHz network (ESP8266 doesn't support 5GHz)
- Verify signal strength

**Firebase authentication fails:**

- Check API key and database URL
- Ensure user exists in Firebase Auth
- Verify database rules allow authenticated access

**TDS readings inaccurate:**

- Calibrate sensor with known solutions
- Check 3.3V power supply
- Clean sensor probe (remove mineral buildup)

**Flow sensor not counting:**

- Verify D6 connection
- Check 5V power supply
- Test interrupt with Serial.println(pulseCount)

**Drop leak sensor always triggered:**

- Ensure sensor is dry
- Check for corrosion on terminals
- Verify pull-up resistor enabled

**Notifications not working:**

- Check browser permissions
- Ensure HTTPS (required for notifications)
- Verify service worker registered
- Test with notification settings panel

**Dashboard shows "Offline":**

- Check Arduino WiFi connection
- Verify Firebase lastUpdate timestamp
- Ensure < 60 seconds since last update

---

## 🔮 FUTURE ENHANCEMENTS

### Planned Features

1. **Multi-Device Support**: Monitor multiple sensors from single dashboard
2. **Historical Analytics**: Weekly/monthly trend reports
3. **Machine Learning**: Predictive leak detection using anomaly detection
4. **SMS Alerts**: Twilio integration for critical alerts
5. **Voice Control**: Alexa/Google Home integration
6. **Temperature Sensor**: DS18B20 for accurate TDS compensation
7. **Pressure Sensor**: Detect pipe pressure drops
8. **Valve Control**: Automated shut-off on leak detection
9. **Battery Backup**: UPS for continuous monitoring
10. **Mobile App**: Native iOS/Android app with push notifications

### Potential Improvements

- **WebSocket**: Direct Arduino → Dashboard communication (bypass Firebase)
- **Edge Computing**: Local data processing before cloud upload
- **Blockchain**: Immutable water quality audit trail
- **AR Visualization**: Augmented reality leak detection guidance
- **Energy Optimization**: Deep sleep mode for battery operation

---

## 📚 TECHNICAL REFERENCES

### Key Algorithms

**TDS Calculation (Cubic Regression):**

```cpp
tdsValue = (133.42 * V³ - 255.86 * V² + 857.39 * V) * calibrationFactor
```

**Flow Rate (Pulse Frequency):**

```cpp
frequency = pulseCount / elapsedTime
flowRate = frequency / calibrationFactor * 60 (L/min)
```

**Temperature Compensation:**

```cpp
coefficient = 1.0 + 0.02 * (T - 25.0)
compensatedVoltage = rawVoltage / coefficient
```

**Online Detection (60-second timeout):**

```typescript
isOnline = currentTime - lastUpdate < 60000 && status === true;
```

---

## 📄 LICENSE & CREDITS

### License

MIT License - Free for personal and commercial use

### Developer

**Deepak Soni**

- GitHub: @deepaksoni47
- Repository: Water-Quality-Monitoring-and-Leak-Detection

### Technologies Used

- Next.js by Vercel
- Firebase by Google
- ESP8266 by Espressif Systems
- Framer Motion by Framer
- Recharts by Recharts Contributors
- Tailwind CSS by Tailwind Labs

---

## 📞 SUPPORT & DOCUMENTATION

### Additional Resources

- **API Documentation**: `docs/api-documentation.md`
- **Calibration Guide**: `docs/calibration-guide.md`
- **Hardware Setup**: `docs/hardware-setup.md`
- **README**: `README.md`
- **Security Guide**: `SECURITY.md`
- **Quick Start**: `QUICKSTART.md`

### Configuration Guides

- **Dark Theme**: `DARK_THEME.md`
- **Notifications**: `NOTIFICATIONS.md`
- **Turbopack Fix**: `TURBOPACK_FIX.md`
- **Mobile Animations**: `MOBILE_ANIMATIONS.md`

---

## 🎯 PROJECT SUMMARY FOR AI REPORT GENERATION

### Executive Summary

This project is a **production-ready IoT water monitoring system** combining:

- **Hardware**: ESP8266 microcontroller with TDS, flow, and leak sensors
- **Cloud**: Firebase Realtime Database + ThingSpeak analytics
- **Frontend**: Next.js 16 PWA with glassmorphism UI

**Key Innovation**: Dual leak detection using both physical drop sensors (short-circuit) and flow deviation analysis, providing comprehensive leak monitoring.

**Technology Highlights**:

- Latest Next.js 16 with Turbopack
- React 19 with concurrent features
- Service worker-based PWA notifications
- Real-time Firebase WebSocket updates
- Hardware interrupt-based flow sensing

**Use Cases**:

- Residential water quality monitoring
- Commercial leak detection
- Industrial flow tracking
- Smart home integration
- Water conservation initiatives

**Deployment Status**: Fully functional with production deployment on Vercel, real-time hardware monitoring, and cross-platform PWA support (iOS/Android/Desktop).

---

**End of Documentation - Total Lines: 1000+**
**Last Updated: December 8, 2025**
**Version: 1.0 - Production Ready**
