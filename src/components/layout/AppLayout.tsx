
import React, { useEffect } from "react";
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

  console.log("Current user in AppLayout:", user);

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

  // Basic navigation items for all users
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

  // Check for super_admin role and add the admin dashboard link
  console.log("Current user role:", user?.role);
  if (user?.role === 'super_admin') {
    console.log("Adding super admin link to navigation");
    // Create a new array instead of modifying the existing one
    const adminItem = { href: "/super-admin", icon: Database, label: "Admin Dashboard" };
    
    // Check if the admin item is already in the array to avoid duplicates
    const adminExists = navItems.some(item => item.href === "/super-admin");
    if (!adminExists) {
      navItems.push(adminItem);
    }
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
                      <SidebarMenuItem key={item.href}>
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
              <div className="text-center p-2 text-xs text-muted-foreground">
                <Link 
                  to="https://waspersolution.com/community" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors"
                >
                  Developed by Wasper Solutions
                </Link>
                {user && (
                  <p className="mt-1">
                    Logged in as {user.fullName}
                    {user.role === 'super_admin' && ' (Admin)'}
                  </p>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex-1 relative">
          <MobileNav />
          
          <main className="pb-16 md:pb-0 min-h-screen">
            <div className="container px-4 py-4 md:py-8">
              {children}
            </div>
          </main>
          
          <footer className="absolute bottom-0 w-full text-center p-2 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm md:hidden">
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
