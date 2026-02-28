import { useState } from "react";
import socket from "../../services/socket";

export default function MessageInput({ conversation, onSend }) {
  const [text, setText] = useState("");
  const myId = localStorage.getItem("userId");

  const send = () => {
    if (!text.trim()) return;

    const payload = {
      conversationId: conversation._id,
      senderId: myId,
      receiverId: conversation.otherUser._id,
      message: text,
    };

    socket.emit("send_message", payload);
    onSend(payload);
    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message…"
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        onKeyDown={e => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className="bg-indigo-600 text-white px-4 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}