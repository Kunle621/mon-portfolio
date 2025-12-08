import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Download, Code2 } from "lucide-react"; 
import { useQuery } from "@tanstack/react-query";
import { profileAPI, skillsAPI } from "@/lib/api";
import * as Icons from "lucide-react"; 
import { ProfileData, SkillData } from "@/types";

export function About() {
  const { t, language } = useLanguage();

  // ✅ CORRECTION 1 : Utilisation de () => profileAPI.get()
  const { data: profile } = useQuery<ProfileData>({ 
    queryKey: ["profile"], 
    queryFn: () => profileAPI.get() 
  });
  
  // ✅ CORRECTION 2 : Utilisation de () => skillsAPI.getAll()
  const { data: skills } = useQuery<SkillData[]>({ 
    queryKey: ["skills"], 
    queryFn: () => skillsAPI.getAll() 
  });

  const getIcon = (iconName: string) => {
    // @ts-ignore
    return Icons[iconName] || Code2; 
  };

  if (!profile) return null;

  return (
    <section id="about" className="py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("À propos de moi", "About Me")}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {language === 'fr' ? profile.bioFr : profile.bioEn}
              </p>
            </div>

            {profile.cvUrl && (
                <Button size="lg" variant="outline" className="h-12" asChild>
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    {t("Télécharger mon CV", "Download CV")}
                </a>
                </Button>
            )}
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold mb-6">{t("Compétences", "Skills")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills?.map((skill, index) => {
                const Icon = getIcon(skill.icon);
                return (
                    <div key={index} className="p-4 rounded-lg border border-card-border bg-card flex flex-col items-center text-center">
                    <Icon className={`h-8 w-8 mb-3 ${skill.color || 'text-primary'}`} />
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}