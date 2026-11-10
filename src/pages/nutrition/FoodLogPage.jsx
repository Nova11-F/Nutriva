import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  PenLine,
  Search,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import Header from "../../components/navigation/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import NoChildState from "../../components/ui/NoChildState";
import Spinner from "../../components/ui/Spinner";
import DailySummaryBar from "./components/DailySummaryBar";
import FoodPortionPanel from "./components/FoodPortionPanel";
import { useAuth } from "../../hooks/useAuth";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import { ageInMonthsAt } from "../../lib/whoGrowth";
import { recipeService } from "../../services/recipeService";
import { todayISO } from "../../utils/formatDate";
import {
  FOOD_CATEGORIES,
  SUGGESTED_FOOD_KEYWORDS,
  normalizeServingOptions,
} from "../../utils/nutritionUtils";

export default function FoodLogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { child: activeChild, childList, selectChild, loading: childLoading } = useChild();
  const { showSuccess, showError } = useToast();

  const currentChild = activeChild || childList[0] || null;
  const childName = currentChild?.name ?? "Si Kecil";
  const ageMonths = currentChild?.birthDate ? ageInMonthsAt(currentChild.birthDate) : 12;

  const today = todayISO();
  const [logDate, setLogDate] = useState(today);

  // Pencarian & daftar makanan
  const [activeTab, setActiveTab] = useState("search"); // search | favorites | recent
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(false);

  // Favorit & recent
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState(() => recipeService.getRecentFoods());

  // Pemilihan porsi / input manual
  const [selectedFood, setSelectedFood] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [savingLog, setSavingLog] = useState(false);

  // Log & summary harian
  const [foodLogs, setFoodLogs] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let ignore = false;
    async function loadFoods() {
      setLoadingFoods(true);
      const res = await recipeService.searchFood(debouncedTerm, {
        category: selectedCategory,
        curatedOnly: !debouncedTerm.trim() && selectedCategory === "semua",
        limit: 36,
      });
      if (!ignore) {
        setFoods(res);
        setLoadingFoods(false);
      }
    }
    loadFoods();
    return () => {
      ignore = true;
    };
  }, [debouncedTerm, selectedCategory]);

  useEffect(() => {
    let ignore = false;
    recipeService.getFavoriteFoods(user?.id).then((list) => {
      if (!ignore) setFavoriteFoods(list);
    });
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const refreshDailyData = useCallback(async () => {
    if (!currentChild?.id) return;
    setLoadingLogs(true);
    try {
      const [logs, summary] = await Promise.all([
        recipeService.getFoodLogs(currentChild.id, logDate),
        recipeService.getDailyNutritionSummary(currentChild.id, logDate),
      ]);
      setFoodLogs(logs);
      setDailySummary(summary);
    } finally {
      setLoadingLogs(false);
    }
  }, [currentChild?.id, logDate]);

  useEffect(() => {
    let ignore = false;
    if (!currentChild?.id) return undefined;

    Promise.all([
      recipeService.getFoodLogs(currentChild.id, logDate),
      recipeService.getDailyNutritionSummary(currentChild.id, logDate),
    ]).then(([logs, summary]) => {
      if (!ignore) {
        setFoodLogs(logs);
        setDailySummary(summary);
      }
    });

    return () => {
      ignore = true;
    };
  }, [currentChild?.id, logDate]);

  const favoriteIds = useMemo(
    () => new Set(favoriteFoods.map((f) => f.id)),
    [favoriteFoods]
  );

  const displayedFoods = useMemo(() => {
    if (activeTab === "favorites") return favoriteFoods;
    if (activeTab === "recent") return recentFoods;
    return foods;
  }, [activeTab, foods, favoriteFoods, recentFoods]);

  const handleToggleFavorite = async (food, e) => {
    e.stopPropagation();
    const updated = await recipeService.toggleFavoriteFood(user?.id, food);
    setFavoriteFoods(updated);
  };

  const handleSelectFood = (food) => {
    setManualMode(false);
    setSelectedFood(food);
  };

  const handleStartManual = () => {
    setSelectedFood(null);
    setManualMode(true);
  };

  const handleSaveLog = async (payload) => {
    if (!currentChild?.id) return;
    setSavingLog(true);
    try {
      await recipeService.logFoodPortion({
        ...payload,
        childId: currentChild.id,
        logDate,
      });
      setRecentFoods(recipeService.getRecentFoods());
      setSelectedFood(null);
      setManualMode(false);
      await refreshDailyData();
      showSuccess(`Berhasil mencatat "${payload.foodName}" untuk ${childName}`);
    } catch (err) {
      showError(err?.message || "Gagal menyimpan catatan makanan.");
    } finally {
      setSavingLog(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    await recipeService.deleteFoodLog(logId);
    await refreshDailyData();
    showSuccess("Catatan makanan dihapus.");
  };

  if (childLoading) {
    return <Spinner size="lg" center label="Memuat data anak..." />;
  }

  if (!currentChild) {
    return (
      <>
        <Header variant="nutrisi" />
        <NoChildState feature="pencatatan gizi harian" />
      </>
    );
  }

  const dateLabel = logDate === today ? "Hari Ini" : logDate;

  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-5 px-4 pb-8 md:px-6">
        {/* Navigasi Kembali & Pemilih Anak / Tanggal */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/nutrition")}
              className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary cursor-pointer"
            >
              <ArrowLeft size={14} /> Kembali ke Nutrisi
            </button>
            <h1 className="text-2xl font-bold text-text md:text-3xl">
              Catat Asupan Makanan (Log Food)
            </h1>
            <p className="text-xs text-gray-500 md:text-sm">
              Cari 1.071 bahan makanan TKPI & USDA, pilih takaran rumah tangga, dan pantau asupan gizi harian {childName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {childList.length > 1 && (
              <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
                {childList.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectChild(c.id)}
                    className={`rounded-md px-3 py-1 cursor-pointer transition ${
                      c.id === currentChild.id
                        ? "bg-surface text-text shadow-2xs font-semibold"
                        : "text-gray-500 hover:text-text"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            <input
              type="date"
              value={logDate}
              max={today}
              onChange={(e) => setLogDate(e.target.value || today)}
              className="rounded-lg border border-gray-200 bg-surface px-3 py-1.5 text-xs font-semibold text-text outline-none focus:border-primary"
              aria-label="Tanggal log makanan"
            />
          </div>
        </div>

        {/* Ringkasan Nutrisi Harian */}
        <DailySummaryBar
          childName={childName}
          ageMonths={ageMonths}
          summary={dailySummary}
          dateLabel={dateLabel}
        />

        {/* Area Utama: Pencarian (Kiri) & Input Porsi (Kanan) */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          {/* Kolom Kiri: Search & Quick Access */}
          <Card className="flex flex-col gap-4 lg:col-span-7">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5 rounded-lg bg-gray-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("search")}
                    className={`rounded-md px-3 py-1.5 cursor-pointer transition ${
                      activeTab === "search" ? "bg-surface text-primary shadow-2xs" : "text-gray-600"
                    }`}
                  >
                    Semua Bahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("favorites")}
                    className={`rounded-md px-3 py-1.5 cursor-pointer transition ${
                      activeTab === "favorites" ? "bg-surface text-primary shadow-2xs" : "text-gray-600"
                    }`}
                  >
                    Favorit ({favoriteFoods.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("recent")}
                    className={`rounded-md px-3 py-1.5 cursor-pointer transition ${
                      activeTab === "recent" ? "bg-surface text-primary shadow-2xs" : "text-gray-600"
                    }`}
                  >
                    Terbaru ({recentFoods.length})
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleStartManual}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <PenLine size={13} /> Input Manual
                </Button>
              </div>

              {activeTab === "search" && (
                <>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari bahan makanan (mis. telur ayam, ikan kembung, bayam)..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {FOOD_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          selectedCategory === cat.value
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Daftar Makanan */}
            {loadingFoods && activeTab === "search" ? (
              <div className="py-10">
                <Spinner size="md" center label="Mencari bahan makanan..." />
              </div>
            ) : displayedFoods.length === 0 ? (
              <div className="py-4">
                <EmptyState
                  icon={UtensilsCrossed}
                  title={
                    activeTab === "favorites"
                      ? "Belum ada makanan favorit"
                      : activeTab === "recent"
                      ? "Belum ada makanan baru dicatat"
                      : `Tidak ditemukan "${searchTerm}"`
                  }
                  description={
                    activeTab === "search"
                      ? "Coba kata kunci lebih umum atau catat nilai gizi makanannya secara manual."
                      : "Cari bahan makanan di tab Semua Bahan, lalu simpan atau tandai bintang favorit."
                  }
                  actionLabel="Input Makanan Manual"
                  onAction={handleStartManual}
                />
                {activeTab === "search" && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    <span className="text-xs text-gray-500">Coba cari:</span>
                    {SUGGESTED_FOOD_KEYWORDS.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => {
                          setSelectedCategory("semua");
                          setSearchTerm(kw);
                        }}
                        className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-primary hover:border-primary cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
                {displayedFoods.map((food) => {
                  const isSelected = selectedFood?.id === food.id && !manualMode;
                  const isFav = favoriteIds.has(food.id);
                  const servings = normalizeServingOptions(food);
                  const urtCount = servings.filter((s) => s.grams !== 100).length;

                  return (
                    <div
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectFood(food);
                        }
                      }}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition cursor-pointer ${
                        isSelected
                          ? "border-primary bg-soft/50"
                          : "border-gray-200 bg-white hover:border-secondary"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="truncate text-sm font-bold text-text">{food.name}</p>
                          {food.category && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold capitalize text-gray-600">
                              {food.category}
                            </span>
                          )}
                          {urtCount > 0 && (
                            <span className="rounded bg-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                              {urtCount} Takaran URT
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Per 100g:{" "}
                          <strong className="text-text">{food.calories_per_100g} kkal</strong> ·
                          Protein {food.protein_per_100g}g · Lemak {food.fat_per_100g}g · Besi{" "}
                          {food.iron_mg_per_100g ?? 0}mg
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(food, e)}
                          className={`rounded-lg p-1.5 transition cursor-pointer ${
                            isFav
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-gray-300 hover:bg-gray-100 hover:text-amber-500"
                          }`}
                          title={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
                          aria-label="Favorit makanan"
                        >
                          <Star size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isSelected ? "Dipilih" : "Pilih"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Kolom Kanan: Panel Input Porsi & Hasil Gizi */}
          <div className="lg:col-span-5">
            <FoodPortionPanel
              key={manualMode ? "manual" : selectedFood?.id || "empty"}
              selectedFood={selectedFood}
              manualMode={manualMode}
              saving={savingLog}
              onStartManual={handleStartManual}
              onCancelSelection={() => {
                setSelectedFood(null);
                setManualMode(false);
              }}
              onSaveLog={handleSaveLog}
            />
          </div>
        </div>

        {/* Riwayat Log Makanan Tanggal Terpilih */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                Catatan Asupan {childName} ({dateLabel})
              </h2>
              <p className="text-xs text-gray-500">
                Daftar makanan yang sudah masuk dalam kalkulasi gizi harian anak.
              </p>
            </div>
          </div>

          {loadingLogs ? (
            <Spinner size="sm" center label="Memuat riwayat log..." />
          ) : foodLogs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center text-sm text-gray-500">
              Belum ada makanan yang dicatat untuk tanggal {dateLabel}. Pilih bahan di atas untuk mulai mencatat!
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {foodLogs.map((item) => {
                const n = item.calculated_nutrition || {};
                return (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="rounded bg-soft px-2 py-0.5 font-semibold text-primary">
                          {item.mealSlot}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={11} /> {item.serving_label} ({item.portion_grams}g)
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-text">
                        {item.displayName}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        <strong className="text-primary">{n.calories} kkal</strong> · Protein{" "}
                        {n.protein_g}g · Lemak {n.fat_g}g · Karbo {n.carbs_g}g · Fe {n.iron_mg}mg
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(item.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger cursor-pointer"
                      title="Hapus catatan"
                      aria-label="Hapus catatan makanan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
