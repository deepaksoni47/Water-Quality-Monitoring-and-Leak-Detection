"use client";

import { Bell, BellOff, Check, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";

export default function NotificationPermission() {
  const { permission, supported, enabled, requestPermission } =
    useNotifications();
  const [requesting, setRequesting] = useState(false);
  const [showBanner, setShowBanner] = useState(
    supported && permission === "default"
  );

  const handleRequest = async () => {
    setRequesting(true);
    const granted = await requestPermission();
    setRequesting(false);
    if (granted) {
      setShowBanner(false);
    }
  };

  if (!supported) {
    return null;
  }

  if (enabled) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-success/20 border border-success/50 rounded-lg">
        <Bell className="w-5 h-5 text-success" />
        <span className="text-success text-sm font-medium">
          Notifications Enabled
        </span>
        <Check className="w-4 h-4 text-success ml-auto" />
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-danger/20 border border-danger/50 rounded-lg">
        <BellOff className="w-5 h-5 text-danger" />
        <div className="flex-1">
          <p className="text-danger text-sm font-medium">
            Notifications Blocked
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Enable in browser settings to receive alerts
          </p>
        </div>
        <X className="w-4 h-4 text-danger" />
      </div>
    );
  }

  if (!showBanner) {
    return (
      <button
        onClick={() => setShowBanner(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary/50 transition-all"
      >
        <BellOff className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300 text-sm">Enable Notifications</span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/50 rounded-xl p-4 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">
            Enable Alert Notifications
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Get instant notifications on your device when water quality issues
            or leaks are detected. Works on phone and laptop!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRequest}
              disabled={requesting}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                requesting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30"
              }`}
            >
              {requesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Requesting...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Enable Notifications
                </>
              )}
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-4 py-2 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
