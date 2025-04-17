
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  RadioTower, 
  Settings, 
  Database,
  AlertTriangle, 
  MapPin, 
  BadgeCheck, 
  Users,
  MessageCircle
} from "lucide-react";
import MobileNavLink from "./MobileNavLink";
import { UserWithRole } from "@/contexts/AuthContext";

interface MobileNavMenuProps {
  onLinkClick: () => void;
  userRole?: string;
}

const MobileNavMenu = ({ onLinkClick, userRole }: MobileNavMenuProps) => {
  const { pathname } = useLocation();
  
  // Base navigation items for all users
  const baseNavItems = [
    {
      href: "/map",
      icon: <MapPin className="h-5 w-5" />,
      title: "Map",
    },
    {
      href: "/patrol",
      icon: <BadgeCheck className="h-5 w-5" />,
      title: "Patrol",
    },
    {
      href: "/alerts",
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Alerts",
    },
    {
      href: "/community",
      icon: <Users className="h-5 w-5" />,
      title: "Community",
    },
    {
      href: "/communication",
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Communication",
    },
  ];
  
  // Add admin dashboard link for super_admin users
  const navItems = userRole === 'super_admin'
    ? [
        ...baseNavItems,
        {
          href: "/super-admin",
          icon: <Database className="h-5 w-5" />,
          title: "Admin",
        }
      ]
    : baseNavItems;

  return (
    <div className="flex flex-col gap-3">
      {navItems.map((item, index) => (
        <MobileNavLink
          key={index}
          href={item.href}
          icon={item.icon}
          title={item.title}
          isActive={pathname === item.href}
          onClick={onLinkClick}
        />
      ))}
      
      <MobileNavLink
        href="/voice"
        icon={<RadioTower className="h-5 w-5" />}
        title="Voice"
        isActive={pathname === "/voice"}
        onClick={onLinkClick}
      />
      
      <MobileNavLink
        href="/settings"
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        isActive={pathname === "/settings"}
        onClick={onLinkClick}
      />
    </div>
  );
};

export default MobileNavMenu;
