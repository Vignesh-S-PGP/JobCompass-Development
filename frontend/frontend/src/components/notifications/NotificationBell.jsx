import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import socketService from "../../services/socket";

export default function NotificationBell({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();

    socketService.connect();
    socketService.onNotification((notif) => {
        setNotifications(prev => [notif, ...prev]);
        // Optional: Play sound or show toast
    });

    return () => {
        // We don't necessarily want to disconnect here if the socket is used elsewhere,
        // but since this component is likely in a layout, it stays mounted.
    };
  }, []);

  const loadNotifications = () => {
    api.get("/notifications")
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error("❌ Notification load failed", err));
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("❌ Failed to mark read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative transition-colors
          ${unreadCount > 0 ? "text-indigo-500" : "text-slate-400"}
          hover:text-indigo-400`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute bottom-full mb-3 right-0 w-72 bg-[#11162A]
          border border-white/10 rounded-xl shadow-2xl z-50">

          <div className="px-4 py-2 text-xs font-bold text-slate-400 border-b border-white/10">
            Notifications
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 text-center">
                No notifications
              </p>
            ) : (
              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`w-full text-left px-4 py-3 text-sm
                    ${n.isRead ? "text-slate-400" : "text-white"}
                    hover:bg-white/5`}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.message}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}