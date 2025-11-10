import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { newsletterAPI } from "@/lib/api";

export function Newsletter() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await newsletterAPI.subscribe({ email });
      
      toast({
        title: t("Abonnement confirmé !", "Subscription confirmed!"),
        description: t(
          "Merci de vous être abonné à la newsletter.",
          "Thank you for subscribing to the newsletter."
        ),
      });

      setEmail("");
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
    <section className="py-20 md:py-24 px-4 md:px-8 bg-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t("Restez informé", "Stay Informed")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t(
              "Recevez les dernières actualités, articles et conseils directement dans votre boîte mail.",
              "Receive the latest news, articles and tips directly in your inbox."
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Votre email", "Your email")}
            required
            className="flex-1 h-12"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 sm:w-auto w-full"
            data-testid="button-newsletter-subscribe"
          >
            {isSubmitting
              ? t("Abonnement...", "Subscribing...")
              : t("S'abonner", "Subscribe")}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          {t(
            "Pas de spam. Désabonnez-vous à tout moment.",
            "No spam. Unsubscribe at any time."
          )}
        </p>
      </div>
    </section>
  );
}
