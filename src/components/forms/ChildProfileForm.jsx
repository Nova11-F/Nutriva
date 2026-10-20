import { useState } from "react";
import Form from "../ui/Form";
import Input, { RadioGroup } from "../ui/Input";

const genderOptions = [
  { value: "female", label: "Perempuan" },
  { value: "male", label: "Laki-laki" },
];

export default function ChildProfileForm({
  id = "child-profile-form",
  title = "Informasi Anak",
  initialValues = { name: "", birthDate: "", gender: "" },
  onSubmit,
  footer,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Nama anak wajib diisi";
    if (!values.birthDate) {
      newErrors.birthDate = "Tanggal lahir wajib diisi";
    } else if (new Date(values.birthDate) > new Date()) {
      newErrors.birthDate = "Tanggal lahir tidak boleh di masa depan";
    }
    if (!values.gender) newErrors.gender = "Pilih jenis kelamin";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(values); 
  };

  return (
    <Form id={id} title={title} onSubmit={handleSubmit} footer={footer}>
      <Input
        label="Nama / Nickname"
        name="name"
        placeholder="Contoh: Aira"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        label="Tanggal Lahir"
        name="birthDate"
        type="date"
        max={new Date().toISOString().split("T")[0]}
        hint="Digunakan untuk menyesuaikan rekomendasi berdasarkan usia anak."
        value={values.birthDate}
        onChange={handleChange}
        error={errors.birthDate}
      />
      <RadioGroup
        label="Jenis Kelamin"
        name="gender"
        options={genderOptions}
        value={values.gender}
        onChange={handleChange}
        error={errors.gender}
      />
    </Form>
  );
}

