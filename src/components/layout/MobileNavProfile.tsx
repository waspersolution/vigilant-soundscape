
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithRole } from "@/contexts/AuthContext";

interface MobileNavProfileProps {
  user: UserWithRole | null;
  onLogout: () => Promise<void>;
}

const MobileNavProfile = ({ user, onLogout }: MobileNavProfileProps) => {
  return (
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
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-2">Logout</span>
      </Button>
    </div>
  );
};

export default MobileNavProfile;
