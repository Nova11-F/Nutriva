import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BellRing, CheckCheck } from "lucide-react";

const defaultNotifications = [
  {
    id: 1,
    title: "Pengingat makan siang",
    message: "Waktunya mencatat menu makan siang hari ini.",
    detail:
      "Catat menu makan siang agar asupan harian tetap terpantau. Pencatatan yang rutin membantu AI Nutriva memberi saran yang lebih akurat untuk kebutuhan gizi anak.",
    time: "2026-10-20T11:30:00",
    read: false,
  },
  {
    id: 2,
    title: "Data pertumbuhan diperbarui",
    message: "Tinggi dan berat badan terbaru sudah tersimpan.",
    detail:
      "Data pengukuran terbaru berhasil disimpan. Buka halaman Growth untuk melihat grafik pertumbuhan dan membandingkannya dengan standar usia.",
    time: "2026-10-20T08:15:00",
    read: false,
  },
  {
    id: 3,
    title: "Saran baru dari AI Nutriva",
    message: "Ada rekomendasi menu untuk minggu ini.",
    detail:
      "Berdasarkan catatan nutrisi 7 hari terakhir, tersedia rekomendasi menu untuk menambah asupan protein dan zat besi. Buka halaman AI Nutriva untuk melihat daftar lengkapnya.",
    time: "2026-10-19T19:00:00",
    read: true,
  },
];

function formatTime(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatFullTime(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

function NotificationItem({ item, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className={`mt-1.5 size-2 shrink-0 rounded-full ${
            item.read ? "bg-transparent" : "bg-danger"
          }`}
        />
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-sm text-text ${
              item.read ? "font-medium" : "font-bold"
            }`}
          >
            {item.title}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-xs text-gray-500">
            {item.message}
          </span>
          <span className="mt-1 block text-[11px] text-gray-400">
            {formatTime(item.time)}
          </span>
        </span>
      </button>
    </li>
  );
}

export default function NotificationItems({
  notifications = defaultNotifications,
  className = "",
}) {
  const [items, setItems] = useState(notifications);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const wrapperRef = useRef(null);

  const unreadCount = items.filter((n) => !n.read).length;
  const selected = items.find((n) => n.id === selectedId) || null;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSelectedId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (selectedId !== null) setSelectedId(null);
      else setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedId]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setSelectedId(null);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={
          unreadCount > 0
            ? `Notifikasi, ${unreadCount} belum dibaca`
            : "Notifikasi"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative rounded-md border cursor-pointer border-gray-300 px-2 py-1.5 transition-colors hover:bg-gray-50 md:rounded-lg md:px-3 md:py-2.5"
      >
        <BellRing className="size-5 text-gray-500 md:size-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifikasi"
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-gray-200 bg-surface shadow-lg"
        >
          {selected ? (
            <div>
              <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Kembali ke daftar notifikasi"
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <h2 className="text-sm font-bold text-text">
                  Detail notifikasi
                </h2>
              </div>

              <div className="max-h-80 overflow-y-auto px-4 py-4">
                <h3 className="text-base font-bold text-text">
                  {selected.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {formatFullTime(selected.time)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {selected.detail}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <h2 className="text-sm font-bold text-text">Notifikasi</h2>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-text"
                  >
                    <CheckCheck className="size-3.5" />
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  Belum ada notifikasi.
                </p>
              ) : (
                <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                  {items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      onSelect={handleSelect}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}