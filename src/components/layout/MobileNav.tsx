import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, RadioTower, Settings, Bell, User, LogOut, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  title: string;
}

const navItems: NavItem[] = [
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

const MobileNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px]">
      <Link
        to="/"
        className="hidden gap-1 font-semibold uppercase lg:inline-flex"
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
      <div className="flex w-full flex-1 items-center gap-1 lg:gap-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={pathname === item.href ? "default" : "ghost"}
            className={pathname === item.href ? "" : "text-muted-foreground"}
            asChild
          >
            <Link to={item.href}>
              {item.icon}
              <span className="ml-2 hidden lg:inline-flex">{item.title}</span>
            </Link>
          </Button>
        ))}
        <Button
          variant={pathname === "/voice" ? "default" : "ghost"}
          className={pathname === "/voice" ? "" : "text-muted-foreground"}
          asChild
        >
          <Link to="/voice">
            <RadioTower className="h-5 w-5" />
            <span className="ml-2 hidden lg:inline-flex">Voice</span>
          </Link>
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <span className="hidden">Open mobile navigation</span>
        </SheetTrigger>
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
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="justify-start px-2" asChild>
                <Link to="/settings" onClick={() => setOpen(false)}>
                  <Settings className="h-5 w-5" />
                  <span className="ml-2">Settings</span>
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start px-2">
                <Bell className="h-5 w-5" />
                <span className="ml-2">Notifications</span>
              </Button>
              {isAuthenticated && user ? (
                <>
                  <Button variant="ghost" className="justify-start px-2" asChild>
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <User className="h-5 w-5" />
                      <span className="ml-2">Profile</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2">Logout</span>
                  </Button>
                </>
              ) : null}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      {isAuthenticated && user ? (
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 lg:hidden" />
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>{user.fullName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
import {
  MapPin,
  BadgeCheck,
  AlertTriangle,
  Users,
} from "lucide-react";
