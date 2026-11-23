
import { motion } from "motion/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hidden lg:flex"
      >
        <Sidebar />
      </motion.div>

      <main className="min-w-0 flex-1 md:px-4 pb-24 lg:pb-8">
        <Outlet />
      </main>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="lg:hidden"
      >
        <BottomNav />
      </motion.div>
    </div>
  );
}
