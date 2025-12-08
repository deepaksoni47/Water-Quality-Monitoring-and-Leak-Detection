"use client";

import { useState } from "react";
import { Settings, Save, RefreshCw } from "lucide-react";
import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";

interface SettingsPanelProps {
  currentExpectedFlow: number;
}

export default function SettingsPanel({
  currentExpectedFlow,
}: SettingsPanelProps) {
  const [expectedFlow, setExpectedFlow] = useState(currentExpectedFlow);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const systemRef = ref(database, "system");
      await update(systemRef, {
        expectedFlowRate: parseFloat(expectedFlow.toFixed(2)),
        lastUpdate: Date.now(),
      });

      setMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = () => {
    setExpectedFlow(currentExpectedFlow);
    setMessage(null);
  };

  const hasChanges = expectedFlow !== currentExpectedFlow;

  return (
    <div className="bg-card-bg border border-gray-300 dark:border-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Settings
      </h2>

      <div className="space-y-6">
        {/* Expected Flow Rate Input */}
        <div>
          <label
            htmlFor="expectedFlow"
            className="block text-gray-300 font-medium mb-2"
          >
            Expected Flow Rate (L/min)
          </label>
          <input
            id="expectedFlow"
            type="number"
            step="0.01"
            min="0"
            value={expectedFlow}
            onChange={(e) => setExpectedFlow(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Enter expected flow rate"
          />
          <p className="text-gray-500 text-sm mt-2">
            This value is used to detect flow anomalies and potential leaks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
              hasChanges && !saving
                ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
              hasChanges && !saving
                ? "bg-gray-700 dark:bg-gray-800 text-white hover:bg-gray-600 dark:hover:bg-gray-700 border border-gray-500 dark:border-gray-700"
                : "bg-gray-300 dark:bg-gray-900 text-gray-500 dark:text-gray-600 cursor-not-allowed border border-gray-400 dark:border-gray-800"
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-success/20 border-success/50 text-success"
                : "bg-danger/20 border-danger/50 text-danger"
            }`}
          >
            <p className="font-medium">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
