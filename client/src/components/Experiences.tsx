// src/components/Experiences.tsx
import { useQuery } from "@tanstack/react-query";
import { experiencesAPI } from "@/lib/api";
import { ExperienceData } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building } from "lucide-react";

export function Experiences() {
  const { t } = useLanguage();
  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: experiencesAPI.getAll,
  });

  if (isLoading) return null;

  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experiences" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t("Expériences Professionnelles", "Professional Experience")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("Découvrez mon parcours professionnel et les projets sur lesquels j'ai travaillé.", "Discover my professional journey and the projects I've worked on.")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((experience: ExperienceData) => (
            <Card key={experience._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{experience.position}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{experience.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(experience.startDate).toLocaleDateString(t("fr-FR", "en-US"), {
                          year: "numeric",
                          month: "long",
                        })} - {
                          experience.endDate
                            ? new Date(experience.endDate).toLocaleDateString(t("fr-FR", "en-US"), {
                                year: "numeric",
                                month: "long",
                              })
                            : t("Présent", "Present")
                        }
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {Math.floor(
                      (new Date(experience.endDate || new Date()).getTime() -
                        new Date(experience.startDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )} {t("ans", "years")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: experience.description }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}