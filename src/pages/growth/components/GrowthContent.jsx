import Header from "../../../components/navigation/Header";
import { useAuth } from "../../../hooks/useAuth";

export default function GrowthContent() {
  const { user } = useAuth();
  return (
    <>
      <Header variant="greeting" userName={user?.name ?? "Pengguna"} />
    </>
  );
}
