// src/components/admin/admin-pages/NewsletterPage.tsx
import { useLanguage } from "@/contexts/LanguageContext";

export function NewsletterPage() {
  const { t } = useLanguage();

  return (
    <>
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">{t("Newsletter", "Newsletter")}</h1>
      </header>
      <main className="p-6">
        <p>{t("Page en construction", "Page under construction")}</p>
      </main>
    </>
  );
}