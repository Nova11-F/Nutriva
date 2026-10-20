import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../../components/navigation/Header";
import Form from "../../components/ui/Form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const emptyValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const { showToast } = useToast();

  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!values.currentPassword) newErrors.currentPassword = "Kata sandi saat ini wajib diisi";
    if (values.newPassword.length < 8) newErrors.newPassword = "Minimal 8 karakter";
    else if (values.newPassword === values.currentPassword)
      newErrors.newPassword = "Kata sandi baru tidak boleh sama dengan yang lama";
    if (values.confirmPassword !== values.newPassword)
      newErrors.confirmPassword = "Kata sandi tidak sama";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      showToast("Kata sandi berhasil diubah", "success");
      navigate("/profile");
    } catch (err) {
      setErrors({ currentPassword: err.message });
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-lg px-4">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text">Ubah Kata Sandi</h2>
          <p className="text-sm text-gray-500">
            Masukkan kata sandi saat ini, lalu pilih kata sandi baru minimal 8 karakter.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          footer={
            <div className="flex items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/profile")}
                      className="flex items-center gap-2">
                <ArrowLeft size={16} /> Batal
              </Button>
              <Button type="submit" loading={loading}>Simpan Kata Sandi</Button>
            </div>
          }
        >
          <Input label="Kata Sandi Saat Ini" name="currentPassword" type="password"
                 placeholder="Masukkan kata sandi saat ini"
                 value={values.currentPassword} onChange={handleChange} error={errors.currentPassword} />
          <Input label="Kata Sandi Baru" name="newPassword" type="password"
                 placeholder="Minimal 8 karakter"
                 value={values.newPassword} onChange={handleChange} error={errors.newPassword} />
          <Input label="Konfirmasi Kata Sandi Baru" name="confirmPassword" type="password"
                 placeholder="Ulangi kata sandi baru"
                 value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        </Form>
      </div>
    </>
  );
}