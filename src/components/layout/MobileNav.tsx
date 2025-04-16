
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, Map, Shield, Settings, Menu, Users, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

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
        <Menu className="h-6 w-6" />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 md:hidden"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-200 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-background shadow-lg">
              <div className="flex flex-col h-full">
                <div className="px-4 py-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Guardian App</h2>
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
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
