import { SystemInfo, SystemStatus as Status } from "@/lib/types";
import { Activity, Wifi, WifiOff, Clock } from "lucide-react";

interface SystemStatusProps {
  systemInfo: SystemInfo | null;
  currentStatus: Status;
}

export default function SystemStatus({
  systemInfo,
  currentStatus,
}: SystemStatusProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "NORMAL":
        return {
          text: "System Normal",
          class: "bg-success/20 text-success",
          icon: <Activity className="w-5 h-5" />,
        };
      case "WATER_QUALITY_ISSUE":
        return {
          text: "Water Quality Alert",
          class: "bg-warning/20 text-warning",
          icon: <Activity className="w-5 h-5" />,
        };
      case "LEAKAGE_DETECTED":
        return {
          text: "Leakage Detected",
          class: "bg-danger/20 text-danger",
          icon: <Activity className="w-5 h-5" />,
        };
      case "DROP_LEAKAGE_DETECTED":
        return {
          text: "Drop Leak Detected",
          class: "bg-danger/20 text-danger",
          icon: <Activity className="w-5 h-5" />,
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);
  const isOnline = systemInfo?.online ?? false;
  const lastUpdate = systemInfo?.lastUpdate
    ? new Date(systemInfo.lastUpdate).toLocaleString()
    : "Never";

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6" />
        System Status
      </h2>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-success" />
            ) : (
              <WifiOff className="w-5 h-5 text-danger" />
            )}
            <span className="text-gray-300">Connection</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isOnline
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* System Status */}
        <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <span className="text-gray-300">Status</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.class}`}
          >
            {statusConfig.text}
          </span>
        </div>

        {/* Last Update */}
        <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">Last Update</span>
          </div>
          <span className="text-gray-400 text-sm">{lastUpdate}</span>
        </div>

        {/* Expected Flow Rate */}
        {systemInfo?.expectedFlowRate !== undefined && (
          <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-gray-300">Expected Flow</span>
            <span className="text-white font-semibold">
              {systemInfo.expectedFlowRate.toFixed(2)} L/min
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
