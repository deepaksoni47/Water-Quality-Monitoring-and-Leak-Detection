# 🔔 Notification System Guide

## Overview

The Water Quality Monitoring System now includes a comprehensive browser notification system that alerts you instantly when:

- 🚨 **Leakage is detected** (flow rate deviation > 20%)
- ⚠️ **Water quality is poor** (TDS out of range)
- 📡 **System status changes**

Notifications work on **both desktop and mobile devices** that have granted permission!

---

## 🎯 Features

### Real-time Alerts

- **Instant notifications** when anomalies are detected
- **Sound alerts** for critical issues
- **Visual badges** with color-coded urgency
- **Persistent notifications** that require acknowledgment for critical alerts

### Smart Detection

- **Leakage Detection**: Monitors flow rate deviations
- **Water Quality**: Tracks TDS levels (50-500 ppm range)
- **Status Changes**: Alerts on system state changes
- **Duplicate Prevention**: Avoids sending the same alert multiple times

### Cross-Platform Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Edge (Desktop & Mobile)
- ✅ Opera (Desktop & Mobile)

---

## 📱 How to Enable Notifications

### On Desktop (Chrome, Firefox, Edge, Safari)

1. **Open the Dashboard**

   ```
   http://localhost:3000
   ```

2. **Look for the Notification Banner**

   - A purple banner will appear at the top asking for permission

3. **Click "Enable Notifications"**

   - Your browser will show a permission prompt
   - Click **Allow** or **Accept**

4. **Confirmation**
   - You'll see a green checkmark: "Notifications Enabled"
   - A test notification will appear

### On Mobile (Android Chrome, iOS Safari)

1. **Open Dashboard in Browser**

   - Navigate to your dashboard URL

2. **Grant Permission**

   - Tap "Enable Notifications" on the banner
   - Mobile browsers will show a system permission dialog
   - Tap **Allow**

3. **For iOS Safari**

   - Go to Settings → Safari → Websites → Notifications
   - Find your site and set to "Allow"

4. **For Android Chrome**
   - Chrome will prompt automatically
   - Or go to Settings → Site Settings → Notifications

---

## 🔧 Notification Settings

### Access Settings Panel

The Notification Settings panel appears on the dashboard with options to:

1. **Enable/Disable Notifications**

   - Toggle notifications on or off
   - See current permission status

2. **Sound Alerts**

   - Enable/disable alert sounds
   - Sounds play for critical alerts only

3. **Test Notifications**

   - Send a test notification to verify setup
   - Checks if everything is working

4. **Alert Types**
   - View which alert types are enabled
   - All types are active by default:
     - 🚨 Leakage Detection
     - ⚠️ Water Quality Issues
     - 📡 System Status Changes

---

## 🎨 Notification Types

### 🚨 Critical: Leakage Detected

**Trigger**: Flow rate deviation > 20%

```
Title: 🚨 LEAKAGE DETECTED!
Body: Flow rate deviation detected!
      Actual: 2.5 L/min
      Expected: 2.0 L/min

      Immediate attention required!
```

**Features**:

