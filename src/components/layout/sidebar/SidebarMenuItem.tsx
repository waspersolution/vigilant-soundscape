
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { 
  SidebarMenuItem as BaseSidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export const SidebarMenuItem = ({ href, icon: Icon, label, isActive }: SidebarMenuItemProps) => {
  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton asChild active={isActive}>
        <Link to={href} className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
};
