import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "../../components/ui/Form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function RegisterPage() {
  const [values, setValues] = useState({
    name: "", email: "", password: "", confirmPassword: "", agree: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const newErrors = {};
    if (!values.name) newErrors.name = "Nama wajib diisi";
    if (!values.email.includes("@")) newErrors.email = "Email tidak valid";
    if (values.password.length < 8) newErrors.password = "Minimal 8 karakter";
    if (values.confirmPassword !== values.password) newErrors.confirmPassword = "Kata sandi tidak sama";
    if (!values.agree) newErrors.agree = "Anda harus menyetujui ketentuan";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Kirim ke API:", values);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-xl font-bold text-text">Buat akun Nutriva</h1>
      <p className="mb-4 text-xs text-gray-500">
        Registrasi hanya membuat akun. Personalisasi baru aktif setelah profil anak dibuat.
      </p>

      <Form
        onSubmit={handleSubmit}
        footer={
          <>
            <Button type="submit" className="w-full">Daftar</Button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Sudah punya akun? <Link to="/login" className="text-primary">Masuk</Link>
            </p>
          </>
        }
      >
        <Input label="Nama" name="name" placeholder="Nama pengguna"
               value={values.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" placeholder="nama@email.com"
               value={values.email} onChange={handleChange} error={errors.email} />
        <Input label="Kata Sandi" name="password" type="password" placeholder="Minimal 8 karakter"
               value={values.password} onChange={handleChange} error={errors.password} />
        <Input label="Konfirmasi Kata Sandi" name="confirmPassword" type="password"
               placeholder="Ulangi kata sandi"
               value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Input type="checkbox" name="agree" checked={values.agree} onChange={handleChange}
               label="Saya menyetujui ketentuan penggunaan dan kebijakan privasi."
               error={errors.agree} />
      </Form>
    </div>
  );
}