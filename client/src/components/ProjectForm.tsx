import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (project: any) => void;
  isSubmitting?: boolean;
  initialData?: any; // Pour l'édition
}

const allowedCategories = ["web", "mobile", "deeplearning", "datascience"];

export function ProjectForm({ onSubmit, isSubmitting, initialData }: ProjectFormProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      link: "",
      github: "",
    }
  });

  const [category, setCategory] = useState("web");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.titleFr || initialData.title || "", // Simplification requise si structure a changé
        description: initialData.descriptionFr || initialData.description || "",
        tags: initialData.categories ? initialData.categories.join(", ") : "web",
        link: initialData.demoUrl || "",
        github: initialData.githubUrl || ""
      });
      if (initialData.categories && initialData.categories[0]) setCategory(initialData.categories[0]);
      if (initialData.imageUrl) setImageUrl(initialData.imageUrl);
    }
  }, [initialData, reset]);

  const onSubmitForm = (data: ProjectFormData) => {
    // Reconstruire l'objet attendu par l'API
    const apiData = {
      titleFr: data.title,
      titleEn: data.title, // Fallback en attendant un vrai champ
      descriptionFr: data.description,
      descriptionEn: data.description, // Fallback en attendant un vrai champ
      categories: [category],
      imageUrl: imageUrl,
      githubUrl: data.github || "",
      demoUrl: data.link || "",
    };

    onSubmit(apiData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-heading font-semibold mb-4">
        {t("Ajouter un projet", "Add Project")}
      </h2>

      <form onSubmit={handleFormSubmit(onSubmitForm)} className="space-y-4">
        {/* Titres */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Titre", "Title")}
            </label>
            <Input
              {...register("title")}
              placeholder={t("Titre du projet", "Project title")}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Description", "Description")}
            </label>
            <Textarea
              {...register("description")}
              placeholder={t("Description du projet", "Project description")}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Catégorie et image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Catégorie", "Category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            >
              {allowedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Tags (séparés par des virgules)", "Tags (comma separated)")}
            </label>
            <Input
              {...register("tags")}
              placeholder="React, Node, MongoDB..."
            />
            {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
          </div>
        </div>

        {/* GitHub et Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("URL GitHub", "GitHub URL")}
            </label>
            <Input
              type="url"
              {...register("github")}
              placeholder="https://github.com/..."
            />
            {errors.github && <p className="text-sm text-destructive mt-1">{errors.github.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("URL de démo", "Demo URL")}
            </label>
            <Input
              type="url"
              {...register("link")}
              placeholder="https://example.com"
            />
            {errors.link && <p className="text-sm text-destructive mt-1">{errors.link.message}</p>}
          </div>
        </div>

        {/* Bouton submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
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
