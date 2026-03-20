import { Bell, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import socketService from "../../services/socket";

export default function NotificationBell({ className = "" }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();

    socketService.connect();

    socketService.onNotification((notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

  }, []);

  const loadNotifications = () => {
    api.get("/notifications")
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error("Notification load failed", err));
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`relative ${className}`}>

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition"
      >
        <Bell size={22} className="text-slate-300" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center
          min-w-[16px] h-[16px] text-[10px] font-bold text-white
          bg-rose-500 rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-96
        bg-[#11162A] border border-white/10
        rounded-2xl shadow-2xl z-50
        overflow-hidden
        animate-in fade-in slide-in-from-top-2 duration-200">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-slate-400">
                  You're all caught up
                </p>
              </div>
            ) : (

              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => {

                    markAsRead(n._id);

                    if (n.meta?.jobId) {
                      navigate("/jobseeker/jobs", {
                        state: { openJobId: n.meta.jobId }
                      });
                    }
                  }}

                  className={`w-full text-left px-5 py-4 border-b border-white/5
                  flex gap-3 hover:bg-white/5 transition
                  ${!n.isRead ? "bg-indigo-500/5" : ""}`}
                >

                  {/* UNREAD DOT */}
                  {!n.isRead && (
                    <Circle
                      size={8}
                      fill="#6366f1"
                      className="text-indigo-500 mt-2 flex-shrink-0"
                    />
                  )}

                  {/* CONTENT */}
                  <div className="flex-1">

                    <p className="text-sm font-medium text-white leading-tight">
                      {n.title}
                    </p>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {n.message}
                    </p>

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