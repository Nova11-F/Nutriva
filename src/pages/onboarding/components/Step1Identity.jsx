import Input, { RadioGroup } from "../../../components/ui/Input";
import PhotoUpload from "../../../components/ui/PhotoUpload";
import { todayISO } from "../../../utils/formatDate";

export default function Step1Identity({ values, errors, onChange, setValue }) {
  return (
    <div className="flex flex-col gap-5">
      <PhotoUpload value={values.photo} onChange={(url) => setValue("photo", url)} />

      <Input label="Nama / Nickname" name="name" placeholder="Contoh: Aira"
             value={values.name} onChange={onChange} error={errors.name} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Tanggal Lahir" name="birthDate" type="date" max={todayISO()}
               value={values.birthDate} onChange={onChange} error={errors.birthDate}
               hint="Digunakan untuk menghitung usia dan menyesuaikan rekomendasi." />
        <Input label="Anak ke-" name="birthOrder" type="number" min={1} max={15} inputMode="numeric"
               placeholder="Contoh: 2" value={values.birthOrder} onChange={onChange} error={errors.birthOrder} />
      </div>

      <RadioGroup label="Jenis Kelamin" name="gender" value={values.gender} onChange={onChange}
                  error={errors.gender}
                  options={[{ value: "female", label: "Perempuan" }, { value: "male", label: "Laki-laki" }]} />
    </div>
  );
}