import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, FileText, Link as LinkIcon, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileData } from "@/types";

export function SettingsPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ✅ CORRECTION 1 : Appel API sécurisé
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => profileAPI.get(),
  });

  // ✅ CORRECTION 2 : Typage explicite de l'état initial
  const [formData, setFormData] = useState<ProfileData>({} as ProfileData);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => profileAPI.update(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: t("Succès", "Success"), description: t("Profil mis à jour", "Profile updated") });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // ✅ CORRECTION 3 : Typage de la clé pour éviter les erreurs TS
  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{t("Mon Profil & CV", "My Profile & CV")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INFO PERSO */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5"/> Info Personnelles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Nom complet" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} />
                <Input placeholder="Email contact" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Titre (FR)" value={formData.titleFr || ''} onChange={e => handleChange('titleFr', e.target.value)} />
                <Input placeholder="Title (EN)" value={formData.titleEn || ''} onChange={e => handleChange('titleEn', e.target.value)} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Téléphone" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                <Input placeholder="Localisation" value={formData.location || ''} onChange={e => handleChange('location', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* BIO & CV */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Bio & CV</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Bio (Français)" value={formData.bioFr || ''} onChange={e => handleChange('bioFr', e.target.value)} />
            <Textarea placeholder="Bio (English)" value={formData.bioEn || ''} onChange={e => handleChange('bioEn', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="URL Photo de profil" value={formData.headshotUrl || ''} onChange={e => handleChange('headshotUrl', e.target.value)} />
                <Input placeholder="URL du CV (PDF)" value={formData.cvUrl || ''} onChange={e => handleChange('cvUrl', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* LIENS SOCIAUX */}
        <Card>
           <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Réseaux Sociaux</CardTitle></CardHeader>
           <CardContent className="grid grid-cols-3 gap-4">
             <Input placeholder="GitHub URL" value={formData.githubUrl || ''} onChange={e => handleChange('githubUrl', e.target.value)} />
             <Input placeholder="LinkedIn URL" value={formData.linkedinUrl || ''} onChange={e => handleChange('linkedinUrl', e.target.value)} />
             <Input placeholder="Twitter URL" value={formData.twitterUrl || ''} onChange={e => handleChange('twitterUrl', e.target.value)} />
           </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={updateMutation.isPending} className="w-full">
            <Save className="w-4 h-4 mr-2" /> {t("Enregistrer les modifications", "Save Changes")}
        </Button>
      </form>
    </div>
  );
}