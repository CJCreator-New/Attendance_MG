import { Bell, X, Check } from 'lucide-react';
import { useNotificationStore } from '../services/notificationService';

export const NotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    };
    return <Bell className={`w-5 h-5 ${colors[type] || 'text-gray-600'}`} />;
  };

  return (
    <div className="relative">
      <button className="relative p-2 hover:bg-gray-100 rounded-lg">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications</div>
        ) : (
          <div className="divide-y">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notif.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
