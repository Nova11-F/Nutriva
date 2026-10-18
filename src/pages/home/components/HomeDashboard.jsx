import Header from "../../../components/navigation/Header";
import { useAuth } from "../../../hooks/useAuth"

export default function HomeDashboard({ child }) {
  const { user } = useAuth();
  return (
    <>
    <Header variant="greeting" userName={user.name ?? "Pengguna"}/>
    <div className="grid gap-6 md:grid-cols-3">
      <h1 className="text-2xl font-bold md:col-span-3">Halo, orang tua {child.name}</h1>
    </div>
    </>
  );
}