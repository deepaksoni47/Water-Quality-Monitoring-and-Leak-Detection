"use client";

import { useEffect } from "react";

export default function NotificationInitializer() {
  useEffect(() => {
    // Register service worker for notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }

    // Request persistent notification permission on page load if not set
    if ("Notification" in window && Notification.permission === "default") {
      // Show a subtle prompt after 5 seconds
      const timer = setTimeout(() => {
        const shouldAsk = localStorage.getItem("notificationPromptShown");
        if (!shouldAsk) {
          localStorage.setItem("notificationPromptShown", "true");
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
