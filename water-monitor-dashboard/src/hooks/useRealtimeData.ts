import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "@/lib/firebase";
import { SensorReading } from "@/lib/types";

export function useRealtimeData() {
  const [data, setData] = useState<SensorReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readingsRef = ref(database, "/readings/current");

    const unsubscribe = onValue(
      readingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val() as SensorReading);
          setError(null);
        } else {
          setError("No data available");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error reading data:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => off(readingsRef, "value", unsubscribe);
  }, []);

  return { data, loading, error };
}
