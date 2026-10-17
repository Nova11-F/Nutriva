import Input, { Select } from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import { useAuth } from "../../../hooks/useAuth";
import { ROLE_OPTIONS } from "../../../constants/childOptions";

export default function Step5Parent({ values, errors, onChange }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      <Card variant="silver" padding="sm" className="text-sm">
        <p className="text-xs text-gray-500">Akun Anda</p>
        <p className="font-semibold text-text">{user?.name}</p>
        <p className="text-gray-600">{user?.email}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nomor Telepon / WhatsApp" name="phone" type="tel" inputMode="tel"
               placeholder="081234567890" value={values.phone} onChange={onChange} error={errors.phone} />
        <Input label="Kota Domisili" name="city" placeholder="Contoh: Surabaya"
               value={values.city} onChange={onChange} error={errors.city} />
      </div>

      <Select label="Peran Anda" name="role" options={ROLE_OPTIONS}
              value={values.role} onChange={onChange} error={errors.role} />
    </div>
  );
}