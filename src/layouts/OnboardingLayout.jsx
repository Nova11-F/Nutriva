import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-5 md:px-8">
      <header>
        <Link to="/" className="inline-block">
          <img src={logo} alt="Nutriva" className="h-20 w-auto lg:h-24" />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl py-4 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}