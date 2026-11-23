import { Baby } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";
import Header from "../navigation/Header"

export default function NoChildState({ feature = "fitur ini" }) {
  const navigate = useNavigate();

  return (
    <>
    <Header variant="ai"></Header>
    <EmptyState
      icon={Baby}
      title="Belum ada profil anak"
      description={`Buat profil anak terlebih dahulu agar ${feature} bisa disesuaikan dengan kondisi anak Anda.`}
      actionLabel="Buat Profil Anak"
      onAction={() => navigate("/onboarding", { state: { from: "/home" } })}
    />
    </>
  );
}