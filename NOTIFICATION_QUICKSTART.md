# 🔔 Quick Notification Setup

## Enable Notifications in 30 Seconds

### Step 1: Open Dashboard

```bash
cd water-monitor-dashboard
npm run dev
```

Open: http://localhost:3000

### Step 2: Click "Enable Notifications"

A purple banner will appear at the top. Click the button.

### Step 3: Allow in Browser

When the browser asks for permission, click **Allow**.

### Step 4: Done! ✅

You'll see a green checkmark and receive a welcome notification.

---

## What You'll Get Notified About

### 🚨 Critical Alerts (Requires Action)

- **Leakage Detected** - When flow rate deviates >20%
- **Water Quality Issue** - When TDS is out of range (50-500 ppm)

### 📡 Status Updates

- **System Status Changes** - When device goes online/offline
- **Custom Alerts** - From Firebase alerts database

---

## Quick Test

1. Enable notifications
2. Expand "Notification Settings" section
3. Click "Send Test Notification"
4. You should see a test notification appear!

---

## Troubleshooting

### Not seeing notifications?

**Desktop:**

- Click lock icon in address bar
- Set Notifications to "Allow"
- Refresh page

**Mobile:**

- Go to browser settings
- Enable notifications for this site
- Add to Home Screen for better experience

---

## Features

✅ Works on desktop and mobile  
✅ Works when browser is in background  
✅ Sound alerts for critical issues  
✅ Persistent notifications for urgent alerts  
✅ Auto-dismiss for normal alerts  
✅ Click notification to focus app

---

For detailed documentation, see [NOTIFICATIONS.md](NOTIFICATIONS.md)
