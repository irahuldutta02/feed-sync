import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../ui-custom/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="flex items-center space-x-8">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
