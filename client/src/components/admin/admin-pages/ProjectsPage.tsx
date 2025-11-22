// src/components/admin/admin-pages/ProjectsPage.tsx
import { useLanguage } from "@/contexts/LanguageContext";

export function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <>
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">{t("Gestion des projets", "Project Management")}</h1>
      </header>
      <main className="p-6">
        <p>{t("Page en construction", "Page under construction")}</p>
      </main>
    </>
  );
}