import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { adminMessagesAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, CheckCircle, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MessagesPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"], // Clé unique partagée
    queryFn: () => adminMessagesAPI.getAll(token!),
    enabled: !!token,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => adminMessagesAPI.markRead(id, token!),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); // Met à jour le compteur du dashboard
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminMessagesAPI.delete(id, token!),
    onSuccess: () => {
      toast({ title: t("Message supprimé", "Message deleted") });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          {t("Boîte de réception", "Inbox")}
        </h1>
      </header>
      
      <main className="space-y-4">
        {isLoading ? (
          <p>{t("Chargement...", "Loading...")}</p>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: any) => (
            <Card key={msg._id} className={`p-4 transition-all ${!msg.read ? "border-l-4 border-l-primary bg-primary/5 shadow-sm" : "opacity-80"}`}>
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-3">
                <div>
                  <div className="font-bold text-lg flex items-center gap-2">
                    {msg.name}
                    {!msg.read && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="w-3 h-3" /> {msg.email}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded self-start">
                   <Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-background p-4 rounded-md border text-sm whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>

              <div className="flex gap-2 justify-end mt-4">
                {!msg.read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="hover:bg-primary hover:text-white"
                    onClick={() => markReadMutation.mutate(msg._id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t("Marquer comme lu", "Mark as read")}
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => { if(confirm(t("Supprimer définitivement ?", "Delete permanently?"))) deleteMutation.mutate(msg._id); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("Supprimer", "Delete")}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{t("Aucun message", "No messages")}</p>
          </div>
        )}
      </main>
    </div>
  );
}