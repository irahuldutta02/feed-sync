import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import { Logo } from "../ui-custom/Logo";
import DashboardSidebar from "./DashboardSidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
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
              <SheetContent
                side="left"
                className="p-0 bg-background text-foreground"
              >
                <DashboardSidebar mobile />
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
        </header>
        {/* Page Content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
