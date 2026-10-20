import { useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import StepIndicator from "./components/StepIndicator";
import Step1Identity from "./components/Step1Identity";
import Step2Body from "./components/Step2Body";
import Step3Nutrition from "./components/Step3Nutrition";
import Step4Medical from "./components/Step4Medical";
import Step5Parent from "./components/Step5Parent";
import { useAuth } from "../../hooks/useAuth";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import { growthService } from "../../services/growthService";
import { ALLERGY_OPTIONS, NO_ALLERGY } from "../../constants/childOptions";
import { todayISO } from "../../utils/formatDate";
import {
  validateIdentity,
  validateBody,
  validateNutrition,
  validateParent,
} from "../../utils/onboardingValidators";

const ALL_STEPS = [
  {
    key: "identity",
    title: "Identitas Dasar",
    Component: Step1Identity,
    validate: validateIdentity,
    description:
      "Kenali anak Anda: foto, nama, tanggal lahir, jenis kelamin, dan urutan kelahiran.",
  },
  {
    key: "body",
    title: "Pengukuran Fisik",
    Component: Step2Body,
    validate: validateBody,
    description:
      "Data antropometri terbaru menjadi titik awal pemantauan pertumbuhan.",
  },
  {
    key: "nutrition",
    title: "Profil Nutrisi",
    Component: Step3Nutrition,
    validate: validateNutrition,
    description:
      "Alergi dan preferensi makan agar rekomendasi menu lebih aman dan sesuai selera.",
  },
  {
    key: "medical",
    title: "Riwayat Kesehatan",
    Component: Step4Medical,
    validate: () => ({}),
    optional: true,
    description: "Riwayat kesehatan anak. Boleh dikosongkan.",
  },
  {
    key: "parent",
    title: "Profil Orang Tua",
    Component: Step5Parent,
    validate: validateParent,
    description: "Lengkapi data Anda sebagai orang tua atau wali.",
  },
];

function buildInitialValues(editing, user) {
  const base = {
    photo: "",
    name: "",
    birthDate: "",
    gender: "",
    birthOrder: "",
    measuredAt: todayISO(),
    weight: "",
    height: "",
    headCircumference: "",
    birthWeight: "",
    birthLength: "",
    feedingType: "",
    allergies: [],
    otherAllergies: [],
    favoriteFoods: [],
    dislikedFoods: [],
    medicalConditions: [],
    medicalNotes: "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    role: user?.role ?? "",
  };
  if (!editing) return base;

  const saved = editing.allergies ?? [];
  const known = saved.filter((a) => ALLERGY_OPTIONS.includes(a));
  const other = saved.filter((a) => !ALLERGY_OPTIONS.includes(a));

  return {
    ...base,
    photo: editing.photo ?? "",
    name: editing.name,
    birthDate: editing.birthDate,
    gender: editing.gender,
    birthOrder: String(editing.birthOrder ?? ""),
    birthWeight: editing.birthWeight ?? "",
    birthLength: editing.birthLength ?? "",
    feedingType: editing.feedingType ?? "",
    allergies: saved.length === 0 ? [NO_ALLERGY] : known,
    otherAllergies: other,
    favoriteFoods: editing.favoriteFoods ?? [],
    dislikedFoods: editing.dislikedFoods ?? [],
    medicalConditions: editing.medicalConditions ?? [],
    medicalNotes: editing.medicalNotes ?? "",
  };
}

function buildChildData(v) {
  return {
    name: v.name.trim(),
    birthDate: v.birthDate,
    gender: v.gender,
    birthOrder: Number(v.birthOrder),
    photo: v.photo,
    birthWeight: v.birthWeight === "" ? null : Number(v.birthWeight),
    birthLength: v.birthLength === "" ? null : Number(v.birthLength),
    feedingType: v.feedingType,
    allergies: [
      ...v.allergies.filter((a) => a !== NO_ALLERGY),
      ...v.otherAllergies,
    ],
    favoriteFoods: v.favoriteFoods,
    dislikedFoods: v.dislikedFoods,
    medicalConditions: v.medicalConditions,
    medicalNotes: v.medicalNotes.trim(),
  };
}

export default function ChildProfilePage() {
  const [params] = useSearchParams();
  const { childList, loading } = useChild();
  const editId = Number(params.get("edit")) || null;
  const parentOnly = params.get("mode") === "parent";

  if (loading) return <Spinner center label="Memuat data anak..." />;
  if (parentOnly)
    return <OnboardingWizard key="parent" editing={null} parentOnly />;

  const editing = editId ? childList.find((c) => c.id === editId) : null;
  if (editId && !editing) return <Navigate to="/profile" replace />;

  return <OnboardingWizard key={editing?.id ?? "new"} editing={editing} />;
}

function OnboardingWizard({ editing, parentOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateProfile } = useAuth();
  const { saveChild, updateChild } = useChild();
  const { showToast } = useToast();

  const isEdit = Boolean(editing);
  const backTo = location.state?.from ?? "/home";

  const [steps] = useState(() => {
    if (parentOnly) return ALL_STEPS.filter((s) => s.key === "parent");
    if (isEdit) return ALL_STEPS.filter((s) => s.key !== "parent");
    return user?.phone
      ? ALL_STEPS.filter((s) => s.key !== "parent")
      : ALL_STEPS;
  });

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(() => buildInitialValues(editing, user));

  const saved = useRef({ child: null, growth: false });

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };
  const handleChange = (e) => setValue(e.target.name, e.target.value);

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const { Component } = current;

  const goTo = (n) => {
    setStep(n);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const saveAll = async () => {
    setSaving(true);
    try {
      const data = buildChildData(values);

      if (isEdit) {
        await updateChild(data, editing.id);
        showToast(`Profil ${data.name} diperbarui`, "success");
        navigate(backTo);
        return;
      }

      if (!saved.current.child) {
        saved.current.child = await saveChild(data);
      }

      if (!saved.current.growth) {
        await growthService.add({
          childId: saved.current.child.id,
          date: values.measuredAt,
          weight: Number(values.weight),
          height: Number(values.height),
          headCircumference: Number(values.headCircumference),
        });
        saved.current.growth = true;
      }

      if (steps.some((s) => s.key === "parent")) {
        await updateProfile({
          phone: values.phone.replace(/[\s-]/g, ""),
          city: values.city.trim(),
          role: values.role,
        });
      }

      showToast(`Profil ${data.name} berhasil disimpan`, "success");
      navigate(backTo);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = current.validate(values, { isEdit });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (isLast) saveAll();
    else goTo(step + 1);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {parentOnly
              ? "Ubah Profil Orang Tua"
              : isEdit
                ? `Ubah Profil ${editing.name}`
                : "Pendaftaran Profil Balita Baru"}
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            {parentOnly
              ? "Perbarui nomor telepon, kota, dan peran Anda."
              : isEdit
                ? "Perbarui data anak. Perubahan akan menyesuaikan rekomendasi nutrisi dan analisis."
                : "Lengkapi data tumbuh kembang dan preferensi gizi si kecil untuk personalisasi menu gizi harian dan grafik."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(backTo)}
          className="flex shrink-0 items-center gap-2"
        >
          <ArrowLeft size={16} />{" "}
          <span className="hidden md:inline">Batal & Kembali</span>
        </Button>
      </div>

      <StepIndicator steps={steps} current={step} />

      <div>
        <h2 className="text-lg font-semibold text-text">{current.title}</h2>
        <p className="mb-4 text-sm text-gray-500">{current.description}</p>

        <Form
          onSubmit={handleSubmit}
          footer={
            <div className="flex items-center justify-between gap-2">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo(step - 1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Kembali
                </Button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                {current.optional && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => goTo(step + 1)}
                  >
                    Lewati
                  </Button>
                )}
                <Button
                  type="submit"
                  loading={saving}
                  className="flex items-center gap-2"
                >
                  {isLast ? (
                    isEdit ? (
                      "Simpan Perubahan"
                    ) : (
                      "Simpan & Mulai"
                    )
                  ) : (
                    <>
                      Lanjut <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          }
        >
          <Component
            values={values}
            errors={errors}
            onChange={handleChange}
            setValue={setValue}
            isEdit={isEdit}
          />
        </Form>
      </div>
    </div>
  );
}
