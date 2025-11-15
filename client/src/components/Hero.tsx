import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import headshotImage from "@/assets/generated_images/Professional_developer_headshot_portrait_cf6cd3c7.png";

export function Hero() {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <div className="max-w-6xl w-full mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <img
              src={headshotImage}
              alt={t("Photo de profil", "Profile picture")}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-lg"
              data-testid="img-hero-profile"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {t("Développeur Web Freelance", "Freelance Web Developer")}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t(
            "Je crée des applications web modernes et performantes avec React, Node.js et les dernières technologies.",
            "I build modern and performant web applications with React, Node.js and the latest technologies."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="text-base px-8 h-12"
            onClick={scrollToContact}
            data-testid="button-cta-contact"
          >
            {t("Travaillons ensemble", "Work with me")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12"
              asChild
              data-testid="button-social-github"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12"
              asChild
              data-testid="button-social-linkedin"
            >
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12"
              asChild
              data-testid="button-social-email"
            >
              <a href="mailto:contact@example.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: t("Projets réalisés", "Projects completed"), value: "50+" },
            { label: t("Années d'expérience", "Years of experience"), value: "5+" },
            { label: t("Clients satisfaits", "Happy clients"), value: "30+" },
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-lg bg-card border border-card-border" data-testid={`stat-${index}`}>
              <div className="text-3xl font-heading font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
