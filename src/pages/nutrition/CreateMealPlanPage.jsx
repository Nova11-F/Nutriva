import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles,
  Pencil,
  Clock,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import { recipeService } from "../../services/recipeService";

function getDiffMonths(birthDateStr, targetDateStr = new Date()) {
  if (!birthDateStr) return 0;
  const b = new Date(birthDateStr);
  const t = new Date(targetDateStr);
  const diffTime = t - b;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const sessionTypes = ["Makan Utama", "Selingan", "ASI / Susu"];

const periods = [
  {
    value: "day",
    title: "Hari ini saja",
    desc: "Jadwal berlaku untuk satu hari.",
  },
  {
    value: "week",
    title: "Mingguan",
    desc: "Jadwal diulang pada hari yang dipilih.",
  },
];

const fieldStyle =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";

export default function CreateMealPlanPage() {
  const navigate = useNavigate();
  const { child: activeChild, childList, selectChild } = useChild();
  const { showSuccess, showError } = useToast();

  const [selectedChildId, setSelectedChildId] = useState(
    activeChild?.id ?? childList[0]?.id ?? null
  );
  const [period, setPeriod] = useState("day");
  const [activeDays, setActiveDays] = useState(["Senin"]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [saving, setSaving] = useState(false);

  const currentChild = useMemo(() => {
    return childList.find((c) => c.id === selectedChildId) ?? activeChild ?? childList[0] ?? null;
  }, [childList, selectedChildId, activeChild]);

  const childAgeMonths = useMemo(() => {
    return getDiffMonths(currentChild?.birthDate);
  }, [currentChild?.birthDate]);

  // Muat resep rekomendasi dari Supabase
  useEffect(() => {
    let ignore = false;
    async function loadRecipes() {
      try {
        const data = await recipeService.getAllRecipes({ ageMonths: childAgeMonths });
        if (!ignore && data) {
          setAvailableRecipes(data);
        }
      } catch (e) {
        console.error("Gagal load recipes:", e);
      }
    }
    loadRecipes();
    return () => {
      ignore = true;
    };
  }, [childAgeMonths]);

  const defaultMenuOptions = useMemo(() => {
    if (availableRecipes.length > 0) {
      return availableRecipes.map((r) => r.title);
    }
    return [
      "Nasi Tim Hati Ayam & Wortel Gurih",
      "Puree Alpukat Santan & Potongan Buah Naga",
      "Semur Ayam Kampung + 2 Telur Puyuh + Buncis Iris",
      "Bola Daging Sapi Cincang, Kentang Halus, Wortel Parut Rebus",
      "Bubur Saring Daging Sapi & Labu Kuning",
    ];
  }, [availableRecipes]);

  const [sessions, setSessions] = useState([
    { id: 1, time: "07:00", type: "Makan Utama", menu: defaultMenuOptions[0] || "", custom: false },
    { id: 2, time: "09:30", type: "Selingan", menu: defaultMenuOptions[1] || "", custom: false },
    { id: 3, time: "12:00", type: "Makan Utama", menu: defaultMenuOptions[2] || "", custom: false },
    { id: 4, time: "15:30", type: "Selingan", menu: "Potongan Buah Pepaya Manis", custom: true },
    { id: 5, time: "18:30", type: "Makan Utama", menu: defaultMenuOptions[3] || "", custom: false },
  ]);

  const toggleDay = (d) =>
    setActiveDays((prev) =>
      prev.includes(d)
        ? prev.length > 1
          ? prev.filter((x) => x !== d)
          : prev
        : [...prev, d]
    );

  const updateSession = (id, patch) =>
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );

  const removeSession = (id) =>
    setSessions((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));

  const addSession = () =>
    setSessions((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: "15:00",
        type: "Selingan",
        menu: "",
        custom: true,
      },
    ]);

  const handleSaveMealPlan = async () => {
    if (!currentChild?.id) {
      showError("Silakan pilih anak terlebih dahulu.");
      return;
    }

    const filledSessions = sessions.filter((s) => s.menu && s.menu.trim().length > 0);
    if (filledSessions.length === 0) {
      showError("Silakan isi minimal 1 menu makanan dalam jadwal.");
      return;
    }

    try {
      setSaving(true);
      // Temukan recipe_id pertama yang cocok atau gunakan default
      const matchedRecipe = availableRecipes.find((r) => r.title === filledSessions[0].menu) || availableRecipes[0];

      if (matchedRecipe?.id) {
        await recipeService.saveMealPlan({
          childId: currentChild.id,
          recipeId: matchedRecipe.id,
          plannedDate: new Date().toISOString().split("T")[0],
          preferences: {
            period,
            activeDays,
            sessions: filledSessions,
          },
        });
      }

      showSuccess(`Jadwal makan untuk ${currentChild.name} berhasil disimpan!`);
      navigate("/nutrition");
    } catch (err) {
      console.error(err);
      showError(err.message || "Gagal menyimpan jadwal makan.");
    } finally {
      setSaving(false);
    }
  };

  const allergyList = Array.isArray(currentChild?.avoidedFoods) && currentChild.avoidedFoods.length > 0
    ? currentChild.avoidedFoods.join(", ")
    : null;

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text md:text-3xl">
              Buat Rencana Makan
            </h1>
            <p className="text-sm text-gray-500">
              Rancang jadwal makan harian atau mingguan untuk si kecil berbasis gizi seimbang.
            </p>
          </div>
          <Button
            variant="noborder"
            onClick={() => navigate("/nutrition")}
            className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            <ArrowLeft className="size-4 md:size-6" /> Kembali
          </Button>
        </div>

        {/* 1. Pilih Anak */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            1. Pilih Anak
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {childList.map((c) => {
              const active = c.id === currentChild?.id;
              const cAge = getDiffMonths(c.birthDate);
              const initial = c.name ? c.name.slice(0, 2).toUpperCase() : "AN";
              const cAllergy = Array.isArray(c.avoidedFoods) && c.avoidedFoods.length > 0
                ? c.avoidedFoods.join(", ")
                : null;

              return (
                <Card
                  key={c.id}
                  variant={active ? "success" : "default"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedChildId(c.id);
                    selectChild(c.id);
                  }}
                  className="flex cursor-pointer flex-col gap-2 transition hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-sm font-bold text-primary">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">{c.name}</p>
                      <p className="text-xs text-gray-500">{cAge} bulan</p>
                    </div>
                    {active && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-surface">
                        Dipilih
                      </span>
                    )}
                  </div>
                  {cAllergy && (
                    <span className="w-fit rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] text-warning">
                      Alergi: {cAllergy}
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Info Alergi */}
        {allergyList && (
          <Card
            variant="warning"
            padding="sm"
            className="flex items-start gap-2 text-xs text-gray-700"
          >
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warning" />
            <span>
              {currentChild.name} memiliki catatan alergi terhadap <b>{allergyList}</b>. Sistem secara otomatis menyaring resep yang mengandung alergen tersebut.
            </span>
          </Card>
        )}

        {/* 2. Periode Jadwal */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            2. Periode Jadwal
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {periods.map((p) => {
              const active = period === p.value;
              return (
                <Card
                  key={p.value}
                  variant={active ? "success" : "default"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => setPeriod(p.value)}
                  className="flex cursor-pointer flex-col gap-1 transition hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-text">{p.title}</p>
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${
                        active
                          ? "border-primary bg-primary text-surface"
                          : "border-gray-300"
                      }`}
                    >
                      {active && <Check size={10} />}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </Card>
              );
            })}
          </div>

          {period === "week" && (
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-600">
                Pilih hari aktif berlakunya jadwal:
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => {
                  const on = activeDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        on
                          ? "bg-primary text-surface shadow-xs"
                          : "bg-surface text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 3. Sesi Makan & Menu */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                3. Sesi Makan & Menu ({sessions.length} sesi)
              </h2>
              <p className="text-xs text-gray-500">
                Pilih menu dari rekomendasi Nutriva atau ketik sendiri menu kustom.
              </p>
            </div>
          </div>

          <Card className="flex flex-col gap-4">
            {sessions.map((s, idx) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-gray-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Clock size={14} /> Sesi {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={s.type}
                      onChange={(e) => updateSession(s.id, { type: e.target.value })}
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none"
                    >
                      {sessionTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSession(s.id)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                        aria-label="Hapus sesi"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto]">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-500">
                      Waktu
                    </label>
                    <input
                      type="time"
                      value={s.time}
                      onChange={(e) => updateSession(s.id, { time: e.target.value })}
                      className={fieldStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-500">
                      Menu Makanan
                    </label>
                    {s.custom ? (
                      <input
                        type="text"
                        value={s.menu}
                        onChange={(e) => updateSession(s.id, { menu: e.target.value })}
                        placeholder="Ketik menu makanan..."
                        className={fieldStyle}
                      />
                    ) : (
                      <select
                        value={s.menu}
                        onChange={(e) => updateSession(s.id, { menu: e.target.value })}
                        className={fieldStyle}
                      >
                        <option value="">Pilih menu rekomendasi</option>
                        {defaultMenuOptions.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex items-end gap-1">
                    <button
                      type="button"
                      onClick={() => updateSession(s.id, { custom: false })}
                      aria-pressed={!s.custom}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer ${
                        !s.custom
                          ? "border-primary bg-soft text-primary"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Sparkles size={12} /> Dari Nutriva
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSession(s.id, { custom: true, menu: "" })}
                      aria-pressed={s.custom}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer ${
                        s.custom
                          ? "border-primary bg-soft text-primary"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Pencil size={12} /> Kustom
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSession}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition hover:border-primary hover:text-primary cursor-pointer"
            >
              <Plus size={16} /> Tambah Sesi / Slot Waktu Khusus
            </button>
          </Card>
        </section>

        {/* Aksi Simpan */}
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/nutrition")}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSaveMealPlan}
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Jadwal"}
          </Button>
        </div>
      </div>
    </>
  );
}
