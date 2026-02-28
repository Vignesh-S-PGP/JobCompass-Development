import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import socketService from "../../services/socket";
import { getUserFromToken } from "../../utils/auth";
import {
  Send,
  MessageSquare,
  Loader2,
  Check,
  CheckCheck
} from "lucide-react";
import { roleBasePath } from "../../utils/rolePath";

/* ---------- TIME FORMAT ---------- */
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c._id === conversationId);
  const activeUser = activeConversation?.participant;

  /* ---------- LOAD CONVERSATIONS ---------- */
  useEffect(() => {
    socketService.connect();

    api.get("/chat/my")
      .then(res => {
        setConversations(res.data.conversations || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- LOAD MESSAGES ---------- */
  useEffect(() => {
    if (!conversationId) return;

    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []));

    socketService.joinConversation(conversationId);

    const onMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;
      setMessages(prev =>
        prev.some(m => m._id === msg._id) ? prev : [...prev, msg]
      );
    };

    socketService.onNewMessage(onMessage);

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.offNewMessage(onMessage);
    };
  }, [conversationId]);

  /* ---------- AUTOSCROLL ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      senderId: user.sub,
      text,
      createdAt: new Date().toISOString(),
      readAt: null
    };

    setMessages(prev => [...prev, optimistic]);
    setText("");

    await api.post(`/chat/${conversationId}/messages`, { text });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white border rounded-3xl overflow-hidden">

      {/* INBOX */}
      <Inbox
        conversations={conversations}
        user={user}
        navigate={navigate}
        activeId={conversationId}
      />

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        {activeUser && (
          <div
            className="flex items-center gap-3 p-4 border-b cursor-pointer"
            onClick={() =>
              navigate(`${roleBasePath[user.role]}/profile/${activeUser._id}`)
            }
          >
            <img
              src={activeUser.profileImage || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{activeUser.name}</p>
              <p className="text-xs text-slate-400">{activeUser.role}</p>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, i) => {
            const mine = m.senderId === user.sub;
            return (
              <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[70%]">
                  <div className={`px-4 py-2 rounded-2xl text-sm ${
                    mine ? "bg-indigo-600 text-white" : "bg-white border"
                  }`}>
                    {m.text}
                  </div>

                  <div className={`flex items-center gap-1 text-[10px] mt-1 ${
                    mine ? "justify-end text-slate-500 font-medium" : "text-slate-400"
                  }`}>
                    <span>{formatTime(m.createdAt)}</span>
                    {mine && (m.readAt ? <CheckCheck size={14} /> : <Check size={12} />)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-xl px-4 py-2"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 rounded-xl">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- INBOX ---------- */
function Inbox({ conversations, user, navigate, activeId }) {
  return (
    <div className="w-80 border-r bg-slate-50">
      <div className="p-6 border-b font-black text-lg flex gap-2">
        <MessageSquare className="text-indigo-600" /> Inbox
      </div>

      <div className="p-4 space-y-2 overflow-y-auto">
        {conversations.map(c => (
          <div
            key={c._id}
            onClick={() => navigate(`${roleBasePath[user.role]}/chat/${c._id}`)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
              activeId === c._id ? "bg-white shadow border" : "hover:bg-white"
            }`}
          >
            <img
              src={c.participant.profileImage || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate">
                {c.participant.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {c.lastMessage || "No messages yet"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-400">
                {formatTime(c.lastMessageAt)}
              </span>

              {c.unreadCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-2 rounded-full">
                  {c.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}