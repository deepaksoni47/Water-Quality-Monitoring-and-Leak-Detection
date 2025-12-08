# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### 1️⃣ Update WiFi Credentials (REQUIRED)

Edit `arduino/water_monitoring_system/secrets.h`:

```cpp
#define WIFI_SSID "YOUR_WIFI_NAME_HERE"      // Change this!
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"    // Change this!
```

### 2️⃣ Upload to ESP8266

1. Open `arduino/water_monitoring_system/water_monitoring_system.ino` in Arduino IDE
2. Select **Board**: NodeMCU 1.0 (ESP-12E Module)
3. Select **Port**: Your COM port
4. Click **Upload** ⬆️

### 3️⃣ Create Firebase User

1. Go to [Firebase Console](https://console.firebase.google.com/project/water-quality-and-leak-detect/authentication/users)
2. Click **Authentication** → **Add user**
3. Enter:
   - Email: `waterqualityuser@gmail.com`
   - Password: `esp8266pass`
4. Click **Add user**

### 4️⃣ Set Database Rules

1. Go to **Realtime Database** → **Rules**
2. Replace with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **Publish**

### 5️⃣ Start Dashboard

```bash
cd water-monitor-dashboard
npm install
npm run dev
```

Open: http://localhost:3000

---

## ✅ Verification Checklist

- [ ] WiFi credentials updated in `secrets.h`
- [ ] Code uploaded to ESP8266
- [ ] Serial Monitor shows "System initialized successfully!"
- [ ] Firebase user created
- [ ] Database rules published
- [ ] Dashboard running on localhost:3000
- [ ] Dashboard shows "Online" status
- [ ] Data updating every 15 seconds

---

## 📱 Access Your Dashboard

### Development

```
http://localhost:3000
```

### Production (after deployment)

```
https://your-app.vercel.app
```

---

## 🔑 Your Credentials Summary

### Firebase (Already Configured ✅)

- **Project**: water-quality-and-leak-detect
- **Region**: Asia Southeast 1
- **Database**: https://water-quality-and-leak-detect-default-rtdb.asia-southeast1.firebasedatabase.app

### ThingSpeak (Already Configured ✅)

- **Write API Key**: YK86J7S3HOWAZKQX
- **View**: https://thingspeak.com/channels/your_channel_id

### Authentication

- **Email**: waterqualityuser@gmail.com
- **Password**: esp8266pass

---

## 🎯 What to Monitor

### Dashboard Panels

1. **Current Readings** - Live TDS, Flow Rate, Volume
2. **TDS Chart** - Last 20 readings
3. **Flow Chart** - Last 20 readings
4. **System Status** - Connection, Last Update
5. **Alerts** - Recent warnings
6. **Settings** - Configure expected flow rate

### Serial Monitor Output

```
========== Sensor Readings ==========
TDS Value: 250.5 ppm
Flow Rate: 2.15 L/min
Expected Flow: 2.0 L/min
Total Volume: 125.8 L
Status: NORMAL
====================================
```

---

## 🔧 Common Commands

### Start Dashboard

```bash
cd water-monitor-dashboard
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### View Serial Monitor

```
Arduino IDE → Tools → Serial Monitor (115200 baud)
```

---

## 📊 Data Update Intervals

| Component         | Update Rate             |
| ----------------- | ----------------------- |
| Sensor Reading    | Every 1 second          |
| Firebase Upload   | Every 15 seconds        |
| ThingSpeak Upload | Every 15 seconds        |
| Dashboard Refresh | Every 15 seconds (auto) |
| Alert Check       | Every 15 seconds        |

---

## 🆘 Quick Troubleshooting

### ESP8266 Not Connecting?

```
1. Check Serial Monitor for error messages
2. Verify WiFi credentials are correct
3. Ensure 2.4GHz WiFi (not 5GHz)
4. Press reset button on ESP8266
```

### Dashboard Shows Offline?

```
1. Check ESP8266 Serial Monitor
2. Verify Firebase Console has data
3. Refresh browser (Ctrl + F5)
4. Check .env.local file exists
```

### No Data in Charts?

```
1. Wait 5 minutes for data collection
2. Check /readings/history in Firebase
3. Verify ESP8266 is sending data
4. Check browser console for errors
```

---

## 📞 Support

For detailed information, see:

- [SETUP.md](SETUP.md) - Complete setup guide
- [README.md](README.md) - Full documentation
- [docs/](docs/) - Hardware & API docs

---

**Ready to Start?** Just update WiFi in `secrets.h` and upload! 🚀
