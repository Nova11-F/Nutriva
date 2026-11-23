import { motion } from "motion/react";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function AuthLayout() {
  return (
    <div className="flex h-screen flex-col bg-stone-50 px-4 py-5 md:px-10">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Link to="/" className="inline-block">
          <img
            src={logo}
            alt="Nutriva"
            className="h-20 w-auto lg:h-24"
          />
        </Link>
      </motion.header>

      <main className="flex items-center justify-center py-4">
        <Outlet />
      </main>
    </div>
  );
}
