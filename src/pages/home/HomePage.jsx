import { useChild } from "../../hooks/useChild";
import Spinner from "../../components/ui/Spinner";
import HomeEmpty from "./components/HomeEmpty";
import HomeDashboard from "./components/HomeDashboard";

export default function HomePage() {
  const { child, loading } = useChild();

  if (loading) return <Spinner size="lg" center label="Memuat data anak..." />;
  if (!child) return <HomeEmpty />;
  return <HomeDashboard child={child} />;
}