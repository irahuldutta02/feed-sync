import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart2, Edit3, Home, LogOut, Settings, Star } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../ui-custom/Logo";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 pl-3",
          isActive
            ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="w-64 border-r border-r-border h-screen sticky top-0 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <NavItem
            to="/dashboard"
            icon={<Home size={18} />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />
          <NavItem
            to="/dashboard/create-campaign"
            icon={<Edit3 size={18} />}
            label="Create Campaign"
            isActive={pathname === "/dashboard/create-campaign"}
          />
          <NavItem
            to="/dashboard/campaigns"
            icon={<BarChart2 size={18} />}
            label="My Campaigns"
            isActive={pathname === "/dashboard/campaigns"}
          />
          <NavItem
            to="/dashboard/feedback"
            icon={<Star size={18} />}
            label="Feedback"
            isActive={pathname === "/dashboard/feedback"}
          />
          <NavItem
            to="/dashboard/settings"
            icon={<Settings size={18} />}
            label="Settings"
            isActive={pathname === "/dashboard/settings"}
          />
        </nav>

        <div className="p-4 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 pl-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
