// src/components/admin/AdminSidebar.tsx
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  labelFr: string;
  labelEn: string;
  href: string;
  badge?: number;
}

export function AdminSidebar({ unreadCount }: { unreadCount: number }) {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  const menuItems: MenuItem[] = [
    // ✅ CORRIGÉ : "/admin" → "/admin/dashboard"
    { icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", href: "/admin/dashboard" },
    { icon: FolderKanban, labelFr: "Projets", labelEn: "Projects", href: "/admin/projects" },
    { icon: FileText, labelFr: "Blog", labelEn: "Blog", href: "/admin/blog" },
    { icon: MessageSquare, labelFr: "Messages", labelEn: "Messages", href: "/admin/messages", badge: unreadCount },
    { icon: Mail, labelFr: "Newsletter", labelEn: "Newsletter", href: "/admin/newsletter" },
    { icon: Settings, labelFr: "Paramètres", labelEn: "Settings", href: "/admin/settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="font-heading font-bold text-lg">
          {t("Administration", "Administration")}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                onClick={() => setLocation(item.href)}
                className={location === item.href ? "bg-sidebar-accent" : ""}
              >
                <item.icon className="h-4 w-4" />
                <span>{t(item.labelFr, item.labelEn)}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("Déconnexion", "Logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}