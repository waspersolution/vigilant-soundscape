
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Bell, 
  Map, 
  Shield, 
  Users, 
  Radio, 
  MessageCircle, 
  Database, 
  Settings
} from "lucide-react";
import { UserWithRole } from "@/contexts/auth";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface NavigationItemsProps {
  user: UserWithRole | null;
}

export const NavigationItems = ({ user }: NavigationItemsProps) => {
  const location = useLocation();
  
  // Use useMemo to prevent unnecessary recalculations
  const navItems = useMemo(() => {
    console.log("NavigationItems - Rebuilding nav items for user role:", user?.role);
    
    // Basic navigation items for all users
    const baseItems = [
      { href: "/home", icon: Home, label: "Home" },
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
      console.log("NavigationItems - Adding admin dashboard link for super_admin");
      return [
        ...baseItems,
        { href: "/super-admin", icon: Database, label: "Admin Dashboard" }
      ];
    }
    
    return baseItems;
  }, [user?.role]);

  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem 
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.href}
        />
      ))}
    </>
  );
};
