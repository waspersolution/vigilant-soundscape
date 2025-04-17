
import React from "react";
import { Link } from "react-router-dom";
import { UserWithRole } from "@/contexts/auth";

interface AppFooterProps {
  user: UserWithRole | null;
  isMobile?: boolean;
}

export default function AppFooter({ user, isMobile = false }: AppFooterProps) {
  return (
    <div className={`text-center p-2 text-xs text-muted-foreground ${isMobile ? 'bg-background/50 backdrop-blur-sm' : ''}`}>
      <Link 
        to="https://waspersolution.com/community" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-primary transition-colors"
      >
        Developed by Wasper Solutions
      </Link>
      {user && (
        <p className="mt-1">
          Logged in as {user.fullName}
          {user.role === 'super_admin' && ' (Admin)'}
        </p>
      )}
    </div>
  );
}
