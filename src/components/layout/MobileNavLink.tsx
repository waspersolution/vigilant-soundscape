
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileNavLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick?: () => void;
}

const MobileNavLink = ({ href, icon, title, isActive, onClick }: MobileNavLinkProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start px-2",
        isActive && "bg-muted"
      )}
      asChild
    >
      <Link to={href} onClick={onClick}>
        {icon}
        <span className="ml-2">{title}</span>
      </Link>
    </Button>
  );
};

export default MobileNavLink;
