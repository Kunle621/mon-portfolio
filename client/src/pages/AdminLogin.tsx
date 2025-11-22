// src/pages/AdminLogin.tsx
import { useState, useEffect } from "react";
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
  const { login, isAuthenticated, isReady } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Redirige vers le dashboard si déjà authentifié ET prêt
  useEffect(() => {
    console.log("🔍 AdminLogin - isReady:", isReady, "isAuthenticated:", isAuthenticated);
    if (isReady && isAuthenticated) {
      console.log("🚀 Redirection automatique vers /admin/dashboard (déjà connecté)");
      setLocation("/admin/dashboard");
    }
  }, [isReady, isAuthenticated, setLocation]);

  // 🕑 Affiche un loader tant que l'authentification n'est pas initialisée
  if (!isReady) {
    console.log("⏳ AdminLogin - En attente de l'initialisation de l'authentification...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("Chargement...", "Loading...")}
      </div>
    );
  }

  // 💡 Si on est ici, isReady === true → on peut afficher le formulaire
  console.log("✅ AdminLogin - Composant prêt à afficher le formulaire");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 Soumission du formulaire avec email:", formData.email);
    setIsSubmitting(true);

    try {
      const { authAPI } = await import("@/lib/api");
      console.log("📥 Appel à authAPI.login...");

      const response = await authAPI.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("✅ Réponse reçue du backend:", { admin: response.admin, tokenExists: !!response.token });

      if (!response.token || !response.admin?.email) {
        console.error("❌ Réponse invalide du serveur (token ou admin manquant)", response);
        throw new Error("Réponse invalide du serveur");
      }

      toast({
        title: t("Connexion réussie", "Login successful"),
        description: t("Bienvenue !", "Welcome!"),
      });

      console.log("🔑 Appel à login() dans AuthContext...");
      login(response.admin, response.token);

      console.log("✅ AuthContext mis à jour. Redirection vers /admin/dashboard...");
      setLocation("/admin/dashboard");

    } catch (error: any) {
      console.error("💥 Erreur lors de la connexion:", error);
      const errorMessage = error?.message || error?.error || "Erreur inconnue";

      toast({
        variant: "destructive",
        title: t("Erreur de connexion", "Login error"),
        description: errorMessage.includes("Email") || errorMessage.includes("email")
          ? t("Email incorrect.", "Incorrect email.")
          : errorMessage.includes("Mot de passe") || errorMessage.includes("password")
          ? t("Mot de passe incorrect.", "Incorrect password.")
          : t("Une erreur est survenue.", "An error occurred."),
      });
    } finally {
      console.log("⏹️ Fin du processus de connexion");
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
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("Email", "Email")}
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder={t("Entrez votre email", "Enter your email")}
              data-testid="input-email"
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