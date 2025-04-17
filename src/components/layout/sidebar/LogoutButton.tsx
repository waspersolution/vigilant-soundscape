
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Logout will automatically redirect to auth page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className="text-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
