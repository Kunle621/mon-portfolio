// src/components/admin/admin-pages/SettingsPage.tsx
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";

export function SettingsPage() {
  const { t } = useLanguage();
  const { admin, token } = useAuth();
  const { toast } = useToast();

  // États pour les formulaires
  const [email, setEmail] = useState(admin?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Mise à jour de l'email
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsEmailSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      // Context doesn't expose an updateAuth function; update local state instead.
      // If your AuthContext provides a method to update the admin object, replace this with that call.
      setEmail(data.email);

      toast({
        title: t("Succès", "Success"),
        description: t("Email mis à jour avec succès.", "Email updated successfully."),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: error.message || t("Une erreur est survenue.", "An error occurred."),
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Changement de mot de passe
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || newPassword !== confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast({
          variant: "destructive",
          title: t("Erreur", "Error"),
          description: t("Les mots de passe ne correspondent pas.", "Passwords do not match."),
        });
      }
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: t("Succès", "Success"),
        description: t("Mot de passe mis à jour avec succès.", "Password updated successfully."),
      });

      // Réinitialiser les champs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: error.message || t("Une erreur est survenue.", "An error occurred."),
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <>
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">{t("Paramètres", "Settings")}</h1>
      </header>
      <main className="p-6 space-y-6">
        {/* Section Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("Changer d'email", "Change Email")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t("Nouvel email", "New Email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isEmailSubmitting}>
                {isEmailSubmitting
                  ? t("Mise à jour...", "Updating...")
                  : t("Mettre à jour l'email", "Update Email")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section Mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t("Changer le mot de passe", "Change Password")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  {t("Mot de passe actuel", "Current Password")}
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  {t("Nouveau mot de passe", "New Password")}
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  {t("Confirmer le mot de passe", "Confirm Password")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isPasswordSubmitting}>
                {isPasswordSubmitting
                  ? t("Mise à jour...", "Updating...")
                  : t("Mettre à jour le mot de passe", "Update Password")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}