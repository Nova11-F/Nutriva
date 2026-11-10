import { Flame, Beef, Droplets, Wheat, Sparkles } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getDailyAkgTarget } from "../../../utils/nutritionUtils";

function ProgressMetric({ label, value, target, unit, barClass, icon: Icon }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
          {Icon && <Icon size={14} className="text-primary" />}
          {label}
        </span>
        <span className="font-bold text-text">
          {value} <span className="font-normal text-gray-500">/ {target} {unit}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500">{pct}% dari estimasi AKG harian</p>
    </div>
  );
}

/**
 * Ringkasan asupan nutrisi harian anak dibanding target estimasi AKG Kemenkes RI (Permenkes 28/2019).
 */
export default function DailySummaryBar({
  childName = "Si Kecil",
  ageMonths = 12,
  summary,
  dateLabel = "Hari Ini",
  actionLabel,
  onAction,
}) {
  const target = getDailyAkgTarget(ageMonths);
  const calories = summary?.total_calories_kcal ?? 0;
  const protein = summary?.total_protein_g ?? 0;
  const iron = summary?.total_iron_mg ?? 0;
  const carbs = summary?.total_carbs_g ?? 0;
  const fat = summary?.total_fat_g ?? 0;
  const totalItems = summary?.total_logged_items ?? 0;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-text md:text-lg">
              Ringkasan Asupan Gizi {childName} ({dateLabel})
            </h2>
            <span className="rounded-full bg-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
              {totalItems} Makanan Tercatat
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            Acuan estimasi AKG Kemenkes RI untuk usia {target.ageGroup}. {target.note}
          </p>
        </div>
        {actionLabel && onAction && (
          <Button
            size="sm"
            onClick={onAction}
            className="flex shrink-0 items-center justify-center gap-1.5 text-sm"
          >
            <Sparkles size={14} /> {actionLabel}
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <ProgressMetric
          label="Energi (Kalori)"
          value={calories}
          target={target.calories}
          unit="kkal"
          barClass="bg-primary"
          icon={Flame}
        />
        <ProgressMetric
          label="Protein"
          value={protein}
          target={target.protein_g}
          unit="g"
          barClass="bg-secondary"
          icon={Beef}
        />
        <ProgressMetric
          label="Zat Besi (Fe)"
          value={iron}
          target={target.iron_mg}
          unit="mg"
          barClass="bg-amber-500"
          icon={Droplets}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-background px-3.5 py-2.5 text-xs text-gray-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Wheat size={14} className="text-primary" /> Karbohidrat:
          <strong className="text-text">{carbs} g</strong> (target ~{target.carbs_g} g)
        </span>
        <span className="text-gray-300">|</span>
        <span>
          Lemak: <strong className="text-text">{fat} g</strong> (target ~{target.fat_g} g)
        </span>
      </div>
    </Card>
  );
}

