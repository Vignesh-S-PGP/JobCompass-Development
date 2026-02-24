import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import socketService from "../../services/socket";
import { getUserFromToken } from "../../utils/auth";

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  // Load conversations
  useEffect(() => {
    api.get("/chat/my")
      .then(res => setConversations(res.data.conversations || []));
  }, []);

  const user = getUserFromToken();
  const messagesEndRef = useRef(null);

  // Connect to socket and setup listeners
  useEffect(() => {
    socketService.connect();

    socketService.onNewMessage((msg) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
        setTypingUser(null);
      }
    });

    socketService.onTyping(({ userId }) => {
        setTypingUser(userId);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
        }, 3000);
    });

    return () => {
      socketService.disconnect();
    };
  }, [conversationId]);

  // Load messages when conversation selected
  useEffect(() => {
    if (!conversationId) return;

    socketService.joinConversation(conversationId);

    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []));

    return () => {
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
      setText(e.target.value);
      if (conversationId && user) {
          socketService.emitTyping(conversationId, user.sub);
      }
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversationId) return;

    // We can use either HTTP or Socket to send.
    // If we use HTTP, the backend emits the socket event which we receive back.
    // If we use Socket directly, we need to handle optimistic UI or wait for response.
    // Let's use the API as it's already there and emits.

    try {
        await api.post(`/chat/${conversationId}/messages`, { text });
        setText("");
    } catch (err) {
        console.error("Failed to send message", err);
    }
  };

  return (
    <div className="h-full flex bg-white rounded-xl shadow overflow-hidden">

      {/* LEFT — CONVERSATION LIST */}
      <div className="w-1/3 border-r p-4">
        <h2 className="font-bold mb-4">Messages</h2>

        {conversations.map(c => (
          <div
            key={c._id}
            onClick={() => navigate(c._id)}
            className={`p-3 rounded cursor-pointer hover:bg-slate-100
              ${conversationId === c._id ? "bg-slate-200" : ""}`}
          >
            <p className="text-sm font-semibold">Conversation</p>
            <p className="text-xs text-slate-500">
              Application {c.applicationId.slice(-6)}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT — CHAT */}
      <div className="flex-1 flex flex-col">
        {!conversationId ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 relative">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${m.senderId === user.sub ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                    m.senderId === user.sub
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                  }`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 opacity-70 ${m.senderId === user.sub ? "text-right" : "text-left"}`}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                    </p>
                  </div>
                </div>
              ))}
              {typingUser && typingUser !== user.sub && (
                  <div className="flex justify-start mb-4">
                      <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
                          <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3 flex gap-2">
              <input
                value={text}
                onChange={handleTyping}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}