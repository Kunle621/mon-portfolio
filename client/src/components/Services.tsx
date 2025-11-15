import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Code2, Palette, Smartphone, Database, Search, Zap, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Code2": Code2,
  "Palette": Palette,
  "Smartphone": Smartphone,
  "Database": Database,
  "Search": Search,
  "Zap": Zap,
};

export function Services() {
  const { t, language } = useLanguage();

  // Données statiques
  const demoServices = [
    {
      icon: Code2,
      titleFr: "Développement Web",
      titleEn: "Web Development",
      descriptionFr: "Création d'applications web modernes avec React, Node.js et les dernières technologies",
      descriptionEn: "Building modern web applications with React, Node.js and the latest technologies",
    },
    {
      icon: Palette,
      titleFr: "UI/UX Design",
      titleEn: "UI/UX Design",
      descriptionFr: "Design d'interfaces utilisateur élégantes et intuitives pour une expérience optimale",
      descriptionEn: "Elegant and intuitive user interface design for optimal experience",
    },
    {
      icon: Smartphone,
      titleFr: "Applications Mobiles",
      titleEn: "Mobile Applications",
      descriptionFr: "Développement d'applications mobiles responsive et performantes",
      descriptionEn: "Development of responsive and performant mobile applications",
    },
    {
      icon: Database,
      titleFr: "Backend & API",
      titleEn: "Backend & API",
      descriptionFr: "Architecture backend robuste et APIs RESTful sécurisées",
      descriptionEn: "Robust backend architecture and secure RESTful APIs",
    },
    {
      icon: Search,
      titleFr: "SEO & Performance",
      titleEn: "SEO & Performance",
      descriptionFr: "Optimisation pour les moteurs de recherche et performances web",
      descriptionEn: "Search engine optimization and web performance",
    },
    {
      icon: Zap,
      titleFr: "Consulting & Support",
      titleEn: "Consulting & Support",
      descriptionFr: "Conseil technique et support pour vos projets web",
      descriptionEn: "Technical consulting and support for your web projects",
    },
  ];

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
          {demoServices.map((service, index) => {
            const IconComponent = typeof service.icon === "string" 
              ? (iconMap[service.icon] || Code2) 
              : service.icon;
            
            return (
              <Card key={index} className="p-6 hover-elevate active-elevate-2 transition-all" data-testid={`service-${index}`}>
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
          })}
        </div>
      </div>
    </section>
  );
}