
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bell, Home, Map, Shield, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // No navigation for unauthenticated users
  if (!isAuthenticated) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Navigation items for both sidebar and mobile nav
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/alerts", icon: Bell, label: "Alerts" },
    { href: "/map", icon: Map, label: "Map" },
    { href: "/patrol", icon: Shield, label: "Patrol" },
    { href: "/community", icon: Users, label: "Communities" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar>
            <SidebarHeader>
              <Link to="/" className="text-xl font-semibold">
                Guardian App
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild active={location.pathname === item.href}>
                          <Link to={item.href} className="flex items-center gap-2">
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          {/* Mobile Nav - Visible only on mobile */}
          <MobileNav />
          
          {/* Main Content */}
          <main className="flex-1 pt-14 pb-16 min-h-screen">
            <div className="container mx-auto px-4 py-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
