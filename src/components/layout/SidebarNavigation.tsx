
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bell, Map, Shield, Users, Radio, MessageCircle, Database, Settings } from "lucide-react";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { UserWithRole } from "@/contexts/auth";

interface SidebarNavigationProps {
  user: UserWithRole | null;
}

export default function SidebarNavigation({ user }: SidebarNavigationProps) {
  const location = useLocation();
  
  // Use useMemo to prevent unnecessary recalculations
  const navItems = useMemo(() => {
    console.log("SidebarNavigation - Rebuilding nav items for user role:", user?.role);
    
    // Basic navigation items for all users
    const baseItems = [
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
    if (user?.role === 'super_admin') {
      console.log("SidebarNavigation - Adding admin dashboard link for super_admin");
      return [
        ...baseItems,
        { href: "/super-admin", icon: Database, label: "Admin Dashboard" }
      ];
    }
    
    return baseItems;
  }, [user?.role]);
  
  return (
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
  );
}
