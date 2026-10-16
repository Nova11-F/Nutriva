import { useChild } from "../../hooks/useChild";
import Spinner from "../../components/ui/Spinner";
import NutritionEmpty from "./components/NutritionEmpty";
import NutritionContent from "./components/NutritionContent";

export default function HomePage() {
  const { child, loading } = useChild();

  if (loading) return <Spinner size="lg" center label="Memuat data anak..." />;
  if (!child) return <NutritionEmpty />;
  return <NutritionContent child={child} />;
}