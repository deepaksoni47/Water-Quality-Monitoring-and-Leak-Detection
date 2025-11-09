"use client";

import { useState, useEffect } from "react";
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  onValue,
} from "firebase/database";
import { database } from "@/lib/firebase";
import { Alert } from "@/lib/types";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alertsRef = query(
      ref(database, "alerts"),
      orderByChild("timestamp"),
      limitToLast(10)
    );

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const alertsArray: Alert[] = Object.entries(
          data as Record<
            string,
            {
              message: string;
              timestamp: number;
              tds?: number;
              flowRate?: number;
            }
          >
        ).map(([id, alert]) => ({
          id,
          message: alert.message,
          timestamp: alert.timestamp,
          tds: alert.tds,
          flowRate: alert.flowRate,
        }));
        // Sort by timestamp descending (most recent first)
        alertsArray.sort((a, b) => b.timestamp - a.timestamp);
        setAlerts(alertsArray);
      } else {
        setAlerts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { alerts, loading };
}
