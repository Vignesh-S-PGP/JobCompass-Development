export default function MessageBubble({ message }) {
  const myId = localStorage.getItem("userId");

  const isMine = message.senderId === myId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] text-sm
          ${isMine
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-900"}`}
      >
        {message.message}
      </div>
    </div>
  );
}