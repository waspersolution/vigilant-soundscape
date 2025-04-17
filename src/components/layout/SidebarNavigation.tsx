
import React from "react";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu
} from "@/components/ui/sidebar";
import { UserWithRole } from "@/contexts/auth";
import { NavigationItems } from "./sidebar/NavigationItems";
import { LogoutButton } from "./sidebar/LogoutButton";

interface SidebarNavigationProps {
  user: UserWithRole | null;
}

export default function SidebarNavigation({ user }: SidebarNavigationProps) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItems user={user} />
            <LogoutButton />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
