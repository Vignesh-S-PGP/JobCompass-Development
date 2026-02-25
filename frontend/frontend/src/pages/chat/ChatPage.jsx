import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

import socketService from "../../services/socket";
import { getUserFromToken } from "../../utils/auth";

import { socket } from "../../services/socket";
import { Send, User, MessageSquare, ChevronLeft, Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";


export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).sub : null;
  const role = token ? jwtDecode(token).role : "jobseeker";


  useEffect(() => {
    socket.connect();
    api.get("/chat/my")
      .then(res => setConversations(res.data.conversations || []))
      .finally(() => setLoading(false));

    return () => {
      socket.disconnect();
    };
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

  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []))
      .finally(() => setLoading(false));

    socket.emit("join_room", { conversationId });

    socket.on("new_message", (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on("display_typing", (data) => {
      if (data.isTyping) setIsTyping(true);
      else setIsTyping(false);
    });

    return () => {
      socket.off("new_message");
      socket.off("display_typing");

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

    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      conversationId,
      senderId: userId,
      text: text.trim()
    });

    setText("");
    socket.emit("typing", { conversationId, userId, isTyping: false });
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", {
      conversationId,
      userId,
      isTyping: e.target.value.length > 0
    });

  };

  if (loading && conversations.length === 0) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">

      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <MessageSquare className="text-indigo-600" /> Inbox
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map(c => (
            <div
              key={c._id}
              onClick={() => navigate(`/${role}/chat/${c._id}`)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                conversationId === c._id
                ? "bg-white border-indigo-200 shadow-md scale-[1.02]"
                : "border-transparent hover:bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                  {c.applicationId.slice(-2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Application Match</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID: {c.applicationId.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {!conversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
              <MessageSquare size={40} />
            </div>
            <p className="font-black uppercase tracking-widest text-xs">Select a conversation to start</p>
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

            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                  JD
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">Recruitment Team</h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Online Now</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl font-bold text-sm shadow-sm ${
                    m.senderId === userId
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-700 rounded-tl-none"
                  }`}>
                    {m.text}
                    <p className={`text-[8px] mt-1 opacity-50 ${m.senderId === userId ? "text-right" : "text-left"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-slate-50 px-4 py-2 rounded-full flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <div className="p-8 border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  value={text}
                  onChange={handleTyping}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all pr-16"
                  placeholder="Write your message..."
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}