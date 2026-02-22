import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Load conversations
  useEffect(() => {
    api.get("/chat/my")
      .then(res => setConversations(res.data.conversations || []));
  }, []);

  // Load messages when conversation selected
  useEffect(() => {
    if (!conversationId) return;

    api.get(`/chat/${conversationId}/messages`)
      .then(res => setMessages(res.data.messages || []));
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post(`/chat/${conversationId}/messages`, { text });

    setMessages(prev => [...prev, { text }]);
    setText("");
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
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className="mb-2">
                  <span className="inline-block bg-slate-100 px-3 py-2 rounded">
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t p-3 flex gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
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