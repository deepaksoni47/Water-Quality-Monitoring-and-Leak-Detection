import { Alert } from "@/lib/types";
import { AlertCircle, Droplet, Wind } from "lucide-react";

interface AlertsListProps {
  alerts: Alert[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const getAlertIcon = (message: string) => {
    if (
      message.toLowerCase().includes("tds") ||
      message.toLowerCase().includes("quality")
    ) {
      return <Droplet className="w-5 h-5 text-warning" />;
    }
    if (
      message.toLowerCase().includes("flow") ||
      message.toLowerCase().includes("leak")
    ) {
      return <Wind className="w-5 h-5 text-danger" />;
    }
    return <AlertCircle className="w-5 h-5 text-primary" />;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card-bg border border-gray-300 dark:border-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
        <AlertCircle className="w-6 h-6" />
        Recent Alerts
        {alerts.length > 0 && (
          <span className="ml-auto text-sm font-normal text-gray-400">
            {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
          </span>
        )}
      </h2>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-gray-400 text-lg font-medium">No alerts</p>
          <p className="text-gray-500 text-sm mt-2">
            System is operating normally
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.message)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-1">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{formatTimestamp(alert.timestamp)}</span>
                    {alert.tds !== undefined && (
                      <span className="text-purple-400">
                        TDS: {alert.tds.toFixed(1)} ppm
                      </span>
                    )}
                    {alert.flowRate !== undefined && (
                      <span className="text-pink-400">
                        Flow: {alert.flowRate.toFixed(2)} L/min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
