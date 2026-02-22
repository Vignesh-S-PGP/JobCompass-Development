import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversation) return;

    api.get(`/chat/messages/${conversation._id}`)
      .then(res => setMessages(res.data.messages || []));
  }, [conversation]);

  useEffect(() => {
    socket.on("receive_message", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, []);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b font-semibold">
        {conversation.otherUser?.fullName}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <MessageBubble key={m._id || Math.random()} message={m} />
        ))}
      </div>

      <MessageInput
        conversation={conversation}
        onSend={msg => setMessages(prev => [...prev, msg])}
      />
    </div>
  );
}