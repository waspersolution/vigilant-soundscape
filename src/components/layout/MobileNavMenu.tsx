
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  RadioTower, 
  Settings, 
  Database,
  AlertTriangle, 
  MapPin, 
  BadgeCheck, 
  Users,
  MessageCircle,
  Home
} from "lucide-react";
import MobileNavLink from "./MobileNavLink";

interface MobileNavMenuProps {
  onLinkClick: () => void;
  userRole?: string;
}

const MobileNavMenu = ({ onLinkClick, userRole }: MobileNavMenuProps) => {
  const { pathname } = useLocation();
  
  // Use useMemo to prevent unnecessary recalculations
  const navItems = useMemo(() => {
    console.log("MobileNavMenu - Building menu items for user role:", userRole);
    
    // Base navigation items for all users
    const baseItems = [
      {
        href: "/home",
        icon: <Home className="h-5 w-5" />,
        title: "Home",
      },
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
      {
        href: "/voice",
        icon: <RadioTower className="h-5 w-5" />,
        title: "Voice",
      },
      {
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
        title: "Settings",
      },
    ];
    
    // Add admin dashboard link for super_admin users
    if (userRole === 'super_admin') {
      console.log("MobileNavMenu - Adding admin link for super_admin");
      return [
        ...baseItems,
        {
          href: "/super-admin",
          icon: <Database className="h-5 w-5" />,
          title: "Admin Dashboard",
        }
      ];
    }
    
    return baseItems;
  }, [userRole]);

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
    </div>
  );
};

export default MobileNavMenu;
