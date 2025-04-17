
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth";
import MobileNavMenu from "./MobileNavMenu";
import MobileNavProfile from "./MobileNavProfile";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("MobileNav - Initiating logout");
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Error logging out", error);
      setOpen(false);
    }
  };

  const handleCloseSheet = () => {
    setOpen(false);
  };

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 md:hidden relative">
      <Link
        to="/"
        className="flex items-center gap-1 font-semibold"
      >
        VigilPro
      </Link>
      
      {isAuthenticated && (
        <div className="absolute top-2 right-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <Link to="/settings">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}

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
    </div>
  );
};

export default MobileNav;
