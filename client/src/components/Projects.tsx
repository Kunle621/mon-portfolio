import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, ExternalLink } from "lucide-react";
import ecommerceImage from "@/assets/generated_images/E-commerce_project_screenshot_16f17c68.png";
import taskAppImage from "@/assets/generated_images/Task_management_app_mockup_e05ae4f3.png";
import realEstateImage from "@/assets/generated_images/Real_estate_website_screenshot_88af8217.png";

export function Projects() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  // Données statiques
  const demoProjects = [
    {
      id: "1",
      titleFr: "Plateforme E-Commerce",
      titleEn: "E-Commerce Platform",
      descriptionFr: "Solution complète de e-commerce avec panier, paiements et gestion des commandes",
      descriptionEn: "Complete e-commerce solution with cart, payments and order management",
      category: "web",
      imageUrl: ecommerceImage,
      githubUrl: "https://github.com",
      demoUrl: "https://demo.example.com",
    },
    {
      id: "2",
      titleFr: "Application de Gestion de Tâches",
      titleEn: "Task Management App",
      descriptionFr: "Application collaborative pour gérer projets et tâches en équipe",
      descriptionEn: "Collaborative application to manage projects and tasks as a team",
      category: "mobile",
      imageUrl: taskAppImage,
      githubUrl: "https://github.com",
      demoUrl: "https://demo.example.com",
    },
    {
      id: "3",
      titleFr: "Site Immobilier",
      titleEn: "Real Estate Website",
      descriptionFr: "Plateforme moderne pour rechercher et publier des biens immobiliers",
      descriptionEn: "Modern platform to search and publish real estate properties",
      category: "web",
      imageUrl: realEstateImage,
      githubUrl: "https://github.com",
      demoUrl: "https://demo.example.com",
    },
  ];

  const categories = [
    { value: "all", labelFr: "Tous", labelEn: "All" },
    { value: "web", labelFr: "Web", labelEn: "Web" },
    { value: "mobile", labelFr: "Mobile", labelEn: "Mobile" },
  ];

  const filteredProjects = filter === "all" 
    ? demoProjects 
    : demoProjects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-20 md:py-24 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Projets récents", "Recent Projects")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Découvrez quelques-uns de mes projets récents et mes réalisations.",
              "Discover some of my recent projects and achievements."
            )}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              onClick={() => setFilter(cat.value)}
              className="h-10"
              data-testid={`button-filter-${cat.value}`}
            >
              {language === "fr" ? cat.labelFr : cat.labelEn}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden group" data-testid={`card-project-${project.id}`}>
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={project.imageUrl}
                  alt={language === "fr" ? project.titleFr : project.titleEn}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {language === "fr" ? project.titleFr : project.titleEn}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {language === "fr" ? project.descriptionFr : project.descriptionEn}
                </p>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      data-testid={`button-github-${project.id}`}
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      asChild
                      data-testid={`button-demo-${project.id}`}
                    >
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}