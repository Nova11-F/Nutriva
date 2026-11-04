import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ChevronRight, RefreshCw } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useToast } from "../../../hooks/useToast";
import { riskService } from "../../../services/riskService";
import { isAiServiceConfigured } from "../../../services/aiClient";
import { countFilledRiskFactors } from "../../../constants/riskFactorOptions";
import { ageInMonthsAt } from "../../../lib/whoGrowth";

const ALERT_STYLE = {
  info: { variant: "success", badge: "bg-green-100 text-green-800", label: "Pantau rutin" },
  attention: { variant: "warning", badge: "bg-yellow-100 text-yellow-800", label: "Perlu perhatian" },
  refer: { variant: "danger", badge: "bg-red-100 text-red-800", label: "Periksakan ke nakes" },
};

const BASIS_LABEL = {
  who_measurement: "Berdasarkan pengukuran terakhir (standar WHO 2006)",
  ml_risk_profile: "Berdasarkan profil faktor risiko (model AI) karena belum ada pengukuran ≤ 90 hari",
};

export default function RiskProfileCard({ child, latestRecord }) {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const filled = countFilledRiskFactors(child.riskFactors);
  const eligible = child.birthDate && ageInMonthsAt(child.birthDate) <= 59;

  useEffect(() => {
    let ignore = false;
    riskService
      .getLatest(child.id)
      .then((r) => !ignore && setResult(r))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [child.id]);

  const runAssessment = useCallback(async () => {
    setRunning(true);
    try {
      setResult(await riskService.assess(child, latestRecord));
    } catch (err) {
      showError(err.message || "Analisis gagal.");
    } finally {
      setRunning(false);
    }
  }, [child, latestRecord, showError]);

  if (!isAiServiceConfigured() || !eligible) return null;
  const style = ALERT_STYLE[result?.alert] || ALERT_STYLE.info;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Analisis AI Nutriva</h3>
      <Card variant={result ? style.variant : "soft"} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold text-text">
            <Activity size={18} className="text-primary" /> Profil Risiko Stunting
          </div>
          {result && <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>{style.label}</span>}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Memuat…</p>
        ) : result ? (
          <>
            <p className="text-sm text-text">{result.message}</p>
            <p className="text-xs text-gray-500">
              {BASIS_LABEL[result.basis]} · {new Date(result.assessedAt).toLocaleDateString("id-ID")} · model v{result.modelVersion}
            </p>
            {result.modifiableFactors.length > 0 && (
              <div className="rounded-lg bg-surface/70 p-3">
                <p className="mb-1 text-xs font-semibold text-gray-600">Hal yang bisa diperbaiki</p>
                <ul className="space-y-1 text-sm">
                  {result.modifiableFactors.map((f, i) => (
                    <li key={i}>
                      <span className="font-medium">{f.factor}.</span> {f.suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Isi faktor risiko (riwayat kelahiran, kehamilan, pola asuh, dan lingkungan) agar Nutriva dapat memberi
            peringatan dini, terutama saat belum ada pengukuran terbaru.
          </p>
        )}

        <p className="text-[11px] text-gray-500">
          Alat bantu edukasi, bukan diagnosis. Status gizi ditetapkan tenaga kesehatan.
        </p>

        <div className="flex flex-col gap-2 md:flex-row">
          <Button size="sm" variant="outline" className="flex items-center justify-center gap-1 text-sm"
            onClick={() => navigate("/growth/risk-profile", { state: { from: "/growth" } })}>
            {filled ? `Perbarui faktor risiko (${filled} terisi)` : "Isi faktor risiko"} <ChevronRight size={14} />
          </Button>
          <Button size="sm" className="flex items-center justify-center gap-1 text-sm" loading={running} onClick={runAssessment}>
            <RefreshCw size={14} /> {result ? "Analisis ulang" : "Analisis sekarang"}
          </Button>
        </div>
      </Card>
    </section>
  );
}
