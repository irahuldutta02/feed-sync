import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header with Sidebar Toggle */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600">
              FeedSync
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Desktop Header */}
        {/* <header className="hidden md:flex items-center justify-end p-4 border-b bg-background">
          <ThemeToggle />
        </header> */}

        {/* Page Content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
