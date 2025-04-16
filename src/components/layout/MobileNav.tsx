import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, Map, Shield, Settings, Menu, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";

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

  // Close mobile nav when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-primary" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="md:hidden" />
        <DialogContent className="fixed inset-y-0 left-0 p-0 border-r max-w-[75%] md:hidden rounded-none data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Guardian App</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