- ❗ Requires user interaction (won't auto-dismiss)
- 🔊 Plays alert sound (if enabled)
- 📳 Strong vibration pattern (mobile)
- 🔴 High priority

### ⚠️ Warning: Water Quality Issue

**Trigger**: TDS < 50 ppm OR TDS > 500 ppm

```
Title: ⚠️ Water Quality Alert
Body: TDS level out of range: 620.5 ppm

      Check your water quality immediately.
```

**Features**:

- ❗ Requires user interaction
- 🔊 Plays alert sound (if enabled)
- 📳 Medium vibration pattern (mobile)
- 🟡 High priority

### 📡 Info: System Status

**Trigger**: Status changes in Firebase

```
Title: ⚠️ Water Monitor Alert
Body: [Custom alert message from Firebase]
```

**Features**:

- ℹ️ Auto-dismisses after 10 seconds
- 🔔 Standard notification sound
- 📳 Light vibration (mobile)
- 🔵 Normal priority

---

## 🔔 How Notifications Work

### 1. Permission Request

```typescript
// User clicks "Enable Notifications"
const permission = await Notification.requestPermission();
// Browser shows permission dialog
// User clicks "Allow" or "Block"
```

### 2. Firebase Listener

```typescript
// Dashboard monitors Firebase in real-time
/alerts → New alert detected
/readings/current → Status change detected
```

### 3. Notification Sent

```typescript
// Notification appears on device
new Notification(title, {
  body: message,
  icon: "/water-icon.png",
  badge: "/badge-icon.png",
  vibrate: [200, 100, 200],
  requireInteraction: true, // For critical alerts
});
```

### 4. User Interaction

```typescript
// User clicks notification
→ Browser/app opens and focuses
→ Notification closes
```

---

## 🛠️ Technical Implementation

### Components Created

1. **`useNotifications.ts`** - Custom React hook

   - Manages notification state
   - Requests permissions
   - Listens to Firebase alerts
   - Sends browser notifications

2. **`NotificationPermission.tsx`** - Permission banner

   - Shows at top of dashboard
   - Requests user permission
   - Displays current status

3. **`NotificationSettings.tsx`** - Settings panel

   - Toggle notifications on/off
   - Enable/disable sounds
   - Test notifications
   - View alert types

4. **`NotificationInitializer.tsx`** - Auto-initializer

   - Registers service worker
   - Sets up background notifications

5. **Service Worker (`sw.js`)**
   - Handles background notifications
   - Works when browser is closed
   - Syncs offline alerts

### Firebase Integration

```javascript
// Listen for new alerts
ref(database, "/alerts") → onValue()
  → New alert detected
  → Send notification

// Listen for status changes
ref(database, "/readings/current") → onValue()
  → Status changed
  → Send notification if critical
```

---

## 📊 Notification Flow Diagram

```
┌─────────────────┐
│  ESP8266 Device │
│  Detects Issue  │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Firebase RTDB      │
│  /alerts/timestamp  │
│  /readings/current  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Dashboard Hook     │
│  useNotifications() │
│  Detects New Alert  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Browser API        │
│  new Notification() │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  User's Device      │
│  📱 💻 Phone/Laptop │
│  Shows Notification │
└─────────────────────┘
```

---

## ⚙️ Configuration Options

### Sound Settings

Stored in `localStorage`:

```javascript
// Enable/disable sound
localStorage.setItem("notificationSound", "true");

// Check sound setting
const soundEnabled = localStorage.getItem("notificationSound") !== "false";
```

### Notification Thresholds

From `config.h`:

```cpp
TDS_MIN_THRESHOLD: 50 ppm
TDS_MAX_THRESHOLD: 500 ppm
FLOW_DEVIATION_THRESHOLD: 20%
```

### Timing

```javascript
Auto-dismiss: 10 seconds (normal alerts)
Persistent: Until clicked (critical alerts)
Cooldown: 5 minutes between duplicate alerts (ESP8266)
```

---

## 🧪 Testing Notifications

### 1. Test Button Method

1. Open Dashboard
2. Enable notifications if not already enabled
3. Expand "Notification Settings"
4. Click **"Send Test Notification"**
5. You should see a test notification appear

### 2. Simulate Alert Method

Use Firebase Console to manually create an alert:

```json
{
  "alerts": {
    "1733664000": {
      "message": "Test: Water quality issue: TDS = 600 ppm",
      "timestamp": 1733664000,
      "tds": 600.5,
      "flowRate": 2.1
    }
  }
}
```

### 3. ESP8266 Method

Trigger a real alert by:

- Changing TDS sensor value (adjust threshold)
- Modifying flow rate (create deviation)
- Manually sending alert from Arduino serial

---

## 🐛 Troubleshooting

### ❌ Not Receiving Notifications

**Check Permission Status**

```javascript
console.log(Notification.permission);
// Should be: "granted"
```

**Solutions**:

1. Check browser notification settings
2. Ensure site isn't in Do Not Disturb list
3. Verify notifications aren't blocked globally
4. Check browser console for errors
5. Try in incognito mode (fresh start)

### ❌ Permission Denied

**On Desktop**:

- Click lock icon in address bar
- Find "Notifications"
- Change to "Allow"
- Refresh page

**On Mobile**:

- Go to device Settings
- Find your browser
- Enable notifications
- Refresh page

### ❌ Notifications Not Appearing on Mobile

**iOS Safari**:

- Add website to Home Screen
- Notifications work better as PWA
- Check iOS Settings → Notifications

**Android Chrome**:

- Ensure notifications are enabled
- Check battery optimization settings
- Verify Do Not Disturb is off

### ❌ No Sound Playing

1. Check "Sound Alerts" toggle in settings
2. Verify browser has audio permission
3. Check device volume
4. Ensure `alert-sound.mp3` exists in `/public`

---

## 📱 Mobile PWA Installation

For better mobile notifications, install as PWA:

### Android

1. Open dashboard in Chrome
2. Tap menu (⋮)
3. Select "Add to Home screen"
4. Confirm installation
5. Notifications will work like native app

### iOS

1. Open dashboard in Safari
2. Tap share button
3. Select "Add to Home Screen"
4. Confirm
5. Grant notification permission when prompted

---

## 🔒 Privacy & Security

### What's Collected

- ❌ **No personal data** is collected
- ❌ **No tracking** of notification interactions
- ✅ Only monitors water sensor data

### Permissions Used

- **Notifications**: To send alerts
- **Service Worker**: For background notifications
- **Local Storage**: To save sound preferences

### Data Storage

- Notification preferences: Stored locally in browser
- No server-side tracking
- All data stays in Firebase (your own database)

---

## 🚀 Advanced Features

### Background Notifications

Notifications work even when:

- ✅ Browser tab is in background
- ✅ Browser is minimized
- ✅ Device is locked (mobile)
- ✅ Multiple tabs are open

### Notification Grouping

Multiple alerts are grouped:

```
Water Monitor (3)
├─ Leakage detected
├─ Water quality issue
└─ System status change
```

### Priority Levels

- **High**: Leakage, Quality issues (persistent)
- **Normal**: Status changes (auto-dismiss)

---

## 📚 Code Examples

### Request Permission

```typescript
import { useNotifications } from "@/hooks/useNotifications";

function MyComponent() {
  const { requestPermission } = useNotifications();

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log("Notifications enabled!");
    }
  };

  return <button onClick={handleEnable}>Enable</button>;
}
```

### Send Custom Notification

```typescript
import { useNotifications } from "@/hooks/useNotifications";

function MyComponent() {
  const { sendNotification } = useNotifications();

  const alertUser = () => {
    sendNotification("Custom Alert", {
      body: "This is a custom notification",
      icon: "/custom-icon.png",
      requireInteraction: true,
    });
  };

  return <button onClick={alertUser}>Alert</button>;
}
```

---

## 📊 Notification Statistics

Track in browser console:

```javascript
// Total notifications sent
let notificationCount = 0;

// Listen for notifications
Notification.requestPermission().then(() => {
  // Count notifications
  const originalNotification = window.Notification;
  window.Notification = function (...args) {
    notificationCount++;
    console.log(`Total notifications: ${notificationCount}`);
    return new originalNotification(...args);
  };
});
```

---

## 🎯 Best Practices

### For Users

1. ✅ Enable notifications for critical alerts
2. ✅ Keep browser/app open in background
3. ✅ Ensure device isn't in Do Not Disturb mode
4. ✅ Add to Home Screen on mobile (PWA)
5. ✅ Test notifications after enabling

### For Developers

1. ✅ Request permission at appropriate time
2. ✅ Don't spam users with notifications
3. ✅ Use clear, actionable messages
4. ✅ Provide easy way to disable
5. ✅ Test on multiple devices/browsers

---

## 🆘 Support

If notifications aren't working:

1. Check this guide's troubleshooting section
2. Review browser console for errors
3. Test with the built-in test button
4. Verify Firebase connection
5. Check ESP8266 is sending alerts

---

## ✅ Checklist

- [ ] Notifications enabled in dashboard
- [ ] Permission granted in browser
- [ ] Test notification received successfully
- [ ] Sound alerts working (if enabled)
- [ ] Mobile notifications working
- [ ] PWA installed (optional, for better mobile experience)
- [ ] Firebase alerts configured
- [ ] ESP8266 sending data properly

---

**Notification System Version**: 1.0  
**Last Updated**: December 8, 2025  
**Status**: ✅ Fully Operational

🎉 **You're all set to receive real-time alerts!**
