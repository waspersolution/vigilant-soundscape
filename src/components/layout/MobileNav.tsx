
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, RadioTower, Settings, Bell, User, LogOut, MessageCircle, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [navItems, setNavItems] = useState([
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
  ]);

  // Update navItems when user changes
  useEffect(() => {
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
    
    const updatedNavItems = [...baseNavItems];
    
    // Add admin link if user is super_admin
    if (user?.role === 'super_admin') {
      console.log("Adding admin link to mobile nav");
      const adminExists = updatedNavItems.some(item => item.href === "/super-admin");
      
      if (!adminExists) {
        updatedNavItems.push({
          href: "/super-admin",
          icon: <Database className="h-5 w-5" />,
          title: "Admin",
        });
      }
    }
    
    setNavItems(updatedNavItems);
  }, [user]);

  console.log("MobileNav rendering with user role:", user?.role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      setOpen(false);
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 md:hidden">
      <Link
        to="/"
        className="flex items-center gap-1 font-semibold"
      >
        VigilPro
      </Link>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-60 sm:max-w-xs">
          <Link
            to="/"
            className="flex items-center gap-1 font-semibold uppercase"
            onClick={() => setOpen(false)}
          >
            VigilPro
          </Link>
          <nav className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "justify-start px-2",
                    pathname === item.href && "bg-muted"
                  )}
                  asChild
                >
                  <Link to={item.href} onClick={() => setOpen(false)}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className={cn(
                  "justify-start px-2",
                  pathname === "/voice" && "bg-muted"
                )}
                asChild
              >
                <Link to="/voice" onClick={() => setOpen(false)}>
                  <RadioTower className="h-5 w-5" />
                  <span className="ml-2">Voice</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start px-2",
                  pathname === "/settings" && "bg-muted"
                )}
                asChild
              >
                <Link to="/settings" onClick={() => setOpen(false)}>
                  <Settings className="h-5 w-5" />
                  <span className="ml-2">Settings</span>
                </Link>
              </Button>
            </div>
            
            {isAuthenticated && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.role === 'super_admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="justify-start px-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
    </div>
  );
}

import { AlertTriangle, MapPin, BadgeCheck, Users } from "lucide-react";

export default MobileNav;
