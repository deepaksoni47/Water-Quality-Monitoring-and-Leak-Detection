import { MetricCardProps } from "@/lib/types";
import { Info } from "lucide-react";

export default function MetricCard({
  title,
  value,
  status,
  statusClass,
  icon,
  info,
}: MetricCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
      <div className="flex items-start justify-between mb-4">
        {icon}
        {info && (
          <div className="group relative">
            <Info className="w-5 h-5 text-gray-500 hover:text-primary cursor-help" />
            <div className="absolute right-0 top-6 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-400">
              {info}
            </div>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      {status && (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {status}
        </span>
      )}
    </div>
  );
}
