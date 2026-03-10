// src/pages/AdminRouter.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardPage } from "@/components/admin/admin-pages/DashboardPage";
import { ProjectsPage } from "@/components/admin/admin-pages/ProjectsPage";
import { MessagesPage } from "@/components/admin/admin-pages/MessagesPage";
import { NewsletterPage } from "@/components/admin/admin-pages/NewsletterPage";
import { SettingsPage } from "@/components/admin/admin-pages/SettingsPage";
import { ServicesSkillsPage } from "@/components/admin/admin-pages/ServicesSkillsPage"; // ✅ nouvelle page
import { ExperiencesPage } from "@/components/admin/admin-pages/ExperiencesPage"; // ✅ nouvelle page

export default function AdminRouter() {
  const { isAuthenticated, isReady } = useAuth();
  const [location, setLocation] = useLocation();

  // --- 1) On attend l'initialisation d'auth (évite clignotements) ---
  if (!isReady) return null;

  // --- 2) Si non connecté → redirection vers /admin/login ---
  if (!isAuthenticated) {
    if (location !== "/admin/login") {
      setLocation("/admin/login");
    }
    return null;
  }

  // --- 3) Si connecté et exact /admin → redirect vers dashboard ---
  if (location === "/admin" || location === "/admin/") {
    setLocation("/admin/dashboard");
    return null;
  }

  // --- 4) Routage interne des pages admin ---
  const getPageContent = () => {
    switch (location) {
      case "/admin/dashboard":
        return <DashboardPage />;

      case "/admin/projects":
        return <ProjectsPage />;

      case "/admin/messages":
        return <MessagesPage />;

      case "/admin/newsletter":
        return <NewsletterPage />;

      case "/admin/services":
        return <ServicesSkillsPage />; // ✅ nouvelle route

      case "/admin/experiences":
        return <ExperiencesPage />; // ✅ nouvelle route

      case "/admin/settings":
        return <SettingsPage />;

      default:
        return <DashboardPage />;
    }
  };

  return <AdminLayout>{getPageContent()}</AdminLayout>;
}
