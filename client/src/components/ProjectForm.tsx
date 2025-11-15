import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (project: any) => void;
  isSubmitting?: boolean;
}

export function ProjectForm({ onSubmit, isSubmitting }: ProjectFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
    category: "web",
    imageUrl: "",
    githubUrl: "",
    demoUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleFr || !formData.titleEn) {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: t("Le titre est requis", "Title is required"),
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-heading font-semibold mb-4">
        {t("Ajouter un projet", "Add Project")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Titre (FR)", "Title (FR)")}
            </label>
            <Input
              value={formData.titleFr}
              onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
              required
              placeholder={t("Titre en français", "Title in French")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Titre (EN)", "Title (EN)")}
            </label>
            <Input
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              required
              placeholder={t("Titre en anglais", "Title in English")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Description (FR)", "Description (FR)")}
            </label>
            <Textarea
              value={formData.descriptionFr}
              onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
              placeholder={t("Description en français", "Description in French")}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Description (EN)", "Description (EN)")}
            </label>
            <Textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              placeholder={t("Description en anglais", "Description in English")}
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Catégorie", "Category")}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            >
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="api">API</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("URL de l'image", "Image URL")}
            </label>
            <Input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("URL GitHub", "GitHub URL")}
            </label>
            <Input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("URL de démo", "Demo URL")}
            </label>
            <Input
              type="url"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            t("Envoi...", "Sending...")
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {t("Créer le projet", "Create Project")}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}