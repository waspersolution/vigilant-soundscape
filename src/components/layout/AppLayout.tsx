
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  // No navigation for unauthenticated users
  if (!isAuthenticated) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <MobileNav />
      <main className="flex-1 pt-14 pb-16">
        <div className="container mx-auto px-4 py-4">{children}</div>
      </main>
    </div>
  );
}
