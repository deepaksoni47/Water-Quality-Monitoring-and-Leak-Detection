"use client";

import { useEffect, useState } from "react";
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  onValue,
} from "firebase/database";
import { database } from "@/lib/firebase";
import { ChartDataPoint } from "@/lib/types";
import { Wind, TrendingUp, TrendingDown } from "lucide-react";

export default function FlowChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = query(
      ref(database, "sensorData"),
      orderByChild("timestamp"),
      limitToLast(20)
    );

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const flowData: ChartDataPoint[] = Object.values(
          data as Record<string, { timestamp: number; flowRate: number }>
        ).map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: item.flowRate,
          timestamp: item.timestamp,
        }));
        setChartData(flowData.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setChartData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getMinMax = () => {
    if (chartData.length === 0) return { min: 0, max: 10 };
    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;
    return { min: Math.max(0, min - padding), max: max + padding };
  };

  const { min, max } = getMinMax();
  const range = max - min || 1;

  const getYPosition = (value: number) => {
    return 90 - ((value - min) / range) * 80;
  };

  const pathData = chartData
    .map((point, index) => {
      const x = 10 + (index / Math.max(chartData.length - 1, 1)) * 80;
      const y = getYPosition(point.value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const getTrend = () => {
    if (chartData.length < 2) return { direction: "stable", percentage: 0 };
    const recent = chartData.slice(-5);
    const firstAvg =
      recent
        .slice(0, Math.ceil(recent.length / 2))
        .reduce((a, b) => a + b.value, 0) / Math.ceil(recent.length / 2);
    const lastAvg =
      recent
        .slice(Math.floor(recent.length / 2))
        .reduce((a, b) => a + b.value, 0) / Math.ceil(recent.length / 2);

    const diff = ((lastAvg - firstAvg) / firstAvg) * 100;
    if (Math.abs(diff) < 2) return { direction: "stable", percentage: 0 };
    return {
      direction: diff > 0 ? "up" : "down",
      percentage: Math.abs(diff),
    };
  };

  const trend = getTrend();

  if (loading) {
    return (
      <div className="bg-card-bg border border-gray-300 dark:border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-gray-300 dark:border-gray-800 rounded-xl p-6 shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Flow Rate Trend</h3>
            <p className="text-gray-400 text-sm">Last 20 readings</p>
          </div>
        </div>
        {trend.direction !== "stable" && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-xs font-semibold">
              {trend.percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available</p>
        </div>
      ) : (
        <div className="relative h-64">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="10"
                y1={y * 0.8 + 10}
                x2="90"
                y2={y * 0.8 + 10}
                stroke="#374151"
                strokeWidth="0.2"
                strokeDasharray="1,1"
              />
            ))}

            {/* Gradient */}
            <defs>
              <linearGradient
                id="flowGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={`${pathData} L 90 90 L 10 90 Z`}
              fill="url(#flowGradient)"
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#ec4899"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {chartData.map((point, index) => {
              const x = 10 + (index / Math.max(chartData.length - 1, 1)) * 80;
              const y = getYPosition(point.value);
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="0.8"
                    fill="#ec4899"
                    className="hover:r-1.5 transition-all cursor-pointer"
                  />
                  <title>
                    {point.time}: {point.value.toFixed(2)} L/min
                  </title>
                </g>
              );
            })}
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{max.toFixed(1)}</span>
            <span>{((max + min) / 2).toFixed(1)}</span>
            <span>{min.toFixed(1)}</span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2 px-8">
            {chartData.length > 0 && (
              <>
                <span>{chartData[0]?.time}</span>
                <span className="text-gray-600">Flow (L/min)</span>
                <span>{chartData[chartData.length - 1]?.time}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
