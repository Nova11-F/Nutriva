import { useEffect, useRef, useState } from "react";
import { Eraser, Sparkles } from "lucide-react";
import Header from "../../../components/navigation/Header";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { useFetch } from "../../../hooks/useFetch";
import { useToast } from "../../../hooks/useToast";
import { assistantService } from "../../../services/assistantService";
import { suggestedQuestions } from "../../../data/chatMessages";

export default function AssistantChat({ child }) {
  const { showToast } = useToast();
  const { data: history, loading } = useFetch(() => assistantService.getHistory(child.id), [child.id]);

  const [extra, setExtra] = useState([]);    
  const [cleared, setCleared] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const messages = cleared ? extra : [...(history ?? []), ...extra];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sending]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const now = Date.now();
    setExtra((prev) => [...prev, { id: now, role: "user", text, createdAt: new Date(now).toISOString() }]);
    setDraft("");
    setSending(true);

    try {
      const reply = await assistantService.sendMessage(child.id, text);
      setExtra((prev) => [...prev, reply]);
    } catch (err) {
      showToast(err.message || "Pesan gagal dikirim", "error");
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Hapus seluruh percakapan?")) return;
    try {
      await assistantService.clearHistory(child.id);
      setCleared(true);
      setExtra([]);
      showToast("Percakapan dihapus", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <Header variant="ai" />

      <div className="mx-4 flex h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm md:mx-6 xl:h-[calc(100dvh-8rem)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-soft text-primary">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">AI Nutriva</p>
              <p className="text-[11px] text-gray-500">Menjawab untuk {child.name}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button size="sm" variant="ghost" onClick={handleClear} className="flex items-center gap-1">
              <Eraser size={14} /> <span className="hidden md:inline">Hapus chat</span>
            </Button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4" aria-live="polite">
          {loading && <Spinner center label="Memuat percakapan..." />}

          {!loading && messages.length === 0 && (
            <ChatBubble
              role="bot"
              text={`Halo! Saya asisten AI Nutriva. Silakan tanyakan seputar nutrisi dan tumbuh kembang ${child.name}. Pilih salah satu pertanyaan di bawah, atau tulis pertanyaan Anda sendiri.`}
            />
          )}

          {!loading && messages.map((m) => <ChatBubble key={m.id} {...m} />)}
          {sending && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <ChatInput value={draft} onChange={setDraft} onSend={handleSend}
                   disabled={sending} suggestions={suggestedQuestions} />
      </div>
    </>
  );
}