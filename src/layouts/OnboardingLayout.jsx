import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-5 md:px-10">
      <header>
        <Link to="/" className="inline-block">
          <img src={logo} alt="Nutriva" className="h-30 w-auto" />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl py-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}