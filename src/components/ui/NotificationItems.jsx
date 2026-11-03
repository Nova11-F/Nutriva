import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, BellRing, CheckCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useChild } from "../../hooks/useChild";

function formatTime(iso) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "Baru saja";
  }
}

function formatFullTime(iso) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "Baru saja";
  }
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

export default function NotificationItems({ className = "" }) {
  const { user } = useAuth();
  const { child } = useChild();

  // Susun notifikasi dinamis berdasarkan konteks user & anak aktif
  const dynamicNotifications = useMemo(() => {
    const list = [];
    const now = new Date();

    // 1. Notifikasi Akun Berhasil Dibuat
    if (user) {
      list.push({
        id: "notif-welcome",
        title: `Selamat datang, ${user.name || "Bunda/Ayah"}!`,
        message: "Akun Nutriva Anda telah aktif dan siap digunakan.",
        detail:
          "Terima kasih telah bergabung bersama Nutriva. Anda dapat memantau tumbuh kembang, merencanakan menu MPASI bergizi, dan berkonsultasi langsung dengan AI Nutriva.",
        time: user.created_at || now.toISOString(),
        read: false,
      });
    }

    // 2. Notifikasi Profil Anak
    if (child) {
      list.push({
        id: "notif-child-created",
        title: `Profil ${child.name} Aktif`,
        message: `Data awal BB (${child.initialWeight || child.initial_weight_kg || "-"} kg) & TB (${child.initialHeight || child.initial_height_cm || "-"} cm) tersimpan.`,
        detail: `Profil anak atas nama ${child.name} berhasil terdaftar. Grafik pemantauan pertumbuhan dan kurva standar WHO kini telah aktif untuk si kecil.`,
        time: child.created_at || now.toISOString(),
        read: false,
      });

      // 3. Notifikasi Pengingat Jadwal Makan Balita
      list.push({
        id: "notif-meal-reminder",
        title: `Waktunya Menu MPASI ${child.name}`,
        message: "Cek rekomendasi menu dan jadwal makan seimbang hari ini.",
        detail: `Kebutuhan gizi ${child.name} dapat dipantau setiap hari. Buka halaman Nutrisi untuk melihat ide menu atau mencatat porsi asupan makanan si kecil.`,
        time: new Date(now.getTime() - 3600000 * 2).toISOString(), // 2 jam lalu
        read: false,
      });
    }

    return list;
  }, [user, child]);

  const [readIds, setReadIds] = useState(() => new Set());
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const wrapperRef = useRef(null);

  const items = useMemo(() => {
    return dynamicNotifications.map((n) => ({
      ...n,
      read: readIds.has(n.id) || n.read,
    }));
  }, [dynamicNotifications, readIds]);

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
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    setReadIds(new Set(dynamicNotifications.map((n) => n.id)));
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
          aria-label="Panel notifikasi"
          className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-gray-200 bg-surface shadow-xl sm:w-96"
        >
          {selected ? (
            <div>
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Kembali ke daftar notifikasi"
                  className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-text"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <h2 className="text-sm font-semibold text-text">Detail</h2>
              </div>
              <div className="space-y-2 p-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-primary">
                  {formatFullTime(selected.time)}
                </span>
                <h3 className="text-base font-bold text-text">
                  {selected.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600">
                  {selected.detail}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-text">Notifikasi</h2>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-primary"
                  >
                    <CheckCheck className="size-3.5" />
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              {items.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  Tidak ada notifikasi saat ini
                </div>
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
