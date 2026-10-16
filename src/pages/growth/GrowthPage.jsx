import { useChild } from "../../hooks/useChild";
import Spinner from "../../components/ui/Spinner";
import GrowthEmpty from "./components/GrowthEmpty";
import GrowthContent from "./components/GrowthContent";

export default function HomePage() {
  const { child, loading } = useChild();

  if (loading) return <Spinner size="lg" center label="Memuat data anak..." />;
  if (!child) return <GrowthEmpty />;
  return <GrowthContent child={child} />;
}