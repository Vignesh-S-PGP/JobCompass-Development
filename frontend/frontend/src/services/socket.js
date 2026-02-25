import { io } from "socket.io-client"

const SOCKET_URL = "http://127.0.0.1:5000"

class SocketService {
  socket = null

  connect() {
    const token = localStorage.getItem("token")
    if (!token) return

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    })

    this.socket.on("connect", () => {
      console.log("Connected to Socket.IO")
    })

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("join_conversation", { conversationId })
    }
  }

  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("leave_conversation", { conversationId })
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit("send_message", data)
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback)
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback)
    }
  }

  onTyping(callback) {
      if (this.socket) {
          this.socket.on("typing", callback)
      }
  }

  emitTyping(conversationId, userId) {
      if (this.socket) {
          this.socket.emit("typing", { conversationId, userId })
      }
  }
}

export default new SocketService()

const SOCKET_URL = "http://127.0.0.1:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: localStorage.getItem("token") });
  }
});

