import { Baby } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";

export default function NoChildState({ feature = "fitur ini" }) {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={Baby}
      title="Belum ada profil anak"
      description={`Buat profil anak terlebih dahulu agar ${feature} bisa disesuaikan dengan kondisi anak Anda.`}
      actionLabel="Buat Profil Anak"
      onAction={() => navigate("/onboarding", { state: { from: "/home" } })}
    />
  );
}