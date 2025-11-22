// src/components/admin/AdminLayout.tsx
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { adminMessagesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  const { data: messagesData } = useQuery({
    queryKey: ["admin-messages-for-badge"],
    queryFn: () => adminMessagesAPI.getAll(token!),
    enabled: !!token,
  });

  const unreadCount = messagesData?.filter((m: any) => !m.read).length || 0;

  const style = {
    "--sidebar-width": "16rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AdminSidebar unreadCount={unreadCount} />
        <div className="flex flex-col flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}