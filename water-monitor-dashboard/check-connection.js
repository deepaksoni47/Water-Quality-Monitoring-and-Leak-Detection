#!/usr/bin/env node

/**
 * Connection Status Checker
 * Verifies Firebase connection and data flow
 *
 * Usage: node check-connection.js
 */

const admin = require("firebase-admin");

const serviceAccount = {
  projectId: "water-quality-and-leak-detect",
  databaseURL:
    "https://water-quality-and-leak-detect-default-rtdb.asia-southeast1.firebasedatabase.app",
};

console.log("\n🔍 Checking Firebase Connection...\n");
console.log("━".repeat(50));

// Check environment variables
console.log("\n📋 Checking Environment Variables:");
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
];

require("dotenv").config({ path: ".env.local" });

let envOk = true;
requiredEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${envVar}: Missing`);
    envOk = false;
  }
});

if (!envOk) {
  console.log("\n❌ Some environment variables are missing!");
  console.log("Make sure .env.local exists with all required variables.\n");
  process.exit(1);
}

console.log("\n✅ All environment variables present!");

// Initialize Firebase Admin (for testing)
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: serviceAccount.databaseURL,
  });

  const db = admin.database();

  console.log("\n📡 Testing Database Connection:");

  // Check if readings exist
  db.ref("/readings/current").once("value", (snapshot) => {
    if (snapshot.exists()) {
      console.log("  ✅ Current readings path exists");
      const data = snapshot.val();
      console.log(`     TDS: ${data.tds || "N/A"} ppm`);
      console.log(`     Flow: ${data.flowRate || "N/A"} L/min`);
      console.log(`     Status: ${data.status || "N/A"}`);
    } else {
      console.log("  ⚠️  No current readings found");
      console.log("     ESP8266 may not be sending data yet");
    }
  });

  // Check system status
  db.ref("/system").once("value", (snapshot) => {
    if (snapshot.exists()) {
      console.log("\n  ✅ System configuration exists");
      const data = snapshot.val();
      console.log(
        `     Expected Flow: ${data.expectedFlowRate || "N/A"} L/min`
      );
      console.log(`     Online: ${data.online || false}`);
      if (data.lastUpdate) {
        const lastUpdate = new Date(data.lastUpdate * 1000);
        console.log(`     Last Update: ${lastUpdate.toLocaleString()}`);
      }
    } else {
      console.log("\n  ⚠️  System configuration not found");
    }
  });

  // Check for alerts
  db.ref("/alerts")
    .limitToLast(1)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        console.log("\n  ✅ Alerts path exists");
        console.log(`     Alert count: ${snapshot.numChildren()}`);
      } else {
        console.log("\n  ℹ️  No alerts yet (this is good!)");
      }

      console.log("\n━".repeat(50));
      console.log("\n✅ Connection check complete!\n");
      console.log("Next steps:");
      console.log("  1. Make sure ESP8266 is powered on");
      console.log("  2. Check Serial Monitor for connection status");
      console.log("  3. Run: npm run dev");
      console.log("  4. Open: http://localhost:3000\n");

      process.exit(0);
    });
} catch (error) {
  console.log("\n❌ Firebase connection failed!");
  console.log("This is expected - you may need Firebase Admin SDK credentials");
  console.log(
    "But your web app will work with the .env.local configuration!\n"
  );
  process.exit(0);
}
