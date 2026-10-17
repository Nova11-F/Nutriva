import { Textarea } from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import ChipSelect from "../../../components/ui/ChipSelect";
import { MEDICAL_OPTIONS } from "../../../constants/childOptions";

export default function Step4Medical({ values, onChange, setValue }) {
  return (
    <div className="flex flex-col gap-5">
      <Card variant="soft" padding="sm" className="text-sm text-gray-600">
        Tahap ini <b>opsional</b>. Isi jika ada, atau lewati. Informasi ini hanya membantu
        menyesuaikan saran edukatif dan bukan diagnosis.
      </Card>

      <ChipSelect label="Riwayat kesehatan anak" options={MEDICAL_OPTIONS}
                  value={values.medicalConditions} onChange={(v) => setValue("medicalConditions", v)} />

      <Textarea label="Catatan tambahan" name="medicalNotes" maxLength={300}
                placeholder="Contoh: pernah dirawat karena DBD, rutin minum vitamin D"
                value={values.medicalNotes} onChange={onChange}
                hint={`${values.medicalNotes.length}/300 karakter`} />
    </div>
  );
}