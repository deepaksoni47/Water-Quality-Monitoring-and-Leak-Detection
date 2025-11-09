"use client";

import { Droplets, Wind, TrendingUp, Database } from "lucide-react";
import Header from "@/components/Dashboard/Header";
import MetricCard from "@/components/Dashboard/MetricCard";
import AlertBanner from "@/components/Dashboard/AlertBanner";
import SystemStatus from "@/components/Dashboard/SystemStatus";
import AlertsList from "@/components/Dashboard/AlertsList";
import SettingsPanel from "@/components/Dashboard/SettingsPanel";
import TDSChart from "@/components/Charts/TDSChart";
import FlowChart from "@/components/Charts/FlowChart";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useAlerts } from "@/hooks/useAlerts";
import { useSystemStatus } from "@/hooks/useSystemStatus";

export default function Dashboard() {
  const { data, loading, error } = useRealtimeData();
  const { alerts } = useAlerts();
  const { systemInfo, notification } = useSystemStatus();

  const getTDSStatus = (tds: number) => {
    if (tds < 50)
      return { text: "Too Low", class: "bg-warning/20 text-warning" };
    if (tds <= 500)
      return { text: "Good Quality", class: "bg-success/20 text-success" };
    return { text: "Poor Quality", class: "bg-danger/20 text-danger" };
  };

  const getFlowStatus = (actual: number, expected: number) => {
    if (expected === 0)
      return { text: "No Reference", class: "bg-warning/20 text-warning" };
    const deviation = (Math.abs(actual - expected) / expected) * 100;
    if (deviation <= 10)
      return { text: "Normal Flow", class: "bg-success/20 text-success" };
    if (deviation <= 20)
      return { text: "Minor Deviation", class: "bg-warning/20 text-warning" };
    return { text: "Possible Leakage", class: "bg-danger/20 text-danger" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger text-xl mb-2">Error loading data</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const tdsStatus = data ? getTDSStatus(data.tds) : { text: "", class: "" };
  const flowStatus = data
    ? getFlowStatus(data.flowRate, data.expectedFlow)
    : { text: "", class: "" };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6">
        <Header isConnected={!!data} />

        {notification?.unread && (
          <AlertBanner
            message={notification.latest}
            unread={notification.unread}
          />
        )}

        {/* Metrics Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Current Readings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Water Quality (TDS)"
              value={data ? `${data.tds.toFixed(1)} ppm` : "-- ppm"}
              status={tdsStatus.text}
              statusClass={tdsStatus.class}
              icon={
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
              }
            />

            <MetricCard
              title="Flow Rate"
              value={data ? `${data.flowRate.toFixed(2)} L/min` : "-- L/min"}
              status={flowStatus.text}
              statusClass={flowStatus.class}
              icon={
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                  <Wind className="w-7 h-7 text-white" />
                </div>
              }
            />

            <MetricCard
              title="Expected Flow"
              value={
                data ? `${data.expectedFlow.toFixed(2)} L/min` : "-- L/min"
              }
              info="Reference flow rate"
              icon={
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              }
            />

            <MetricCard
              title="Total Volume"
              value={data ? `${data.totalVolume.toFixed(2)} L` : "-- L"}
              info="Session total"
              icon={
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                  <Database className="w-7 h-7 text-white" />
                </div>
              }
            />
          </div>
        </section>

        {/* Charts */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TDSChart />
            <FlowChart />
          </div>
        </section>

        {/* System Status & Settings */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemStatus
              systemInfo={systemInfo}
              currentStatus={data?.status || "NORMAL"}
            />
            <SettingsPanel currentExpectedFlow={data?.expectedFlow || 0} />
          </div>
        </section>

        {/* Alerts List */}
        <section>
          <AlertsList alerts={alerts} />
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Water Quality Monitoring System</p>
          <p className="mt-1">Refresh Rate: 15 seconds</p>
        </footer>
      </div>
    </div>
  );
}
