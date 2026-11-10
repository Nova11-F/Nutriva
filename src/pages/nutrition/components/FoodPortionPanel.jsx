import { useMemo, useState } from "react";
import { Calculator, Check, PenLine, Scale, Utensils, X } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  MEAL_SLOTS,
  PORTION_MULTIPLIERS,
  calculatePortionNutrition,
  normalizeServingOptions,
} from "../../../utils/nutritionUtils";

const EMPTY_MANUAL = {
  name: "",
  calories: "120",
  protein: "5",
  fat: "4",
  carbs: "16",
  iron: "1.0",
};

/**
 * Panel Input Porsi & Hasil Kalkulasi Gizi untuk Sub-Modul Log Food (PRD Bab 5.2B).
 * Gunakan prop `key` pada komponen ini saat selectedFood / manualMode berganti agar state ter-reset bersih.
 */
export default function FoodPortionPanel({
  selectedFood,
  manualMode,
  saving,
  onStartManual,
  onCancelSelection,
  onSaveLog,
}) {
  const servingOptions = useMemo(
    () => normalizeServingOptions(selectedFood),
    [selectedFood]
  );

  const initialIdx = useMemo(() => {
    const idx = servingOptions.findIndex((o) => o.grams !== 100);
    return idx >= 0 ? idx : 0;
  }, [servingOptions]);

  const [mealSlot, setMealSlot] = useState("Sarapan");
  const [selectedServingIdx, setSelectedServingIdx] = useState(initialIdx);
  const [multiplier, setMultiplier] = useState(1);
  const [customGrams, setCustomGrams] = useState(
    String(servingOptions[initialIdx]?.grams || 100)
  );
  const [useCustomGrams, setUseCustomGrams] = useState(Boolean(manualMode));
  const [manualForm, setManualForm] = useState(EMPTY_MANUAL);
  const [formError, setFormError] = useState("");

  const activeServing = servingOptions[selectedServingIdx] || servingOptions[0];

  const effectiveGrams = useMemo(() => {
    if (manualMode || useCustomGrams) {
      const parsed = parseFloat(customGrams);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return Number(((activeServing?.grams || 100) * multiplier).toFixed(1));
  }, [manualMode, useCustomGrams, customGrams, activeServing, multiplier]);

  const servingLabel = useMemo(() => {
    if (manualMode || useCustomGrams) {
      return `${effectiveGrams} gram`;
    }
    const multText = multiplier === 1 ? "" : `${multiplier}× `;
    return `${multText}${activeServing?.label || "100 gram"} (${effectiveGrams} g)`;
  }, [manualMode, useCustomGrams, activeServing, multiplier, effectiveGrams]);

  const nutritionPer100g = useMemo(() => {
    if (manualMode) {
      return {
        calories: Number(manualForm.calories) || 0,
        protein: Number(manualForm.protein) || 0,
        fat: Number(manualForm.fat) || 0,
        carbs: Number(manualForm.carbs) || 0,
        iron: Number(manualForm.iron) || 0,
      };
    }
    if (!selectedFood) return null;
    return {
      calories: Number(selectedFood.calories_per_100g) || 0,
      protein: Number(selectedFood.protein_per_100g) || 0,
      fat: Number(selectedFood.fat_per_100g) || 0,
      carbs: Number(selectedFood.carbs_per_100g) || 0,
      iron: Number(selectedFood.iron_mg_per_100g) || 0,
    };
  }, [manualMode, manualForm, selectedFood]);

  const previewNutrition = useMemo(() => {
    if (!nutritionPer100g) return null;
    return calculatePortionNutrition(
      nutritionPer100g,
      effectiveGrams,
      manualMode ? null : selectedFood?.extra_nutrients_per_100g
    );
  }, [nutritionPer100g, effectiveGrams, manualMode, selectedFood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (manualMode && !manualForm.name.trim()) {
      setFormError("Nama makanan wajib diisi.");
      return;
    }
    if (effectiveGrams <= 0 || effectiveGrams > 3000) {
      setFormError("Berat porsi harus antara 1 sampai 3000 gram.");
      return;
    }

    await onSaveLog({
      foodId: manualMode ? null : selectedFood?.id,
      foodName: manualMode ? manualForm.name.trim() : selectedFood?.name,
      foodSnapshot: manualMode ? null : selectedFood,
      customFoodName: manualMode ? manualForm.name.trim() : null,
      mealSlot,
      servingLabel,
      portionGrams: effectiveGrams,
      nutritionPer100g,
      extraPer100g: manualMode ? null : selectedFood?.extra_nutrients_per_100g,
    });
  };

  if (!selectedFood && !manualMode) {
    return (
      <Card variant="soft" className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-xs">
          <Utensils size={24} />
        </div>
        <h3 className="text-base font-bold text-text">Pilih Makanan di Sebelah Kiri</h3>
        <p className="max-w-xs text-xs leading-relaxed text-gray-600">
          Klik salah satu dari 1.071 bahan makanan TKPI/USDA untuk memilih takaran rumah tangga dan menghitung gizinya secara otomatis.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onStartManual}
          className="mt-1 flex items-center gap-1.5 text-sm"
        >
          <PenLine size={14} /> Atau Input Makanan Manual
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 border-primary/40">
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <span className="inline-block rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {manualMode ? "Input Makanan Manual" : selectedFood.category || "Bahan Pangan"}
          </span>
          <h3 className="mt-1 text-lg font-bold text-text">
            {manualMode ? "Catat Makanan Kustom" : selectedFood.name}
          </h3>
          {!manualMode && (
            <p className="text-xs text-gray-500">
              {selectedFood.preparation_type ? `${selectedFood.preparation_type} · ` : ""}
              {selectedFood.source || "Referensi Gizi Nutriva"}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCancelSelection}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          title="Batal pilih"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {manualMode && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3">
            <Input
              label="Nama Makanan / Menu"
              placeholder="Misal: Nasi goreng kampung buatan ibu"
              value={manualForm.name}
              onChange={(e) => setManualForm((p) => ({ ...p, name: e.target.value }))}
            />
            <p className="text-[11px] font-semibold text-gray-500">
              Estimasi Nilai Gizi per 100 gram:
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Input
                label="Kalori (kkal)"
                type="number"
                min="0"
                step="1"
                value={manualForm.calories}
                onChange={(e) => setManualForm((p) => ({ ...p, calories: e.target.value }))}
              />
              <Input
                label="Protein (g)"
                type="number"
                min="0"
                step="0.1"
                value={manualForm.protein}
                onChange={(e) => setManualForm((p) => ({ ...p, protein: e.target.value }))}
              />
              <Input
                label="Lemak (g)"
                type="number"
                min="0"
                step="0.1"
                value={manualForm.fat}
                onChange={(e) => setManualForm((p) => ({ ...p, fat: e.target.value }))}
              />
              <Input
                label="Karbohidrat (g)"
                type="number"
                min="0"
                step="0.1"
                value={manualForm.carbs}
                onChange={(e) => setManualForm((p) => ({ ...p, carbs: e.target.value }))}
              />
              <Input
                label="Zat Besi (mg)"
                type="number"
                min="0"
                step="0.1"
                value={manualForm.iron}
                onChange={(e) => setManualForm((p) => ({ ...p, iron: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Waktu Makan */}
        <div>
          <p className="mb-1.5 text-xs font-semibold text-gray-600">Waktu Makan</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MEAL_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setMealSlot(slot)}
                className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  mealSlot === slot
                    ? "border-primary bg-soft text-primary"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Ukuran Rumah Tangga (URT) & Gram */}
        {!manualMode && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600">Takaran Saji (URT)</p>
              <button
                type="button"
                onClick={() => {
                  if (!useCustomGrams && effectiveGrams > 0) {
                    setCustomGrams(String(effectiveGrams));
                  }
                  setUseCustomGrams((prev) => !prev);
                }}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                {useCustomGrams ? "Pakai Takaran URT" : "Ketik Gram Manual"}
              </button>
            </div>

            {!useCustomGrams ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap gap-2">
                  {servingOptions.map((opt, idx) => (
                    <button
                      key={`${opt.label}-${idx}`}
                      type="button"
                      onClick={() => setSelectedServingIdx(idx)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        selectedServingIdx === idx
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-primary"
                      }`}
                    >
                      {opt.label} ({opt.grams}g)
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Jumlah porsi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PORTION_MULTIPLIERS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMultiplier(m)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          multiplier === m
                            ? "border-primary bg-soft text-primary"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {m}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Input
                label="Berat Porsi (gram)"
                type="number"
                min="1"
                max="3000"
                step="1"
                value={customGrams}
                onChange={(e) => setCustomGrams(e.target.value)}
              />
            )}
          </div>
        )}

        {manualMode && (
          <Input
            label="Berat Porsi yang Dikonsumsi (gram)"
            type="number"
            min="1"
            max="3000"
            step="1"
            value={customGrams}
            onChange={(e) => setCustomGrams(e.target.value)}
          />
        )}

        {/* Nutrition Result Card */}
        {previewNutrition && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Calculator size={14} className="text-primary" /> Hasil Kalkulasi Nutrisi
              </span>
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Scale size={12} /> {effectiveGrams} g
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <div className="rounded-lg bg-white p-2 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500">Energi</p>
                <p className="text-sm font-bold text-primary">{previewNutrition.calories} kkal</p>
              </div>
              <div className="rounded-lg bg-white p-2 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500">Protein</p>
                <p className="text-sm font-bold text-text">{previewNutrition.protein_g} g</p>
              </div>
              <div className="rounded-lg bg-white p-2 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500">Lemak</p>
                <p className="text-sm font-bold text-text">{previewNutrition.fat_g} g</p>
              </div>
              <div className="rounded-lg bg-white p-2 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500">Karbo</p>
                <p className="text-sm font-bold text-text">{previewNutrition.carbs_g} g</p>
              </div>
              <div className="col-span-2 rounded-lg bg-white p-2 text-center shadow-2xs sm:col-span-1">
                <p className="text-[10px] text-gray-500">Zat Besi</p>
                <p className="text-sm font-bold text-amber-700">{previewNutrition.iron_mg} mg</p>
              </div>
            </div>

            {(previewNutrition.calcium_mg != null ||
              previewNutrition.zinc_mg != null ||
              previewNutrition.vit_c_mg != null ||
              previewNutrition.fiber_g != null) && (
              <p className="mt-2 text-[11px] text-emerald-800">
                Mikronutrien tambahan:
                {previewNutrition.calcium_mg != null ? ` Kalsium ${previewNutrition.calcium_mg} mg` : ""}
                {previewNutrition.zinc_mg != null ? ` · Zink ${previewNutrition.zinc_mg} mg` : ""}
                {previewNutrition.vit_c_mg != null ? ` · Vit C ${previewNutrition.vit_c_mg} mg` : ""}
                {previewNutrition.fiber_g != null ? ` · Serat ${previewNutrition.fiber_g} g` : ""}
              </p>
            )}
          </div>
        )}

        {formError && <p className="text-xs font-medium text-danger">{formError}</p>}

        <Button
          type="submit"
          loading={saving}
          className="flex w-full items-center justify-center gap-2 text-sm"
        >
          <Check size={16} /> Simpan ke Log Makanan Harian
        </Button>
      </form>
    </Card>
  );
}
