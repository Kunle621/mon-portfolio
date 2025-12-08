// client/src/components/Hero.tsx
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileAPI } from "@/lib/api";
import { ProfileData } from "@/types";

export function Hero() {
  const { t, language } = useLanguage();

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    // On force le type ici pour rassurer TypeScript
    queryFn: async () => {
      const data = await profileAPI.get();
      return data as ProfileData; 
    },
    staleTime: 5 * 60 * 1000, // 5 minutes avant de reconsidérer les données comme périmées
    gcTime: 10 * 60 * 1000,   // "Garbage Collection Time" (remplace cacheTime en v5)
  });

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        {t("Chargement...", "Loading...")}
      </div>
    );
  }

  if (!profile) return null;

  // Helper pour choisir la bio selon la langue
  const bioContent = language === "fr" ? profile.bioFr : profile.bioEn;

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <div className="max-w-6xl w-full mx-auto text-center">
        {/* Photo de profil */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <img
              src={profile.headshotUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-lg"
            />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {language === "fr" 
            ? profile.titleFr || "Développeur Fullstack" 
            : profile.titleEn || "Fullstack Developer"}
        </h1>

        {/* Bio (Gestion du HTML venant de ReactQuill) */}
        <div 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto prose prose-neutral dark:prose-invert"
          dangerouslySetInnerHTML={{ 
            __html: bioContent || "" 
          }}
        />

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="text-base px-8 h-12" onClick={scrollToContact}>
            {t("Travaillons ensemble", "Work with me")} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {profile.githubUrl && (
              <Button size="icon" variant="outline" className="h-12 w-12" asChild>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            {profile.linkedinUrl && (
              <Button size="icon" variant="outline" className="h-12 w-12" asChild>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
            {profile.email && (
              <Button size="icon" variant="outline" className="h-12 w-12" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}