import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Code2, Zap, Palette, Smartphone, Database, Search, Globe, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileAPI, skillsAPI } from "@/lib/api";
import { ProfileData, SkillData } from "@/types";

// 🔑 Helper robuste : retourne le bon composant Lucide à partir du nom (string)
const getIconComponent = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "Code2": return Code2;
    case "Zap": return Zap;
    case "Palette": return Palette;
    case "Smartphone": return Smartphone;
    case "Database": return Database;
    case "Search": return Search;
    case "Globe": return Globe;
    // Ajoute ici d'autres icônes si besoin :
    // case "Cloud": return Cloud;
    // case "Terminal": return Terminal;
    default:
      console.warn(`[About] Icon "${iconName}" not found. Using fallback Code2.`);
      return Code2;
  }
};

export function About() {
  const { t, language } = useLanguage();

  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => profileAPI.get(),
  });

  
  const {  data: skills = [] } = useQuery<SkillData[]>({
    queryKey: ["skills"],
    queryFn: () => skillsAPI.getAll(),
  });

  if (!profile) return null;

  const bioHtml = language === "fr" ? profile.bioFr : profile.bioEn;
  const learningMessage = language === "fr" ? profile.learningMessageFr : profile.learningMessageEn;

  return (
    <section id="about" className="py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("À propos de moi", "About Me")}
          </h2>
          {profile.taglineFr && profile.taglineEn && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "fr" ? profile.taglineFr : profile.taglineEn}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio & CTA */}
          <div className="space-y-6">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: bioHtml || "" }}
            />

            {profile.cvUrl && (
              <Button size="lg" variant="outline" className="h-12" asChild>
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-download-cv"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {t("Télécharger mon CV", "Download CV")}
                </a>
              </Button>
            )}
          </div>

          {/* Compétences & Bloc Apprentissage */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-6">
              {t("Compétences", "Skills")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {skills.length > 0 ? (
                skills.map((skill) => {
                  const Icon = getIconComponent(skill.icon);
                  return (
                    <Card
                      key={skill._id || skill.name}
                      className="p-4 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Icon className={`h-8 w-8 mb-3 ${skill.color || "text-primary"}`} />
                      <h4 className="font-medium text-sm">{skill.name}</h4>
                    </Card>
                  );
                })
              ) : (
                <p className="col-span-2 text-muted-foreground text-center text-sm">
                  {t("Aucune compétence disponible.", "No skills available.")}
                </p>
              )}
            </div>

            {learningMessage && (
              <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("Toujours en apprentissage", "Always Learning")}
                    </h4>
                    <p className="text-sm text-muted-foreground">{learningMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}