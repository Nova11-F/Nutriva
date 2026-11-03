import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus, ShieldCheck, Trash2, TriangleAlert, ChevronRight, Users } from "lucide-react";
import Header from "../../../components/navigation/Header";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import { useChild } from "../../../hooks/useChild";
import { useToast } from "../../../hooks/useToast";
import { growthService } from "../../../services/growthService";

const chartTabs = [
  { key: "weight", title: "Berat Badan", unit: "kg", color: "#15803d" },
  { key: "height", title: "Panjang / Tinggi", unit: "cm", color: "#0ea5e9" },
  { key: "head", title: "Lingkar Kepala", unit: "cm", color: "#f59e0b" },
];

const tones = {
  ok: "bg-green-50 border-green-200 text-green-700",
  warn: "bg-yellow-50 border-yellow-300 text-warning",
  bad: "bg-red-50 border-red-200 text-danger",
};

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatMonthLabel = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    month: "short",
  });
};

function getDiffMonths(birthDateStr, targetDateStr = new Date()) {
  if (!birthDateStr) return 0;
  const b = new Date(birthDateStr);
  const t = new Date(targetDateStr);
  const diffTime = t - b;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
}

export default function GrowthContent() {
  const navigate = useNavigate();
  const { child: activeChild, childList, selectChild } = useChild();
  const { showSuccess, showError } = useToast();

  const [selectedChildId, setSelectedChildId] = useState(activeChild?.id ?? childList[0]?.id ?? null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [tab, setTab] = useState("weight");

  const currentChild = useMemo(() => {
    return childList.find((c) => c.id === selectedChildId) ?? activeChild ?? childList[0] ?? null;
  }, [childList, selectedChildId, activeChild]);

  // Muat data pengukuran dari Supabase
  const loadRecords = useCallback(async () => {
    if (!currentChild?.id) {
      setRecords([]);
      setLoadingRecords(false);
      return;
    }

    try {
      setLoadingRecords(true);
      const data = await growthService.getByChild(currentChild.id);
      setRecords(data);
    } catch (err) {
      console.error("Gagal memuat rekam pertumbuhan:", err);
      showError("Gagal memuat data pertumbuhan.");
    } finally {
      setLoadingRecords(false);
    }
  }, [currentChild?.id, showError]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Siapkan data untuk grafik
  const chartData = useMemo(() => {
    return records.map((r) => ({
      id: r.id,
      date: r.date,
      label: formatMonthLabel(r.date),
      weight: r.weight,
      height: r.height,
      head: r.headCircumference ?? 0,
      note: r.insightMessage || "",
    }));
  }, [records]);

  // Data pengukuran terakhir dan delta
  const latestMetric = useMemo(() => {
    if (records.length === 0) {
      const initW =
        currentChild?.initialWeight ??
        currentChild?.initial_weight_kg ??
        currentChild?.birthWeight;
      const initH =
        currentChild?.initialHeight ??
        currentChild?.initial_height_cm ??
        currentChild?.birthLength;
      return {
        date: "Belum ada pengukuran",
        weight: initW ? `${initW}` : "-",
        height: initH ? `${initH}` : "-",
        head: "-",
        deltaWeight: "Data awal saat registrasi",
        deltaHeight: "Data awal saat registrasi",
        deltaHead: "-",
      };
    }

    const latest = records[records.length - 1];
    const prev = records.length > 1 ? records[records.length - 2] : null;

    let deltaWeight = "Pengukuran pertama";
    let deltaHeight = "Pengukuran pertama";
    let deltaHead = "-";

    if (prev) {
      const dw = (latest.weight - prev.weight).toFixed(1);
      deltaWeight = `${dw >= 0 ? "+" : ""}${dw} kg dari pengukuran sebelumnya`;

      const dh = (latest.height - prev.height).toFixed(1);
      deltaHeight = `${dh >= 0 ? "+" : ""}${dh} cm dari pengukuran sebelumnya`;

      if (latest.headCircumference && prev.headCircumference) {
        const dhead = (latest.headCircumference - prev.headCircumference).toFixed(1);
        deltaHead = `${dhead >= 0 ? "+" : ""}${dhead} cm dari pengukuran sebelumnya`;
      }
    }

    return {
      date: formatDate(latest.date),
      weight: latest.weight.toFixed(1),
      height: latest.height.toFixed(1),
      head: latest.headCircumference ? latest.headCircumference.toFixed(1) : "-",
      deltaWeight,
      deltaHeight,
      deltaHead,
      zScoreWaz: latest.zScoreWaz,
      zScoreHaz: latest.zScoreHaz,
      zScoreWhz: latest.zScoreWhz,
      needsAttention: latest.needsAttention,
      insightMessage: latest.insightMessage,
    };
  }, [records, currentChild]);

  // Deteksi stunting dinamis
  const detections = useMemo(() => {
    const haz = Number(latestMetric.zScoreHaz ?? 0);
    const waz = Number(latestMetric.zScoreWaz ?? 0);
    const whz = Number(latestMetric.zScoreWhz ?? 0);

    // TB/U
    let tbStatus = "Normal";
    let tbTone = "ok";
    if (haz < -3) {
      tbStatus = "Sangat Pendek (Severely Stunted)";
      tbTone = "bad";
    } else if (haz < -2) {
      tbStatus = "Pendek (Stunted)";
      tbTone = "warn";
    } else if (haz > 3) {
      tbStatus = "Tinggi";
      tbTone = "ok";
    }

    // BB/U
    let bbStatus = "Berat badan normal";
    let bbTone = "ok";
    if (waz < -3) {
      bbStatus = "Sangat Kurang (Severely Underweight)";
      bbTone = "bad";
    } else if (waz < -2) {
      bbStatus = "Berat Badan Kurang";
      bbTone = "warn";
    } else if (waz > 2) {
      bbStatus = "Risiko Berat Lebih";
      bbTone = "warn";
    }

    // BB/TB
    let giziStatus = "Gizi Baik (Normal)";
    let giziTone = "ok";
    if (whz < -3) {
      giziStatus = "Gizi Buruk (Severely Wasted)";
      giziTone = "bad";
    } else if (whz < -2) {
      giziStatus = "Gizi Kurang (Wasted)";
      giziTone = "warn";
    } else if (whz > 2) {
      giziStatus = "Gizi Lebih / Obesitas";
      giziTone = "warn";
    }

    return [
      {
        label: "Tinggi menurut Umur (TB/U)",
        status: tbStatus,
        tone: tbTone,
        zscore: `${haz >= 0 ? "+" : ""}${haz} SD`,
      },
      {
        label: "Berat menurut Umur (BB/U)",
        status: bbStatus,
        tone: bbTone,
        zscore: `${waz >= 0 ? "+" : ""}${waz} SD`,
      },
      {
        label: "Berat menurut Tinggi (BB/TB)",
        status: giziStatus,
        tone: giziTone,
        zscore: `${whz >= 0 ? "+" : ""}${whz} SD`,
      },
    ];
  }, [latestMetric]);

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data pengukuran ini?")) {
      return;
    }
    try {
      await growthService.remove(recordId);
      showSuccess("Data pengukuran berhasil dihapus.");
      loadRecords();
    } catch (err) {
      showError(err.message || "Gagal menghapus data.");
    }
  };

  const activeTab = chartTabs.find((t) => t.key === tab);
  const history = useMemo(() => [...records].reverse(), [records]);

  return (
    <>
      <Header variant="pertumbuhan" />
      <div className="flex flex-col gap-5 px-4 pb-6 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text md:text-3xl">
              Pemantauan Pertumbuhan
            </h2>
            <p className="text-sm text-gray-500">
              Pantau berat, tinggi, dan status gizi anak dari waktu ke waktu secara akurat sesuai standar WHO.
            </p>
          </div>
          <Button
            onClick={() =>
              navigate("/growth/measurement", { state: { from: "/growth" } })
            }
            className="flex w-full items-center justify-center gap-2 md:w-fit"
          >
            <Plus className="size-4 md:size-6" strokeWidth={3} /> Catat Pengukuran
          </Button>
        </div>

        {/* Pemilihan Balita */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Pilih Balita{" "}
              <span className="ml-1 rounded bg-gray-100 px-1.5">
                {childList.length} Anak
              </span>
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {childList.map((p) => {
              const active = p.id === currentChild?.id;
              const ageMonths = getDiffMonths(p.birthDate);
              const initial = p.name ? p.name.slice(0, 2).toUpperCase() : "AN";
              const weightVal = p.initialWeight ?? p.initial_weight_kg ?? p.birthWeight;

              return (
                <Card
                  key={p.id}
                  variant={active ? "success" : "default"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedChildId(p.id);
                    selectChild(p.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedChildId(p.id);
                      selectChild(p.id);
                    }
                  }}
                  className="flex cursor-pointer justify-center flex-col gap-3 transition hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-sm font-bold text-primary">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ageMonths} Bln · {weightVal ? `${weightVal} kg` : "-"}
                      </p>
                    </div>
                    {active && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-surface">
                        Aktif
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}

            <Card variant="soft" className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text">
                <Users size={16} className="text-primary" /> Punya Balita Lain?
              </div>
              <p className="text-xs text-gray-600">
                Daftarkan anak lainnya untuk pemantauan pertumbuhan yang terpisah.
              </p>
              <button
                onClick={() =>
                  navigate("/onboarding", { state: { from: "/growth" } })
                }
                className="mt-auto flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Daftarkan Profil Anak Baru <ChevronRight size={12} />
              </button>
            </Card>
          </div>
        </section>

        {loadingRecords ? (
          <Spinner size="lg" center label="Memuat riwayat pertumbuhan..." />
        ) : (
          <>
            {/* Antropometri Terakhir */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text">Antropometri Terakhir</h3>
                <span className="text-xs text-gray-500">
                  {latestMetric.date !== "Belum ada pengukuran" ? `Diukur ${latestMetric.date}` : latestMetric.date}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Card variant="silver" className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Berat Badan
                  </p>
                  <p className="text-3xl font-bold text-text">
                    {latestMetric.weight}{" "}
                    <span className="text-sm font-medium text-gray-500">kg</span>
                  </p>
                  <p className="text-xs text-gray-500">{latestMetric.deltaWeight}</p>
                </Card>

                <Card variant="silver" className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Panjang / Tinggi Badan
                  </p>
                  <p className="text-3xl font-bold text-text">
                    {latestMetric.height}{" "}
                    <span className="text-sm font-medium text-gray-500">cm</span>
                  </p>
                  <p className="text-xs text-gray-500">{latestMetric.deltaHeight}</p>
                </Card>

                <Card variant="silver" className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Lingkar Kepala
                  </p>
                  <p className="text-3xl font-bold text-text">
                    {latestMetric.head}{" "}
                    <span className="text-sm font-medium text-gray-500">cm</span>
                  </p>
                  <p className="text-xs text-gray-500">{latestMetric.deltaHead}</p>
                </Card>
              </div>
            </section>

            {/* Grafik Pertumbuhan Recharts */}
            <Card className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text">
                    Grafik Riwayat Pengukuran
                  </h3>
                  <p className="text-xs text-gray-500">
                    Perubahan {activeTab?.title.toLowerCase()} si kecil.
                  </p>
                </div>
                <div className="flex w-fit gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
                  {chartTabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      aria-pressed={tab === t.key}
                      className={`rounded-md px-3 py-1.5 transition cursor-pointer ${
                        tab === t.key
                          ? "bg-surface text-text shadow-sm"
                          : "text-gray-500 hover:text-text"
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 text-center">
                  <p className="text-sm text-gray-500">Belum ada riwayat pengukuran yang dicatat.</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/growth/measurement", { state: { from: "/growth" } })}
                  >
                    Tambah Pengukuran Pertama
                  </Button>
                </div>
              ) : (
                <div className="h-64 w-full md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 12 }}
                        unit={` ${activeTab?.unit}`}
                        width={64}
                      />
                      <Tooltip
                        formatter={(v) => [`${v} ${activeTab?.unit}`, activeTab?.title]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={tab}
                        name={activeTab?.title}
                        stroke={activeTab?.color}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Deteksi Stunting Standar WHO */}
            <Card className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-text">Deteksi Status Gizi & Stunting</h3>
                  <p className="text-xs text-gray-500">
                    Berdasarkan antropometri terkini dan standar pertumbuhan balita WHO.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {detections.map((d) => (
                  <div
                    key={d.label}
                    className={`flex flex-col gap-1 rounded-xl border p-4 ${tones[d.tone]}`}
                  >
                    <p className="text-[11px] font-semibold uppercase opacity-80">
                      {d.label}
                    </p>
                    <p className="text-lg font-bold">{d.status}</p>
                    <p className="text-xs opacity-80">Z-score: {d.zscore}</p>
                  </div>
                ))}
              </div>

              <Card
                variant="success"
                padding="sm"
                className="flex items-start gap-2 text-xs text-gray-600"
              >
                <TriangleAlert size={16} className="mt-0.5 shrink-0 text-primary" />
                Hasil ini bersifat edukatif berbasis panduan WHO. Jika status berada di bawah garis normal atau pertumbuhan melambat, segera konsultasikan ke posyandu, puskesmas, atau dokter anak.
              </Card>
            </Card>

            {/* Tabel Riwayat Pengukuran */}
            <Card className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text">Riwayat Pengukuran</h3>

              {history.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada riwayat pengukuran.</p>
              ) : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                          <th className="py-2 pr-4 text-center font-semibold">Tanggal</th>
                          <th className="py-2 pr-4 text-center font-semibold">Berat (kg)</th>
                          <th className="py-2 pr-4 text-center font-semibold">PB/TB (cm)</th>
                          <th className="py-2 pr-4 text-center font-semibold">Lingkar Kepala</th>
                          <th className="py-2 pr-4 font-semibold">Status / Catatan</th>
                          <th className="py-2 pr-4 text-center font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="py-3 pr-4 text-center font-medium text-text">
                              {formatDate(r.date)}
                            </td>
                            <td className="py-3 pr-4 text-center">{r.weight} kg</td>
                            <td className="py-3 pr-4 text-center">{r.height} cm</td>
                            <td className="py-3 pr-4 text-center">
                              {r.headCircumference ? `${r.headCircumference} cm` : "-"}
                            </td>
                            <td className="py-3 pr-4 text-gray-500 text-xs">
                              {r.insightMessage || "Pemeriksaan berkala"}
                            </td>
                            <td className="py-3">
                              <div className="flex justify-center gap-2">
                                <Button
                                  aria-label="Hapus"
                                  className="text-gray-400 hover:text-red-500"
                                  variant="noborder"
                                  onClick={() => handleDeleteRecord(r.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="flex flex-col gap-3 md:hidden">
                    {history.map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-text">
                            {formatDate(r.date)}
                          </p>
                          <Button
                            aria-label="Hapus"
                            className="text-gray-400 hover:text-red-500"
                            variant="noborder"
                            onClick={() => handleDeleteRecord(r.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-lg bg-gray-50 p-2">
                            <p className="text-gray-500">Berat</p>
                            <p className="font-bold text-text">{r.weight} kg</p>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2">
                            <p className="text-gray-500">PB/TB</p>
                            <p className="font-bold text-text">{r.height} cm</p>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2">
                            <p className="text-gray-500">L. Kepala</p>
                            <p className="font-bold text-text">
                              {r.headCircumference ? `${r.headCircumference} cm` : "-"}
                            </p>
                          </div>
                        </div>
                        {r.insightMessage && (
                          <p className="text-xs text-gray-500">{r.insightMessage}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}
