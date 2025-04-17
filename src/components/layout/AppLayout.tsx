
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";
import { Sidebar, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarNavigation from "./SidebarNavigation";
import AppFooter from "./AppFooter";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
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
            
            <SidebarNavigation user={user} />
            
            <SidebarFooter>
              <AppFooter user={user} />
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
          
          <footer className="absolute bottom-0 w-full md:hidden">
            <AppFooter user={user} isMobile={true} />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
