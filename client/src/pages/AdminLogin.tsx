// src/pages/AdminLogin.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const { t } = useLanguage();
  const { login, isAuthenticated, isReady } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // État pour savoir à quelle étape on est : "credentials" (email/mdp) ou "otp" (code)
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Redirige vers le dashboard si déjà authentifié ET prêt
  useEffect(() => {
    if (isReady && isAuthenticated) {
      setLocation("/admin/dashboard");
    }
  }, [isReady, isAuthenticated, setLocation]);

  // 🕑 Affiche un loader tant que l'authentification n'est pas initialisée
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("Chargement...", "Loading...")}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Import dynamique de l'API
      const { authAPI } = await import("@/lib/api");

      // ─── CAS 1 : Envoi Email + Mot de passe ───
      if (step === "credentials") {
        console.log("📤 Étape 1 : Login avec", formData.email);
        
        const response = await authAPI.login({
          email: formData.email.trim(),
          password: formData.password,
        });

        // Si le backend demande l'OTP (comportement normal attendu)
        if (response.requireOtp) {
          toast({
            title: t("Vérification requise", "Verification required"),
            description: t(`Code envoyé à ${response.email}`, `Code sent to ${response.email}`),
          });
          setStep("otp"); // Passage à l'étape 2
        } 
        // Fallback : Si l'OTP est désactivé côté serveur et qu'on reçoit le token direct
        else if (response.token) {
          login(response.admin, response.token);
          setLocation("/admin/dashboard");
        }
      } 
      
      // ─── CAS 2 : Envoi du Code OTP ───
      else {
        console.log("📤 Étape 2 : Vérification OTP");

        const response = await authAPI.verifyOtp({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
        });

        toast({
          title: t("Connexion réussie", "Login successful"),
          description: t("Bienvenue !", "Welcome!"),
        });

        // Connexion finale
        login(response.admin, response.token);
        setLocation("/admin/dashboard");
      }

    } catch (error: any) {
      console.error("💥 Erreur:", error);
      const errorMessage = error?.message || "Erreur inconnue";

      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md p-8 shadow-xl">
        
        {/* En-tête dynamique selon l'étape */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
            {step === "credentials" ? (
              <Lock className="h-8 w-8 text-primary" />
            ) : (
              <KeyRound className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-heading font-bold mb-2">
            {step === "credentials" 
              ? t("Administration", "Administration")
              : t("Code de sécurité", "Security Code")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === "credentials" 
              ? t("Connectez-vous pour accéder au tableau de bord", "Sign in to access the dashboard")
              : t("Entrez le code reçu par email", "Enter the code received by email")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CHAMPS ÉTAPE 1 : EMAIL & PASS */}
          {step === "credentials" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {t("Email", "Email")}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="admin@example.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {t("Mot de passe", "Password")}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  data-testid="input-password"
                />
              </div>
            </div>
          )}

          {/* CHAMPS ÉTAPE 2 : OTP */}
          {step === "otp" && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div>
                <Input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono h-14"
                  placeholder="000000"
                  autoFocus
                  data-testid="input-otp"
                />
              </div>
            </div>
          )}

          {/* Bouton Principal */}
          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting
              ? t("Chargement...", "Loading...")
              : step === "credentials"
              ? t("Se connecter", "Sign in")
              : t("Vérifier", "Verify")}
          </Button>

          {/* Bouton Retour (Visible uniquement à l'étape 2) */}
          {step === "otp" && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("credentials");
                setFormData(prev => ({ ...prev, otp: "" }));
              }}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Retour", "Back")}
            </Button>
          )}

        </form>
      </Card>
    </div>
  );
}