
import * as React from "react";
import { cva } from "class-variance-authority";
import { Users, Menu } from "lucide-react";
import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

// Create a context to manage sidebar state
const SidebarContext = React.createContext<{
  collapsed: boolean;
  toggleCollapse: () => void;
} | undefined>(undefined);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapse = React.useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, toggleCollapse }),
    [collapsed, toggleCollapse]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Sidebar trigger component
export function SidebarTrigger() {
  const { toggleCollapse } = useSidebar();

  return (
    <button
      onClick={toggleCollapse}
      className="fixed left-4 top-4 z-50 md:hidden rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 w-10 flex items-center justify-center"
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

// Sidebar
const sidebarVariants = cva(
  "flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
  {
    variants: {
      collapsed: {
        true: "w-[56px] md:w-[70px]",
        false: "w-[250px]",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <aside className={sidebarVariants({ collapsed })}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      {children ? (
        children
      ) : (
        <>
          {!collapsed ? (
            <Link to="/" className="text-xl font-semibold">
              GuardianApp
            </Link>
          ) : (
            <Link to="/" className="text-xl font-semibold">
              GA
            </Link>
          )}
        </>
      )}
    </header>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-auto py-2">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <footer className="border-t p-4">{children}</footer>;
}

export function SidebarGroup({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();

  if (collapsed) return null;

  return (
    <div
      className={cn("px-4 py-2 text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("grid gap-1 px-2", className)} role="menu" {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("", className)} role="menuitem" {...props}>
      {children}
    </li>
  );
}

const buttonVariants = cva(
  "flex items-center gap-2 w-full rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      active: {
        true: "bg-accent/50 text-accent-foreground",
        false: "transparent",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, active, asChild = false, children, ...props }, ref) => {
  const { collapsed } = useSidebar();
  const Comp = asChild ? React.Fragment : "button";

  return (
    <Comp {...(asChild ? {} : { className: buttonVariants({ active, className }), ref, ...props })}>
      {asChild ? (
        children
      ) : (
        <>
          {children}
        </>
      )}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// Add a new community menu item component
export function SidebarCommunityMenuItem() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const active = location.pathname === "/community";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild active={active}>
        <Link to="/community" className={buttonVariants({ active, className: "" })}>
          <Users />
          {!collapsed && <span>Communities</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
