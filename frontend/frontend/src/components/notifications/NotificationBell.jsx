import { useState, useEffect } from "react";
import api from "../../services/api";
import socketService from "../../services/socket";
import { Bell, CheckCircle, Trash2 } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const loadNotifications = () => {
    api.get("/notifications")
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error("Notification load failed", err));
  };

  useEffect(() => {
    loadNotifications();
    socketService.connect();

    const handleNewNotif = () => {
      loadNotifications();
    };

    socketService.onNotification(handleNewNotif);
    return () => socketService.offNotification(handleNewNotif);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative p-2 rounded-lg hover:bg-white/10 transition">
        <Bell size={22} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <Badge variant="outline">{unreadCount} New</Badge>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className={`p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm ${!n.isRead ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{n.message}</p>
                      <div className="flex gap-1">
                         {!n.isRead && (
                           <button onClick={() => markAsRead(n._id)} className="p-1 hover:text-primary transition-colors"><CheckCircle size={14} /></button>
                         )}
                         <button onClick={() => deleteNotif(n._id)} className="p-1 hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import Badge from "../ui/Badge";
