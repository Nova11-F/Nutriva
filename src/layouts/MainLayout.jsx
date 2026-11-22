import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar />

      <main className="min-w-0 flex-1 md:px-4 py-4 pb-24 lg:pb-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}