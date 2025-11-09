import { AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  message: string;
  unread: boolean;
}

export default function AlertBanner({ message, unread }: AlertBannerProps) {
  return (
    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-4 shadow-lg">
      <div className="flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="text-white font-semibold">{message}</p>
      </div>
      {unread && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
            !
          </span>
        </div>
      )}
    </div>
  );
}
