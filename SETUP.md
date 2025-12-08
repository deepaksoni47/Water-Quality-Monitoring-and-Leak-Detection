# 🔌 Connection & Setup Guide

This guide explains how to connect your ESP8266 device to the web dashboard.

## 📋 System Components

Your water monitoring system consists of three main parts:

1. **ESP8266 Hardware** - Reads sensors and sends data
2. **Firebase Realtime Database** - Stores data in the cloud
3. **Next.js Web Dashboard** - Displays data in real-time

## 🔄 Data Flow

```
ESP8266 → WiFi → Firebase Realtime Database ← Next.js Dashboard
                      ↓
                 ThingSpeak (Optional Analytics)
```

---

## ✅ Step 1: ESP8266 Configuration

Your ESP8266 is already configured with these credentials:

### WiFi Settings

- **SSID**: `Your_WiFi_SSID` ⚠️ _You need to update this_
- **Password**: `Your_WiFi_Password` ⚠️ _You need to update this_

### Firebase Settings (Already Configured ✓)

- **API Key**: `AIzaSyBJ_h8HoBu_5Jm43VfcPRS6M5xef7KO1uY`
- **Database URL**: `https://water-quality-and-leak-detect-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Auth Email**: `waterqualityuser@gmail.com`
- **Auth Password**: `esp8266pass`

### ThingSpeak Settings (Already Configured ✓)

- **API Key**: `YK86J7S3HOWAZKQX`

### 🔧 Update WiFi Credentials

1. Open `arduino/water_monitoring_system/secrets.h`
2. Replace these lines with your actual WiFi:
   ```cpp
   #define WIFI_SSID "Your_Actual_WiFi_Name"
   #define WIFI_PASSWORD "Your_Actual_WiFi_Password"
   ```
3. Upload the code to your ESP8266

---

## ✅ Step 2: Web Dashboard Configuration

Your dashboard is already configured with Firebase credentials in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBJ_h8HoBu_5Jm43VfcPRS6M5xef7KO1uY
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://water-quality-and-leak-detect-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=water-quality-and-leak-detect
# ... and more
```

### 🚀 Run the Dashboard

```bash
cd water-monitor-dashboard
npm install
npm run dev
```

Open http://localhost:3000 to view your dashboard!

---

## ✅ Step 3: Firebase Setup

### Database Rules

Your Firebase Realtime Database needs proper security rules. Update them at:
**Firebase Console → Realtime Database → Rules**

