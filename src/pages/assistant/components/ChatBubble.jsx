import { Sparkles } from "lucide-react";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export default function ChatBubble({ role, text, createdAt }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-soft text-primary">
          <Sparkles size={16} />
        </div>
      )}
      <div className={`flex max-w-[85%] flex-col gap-1 md:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-primary text-surface"
              : "rounded-bl-sm border border-gray-200 bg-surface text-text"
          }`}
        >
          {text}
        </div>
        {createdAt && <span className="px-1 text-[10px] text-gray-400">{formatTime(createdAt)}</span>}
      </div>
    </div>
  );
}