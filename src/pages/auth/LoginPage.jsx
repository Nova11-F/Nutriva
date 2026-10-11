import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useToast } from "../../hooks/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast, hideToast } = useToast();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!values.email.includes("@")) newErrors.email = "Email tidak valid";
    if (!values.password) newErrors.password = "Kata sandi wajib diisi";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const loadingId = showToast("Sedang masuk...", "loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      hideToast(loadingId);
      showToast("Berhasil masuk", "success");
      navigate("/onboarding"); 
    } catch (err) {
      hideToast(loadingId);
      showToast("Email atau kata sandi salah", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="px-4 flex flex-col gap-4 mb-8">
      <h1 className="text-4xl font-bold text-text text-center">Masuk ke Nutriva</h1>
      <p className="mt-1 text-xs text-gray-500">
        Lanjutkan menggunakan akun Anda. Setelah masuk, sistem akan mengecek apakah
        profil anak sudah tersedia.
      </p>
      </div>

      <Form
        onSubmit={handleSubmit}
        footer={
          <>
            <Button type="submit" loading={loading} className="w-full">
              Masuk
            </Button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Belum punya akun?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Daftar
              </Link>
            </p>
          </>
        }
      >
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div>
          <Input
            label="Kata Sandi"
            name="password"
            type="password"
            placeholder="Masukkan kata sandi"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-primary">
              Lupa kata sandi?
            </Link>
          </div>
        </div>
      </Form>

      <Card variant="success" className="mt-8 text-sm text-gray-600">
        <p className="mb-2 font-medium text-gray-700">Setelah masuk</p>
        <p>
          Jika belum ada Profil Anak → Pengaturan Profil Anak. Jika sudah ada → Beranda
          Personal.
        </p>
      </Card>
    </div>
  );
}