export interface SensorReading {
  tds: number;
  flowRate: number;
  expectedFlow: number;
  totalVolume: number;
  timestamp: number;
  status: SystemStatus;
}

export type SystemStatus =
  | "NORMAL"
  | "WATER_QUALITY_ISSUE"
  | "LEAKAGE_DETECTED";

export interface Alert {
  id: string;
  message: string;
  timestamp: number;
  tds?: number;
  flowRate?: number;
}

export interface SystemInfo {
  expectedFlowRate: number;
  lastUpdate: number;
  online: boolean;
}

export interface Notification {
  latest: string;
  timestamp: number;
  unread: boolean;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  timestamp: number;
}

export interface MetricCardProps {
  title: string;
  value: string;
  status?: string;
  statusClass?: string;
  icon: React.ReactNode;
  info?: string;
}
