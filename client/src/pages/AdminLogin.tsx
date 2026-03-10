import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from "@/lib/validations";
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

  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    reset: resetOtp
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  const [savedEmail, setSavedEmail] = useState("");
  
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

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { authAPI } = await import("@/lib/api");
      const response = await authAPI.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (response.requireOtp) {
        toast({
          title: t("Vérification requise", "Verification required"),
          description: t(`Code envoyé à ${response.email}`, `Code sent to ${response.email}`),
        });
        setSavedEmail(data.email.trim());
        setStep("otp");
      } else if (response.token) {
        login(response.admin, response.token);
        setLocation("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: error?.message || "Identifiants incorrects",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);
    try {
      const { authAPI } = await import("@/lib/api");
      const response = await authAPI.verifyOtp({
        email: savedEmail,
        otp: data.otp.trim(),
      });

      toast({
        title: t("Connexion réussie", "Login successful"),
        description: t("Bienvenue !", "Welcome!"),
      });

      login(response.admin, response.token);
      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: error?.message || "Code invalide",
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

        <form 
          onSubmit={step === "credentials" ? handleSubmitLogin(onLoginSubmit) : handleSubmitOtp(onOtpSubmit)} 
          className="space-y-4"
        >
          
          {/* CHAMPS ÉTAPE 1 : EMAIL & PASS */}
          {step === "credentials" && (
            <div className="space-y-4 animate-in slide-in-from-left duration-300">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {t("Email", "Email")}
                </label>
                <Input
                  type="email"
                  {...registerLogin("email")}
                  placeholder="admin@example.com"
                  data-testid="input-email"
                />
                {loginErrors.email && (
                  <p className="text-sm text-destructive mt-1">{loginErrors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {t("Mot de passe", "Password")}
                </label>
                <Input
                  type="password"
                  {...registerLogin("password")}
                  placeholder="••••••••"
                  data-testid="input-password"
                />
                {loginErrors.password && (
                  <p className="text-sm text-destructive mt-1">{loginErrors.password.message}</p>
                )}
              </div>
            </div>
          )}

          {/* CHAMPS ÉTAPE 2 : OTP */}
          {step === "otp" && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div>
                <Input
                  type="text"
                  {...registerOtp("otp")}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono h-14"
                  placeholder="000000"
                  autoFocus
                  data-testid="input-otp"
                />
                {otpErrors.otp && (
                  <p className="text-sm text-destructive mt-1 text-center">{otpErrors.otp.message}</p>
                )}
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
                resetOtp();
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