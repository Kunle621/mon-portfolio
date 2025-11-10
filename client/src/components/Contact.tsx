import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactAPI } from "@/lib/api";

export function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit(formData);
      
      toast({
        title: t("Message envoyé !", "Message sent!"),
        description: t(
          "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
          "Thank you for your message. I will get back to you as soon as possible."
        ),
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: t(
          "Une erreur est survenue. Veuillez réessayer.",
          "An error occurred. Please try again."
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Contactez-moi", "Contact Me")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Vous avez un projet en tête ? Discutons de vos besoins et donnons vie à vos idées.",
              "Have a project in mind? Let's discuss your needs and bring your ideas to life."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t("Nom", "Name")}
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder={t("Votre nom", "Your name")}
                    data-testid="input-contact-name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t("Email", "Email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder={t("votre@email.com", "your@email.com")}
                    data-testid="input-contact-email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t("Message", "Message")}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder={t("Parlez-moi de votre projet...", "Tell me about your project...")}
                    rows={6}
                    data-testid="textarea-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12"
                  disabled={isSubmitting}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting
                    ? t("Envoi en cours...", "Sending...")
                    : t("Envoyer le message", "Send Message")}
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-6">
                {t("Informations de contact", "Contact Information")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a
                      href="mailto:contact@example.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      contact@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Téléphone</div>
                    <a
                      href="tel:+33123456789"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      {t("Localisation", "Location")}
                    </div>
                    <div className="text-muted-foreground">
                      Paris, France
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-semibold mb-2">
                {t("Disponibilité", "Availability")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Actuellement disponible pour de nouveaux projets. Réponse généralement sous 24h.",
                  "Currently available for new projects. Response typically within 24h."
                )}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
