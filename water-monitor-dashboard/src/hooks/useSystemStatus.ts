"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { SystemInfo, Notification } from "@/lib/types";

export function useSystemStatus() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to system info
    const systemRef = ref(database, "system");
    const unsubscribeSystem = onValue(systemRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSystemInfo({
          expectedFlowRate: data.expectedFlowRate || 0,
          lastUpdate: data.lastUpdate || Date.now(),
          online: data.online ?? true,
        });
      }
      setLoading(false);
    });

    // Listen to notifications
    const notifRef = ref(database, "notifications/latest");
    const unsubscribeNotif = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setNotification({
          latest: data.message || "",
          timestamp: data.timestamp || Date.now(),
          unread: data.unread ?? false,
        });
      } else {
        setNotification(null);
      }
    });

    return () => {
      unsubscribeSystem();
      unsubscribeNotif();
    };
  }, []);

  return { systemInfo, notification, loading };
}
