import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import socketService from "../../services/socket";
import {
  Send,
  Search,
  ChevronLeft,
  Smile,
  Paperclip,
  CheckCheck,
  MessageSquare,
  Phone,
  Video,
  Info
} from "lucide-react";
import { Card, Button, Skeleton } from "../../components/ui";

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchConversations();
    socketService.connect();

    return () => {
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      socketService.joinConversation(conversationId);

      const handleNewMessage = (msg) => {
        if (msg.conversationId === conversationId) {
          setMessages(prev => [...prev, msg]);
        }
        setConversations(prev => prev.map(c =>
          c._id === msg.conversationId ? { ...c, lastMessage: msg.text } : c
        ));
      };

      socketService.onNewMessage(handleNewMessage);
      return () => socketService.offNewMessage(handleNewMessage);
    }
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
    } catch (err) {}
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/chat/my");
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await api.get(`/chat/${id}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !conversationId) return;

    try {
      await api.post(`/chat/${conversationId}/messages`, {
        text: messageText
      });
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const filteredConversations = conversations.filter(c => {
    return c.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeConversation = conversations.find(c => c._id === conversationId);
  const otherParticipant = activeConversation?.participant;

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 max-w-7xl mx-auto">
      {/* CONVERSATION LIST */}
      <aside className={`w-full lg:w-96 flex flex-col gap-6 ${conversationId ? "hidden lg:flex" : "flex"}`}>
        <div className="flex items-center justify-between px-2">
           <h1 className="text-3xl font-black tracking-tight">Messages</h1>
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {conversations.length}
           </div>
        </div>

        <div className="relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-12 bg-card border border-border rounded-2xl pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
           />
        </div>

        <Card className="flex-1 overflow-y-auto p-2 space-y-1 shadow-sm rounded-[32px]">
           {loading ? (
              [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)
           ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                 const other = conv.participant;
                 const isActive = conv._id === conversationId;
                 return (
                    <button
                       key={conv._id}
                       onClick={() => navigate(`/chat/${conv._id}`)}
                       className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                       }`}
                    >
                       <div className="relative shrink-0">
                          <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${isActive ? "border-primary-foreground/30" : "border-primary/10"}`}>
                             {other?.profileImage ? (
                                <img src={other.profileImage} alt="" className="w-full h-full object-cover" />
                             ) : (
                                <div className={`w-full h-full flex items-center justify-center font-black ${isActive ? "bg-white/10" : "bg-primary/5 text-primary"}`}>
                                   {other?.name?.[0]}
                                </div>
                             )}
                          </div>
                          {conv.unreadCount > 0 && (
                             <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-[10px] font-black flex items-center justify-center rounded-full text-white border-2 border-background">
                                {conv.unreadCount}
                             </div>
                          )}
                       </div>
                       <div className="flex-1 text-left min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                             <p className="font-bold text-sm truncate">{other?.name}</p>
                             <p className={`text-[10px] font-bold ${isActive ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                             </p>
                          </div>
                          <p className={`text-xs truncate ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                             {conv.lastMessage || "Started a new conversation"}
                          </p>
                       </div>
                    </button>
                 );
              })
           ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground opacity-50">
                 <MessageSquare size={48} className="mb-4" />
                 <p className="font-bold uppercase tracking-widest text-[10px]">No messages yet</p>
              </div>
           )}
        </Card>
      </aside>

      {/* MESSAGE AREA */}
      <main className={`flex-1 flex flex-col gap-6 ${!conversationId ? "hidden lg:flex" : "flex"}`}>
        {conversationId ? (
           <>
              <Card className="flex items-center justify-between p-4 px-6 rounded-[28px] shadow-sm">
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="lg:hidden rounded-xl">
                       <ChevronLeft size={20} />
                    </Button>
                    <div className="w-11 h-11 rounded-2xl overflow-hidden border border-primary/10">
                       {otherParticipant?.profileImage ? (
                          <img src={otherParticipant.profileImage} alt="" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black">
                             {otherParticipant?.name?.[0]}
                          </div>
                       )}
                    </div>
                    <div>
                       <p className="font-black text-foreground">{otherParticipant?.name}</p>
                       <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active now</p>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground"><Phone size={18} /></Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground"><Video size={18} /></Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground"><Info size={18} /></Button>
                 </div>
              </Card>

              <Card className="flex-1 overflow-y-auto p-8 space-y-6 rounded-[32px] shadow-sm scroll-smooth" ref={scrollRef}>
                 {messages.map((msg) => {
                    const isMe = msg.senderId === profile?._id;
                    return (
                       <div
                          key={msg._id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                       >
                          <div className={`max-w-[70%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                             <div className={`px-5 py-3 rounded-[24px] text-sm font-medium shadow-sm ${
                                isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none border border-border"
                             }`}>
                                {msg.text}
                             </div>
                             <div className={`flex items-center gap-2 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                <span className="text-[10px] font-bold text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMe && <CheckCheck size={12} className="text-primary" />}
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </Card>

              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                 <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"><Smile size={20} /></Button>
                       <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"><Paperclip size={20} /></Button>
                    </div>
                    <input
                       value={messageText}
                       onChange={(e) => setMessageText(e.target.value)}
                       placeholder="Type your message here..."
                       className="w-full h-14 bg-card border border-border rounded-[24px] pl-24 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground"
                    />
                 </div>
                 <Button type="submit" className="w-14 h-14 rounded-full shadow-lg shadow-primary/20">
                    <Send size={20} />
                 </Button>
              </form>
           </>
        ) : (
           <Card className="flex-1 flex flex-col items-center justify-center p-20 text-center rounded-[40px] border-dashed border-2 bg-muted/5">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                 <MessageSquare size={56} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-4">Your Inbox</h2>
              <p className="text-muted-foreground font-medium max-w-sm">
                 Select a conversation from the sidebar to start chatting with candidates and recruiters.
              </p>
           </Card>
        )}
      </main>
    </div>
  );
}
