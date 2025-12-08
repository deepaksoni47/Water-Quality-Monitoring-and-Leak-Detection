# 🔒 Security & Credentials Guide

## ⚠️ IMPORTANT: Before Pushing to GitHub

This project contains sensitive credentials that **MUST NOT** be committed to GitHub. Follow these steps to ensure your credentials remain private.

---

## 🔐 Protected Files

The following files contain sensitive information and are automatically ignored by git:

### **Arduino Credentials**

```
arduino/water_monitoring_system/secrets.h
```

- WiFi SSID and password
- Firebase API keys
- Firebase user credentials
- ThingSpeak API key

### **Web Dashboard Credentials**

```
water-monitor-dashboard/.env.local
```

- Firebase configuration
- API keys
- Project IDs

---

## ✅ How to Set Up Credentials

### **1. Arduino (ESP8266)**

```bash
# Copy the example file
cd arduino/water_monitoring_system
cp secrets.h.example secrets.h

# Edit secrets.h with your actual credentials
# Use your favorite editor (VS Code, Notepad++, etc.)
```

Edit `secrets.h` with your values:

```cpp
#define WIFI_SSID "YourActualWiFiName"
#define WIFI_PASSWORD "YourActualPassword"
#define FIREBASE_HOST "your-project-default-rtdb.region.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
#define FIREBASE_USER_EMAIL "your-user@example.com"
#define FIREBASE_USER_PASSWORD "your-secure-password"
#define THINGSPEAK_API_KEY "XXXXXXXXXXXXXXXXX"
```

### **2. Web Dashboard**

```bash
# Copy the example file
cd water-monitor-dashboard
cp .env.example .env.local

# Edit .env.local with your actual credentials
```

Edit `.env.local` with your Firebase credentials from [Firebase Console](https://console.firebase.google.com/):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🛡️ GitIgnore Protection

Your `.gitignore` file automatically protects:

```gitignore
# Sensitive credentials
arduino/water_monitoring_system/secrets.h
.env
.env.local
.env*.local

# Firebase
.firebase/
firebase-debug.log
```

---

## ✅ Verify Before Pushing

**Always run this before pushing to GitHub:**

```bash
# Check what files will be committed
git status

# Verify secrets.h is NOT listed
# Verify .env.local is NOT listed

# If they appear, they're NOT being ignored!
# Check your .gitignore file
```

---

## 🚨 If You Accidentally Pushed Credentials

### **Immediate Actions:**

1. **Rotate ALL credentials immediately:**

   - Change Firebase API keys
   - Regenerate ThingSpeak API keys
   - Change WiFi password (if exposed)
   - Update Firebase user password

2. **Remove from Git history:**

```bash
# Remove file from all commits (DANGEROUS - backup first!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch arduino/water_monitoring_system/secrets.h" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (only if you're sure!)
git push origin --force --all
```

3. **Contact GitHub Support** to remove cached versions

---

## 📋 Getting Your Credentials

### **Firebase Credentials**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **Your apps** → **SDK setup and configuration**
5. Copy the config values

### **ThingSpeak API Key**

1. Go to [ThingSpeak.com](https://thingspeak.com/)
2. Sign in → **Channels** → Select your channel
3. Go to **API Keys** tab
4. Copy the **Write API Key**

### **WiFi Credentials**

- Your home/office WiFi network name (SSID)
- Your WiFi password
- **Note**: ESP8266 only supports 2.4GHz networks

---

## 🔍 Security Best Practices

### **✅ DO:**

- Use strong, unique passwords
- Keep credentials in `.gitignore` files
- Use environment variables for sensitive data
- Rotate credentials regularly
- Use Firebase Security Rules in production
- Enable 2FA on your Firebase account

### **❌ DON'T:**

- Hard-code credentials in source files
- Commit `.env.local` or `secrets.h` to git
- Share credentials in chat/email
- Use the same password for multiple services
- Expose API keys in client-side code (for backend keys)
- Use default/weak passwords

---

## 🔒 Production Security

When deploying to production:

### **Firebase Security Rules**

Replace open rules with authenticated access:

```json
{
  "rules": {
    "readings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "alerts": {
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

### **Environment-Based Configuration**

Use different credentials for:

- **Development**: Test database, open rules
- **Staging**: Similar to production
- **Production**: Strict rules, monitored access

---

## 📞 Need Help?

If you:

- Accidentally committed credentials
- Lost access to your credentials
- Need to rotate compromised keys
- Have security concerns

**Take immediate action:**

1. Stop using compromised credentials
2. Rotate/regenerate new ones
3. Update your local files
4. Review git history

---

## 📝 Checklist Before Pushing

- [ ] `secrets.h` is NOT in git status
- [ ] `.env.local` is NOT in git status
- [ ] `.gitignore` includes both files
- [ ] No credentials in documentation
- [ ] Example files (`.example`) are safe to commit
- [ ] README doesn't contain real API keys

---

**Last Updated**: December 8, 2025  
**Security Status**: ✅ Protected (if setup correctly)
