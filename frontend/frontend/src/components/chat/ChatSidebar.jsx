import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ChatSidebar({ onSelect, activeConversation }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    api.get("/chat/conversations").then(res => {
      setConversations(res.data.conversations || []);
    });
  }, []);

  return (
    <div className="w-72 border-r bg-slate-50">
      <div className="p-4 font-bold border-b">Messages</div>

      <div className="overflow-y-auto">
        {conversations.map(c => (
          <button
            key={c._id}
            onClick={() => onSelect(c)}
            className={`w-full text-left px-4 py-3 hover:bg-indigo-50
              ${activeConversation?._id === c._id ? "bg-indigo-100" : ""}`}
          >
            <p className="font-semibold text-sm">
              {c.otherUser?.fullName || "Conversation"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {c.lastMessage || "No messages yet"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}