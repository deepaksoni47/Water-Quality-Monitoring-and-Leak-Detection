"use client";

import { Droplets } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Water Monitor</h1>
            <p className="text-gray-400 text-sm">Real-time monitoring system</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-success animate-pulse" : "bg-danger"
            }`}
          />
          <span className="text-sm text-gray-300">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );
}
