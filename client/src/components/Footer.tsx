import { useLanguage } from "@/contexts/LanguageContext";
import { Github, Mail, Instagram, MessageCircle, Linkedin } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Kunle621",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/yahya-amoussa-515135329",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/kunlebiola12",
      label: "Instagram",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/22961560577",
      label: "WhatsApp",
    },
    {
      icon: Mail,
      href: "mailto:amoussayahya@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">
              {t("À propos", "About")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                "Développeur web freelance passionné, spécialisé dans la création d'applications web modernes.",
                "Passionate freelance web developer, specialized in creating modern web applications."
              )}
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">
              {t("Navigation", "Navigation")}
            </h3>
            <nav className="space-y-2">
              {[
                { href: "#about", labelFr: "À propos", labelEn: "About" },
                { href: "#projects", labelFr: "Projets", labelEn: "Projects" },
                { href: "#services", labelFr: "Services", labelEn: "Services" },
                { href: "#contact", labelFr: "Contact", labelEn: "Contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t(link.labelFr, link.labelEn)}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">
              {t("Me suivre", "Follow Me")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
                  aria-label={language === "fr" ? `Ouvrir ${social.label}` : `Open ${social.label}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t("Tous droits réservés", "All rights reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}