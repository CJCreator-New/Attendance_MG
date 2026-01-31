import { Wifi, WifiOff } from 'lucide-react';

export const LiveIndicator = ({ isConnected, lastUpdate }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm">
      {isConnected ? (
        <>
          <div className="relative">
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-medium text-green-700">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Offline</span>
        </>
      )}
      {lastUpdate && (
        <span className="text-xs text-gray-400 ml-1">
          {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
