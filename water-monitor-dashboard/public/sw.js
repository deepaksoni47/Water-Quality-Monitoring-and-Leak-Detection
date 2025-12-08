// Service Worker for Push Notifications
const CACHE_NAME = "water-monitor-v1";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  let notificationData = {
    title: "Water Monitor Alert",
    body: "Check your water system",
    icon: "/water-icon.png",
    badge: "/badge-icon.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let client of clientList) {
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});

// Background sync for offline alerts
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event);
  if (event.tag === "sync-alerts") {
    event.waitUntil(syncAlerts());
  }
});

async function syncAlerts() {
  // Sync any missed alerts when coming back online
  console.log("Syncing alerts...");
}
