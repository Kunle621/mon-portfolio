import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { newsletterAPI } from "@/lib/api"; // ✅ Import réel

export function Newsletter() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      // 🚀 Envoi réel au backend
      await newsletterAPI.subscribe({ email: data.email });

      toast({
        title: t("Abonnement confirmé !", "Subscription confirmed!"),
        description: t(
          "Merci de vous être abonné à la newsletter.",
          "Thank you for subscribing to the newsletter."
        ),
      });

      reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: error?.response?.data?.error || t(
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
          <div className="flex-1">
            <Input
              type="email"
              {...register("email")}
              placeholder={t("Votre email", "Your email")}
              className="w-full h-12"
              data-testid="input-newsletter-email"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1 absolute left-0 -bottom-6">{errors.email.message}</p>
            )}
          </div>
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
