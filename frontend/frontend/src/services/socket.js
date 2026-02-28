import { io } from "socket.io-client";

const SOCKET_URL = "http://127.0.0.1:5000";

class SocketService {
  socket = null;

  /* ---------- CONNECT ---------- */
  connect() {
    if (this.socket) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /* ---------- ROOMS ---------- */
  joinConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit("join_conversation", { conversationId });
  }

  leaveConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit("leave_conversation", { conversationId });
  }

  /* ---------- MESSAGES ---------- */
  onNewMessage(callback) {
    if (!this.socket) return;
    this.socket.on("new_message", callback);
  }

  offNewMessage(callback) {
    if (!this.socket) return;
    this.socket.off("new_message", callback);
  }

  /* ---------- NOTIFICATIONS ---------- */
  onNotification(callback) {
    if (!this.socket) return;
    this.socket.on("notification", callback);
  }

  offNotification(callback) {
    if (!this.socket) return;
    this.socket.off("notification", callback);
  }

  /* ---------- TYPING ---------- */
  emitTyping(conversationId, userId) {
    if (!this.socket) return;
    this.socket.emit("typing", { conversationId, userId });
  }

  onTyping(callback) {
    if (!this.socket) return;
    this.socket.on("typing", callback);
  }

  offTyping(callback) {
    if (!this.socket) return;
    this.socket.off("typing", callback);
  }
  onMessagesRead(callback) {
  if (!this.socket) return;
  this.socket.on("messages_read", callback);
}

offMessagesRead(callback) {
  if (!this.socket) return;
  this.socket.off("messages_read", callback);
}
}

export default new SocketService();