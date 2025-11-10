import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Download, Code2, Palette, Smartphone, Database, Globe, Zap } from "lucide-react";

export function About() {
  const { t } = useLanguage();

  const skills = [
    { icon: Code2, name: "React & Next.js", color: "text-blue-500" },
    { icon: Database, name: "Node.js & Express", color: "text-green-500" },
    { icon: Database, name: "MongoDB & PostgreSQL", color: "text-purple-500" },
    { icon: Palette, name: "TailwindCSS & UI/UX", color: "text-pink-500" },
    { icon: Smartphone, name: t("Responsive Design", "Responsive Design"), color: "text-orange-500" },
    { icon: Globe, name: "APIs & Intégrations", color: "text-cyan-500" },
  ];

  return (
    <section id="about" className="py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("À propos de moi", "About Me")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Passionné par le développement web, je transforme vos idées en applications modernes et performantes.",
              "Passionate about web development, I transform your ideas into modern and performant applications."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-base md:text-lg leading-relaxed">
                {t(
                  "Avec plus de 5 ans d'expérience dans le développement web, je me spécialise dans la création d'applications React modernes et de backends robustes avec Node.js. Mon approche combine excellence technique et design soigné pour délivrer des produits qui impressionnent vos utilisateurs.",
                  "With over 5 years of experience in web development, I specialize in creating modern React applications and robust backends with Node.js. My approach combines technical excellence and thoughtful design to deliver products that impress your users."
                )}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                {t(
                  "Je travaille en étroite collaboration avec mes clients pour comprendre leurs besoins et créer des solutions sur mesure. Performance, sécurité et expérience utilisateur sont au cœur de chaque projet.",
                  "I work closely with my clients to understand their needs and create custom solutions. Performance, security, and user experience are at the heart of every project."
                )}
              </p>
            </div>

            <Button size="lg" variant="outline" className="h-12" data-testid="button-download-cv">
              <Download className="mr-2 h-5 w-5" />
              {t("Télécharger mon CV", "Download CV")}
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold mb-6">
              {t("Compétences & Outils", "Skills & Tools")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-card-border bg-card hover-elevate active-elevate-2 transition-all"
                  data-testid={`skill-${index}`}
                >
                  <skill.icon className={`h-8 w-8 ${skill.color} mb-3`} />
                  <h4 className="font-medium text-sm">{skill.name}</h4>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("Toujours en apprentissage", "Always Learning")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Je reste à jour avec les dernières technologies et meilleures pratiques pour offrir des solutions modernes et pérennes.",
                      "I stay up to date with the latest technologies and best practices to offer modern and sustainable solutions."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
