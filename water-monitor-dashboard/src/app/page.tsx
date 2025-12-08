"use client";

import {
  Droplets,
  Wind,
  TrendingUp,
  Database,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import Header from "@/components/Dashboard/Header";
import MetricCard from "@/components/Dashboard/MetricCard";
import AlertBanner from "@/components/Dashboard/AlertBanner";
import SystemStatus from "@/components/Dashboard/SystemStatus";
import AlertsList from "@/components/Dashboard/AlertsList";
import SettingsPanel from "@/components/Dashboard/SettingsPanel";
import TDSChart from "@/components/Charts/TDSChart";
import FlowChart from "@/components/Charts/FlowChart";
import NotificationPermission from "@/components/Notifications/NotificationPermission";
import NotificationSettings from "@/components/Notifications/NotificationSettings";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useAlerts } from "@/hooks/useAlerts";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { useNotifications } from "@/hooks/useNotifications";

export default function Dashboard() {
  const { data, loading, error } = useRealtimeData();
  const { alerts } = useAlerts();
  const { systemInfo, notification } = useSystemStatus();

  // Refs for scroll animations (keeping for future use)
  const metricsRef = useRef(null);
  const chartsRef = useRef(null);
  const statusRef = useRef(null);
  const notifSettingsRef = useRef(null);
  const alertsRef = useRef(null);

  // Initialize notifications
  useNotifications();

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

  const getDropLeakageStatus = (dropLeakage: boolean) => {
    return dropLeakage
      ? { text: "Drop Detected", class: "bg-danger/20 text-danger" }
      : { text: "No Drops", class: "bg-success/20 text-success" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-danger text-xl mb-2">Error loading data</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure Firebase database rules are deployed and sample data is
            imported.
          </p>
        </motion.div>
      </div>
    );
  }

  // Show UI even if data is null (will show -- placeholders)
  const tdsStatus = data
    ? getTDSStatus(data.tds)
    : { text: "Waiting...", class: "bg-gray-500/20 text-gray-400" };
  const flowStatus = data
    ? getFlowStatus(data.flowRate, data.expectedFlow)
    : { text: "Waiting...", class: "bg-gray-500/20 text-gray-400" };
  const dropLeakageStatus = data
    ? getDropLeakageStatus(data.dropLeakage)
    : { text: "Waiting...", class: "bg-gray-500/20 text-gray-400" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Header isConnected={systemInfo?.online ?? false} />
        </motion.div>

        {/* Notification Permission Banner */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <NotificationPermission />
        </motion.div>

        {notification?.unread && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AlertBanner
              message={notification.latest}
              unread={notification.unread}
            />
          </motion.div>
        )}

        {/* Metrics Cards */}
        <section className="mb-8" ref={metricsRef}>
          <motion.h2
            className="text-2xl font-bold text-primary mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Current Readings
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <MetricCard
                title="Drop Leakage"
                value={data?.dropLeakage ? "DETECTED" : "NONE"}
                status={dropLeakageStatus.text}
                statusClass={dropLeakageStatus.class}
                icon={
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                }
                info="Physical sensor (D5)"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
            </motion.div>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-8" ref={chartsRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <TDSChart />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <FlowChart />
            </motion.div>
          </div>
        </section>

        {/* System Status & Settings */}
        <section className="mb-8" ref={statusRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <SystemStatus
                systemInfo={systemInfo}
                currentStatus={data?.status || "NORMAL"}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <SettingsPanel currentExpectedFlow={data?.expectedFlow || 0} />
            </motion.div>
          </div>
        </section>

        {/* Notification Settings */}
        <motion.section
          className="mb-8"
          ref={notifSettingsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <NotificationSettings />
        </motion.section>

        {/* Alerts List */}
        <motion.section
          ref={alertsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <AlertsList alerts={alerts} />
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p>&copy; 2025 Water Quality Monitoring System</p>
          <p className="mt-1">Refresh Rate: 15 seconds</p>
        </motion.footer>
      </div>
    </div>
  );
}
