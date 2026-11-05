import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Form from "../../components/ui/Form";
import Input, { Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import NoChildState from "../../components/ui/NoChildState";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import { growthService } from "../../services/growthService";
import { riskService } from "../../services/riskService";
import { isAiServiceConfigured } from "../../services/aiClient";
import { RISK_NUMBER_FIELDS, RISK_SELECT_FIELDS, cleanRiskFactors } from "../../constants/riskFactorOptions";

export default function RiskProfilePage() {
  const { child, updateChild } = useChild();
  if (!child) return <NoChildState feature="profil risiko" />;
  // key: reset isian form saat anak aktif berganti
  return <RiskProfileForm key={child.id} child={child} updateChild={updateChild} />;
}

function RiskProfileForm({ child, updateChild }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const backTo = location.state?.from ?? "/growth";

  const initial = useMemo(() => {
    const rf = child.riskFactors || {};
    return Object.fromEntries(
      [...RISK_NUMBER_FIELDS, ...RISK_SELECT_FIELDS].map((f) => [f.key, rf[f.key] ?? ""])
    );
  }, [child]);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    for (const f of RISK_NUMBER_FIELDS) {
      const raw = values[f.key];
      if (raw === "" || raw === null) continue;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < f.min || n > f.max) er[f.key] = `Isi antara ${f.min} dan ${f.max}`;
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const riskFactors = cleanRiskFactors(values);
      const updated = await updateChild({ riskFactors }, child.id);
      if (isAiServiceConfigured()) {
        const latest = await growthService.getLatest(child.id);
        await riskService.assess({ ...child, ...updated, riskFactors }, latest);
      }
      showSuccess("Faktor risiko tersimpan dan dianalisis.");
      navigate(backTo);
    } catch (err) {
      showError(err.message || "Gagal menyimpan faktor risiko.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-6">
      <button type="button" onClick={() => navigate(backTo)} className="flex w-fit items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div>
        <h2 className="text-2xl font-bold text-text">Faktor Risiko {child.name}</h2>
        <p className="text-sm text-gray-500">
          Semua isian opsional. Makin lengkap, makin baik peringatan dininya. Data hanya dipakai untuk analisis
          anak ini dan tidak menggantikan pemeriksaan tenaga kesehatan.
        </p>
      </div>

      <Form
        onSubmit={handleSubmit}
        footer={
          <Button type="submit" loading={saving} className="w-full md:w-fit">
            Simpan & analisis
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {RISK_NUMBER_FIELDS.map((f) => (
            <Input key={f.key} name={f.key} label={f.label} type="number" inputMode="decimal" step={f.step}
              min={f.min} max={f.max} placeholder={`Contoh: ${f.placeholder}`} hint={f.hint}
              value={values[f.key]} onChange={onChange} error={errors[f.key]} />
          ))}
          {RISK_SELECT_FIELDS.map((f) => (
            <Select key={f.key} name={f.key} label={f.label} options={f.options} placeholder="Tidak tahu / lewati"
              value={values[f.key]} onChange={onChange} />
          ))}
        </div>
      </Form>
    </div>
  );
}
