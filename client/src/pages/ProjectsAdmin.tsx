import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { ProjectForm } from "@/components/ProjectForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { projectsAPI } from "@/lib/api";

export default function ProjectsAdmin() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const handleCreateProject = async (projectData: any) => {
    setIsSubmitting(true);

    try {
      // Récupère le token depuis le contexte d'authentification
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token manquant");
      }

      await projectsAPI.create(projectData, token);
      
      toast({
        title: t("Projet créé", "Project created"),
        description: t("Le projet a été ajouté avec succès", "Project added successfully"),
      });

      // Réinitialise le formulaire
      // Tu peux aussi rediriger vers la liste des projets
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: t("Échec de création du projet", "Failed to create project"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          {t("Gestion des projets", "Projects Management")}
        </h1>
        <p className="text-muted-foreground">
          {t("Créez et gérez vos projets", "Create and manage your projects")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">
              {t("Projets existants", "Existing Projects")}
            </h2>
            <p className="text-muted-foreground">
              {t("Liste de vos projets (à implémenter)", "List of your projects (to implement)")}
            </p>
          </Card>
        </div>

        <div>
          <ProjectForm onSubmit={handleCreateProject} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}