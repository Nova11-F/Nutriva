import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChildProfileForm from "../../components/forms/ChildProfileForm";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";

export default function ChildProfilePage() {
  const navigate = useNavigate();
  const { saveChild } = useChild();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    saveChild(values);
    setLoading(false);

    showToast("Profil anak berhasil disimpan", "success");
    navigate("/home");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Lengkapi Profil Anak</h1>
      <p className="mb-6 mt-1 text-xs text-gray-500">
        Data ini membantu Nutriva mengenali profil dasar anak. Data pertumbuhan
        dapat ditambahkan setelah profil selesai.
      </p>

      <div className="grid gap-4 md:grid-cols-[3fr_2fr] md:items-start">
        <ChildProfileForm onSubmit={handleSubmit} />

        <div className="flex flex-col gap-4">
          <Card
            variant="success"
            className="flex min-h-48 flex-col justify-between"
          >
            <h1 className="text-xl font-semibold mb-4">kenapa profil ini diperlukan?</h1>
            <span className="flex items-center gap-4 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Menyesuaikan usia anak
            </span>
            <span className="flex items-center gap-4 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Memberikan konteks untuk Nutrisi
            </span>
            <span className="flex items-center gap-4 text-sm text-gray-500">
             <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Menentukan konteks awal Asisten AI
            </span>
            <span className="flex items-center gap-4 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Data Pertumbuhan ditambahkan setelah profil selesai
            </span>
            <p className="text-md text-gray-500 mt-4">Profil dan data pertumbuhan dapat diedit kembali dari Profil.</p>
          </Card>

          <Button
            type="submit"
            form="child-profile-form"
            variant="outline"
            loading={loading}
            className="w-full"
          >
            Simpan Profil & Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  );
}
