import { useLanguage } from "@/contexts/LanguageContext";
import { Github, Linkedin, Mail } from "lucide-react";
import { SiUpwork, SiFiverr } from "react-icons/si";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: SiUpwork, href: "https://upwork.com", label: "Upwork" },
    { icon: SiFiverr, href: "https://fiverr.com", label: "Fiverr" },
    { icon: Mail, href: "mailto:contact@example.com", label: "Email" },
  ];

  return (
    <footer className="bg-card border-t border-card-border">
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
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-muted flex items-center justify-center hover-elevate active-elevate-2 transition-all"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
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
