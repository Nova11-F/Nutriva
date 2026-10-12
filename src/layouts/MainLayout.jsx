import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 pb-28 md:p-8 md:pb-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}