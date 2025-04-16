
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, Map, Shield, Settings, Menu, Users, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon: Icon, label, active, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 p-3 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
};

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Close mobile nav when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-20 flex items-center justify-between px-4 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>
        
        <Link to="/" className="text-xl font-semibold text-primary">
          VigilPro
        </Link>
        
        <Link to="/settings" className="md:hidden">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="md:hidden" />
        <DialogContent className="fixed inset-y-0 left-0 p-0 border-r max-w-[75%] md:hidden rounded-none data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">VigilPro</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {user && (
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 px-4 py-6 overflow-auto">
              <nav className="space-y-2">
                <NavItem
                  href="/"
                  icon={Home}
                  label="Home"
                  active={location.pathname === "/"}
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  href="/alerts"
                  icon={Bell}
                  label="Alerts"
                  active={location.pathname === "/alerts"}
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  href="/map"
                  icon={Map}
                  label="Map"
                  active={location.pathname === "/map"}
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  href="/patrol"
                  icon={Shield}
                  label="Patrol"
                  active={location.pathname === "/patrol"}
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  href="/community"
                  icon={Users}
                  label="Communities"
                  active={location.pathname === "/community"}
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  href="/settings"
                  icon={Settings}
                  label="Settings"
                  active={location.pathname === "/settings"}
                  onClick={() => setIsOpen(false)}
                />
              </nav>
            </div>
            
            <div className="px-4 py-4 border-t">
              <p className="text-xs text-muted-foreground">VigilPro v1.0</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
