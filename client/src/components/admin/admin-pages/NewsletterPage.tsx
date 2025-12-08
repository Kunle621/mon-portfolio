import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { newsletterAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NewsletterPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["newsletter"],
    queryFn: () => newsletterAPI.getAll(token!),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsletterAPI.delete(id, token!),
    onSuccess: () => {
      toast({ title: t("Abonné supprimé", "Subscriber deleted") });
      queryClient.invalidateQueries({ queryKey: ["newsletter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <header className="border-b pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" />
          {t("Newsletter", "Newsletter")}
        </h1>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
          <Users className="h-4 w-4" />
          <span className="font-bold text-lg">{subscribers?.length || 0}</span>
          <span className="text-sm opacity-80">{t("abonnés", "subscribers")}</span>
        </div>
      </header>

      <main>
        {isLoading ? (
          <p>{t("Chargement...", "Loading...")}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {subscribers?.map((sub: any) => (
              <Card key={sub._id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 min-w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-medium truncate" title={sub.email}>{sub.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(sub.subscribedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => { if(confirm(t("Supprimer cet abonné ?", "Remove this subscriber?"))) deleteMutation.mutate(sub._id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
            {subscribers?.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {t("Aucun abonné pour le moment", "No subscribers yet")}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}