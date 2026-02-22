import { Bell, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { socket } from "../../services/socket";

export default function NotificationBell({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();

    socket.on("new_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      socket.off("new_notification");
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
        <div className="absolute bottom-full mb-4 right-0 w-80 bg-[#11162A] border border-white/10 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
            {unreadCount > 0 && <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{unreadCount} New</span>}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">All caught up</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`w-full text-left px-6 py-4 transition-all hover:bg-white/5 border-b border-white/5 flex gap-3
                    ${n.isRead ? "opacity-60" : "bg-indigo-500/5"}`}
                >
                  {!n.isRead && <Circle size={8} fill="#4f46e5" className="text-indigo-600 mt-1 flex-shrink-0" />}
                  <div>
                    <p className="font-black text-sm text-white leading-tight mb-1">{n.title}</p>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}