import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label="Asisten sedang mengetik">
      <div className="flex size-8 items-center justify-center rounded-full bg-soft text-primary">
        <Sparkles size={16} />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-gray-200 bg-surface px-4 py-3">
        {[0, 150, 300].map((d) => (
          <span key={d} className="size-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}