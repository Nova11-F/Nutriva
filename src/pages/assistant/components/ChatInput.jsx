import { useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({ value, onChange, onSend, disabled, suggestions }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const pickSuggestion = (q) => {
    onChange(q);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-200 bg-surface px-3 pb-3 pt-2 md:px-6">
      <div className="-mx-3 mb-2 flex gap-2 overflow-x-auto px-3 pb-1 md:mx-0 md:px-0">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => pickSuggestion(q)}
            className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:border-primary hover:bg-soft hover:text-primary lg:text-md"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          maxLength={500}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan seputar nutrisi dan tumbuh kembang anak..."
          aria-label="Tulis pertanyaan"
          className="min-h-12 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 md:text-md"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Kirim pesan"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizonal size={18} />
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-400">
        Informasi bersifat edukatif dan bukan pengganti tenaga kesehatan.
      </p>
    </div>
  );
}