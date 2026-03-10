// src/components/Services.tsx
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { servicesAPI } from "@/lib/api";
import { ServiceData } from "@/types";
import * as LucideIcons from "lucide-react";


// ✅ Helper pour récupérer une icône Lucide par son nom (string)
const getIconComponent = (iconName: string): any => {
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  return Icon || LucideIcons.Code2; // fallback sûr
};

export function Services() {
  const { t, language } = useLanguage();

  // ✅ Récupère les services depuis l'API
  const { data: services = [], isLoading, error } = useQuery<ServiceData[]>({
    queryKey: ["services"],
    queryFn: () => servicesAPI.getAll(),
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Services", "Services")}
          </h2>
          <p className="text-muted-foreground">{t("Chargement...", "Loading...")}</p>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("[Services] Failed to load:", error);
    return null; // ou un fallback UI
  }

  return (
    <section id="services" className="py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Services", "Services")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Des solutions complètes pour donner vie à vos projets digitaux.",
              "Complete solutions to bring your digital projects to life."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => {
              const IconComponent = getIconComponent(service.icon); // ✅ Toujours un composant valide

              return (
                <Card
                  key={service._id}
                  className="p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  data-testid={`service-${service._id}`}
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">
                    {language === "fr" ? service.titleFr : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "fr" ? service.descriptionFr : service.descriptionEn}
                  </p>
                </Card>
              );
            })
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              {t("Aucun service disponible pour le moment.", "No services available at the moment.")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}