import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../ui-custom/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();

  console.log("User:", user);
  console.log("Is Authenticated:", isAuthenticated);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Blog
            </Link>
            <Link to="/login">
              <Button
                variant="ghost"
                className="hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-brand-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/features"
              className="block px-3 py-2 text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-foreground/80 hover:text-brand-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 text-brand-600 hover:text-brand-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
