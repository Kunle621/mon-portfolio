// src/components/admin/admin-pages/MessagesPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { adminMessagesAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesPage() {
  const { t } = useLanguage();
  const { token } = useAuth();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["admin-all-messages"],
    queryFn: () => adminMessagesAPI.getAll(token!),
    enabled: !!token,
  });

  return (
    <>
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          {t("Messages", "Messages")}
        </h1>
      </header>
      <main className="p-6">
        {isLoading ? (
          <p>{t("Chargement...", "Loading...")}</p>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="p-4">
                <div className="font-bold">
                  {`${msg.name} <${msg.email}>`}
                </div>
                <div className="mt-2 whitespace-pre-wrap">{msg.message}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>{t("Aucun message", "No messages")}</p>
        )}
      </main>
    </>
  );
}