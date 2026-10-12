import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-3xl bg-surface p-1.5 shadow-lg ring-1 ring-black/5 md:hidden">
      {navItems.map(({ label, shortLabel, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] transition-all duration-300 ${
              isActive 
              ? "bg-soft font-semibold text-primary" 
              : "text-gray-500 hover:bg-soft hover:text-primary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span>{shortLabel ?? label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}