```json
{
  "rules": {
    "readings": {
      ".read": true,
      ".write": true
    },
    "alerts": {
      ".read": true,
      ".write": true
    },
    "system": {
      ".read": true,
      ".write": true
    },
    "notifications": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Authentication Setup

1. Go to **Firebase Console → Authentication**
2. Enable **Email/Password** authentication
3. Add a user with:
   - Email: `waterqualityuser@gmail.com`
   - Password: `esp8266pass`

---

## ✅ Step 4: Initialize Database Structure

Before the ESP8266 starts sending data, initialize the database with this structure:

**Firebase Console → Realtime Database → Data**

```json
{
  "system": {
    "expectedFlowRate": 2.0,
    "lastUpdate": 0,
    "online": false
  },
  "readings": {
    "current": {
      "tds": 0,
      "flowRate": 0,
      "totalVolume": 0,
      "expectedFlow": 2.0,
      "timestamp": 0,
      "status": "NORMAL"
    }
  }
}
```

---

## 🧪 Testing the Connection

### 1. Test ESP8266 Connection

After uploading the code:

1. Open **Arduino IDE → Tools → Serial Monitor** (115200 baud)
2. You should see:
   ```
   Water Monitoring System Starting...
   Connecting to WiFi: [Your WiFi Name]
   WiFi connected!
   IP Address: 192.168.x.x
   Initializing Firebase...
   Firebase initialized!
   Fetching expected flow rate from Firebase...
   Expected flow rate: 2.0 L/min
   System initialized successfully!
   ```

### 2. Verify Data in Firebase

1. Go to Firebase Console → Realtime Database
2. Check if data is updating under `readings/current`
3. You should see real-time updates every 15 seconds

### 3. Check Web Dashboard

1. Open http://localhost:3000
2. You should see:
   - ✅ Connection status: **Online**
   - 📊 Real-time sensor readings
   - 📈 Charts updating automatically
   - ⏰ Last update timestamp

---

## 🔧 Troubleshooting

### ❌ ESP8266 Won't Connect to WiFi

**Problem**: Serial Monitor shows "WiFi connection failed!"

**Solutions**:

- Verify WiFi credentials in `secrets.h` are correct
- Ensure you're using 2.4GHz WiFi (ESP8266 doesn't support 5GHz)
- Check if WiFi is within range
- Try resetting the ESP8266

### ❌ Firebase Connection Error

**Problem**: "Failed to send data to Firebase"

**Solutions**:

- Verify Firebase credentials are correct
- Check Firebase Database Rules allow read/write
- Ensure Firebase user is created in Authentication
- Check internet connection

### ❌ Dashboard Shows "Offline"

**Problem**: System Status shows offline

**Solutions**:

- Check if ESP8266 is powered on and connected
- Verify Serial Monitor shows successful data transmission
- Check Firebase Console for incoming data
- Refresh the dashboard (Ctrl+F5)

### ❌ No Data in Charts

**Problem**: Charts are empty

**Solutions**:

- Wait for at least 20 readings (5 minutes)
- Check if `sensorData` path exists in Firebase
- Verify ESP8266 is sending to `readings/history`
- Check browser console for errors

---

## 📊 Data Paths Explained

### Where ESP8266 Writes Data

| Path                            | Purpose              | Update Frequency  |
| ------------------------------- | -------------------- | ----------------- |
| `/readings/current`             | Latest sensor values | Every 15 seconds  |
| `/readings/history/{timestamp}` | Historical data      | Every 15 seconds  |
| `/system/lastUpdate`            | Last connection time | Every 15 seconds  |
| `/system/online`                | Device status        | Every 15 seconds  |
| `/alerts/{timestamp}`           | Anomaly alerts       | When detected     |
| `/notifications/latest`         | Latest notification  | When alert occurs |

### Where Dashboard Reads Data

| Component     | Reads From                 | Purpose        |
| ------------- | -------------------------- | -------------- |
| MetricCard    | `/readings/current`        | Current values |
| TDSChart      | `/sensorData` (last 20)    | TDS trend      |
| FlowChart     | `/sensorData` (last 20)    | Flow trend     |
| AlertsList    | `/alerts` (last 10)        | Recent alerts  |
| SystemStatus  | `/system`                  | System info    |
| SettingsPanel | `/system/expectedFlowRate` | Configuration  |

---

## 🎯 Expected Behavior

Once everything is connected:

1. **ESP8266** reads sensors every second
2. Every **15 seconds**, it sends data to:
   - Firebase Realtime Database
   - ThingSpeak (optional)
3. **Dashboard** updates automatically every 15 seconds
4. If TDS is out of range or flow deviates >20%, an **alert** is created
5. Alerts are displayed in the dashboard with notification banner

---

## 🔐 Security Notes

⚠️ **Important Security Information**:

1. **secrets.h** contains sensitive WiFi and Firebase credentials

   - Already added to `.gitignore`
   - Never commit this file to GitHub

2. **Firebase Rules** are currently open for development

   - For production, implement proper authentication
   - Restrict write access to authenticated users only

3. **API Keys** are visible in the frontend
   - This is normal for Firebase web apps
   - Secure your app with Firebase Security Rules

---

## 📈 Next Steps

1. ✅ Update WiFi credentials in `secrets.h`
2. ✅ Upload code to ESP8266
3. ✅ Create Firebase Authentication user
4. ✅ Set Firebase Database Rules
5. ✅ Initialize database structure
6. ✅ Run the dashboard
7. ✅ Verify data is flowing
8. 🎉 Start monitoring!

---

## 🆘 Need Help?

If you encounter issues:

1. Check Serial Monitor output
2. Verify Firebase Console shows incoming data
3. Check browser console for errors
4. Review the troubleshooting section above
5. Check connection diagram in README.md

---

**Last Updated**: December 8, 2025  
**Status**: ✅ All configurations complete (except WiFi credentials)
