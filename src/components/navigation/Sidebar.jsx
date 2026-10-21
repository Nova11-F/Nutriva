import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { navItems } from "./navItems";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-10 border-r border-gray-300 bg-surface px-4 py-10 xl:flex lg:w-80">
      <div className="flex items-center gap-2 px-4">
        <img src={Logo} alt="Logo Nutriva" className="h-16 w-auto object-cover" />
        <h1 className="text-3xl font-bold text-primary">Nutriva</h1>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl p-4 font-medium transition-all duration-300 ${
                isActive
                  ? "bg-soft text-primary"
                  : "text-gray-500 hover:bg-soft hover:text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}