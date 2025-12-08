"use client";

import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
  enabled: boolean;
}

interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

export function useNotifications() {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      permission: "default",
      supported: false,
      enabled: false,
    }
  );

  const [lastAlertId, setLastAlertId] = useState<string>("");

  // Check if notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = "Notification" in window;
      setNotificationState((prev) => ({
        ...prev,
        supported,
        permission: supported ? Notification.permission : "denied",
        enabled: supported && Notification.permission === "granted",
      }));
    };
    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationState((prev) => ({
        ...prev,
        permission,
        enabled: permission === "granted",
      }));

      if (permission === "granted") {
        // Show welcome notification
        new Notification("Water Monitor Notifications Enabled", {
          body: "You will now receive alerts for water quality issues and leaks.",
          icon: "/drop.png",
          badge: "/badge-icon.png",
          tag: "welcome",
        });
      }

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, []);

  // Send notification
  const sendNotification = useCallback(
    async (title: string, options?: ExtendedNotificationOptions) => {
      if (!notificationState.enabled) {
        console.log("Notifications not enabled");
        return;
      }

      try {
        // Check if service worker is available (for PWA)
        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          const registration = await navigator.serviceWorker.ready;

          // Show notification via service worker for PWA
          await registration.showNotification(title, {
            icon: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=192&h=192&fit=crop",
            badge:
              "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=96&h=96&fit=crop",
            requireInteraction: true,
            vibrate: [200, 100, 200],
            ...(options as NotificationOptions),
          } as NotificationOptions);

          console.log("Notification shown via service worker");
        } else {
          // Fallback to standard notification API
          const notification = new Notification(title, {
            icon: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=192&h=192&fit=crop",
            badge:
              "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=96&h=96&fit=crop",
            requireInteraction: true,
            ...(options as NotificationOptions),
          } as NotificationOptions);

          // Auto-close after 10 seconds if not interacted with
          setTimeout(() => {
            notification.close();
          }, 10000);

          // Handle notification click
          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          console.log("Notification shown via Notification API");
        }

        return true;
      } catch (error) {
        console.error("Error showing notification:", error);
        return null;
      }
    },
    [notificationState.enabled]
  );

  // Listen for alerts from Firebase
  useEffect(() => {
    if (!notificationState.enabled) return;

    const alertsRef = ref(database, "/alerts");

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const alerts = snapshot.val();
        const alertEntries = Object.entries(alerts);

        // Get the latest alert
        if (alertEntries.length > 0) {
          const [latestId, latestAlert] = alertEntries[
            alertEntries.length - 1
          ] as [
            string,
            {
              message: string;
              timestamp: number;
              tds?: number;
              flowRate?: number;
            }
          ];

          // Only notify if it's a new alert
          if (latestId !== lastAlertId) {
            setLastAlertId(latestId);

            // Determine notification type and urgency
            const message = latestAlert.message || "";
            const isLeakage = message.toLowerCase().includes("leak");
            const isQuality =
              message.toLowerCase().includes("quality") ||
              message.toLowerCase().includes("tds");

            let title = "⚠️ Water Monitor Alert";
            let urgency: "normal" | "high" = "normal";
            let body = message;

            if (isLeakage) {
              title = "🚨 LEAKAGE DETECTED!";
              urgency = "high";
              body = `${message}\n\nImmediate attention required!`;
            } else if (isQuality) {
              title = "⚠️ Water Quality Issue";
              urgency = "high";
              body = `${message}\n\nCheck your water system.`;
            }

            // Send notification with appropriate settings
            sendNotification(title, {
              body,
              tag: latestId,
              requireInteraction: urgency === "high",
            } as ExtendedNotificationOptions);

            // Play sound if high urgency
            if (urgency === "high") {
              playAlertSound();
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [notificationState.enabled, lastAlertId, sendNotification]);

  // Listen for critical status changes
  useEffect(() => {
    if (!notificationState.enabled) return;

    const currentReadingRef = ref(database, "/readings/current");

    const unsubscribe = onValue(currentReadingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const status = data.status;

        // Notify on critical status
        if (status === "LEAKAGE_DETECTED") {
          sendNotification("🚨 LEAKAGE DETECTED!", {
            body: `Flow rate deviation detected!\nActual: ${data.flowRate?.toFixed(
              2
            )} L/min\nExpected: ${data.expectedFlow?.toFixed(2)} L/min`,
            tag: "leakage-status",
            requireInteraction: true,
          } as ExtendedNotificationOptions);
          playAlertSound();
        } else if (status === "WATER_QUALITY_ISSUE") {
          sendNotification("⚠️ Water Quality Alert", {
            body: `TDS level out of range: ${data.tds?.toFixed(
              1
            )} ppm\n\nCheck your water quality immediately.`,
            tag: "quality-status",
            requireInteraction: true,
          } as ExtendedNotificationOptions);
          playAlertSound();
        }
      }
    });

    return () => unsubscribe();
  }, [notificationState.enabled, sendNotification]);

  return {
    ...notificationState,
    requestPermission,
    sendNotification,
  };
}

// Play alert sound
function playAlertSound() {
  try {
    const audio = new Audio("/alert-sound.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.log("Audio play failed:", err));
  } catch {
    console.log("Alert sound not available");
  }
}
