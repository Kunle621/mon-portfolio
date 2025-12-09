import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, ExternalLink } from "lucide-react";
import { projectsAPI } from "@/lib/api";

export function Projects() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  // --- Fetch projects from the DB ---
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsAPI.getAll,
  });

  // --- Define categories for filtering ---
  const categories = [
    { value: "all", labelFr: "Tous", labelEn: "All" },
    { value: "web", labelFr: "Web", labelEn: "Web" },
    { value: "mobile", labelFr: "Mobile", labelEn: "Mobile" },
    { value: "datascience", labelFr: "Data Science", labelEn: "Data Science" },
    { value: "deeplearning", labelFr: "Deep Learning", labelEn: "Deep Learning" },
  ];

  // --- Filter projects by category ---
  const filteredProjects = !projects
    ? []
    : filter === "all"
      ? projects
      : projects.filter((p: any) => p.categories?.includes(filter));

  // --- Loading state ---
  if (isLoading) {
    return (
      <section id="projects" className="py-20 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Projets récents", "Recent Projects")}
          </h2>
          <p>{t("Chargement des projets...", "Loading projects...")}</p>
        </div>
      </section>
    );
  }

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

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              onClick={() => setFilter(cat.value)}
              className="h-10"
            >
              {language === "fr" ? cat.labelFr : cat.labelEn}
            </Button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <Card key={project._id} className="overflow-hidden group">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={language === "fr" ? project.titleFr : project.titleEn}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {t("Pas d'image", "No image")}
                  </div>
                )}
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
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button size="sm" asChild>
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
