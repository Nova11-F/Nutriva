import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}