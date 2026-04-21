import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Send,
  Search,
  User,
  MessageCircle,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Check,
  CheckCheck,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import socketService from "../../services/socket";
import { getUserFromToken } from "../../utils/auth";
import { roleBasePath } from "../../utils/rolePath";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";

/* TIME FORMAT */
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
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c._id === conversationId);
  const activeUser = activeConversation?.participant;

  /* LOAD CONVERSATIONS */
  useEffect(() => {
    socketService.connect();
    api.get("/chat/my")
      .then(res => {
        setConversations(res.data.conversations || []);
      })
      .finally(() => setLoading(false));
    return () => socketService.disconnect();
  }, []);

  /* LOAD MESSAGES */
  useEffect(() => {
    if (!conversationId) return;

    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []));

    socketService.joinConversation(conversationId);

    const onMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;
      setMessages(prev =>
        prev.some(m => m._id === msg._id)
          ? prev
          : [...prev, msg]
      );
    };

    socketService.onNewMessage(onMessage);

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.offNewMessage(onMessage);
    };
  }, [conversationId]);

  /* AUTOSCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = async () => {
    if (!text.trim() || !conversationId) return;

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      senderId: user.sub,
      text,
      createdAt: new Date().toISOString(),
      readAt: null
    };

    setMessages(prev => [...prev, optimistic]);
    setText("");

    try {
      await api.post(`/chat/${conversationId}/messages`, { text });
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center rounded-2xl border border-border bg-card">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm text-muted-foreground font-medium">Loading your conversations...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden rounded-2xl border border-border shadow-xl bg-card dark:bg-slate-950/50 backdrop-blur-sm">
      {/* Sidebar - Conversation List */}
      <motion.div
        className={`
          ${isSidebarOpen ? 'w-full md:w-80' : 'w-0'}
          ${conversationId && isSidebarOpen ? 'hidden md:flex' : 'flex'}
          border-r border-border h-full flex-col transition-all duration-300
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="text-primary" size={20} />
            Messages
          </h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
             <ChevronLeft size={20} />
          </Button>
        </div>

        <div className="p-4 bg-muted/30">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
             <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search chats..."
                className="pl-9 h-10 border-none bg-background shadow-none"
             />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(c => (
            <button
              key={c._id}
              onClick={() => {
                navigate(`${roleBasePath[user.role]}/chat/${c._id}`);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors
                ${conversationId === c._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
              `}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                {c.participant.profileImage ? (
                  <img src={c.participant.profileImage} className="h-full w-full object-cover" />
                ) : (
                  c.participant.name?.[0] || 'U'
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-semibold text-sm truncate">{c.participant.name}</h4>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTime(c.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage || 'Start a conversation'}</p>
              </div>
              {c.unreadCount > 0 && (
                <div className="h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                  {c.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-full ${!conversationId && !isSidebarOpen ? 'flex' : (conversationId ? 'flex' : 'hidden md:flex')}`}>
        {conversationId ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setIsSidebarOpen(true)}>
                  <ChevronLeft size={20} />
                </Button>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {activeUser?.profileImage ? (
                    <img src={activeUser.profileImage} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    activeUser?.name?.[0] || 'U'
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm leading-tight truncate">{activeUser?.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-muted-foreground font-medium">{activeUser?.role || 'Active'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hidden sm:flex"><Phone size={18} /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hidden sm:flex"><Video size={18} /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full"><MoreVertical size={18} /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/10">
              <AnimatePresence mode="popLayout">
                {messages.map((m, i) => {
                  const mine = m.senderId === user.sub;
                  return (
                    <motion.div
                      key={m._id || i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                        <div
                          className={`
                            p-3 px-4 rounded-2xl shadow-sm text-sm
                            ${mine
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card text-foreground rounded-tl-none border border-border/50'}
                          `}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] mt-1.5 opacity-70 ${mine ? 'text-right' : 'text-left'}`}>
                          <span>{formatTime(m.createdAt)}</span>
                          {mine && (
                            m.readAt ? <CheckCheck size={12} className="text-emerald-500" /> : <Check size={12} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-card border-t border-border">
              <div className="flex items-center gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    className="pr-12 h-12 rounded-2xl bg-muted/50 border-none shadow-none focus-visible:ring-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={sendMessage}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-xl font-bold">Your Conversations</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">Choose someone from the list to start messaging or view your conversation history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
