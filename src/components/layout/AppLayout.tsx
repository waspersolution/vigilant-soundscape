
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
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
      <div className="flex min-h-screen bg-secondary/5">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar>
            <SidebarHeader>
              <Link to="/" className="text-xl font-semibold text-primary">
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
            <SidebarFooter>
              <div className="px-3 py-2">
                <p className="text-xs text-muted-foreground">Guardian App v1.0</p>
              </div>
            </SidebarFooter>
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
          
          {/* Mobile Footer Menu - Visible only on mobile */}
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-10">
            <div className="flex items-center justify-around">
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.href} 
                  className={`flex flex-col items-center p-3 ${location.pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
