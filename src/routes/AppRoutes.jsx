import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import MainLayout from "../layouts/MainLayout";
import PublicLayout from "../layouts/PublicLayout";

import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ChildProfilePage from "../pages/onboarding/ChildProfilePage";
import HomePage from "../pages/home/HomePage";
import NutritionPage from "../pages/nutrition/NutritionPage";
import RecipeListPage from "../pages/nutrition/RecipeListPage";
import RecipeDetailPage from "../pages/nutrition/RecipeDetailPage";
import GrowthPage from "../pages/growth/GrowthPage";
import AssistantPage from "../pages/assistant/AssistantPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<OnboardingLayout />}>
        <Route path="/onboarding" element={<ChildProfilePage />} />
        <Route path="/profile/:changepass" element={<ChangePasswordPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/nutrition/:recipes" element={<RecipeListPage />} />
        <Route path="/nutrition/:recipeId" element={<RecipeDetailPage />} />
        <Route path="/growth" element={<GrowthPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
