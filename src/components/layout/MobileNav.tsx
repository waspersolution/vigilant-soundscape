
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import MobileNavMenu from "./MobileNavMenu";
import MobileNavProfile from "./MobileNavProfile";

const MobileNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      setOpen(false);
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleCloseSheet = () => {
    setOpen(false);
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
            onClick={handleCloseSheet}
          >
            VigilPro
          </Link>
          <nav className="mt-8 flex flex-col gap-6">
            <MobileNavMenu 
              onLinkClick={handleCloseSheet} 
              userRole={user?.role}
            />
            
            {isAuthenticated && (
              <MobileNavProfile 
                user={user} 
                onLogout={handleLogout} 
              />
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
};

export default MobileNav;
