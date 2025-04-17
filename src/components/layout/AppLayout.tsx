
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
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

  // Force theme check on layout mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const theme = config.theme || 'system';
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      } catch (error) {
        console.error("Error applying theme from localStorage:", error);
      }
    }
  }, []);

  // If not authenticated, just return the children
  if (!isAuthenticated) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/5">
        {/* Desktop Sidebar - always render but hide on mobile */}
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
          {/* Mobile Navigation - always render on mobile */}
          <MobileNav />
          
          <main className="pb-16 md:pb-0 min-h-screen">
            <div className="container px-4 py-4 md:py-8">
              {children}
            </div>
          </main>
          
          {/* Mobile Footer */}
          <footer className="fixed bottom-0 w-full md:hidden z-10">
            <AppFooter user={user} isMobile={true} />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
