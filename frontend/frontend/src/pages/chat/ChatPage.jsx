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
  Search
} from "lucide-react";
import { roleBasePath } from "../../utils/rolePath";

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

  const [conversations,setConversations] = useState([]);
  const [messages,setMessages] = useState([]);
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c._id === conversationId);
  const activeUser = activeConversation?.participant;

  /* LOAD CONVERSATIONS */

  useEffect(()=>{

    socketService.connect();

    api.get("/chat/my")
      .then(res=>{
        setConversations(res.data.conversations || []);
      })
      .finally(()=>setLoading(false));

  },[]);

  /* LOAD MESSAGES */

  useEffect(()=>{

    if(!conversationId) return;

    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []));

    socketService.joinConversation(conversationId);

    const onMessage = (msg)=>{

      if(msg.conversationId !== conversationId) return;

      setMessages(prev =>
        prev.some(m=>m._id===msg._id)
          ? prev
          : [...prev,msg]
      );

    };

    socketService.onNewMessage(onMessage);

    return ()=>{

      socketService.leaveConversation(conversationId);
      socketService.offNewMessage(onMessage);

    };

  },[conversationId]);

  /* AUTOSCROLL */

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

  /* SEND MESSAGE */

  const sendMessage = async()=>{

    if(!text.trim()) return;

    const optimistic = {
      _id:`tmp-${Date.now()}`,
      senderId:user.sub,
      text,
      createdAt:new Date().toISOString(),
      readAt:null
    };

    setMessages(prev=>[...prev,optimistic]);
    setText("");

    await api.post(`/chat/${conversationId}/messages`,{text});

  };

  if(loading){
    return(
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40}/>
      </div>
    );
  }

  const filteredConversations = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return(

    <div className="h-[calc(100vh-120px)] flex bg-white border rounded-2xl overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-80 border-r flex flex-col">

        {/* HEADER */}

        <div className="p-5 border-b flex items-center gap-2 font-semibold text-slate-800">
          <MessageSquare size={18}/>
          Messages
        </div>

        {/* SEARCH */}

        <div className="p-4 border-b">

          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2">

            <Search size={16} className="text-slate-400"/>

            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search conversations"
              className="ml-2 bg-transparent outline-none text-sm w-full"
            />

          </div>

        </div>

        {/* CONVERSATION LIST */}

        <div className="flex-1 overflow-y-auto">

          {filteredConversations.map(c => (

            <div
              key={c._id}
              onClick={()=>navigate(`${roleBasePath[user.role]}/chat/${c._id}`)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
              ${conversationId===c._id
                ? "bg-indigo-50"
                : "hover:bg-slate-50"}`}
            >

              <img
                src={c.participant.profileImage || "/avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1 overflow-hidden">

                <p className="text-sm font-medium truncate">
                  {c.participant.name}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {c.lastMessage || "No messages yet"}
                </p>

              </div>

              {c.unreadCount>0 && (

                <span className="bg-indigo-600 text-white text-xs px-2 rounded-full">
                  {c.unreadCount}
                </span>

              )}

            </div>

          ))}

        </div>

      </div>


      {/* CHAT SECTION */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        {activeUser && (

          <div className="flex items-center gap-3 px-6 py-4 border-b">

            <img
              src={activeUser.profileImage || "/avatar.png"}
              className="w-10 h-10 rounded-full"
            />

            <div>

              <p className="font-medium">
                {activeUser.name}
              </p>

              <p className="text-xs text-slate-400">
                {activeUser.role}
              </p>

            </div>

          </div>

        )}


        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">

          {messages.map((m,i)=>{

            const mine = m.senderId===user.sub;

            return(

              <div
                key={i}
                className={`flex ${mine?"justify-end":"justify-start"}`}
              >

                <div className="max-w-[70%]">

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm
                    ${mine
                      ?"bg-indigo-600 text-white"
                      :"bg-white border"}`}
                  >

                    {m.text}

                  </div>

                  <div
                    className={`flex items-center gap-1 text-[10px] mt-1
                    ${mine
                      ?"justify-end text-slate-500"
                      :"text-slate-400"}`}
                  >

                    <span>{formatTime(m.createdAt)}</span>

                    {mine && (
                      m.readAt
                        ? <CheckCheck size={12}/>
                        : <Check size={12}/>
                    )}

                  </div>

                </div>

              </div>

            );

          })}

          <div ref={messagesEndRef}/>

        </div>


        {/* MESSAGE INPUT */}

        <div className="border-t p-4 flex gap-3">

          <input
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition"
          >

            <Send size={16}/>

          </button>

        </div>

      </div>

    </div>

  );

}