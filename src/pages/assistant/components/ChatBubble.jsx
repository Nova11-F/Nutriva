import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, Sparkles } from "lucide-react";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export default function ChatBubble({
  role,
  text,
  createdAt,
  steps = [],
  sources = [],
  links = [],
  requiresMedicalReferral = false,
  failed = false,
}) {
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
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:text-lg ${
            isUser
              ? `rounded-br-sm bg-primary text-surface ${failed ? "opacity-60" : ""}`
              : "rounded-bl-sm border border-gray-200 bg-surface text-text"
          }`}
        >
          {text}

          {!isUser && steps.length > 0 && (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}

          {!isUser && requiresMedicalReferral && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              Disarankan berkonsultasi langsung dengan tenaga kesehatan (Posyandu, Puskesmas, atau dokter anak).
            </p>
          )}

          {!isUser && sources.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500">
              <p className="mb-1 flex items-center gap-1 font-medium">
                <BookOpen size={12} /> Sumber
              </p>
              <ul className="space-y-0.5">
                {sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isUser && links.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {links.map((l, i) => (
                <Link
                  key={i}
                  to={l.targetRoute}
                  className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {failed && <span className="px-1 text-[10px] text-red-500">Gagal terkirim</span>}
        {!failed && createdAt && <span className="px-1 text-[10px] text-gray-400">{formatTime(createdAt)}</span>}
      </div>
    </div>
  );
}
