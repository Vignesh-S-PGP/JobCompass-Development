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
  CheckCheck,
  ArrowLeft,
  UserCircle,
  Clock,
  Search,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { roleBasePath } from "../../utils/rolePath";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredConversations = conversations.filter(c =>
    c.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center bg-white rounded-[3rem] border-2 border-slate-50">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Decrypting Transmission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">

      {/* INBOX PANEL */}
      <div className="w-96 border-r border-slate-100 bg-slate-50/50 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <MessageSquare className="text-primary-600" size={24} />
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Inbox</h1>
             </div>
             <Badge variant="primary" className="px-3">Secure</Badge>
          </div>
          <Input
            icon={Search}
            placeholder="Search dialogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border-none shadow-none text-xs"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="p-10 text-center opacity-50">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No transmissions located</p>
            </div>
          ) : filteredConversations.map(c => (
            <div
              key={c._id}
              onClick={() => navigate(`${roleBasePath[user.role]}/chat/${c._id}`)}
              className={`group flex items-center gap-4 p-5 rounded-[2rem] cursor-pointer transition-all duration-300 relative overflow-hidden ${
                conversationId === c._id
                  ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-primary-100"
                  : "hover:bg-white hover:shadow-lg"
              }`}
            >
              <div className="relative shrink-0">
                 <div className="w-12 h-12 rounded-2xl bg-primary-950 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {c.participant.profileImage ? (
                       <img src={c.participant.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-xs font-black text-white">{c.participant.name?.[0]}</span>
                    )}
                 </div>
                 {c.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                       {c.unreadCount}
                    </div>
                 )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                   <p className="font-black text-sm text-slate-900 truncate uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                     {c.participant.name}
                   </p>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     {formatTime(c.lastMessageAt)}
                   </span>
                </div>
                <p className="text-xs font-medium text-slate-500 truncate group-hover:text-slate-700">
                  {c.lastMessage || "No historical messages"}
                </p>
              </div>

              {conversationId === c._id && (
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-l-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT DISPLAY */}
      <div className="flex-1 flex flex-col bg-white">
        {activeUser ? (
          <>
            {/* CHAT HEADER */}
            <header className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
              <div
                className="flex items-center gap-6 cursor-pointer group"
                onClick={() => navigate(`${roleBasePath[user.role]}/profile/${activeUser._id}`)}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-md group-hover:border-primary-500 transition-colors">
                  {activeUser.profileImage ? (
                    <img src={activeUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-white uppercase">{activeUser.name?.[0]}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors leading-none mb-1.5">{activeUser.name}</h2>
                  <div className="flex items-center gap-3">
                     <Badge className="px-2 py-0.5 text-[8px] bg-slate-50 text-slate-400 border-slate-100">{activeUser.role.replace('_', ' ')}</Badge>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Active Transmission</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="sm" icon={ShieldCheck} className="text-primary-600" />
                 <Button variant="ghost" size="sm" icon={MoreVertical} />
              </div>
            </header>

            {/* MESSAGES FEED */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50/30 space-y-8">
              {messages.map((m, i) => {
                const mine = m.senderId === user.sub;
                const isSystem = m.senderId === 'system';

                if (isSystem) return (
                   <div key={i} className="flex justify-center">
                      <div className="bg-white/50 border border-slate-100 px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                         <Clock size={12} /> {m.text}
                      </div>
                   </div>
                );

                return (
                  <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"} animate-in ${mine ? "slide-up" : "fade-in"}`}>
                    <div className={`max-w-[65%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div className={`
                        px-8 py-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-xl
                        ${mine
                          ? "bg-slate-950 text-white rounded-tr-none shadow-slate-900/10"
                          : "bg-white border border-slate-100 text-slate-900 rounded-tl-none shadow-slate-200/30"}
                      `}>
                        {m.text}
                      </div>

                      <div className={`flex items-center gap-3 mt-3 ${mine ? "flex-row" : "flex-row-reverse"}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatTime(m.createdAt)}
                        </span>
                        {mine && (
                           <div className="flex items-center">
                              {m.readAt ? <CheckCheck size={16} className="text-primary-600" /> : <Check size={14} className="text-slate-300" />}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE INPUT SECTION */}
            <div className="p-8 md:px-12 md:pb-12 bg-white border-t border-slate-50 relative z-10">
               <div className="relative group">
                  <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    className="w-full bg-slate-50 border-none rounded-[2.5rem] pl-10 pr-20 py-6 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-600/5 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
                    placeholder="Type encrypted message..."
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 opacity-30 group-focus-within:opacity-100 transition-opacity">
                     <Sparkles size={18} />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Button
                       onClick={sendMessage}
                       className="p-4 rounded-[2rem] shadow-xl shadow-primary-600/30"
                       icon={Send}
                    />
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
             <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner">
                <MessageSquare size={48} className="text-slate-200" />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">Registry Dialogue</h2>
             <p className="text-slate-500 font-medium max-w-sm mx-auto mb-12 uppercase text-[10px] tracking-[0.2em] leading-relaxed">Select a secure transmission from the inbox to initiate communications with a verified profile.</p>
             <div className="flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={18} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
