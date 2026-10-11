import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from "lucide-react";

const styles = {
  success: { box: "border-green-200 bg-green-50 text-primary", icon: CheckCircle2 },
  error:   { box: "border-red-200 bg-red-50 text-danger",       icon: XCircle },
  warning: { box: "border-yellow-200 bg-yellow-50 text-warning", icon: AlertTriangle },
  info:    { box: "border-blue-200 bg-blue-50 text-blue-800",    icon: Info },
  loading: { box: "border-gray-200 bg-surface text-text",      icon: Loader2 },
};

export default function Toast({ message, type = "info", onClose }) {
  const { box, icon: Icon } = styles[type] ?? styles.info;

  return (
    <div
      role="status"
      className={`animate-toast-in flex w-full items-start gap-3 rounded-lg border p-3 text-sm shadow-lg ${box}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${type === "loading" ? "animate-spin" : ""}`} />
      <p className="flex-1">{message}</p>

      {type !== "loading" && (
        <button onClick={onClose} aria-label="Tutup notifikasi" className="opacity-60 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex w-full max-w-sm flex-col gap-2 px-4 md:left-auto md:right-4 md:mx-0">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} type={t.type} onClose={() => onClose(t.id)} />
        </div>
      ))}
    </div>
  );
}