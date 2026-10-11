import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function AuthLayout() {
  return (
    <div className="flex h-screen flex-col bg-stone-50 px-4 py-5 md:px-10">
      <header>
        <Link to="/" className="inline-block">
          <img src={logo} alt="Nutriva" className="h-30 w-auto" />
        </Link>
      </header>

      <main className="flex items-center justify-center py-8">
        <Outlet />
      </main>
    </div>
  );
}