"use client";

import { useState } from "react";
import { Bell, BellRing, Volume2, VolumeX, Settings } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationSettings() {
  const { permission, enabled, requestPermission, sendNotification } =
    useNotifications();
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem("notificationSound") !== "false"
  );
  const [expandedSettings, setExpandedSettings] = useState(false);

  const handleToggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("notificationSound", String(newValue));
  };

  const handleTestNotification = () => {
    sendNotification("🧪 Test Notification", {
      body: "This is a test notification from Water Monitor.\nIf you see this, notifications are working!",
      tag: "test",
      requireInteraction: false,
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">
            Notification Settings
          </h3>
        </div>
        <button
          onClick={() => setExpandedSettings(!expandedSettings)}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          {expandedSettings ? "Hide" : "Show"}
        </button>
      </div>

      {/* Status Summary */}
      <div className="mb-4">
        <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
          {enabled ? (
            <>
              <BellRing className="w-5 h-5 text-success animate-pulse" />
              <div className="flex-1">
                <p className="text-success font-medium">Notifications Active</p>
                <p className="text-gray-400 text-xs">
                  You&apos;ll receive alerts for leaks and water quality issues
                </p>
              </div>
            </>
          ) : (
            <>
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-300 font-medium">
                  Notifications Disabled
                </p>
                <p className="text-gray-400 text-xs">
                  Enable to receive instant alerts
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {expandedSettings && (
        <div className="space-y-4">
          {/* Enable/Disable Notifications */}
          {!enabled && permission !== "denied" && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-white font-medium mb-3">
                Enable browser notifications to receive alerts
              </p>
              <button
                onClick={requestPermission}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
              >
                <Bell className="w-4 h-4" />
                Enable Notifications
              </button>
            </div>
          )}

          {permission === "denied" && (
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
              <p className="text-danger font-medium mb-2">
                Notifications Blocked
              </p>
              <p className="text-gray-400 text-sm">
                You&apos;ve blocked notifications for this site. To enable:
              </p>
              <ul className="text-gray-400 text-sm mt-2 ml-4 space-y-1">
                <li>• Chrome: Click the lock icon → Notifications → Allow</li>
                <li>
                  • Firefox: Click the shield icon → Permissions → Notifications
                </li>
                <li>• Safari: Preferences → Websites → Notifications</li>
              </ul>
            </div>
          )}

          {/* Sound Settings */}
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="text-white font-medium">Alert Sound</p>
                  <p className="text-gray-400 text-xs">
                    Play sound for critical alerts
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? "bg-primary" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Alert Types */}
          <div className="p-4 bg-dark-bg rounded-lg border border-gray-800">
            <p className="text-white font-medium mb-3">Alert Types</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-card-bg rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger"></div>
                  <span className="text-gray-300 text-sm">
                    Leakage Detection
                  </span>
                </div>
                <span className="text-success text-xs font-semibold">
                  ENABLED
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-card-bg rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-gray-300 text-sm">
                    Water Quality Issues
                  </span>
                </div>
                <span className="text-success text-xs font-semibold">
                  ENABLED
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-card-bg rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-gray-300 text-sm">
                    System Status Changes
                  </span>
                </div>
                <span className="text-success text-xs font-semibold">
                  ENABLED
                </span>
              </div>
            </div>
          </div>

          {/* Test Notification */}
          {enabled && (
            <button
              onClick={handleTestNotification}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium border border-gray-400"
            >
              <Bell className="w-4 h-4" />
              Send Test Notification
            </button>
          )}

          {/* Info */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-gray-400 text-xs leading-relaxed">
              💡 <strong className="text-white">Tip:</strong> Notifications work
              even when the browser is in the background. Make sure your
              device&apos;s Do Not Disturb mode is off to receive alerts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
