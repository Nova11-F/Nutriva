// src/pages/home/HomePage.jsx
import { useChild } from "../../hooks/useChild";
import HomeEmpty from "./components/HomeEmpty";
import HomeDashboard from "./components/HomeDashboard";

export default function HomePage() {
  const { child } = useChild();

  if (!child) return <HomeEmpty />;
  return <HomeDashboard child={child} />;
}