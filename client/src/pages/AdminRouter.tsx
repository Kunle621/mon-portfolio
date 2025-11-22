import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardPage } from "@/components/admin/admin-pages/DashboardPage";
import { ProjectsPage } from "@/components/admin/admin-pages/ProjectsPage";
import { MessagesPage } from "@/components/admin/admin-pages/MessagesPage";
import { NewsletterPage } from "@/components/admin/admin-pages/NewsletterPage";
import { SettingsPage } from "@/components/admin/admin-pages/SettingsPage";

export default function AdminRouter() {
  const { isAuthenticated, logout, isReady } = useAuth();
  const [location, setLocation] = useLocation();

  // Tant qu'on ne sait pas si on est authentifié, on ne fait rien
  if (!isReady) {
    return null;
  }

  // Redirige /admin → /admin/dashboard
  useEffect(() => {
    if (location === "/admin") {
      setLocation("/admin/dashboard");
    }
  }, [location, setLocation]);

  // Redirige vers login si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      setLocation("/admin/login");
    }
  }, [isAuthenticated, logout, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  switch (location) {
    case "/admin/dashboard":
      return <AdminLayout><DashboardPage /></AdminLayout>;
    case "/admin/projects":
      return <AdminLayout><ProjectsPage /></AdminLayout>;
    case "/admin/messages":
      return <AdminLayout><MessagesPage /></AdminLayout>;
    case "/admin/newsletter":
      return <AdminLayout><NewsletterPage /></AdminLayout>;
    case "/admin/settings":
      return <AdminLayout><SettingsPage /></AdminLayout>;
    default:
      return <AdminLayout><DashboardPage /></AdminLayout>;
  }
}