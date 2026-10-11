import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 px-4 py-5 md:px-10">
      <header>
        <Link to="/" className="inline-block">
          <img src={logo} alt="Nutriva" className="h-12 w-auto" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-8">
        <Outlet />
      </main>
    </div>
  );
}