
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bell, Home, Map, Shield, Settings, Users, Radio, MessageCircle, Database } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        if (config.theme && config.theme !== 'system') {
          document.documentElement.classList.toggle('dark', config.theme === 'dark');
        }
      }
    } catch (error) {
      console.error("Error loading dashboard configuration:", error);
    }
  }, []);

  if (!isAuthenticated) {
    return <main className="min-h-screen">{children}</main>;
  }

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/alerts", icon: Bell, label: "Alerts" },
    { href: "/map", icon: Map, label: "Map" },
    { href: "/patrol", icon: Shield, label: "Patrol" },
    { href: "/community", icon: Users, label: "Communities" },
    { href: "/communication", icon: MessageCircle, label: "Communication" },
    { href: "/voice", icon: Radio, label: "Voice" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  // Add Super Admin Dashboard link for super_admin users
  if (user?.role === 'super_admin') {
    navItems.push({ href: "/super-admin", icon: Database, label: "Admin Dashboard" });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/5">
        <div className="hidden md:block">
          <Sidebar>
            <SidebarHeader>
              <Link to="/" className="text-xl font-semibold text-primary">
                VigilPro
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
              <div className="px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">
                  VigilPro v1.0 by{' '}
                  <Link 
                    to="https://waspersolution.com/community" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors underline"
                  >
                    Wasper Solutions
                  </Link>
                </p>
                {user && (
                  <p className="text-xs font-medium mt-1">
                    Logged in as {user.fullName}
                    {user.role === 'super_admin' && ' (Super Admin)'}
                  </p>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex-1 relative">
          <MobileNav />
          
          <main className="flex-1 pt-14 pb-16 min-h-screen">
            <div className="container mx-auto px-4 py-4">
              {children}
            </div>
          </main>
          
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

          <footer className="absolute bottom-0 w-full text-center p-2 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm">
            <Link 
              to="https://waspersolution.com/community" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors"
            >
              Developed by Wasper Solutions
            </Link>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
