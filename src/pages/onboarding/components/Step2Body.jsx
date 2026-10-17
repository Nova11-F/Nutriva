import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import { formatAge, getAgeInMonths, todayISO } from "../../../utils/formatDate";

export default function Step2Body({ values, errors, onChange, isEdit }) {
  const months = values.birthDate ? getAgeInMonths(values.birthDate) : null;
  const lying = months !== null && months < 24;
  const heightLabel = lying ? "Panjang Badan (cm)" : "Tinggi Badan (cm)";

    if (isEdit) {
    return (
      <div className="flex flex-col gap-5">
        <Card variant="soft" padding="sm" className="text-sm text-gray-600">
          Pengukuran berat dan tinggi terbaru ditambahkan lewat halaman <b>Pertumbuhan</b>.
          Di sini Anda hanya mengubah data kelahiran.
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Berat Lahir (kg)" name="birthWeight" type="number" step="0.01" inputMode="decimal"
                 placeholder="Contoh: 3.1" value={values.birthWeight} onChange={onChange} error={errors.birthWeight} />
          <Input label="Panjang Lahir (cm)" name="birthLength" type="number" step="0.1" inputMode="decimal"
                 placeholder="Contoh: 49" value={values.birthLength} onChange={onChange} error={errors.birthLength} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {months !== null && (
        <Card variant="soft" padding="sm" className="text-sm text-gray-600">
          Usia {values.name.trim() || "anak"}: <b>{formatAge(months)}</b>.{" "}
          {lying ? "Anak di bawah 2 tahun diukur dalam posisi berbaring." : "Anak diukur dalam posisi berdiri tegak."}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Berat Badan (kg)" name="weight" type="number" step="0.1" inputMode="decimal"
               placeholder="Contoh: 9.5" value={values.weight} onChange={onChange} error={errors.weight} />
        <Input label={heightLabel} name="height" type="number" step="0.1" inputMode="decimal"
               placeholder="Contoh: 72" value={values.height} onChange={onChange} error={errors.height} />
        <Input label="Lingkar Kepala (cm)" name="headCircumference" type="number" step="0.1" inputMode="decimal"
               placeholder="Contoh: 45" value={values.headCircumference} onChange={onChange}
               error={errors.headCircumference} />
        <Input label="Tanggal Pengukuran" name="measuredAt" type="date" max={todayISO()}
               value={values.measuredAt} onChange={onChange} error={errors.measuredAt} />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-text">
          Data kelahiran <span className="font-normal text-gray-400">(opsional, membantu analisis)</span>
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Berat Lahir (kg)" name="birthWeight" type="number" step="0.01" inputMode="decimal"
                 placeholder="Contoh: 3.1" value={values.birthWeight} onChange={onChange} error={errors.birthWeight} />
          <Input label="Panjang Lahir (cm)" name="birthLength" type="number" step="0.1" inputMode="decimal"
                 placeholder="Contoh: 49" value={values.birthLength} onChange={onChange} error={errors.birthLength} />
        </div>
      </div>
    </div>
  );
}