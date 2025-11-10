import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { authAPI } = await import("@/lib/api");
      const response = await authAPI.login(formData);
      
      toast({
        title: t("Connexion réussie", "Login successful"),
        description: t("Bienvenue !", "Welcome!"),
      });

      login(response.admin, response.token);
      setLocation("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Erreur de connexion", "Login error"),
        description: t(
          "Nom d'utilisateur ou mot de passe incorrect.",
          "Incorrect username or password."
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-2">
            {t("Administration", "Administration")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("Connectez-vous pour accéder au tableau de bord", "Sign in to access the dashboard")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              {t("Nom d'utilisateur", "Username")}
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder={t("Entrez votre nom d'utilisateur", "Enter your username")}
              data-testid="input-username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t("Mot de passe", "Password")}
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder={t("Entrez votre mot de passe", "Enter your password")}
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isSubmitting}
            data-testid="button-login"
          >
            {isSubmitting
              ? t("Connexion...", "Signing in...")
              : t("Se connecter", "Sign in")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
