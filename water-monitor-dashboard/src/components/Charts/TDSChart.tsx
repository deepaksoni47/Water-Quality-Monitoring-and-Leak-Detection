"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ref, query, limitToLast, onValue, off } from "firebase/database";
import { database } from "@/lib/firebase";
import { format } from "date-fns";
import { ChartDataPoint } from "@/lib/types";

export default function TDSChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const historyRef = ref(database, "/readings/history");
    const historyQuery = query(historyRef, limitToLast(20));

    const unsubscribe = onValue(historyQuery, (snapshot) => {
      const dataPoints: ChartDataPoint[] = [];

      snapshot.forEach((childSnapshot) => {
        const reading = childSnapshot.val();
        dataPoints.push({
          time: format(new Date(reading.timestamp * 1000), "HH:mm"),
          value: reading.tds,
          timestamp: reading.timestamp,
        });
      });

      dataPoints.sort((a, b) => a.timestamp - b.timestamp);
      setData(dataPoints);
    });

    return () => off(historyQuery, "value", unsubscribe);
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">TDS History</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ color: "#9CA3AF" }} />
          <ReferenceLine
            y={500}
            label="Max"
            stroke="#F44336"
            strokeDasharray="5 5"
          />
          <ReferenceLine
            y={50}
            label="Min"
            stroke="#F44336"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="value"
            name="TDS (ppm)"
            stroke="#667eea"
            strokeWidth={2}
            dot={{ fill: "#667eea", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
