import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const FooterCommon = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          <Link to="/" className="inline-block mb-4">
            <Logo />
          </Link>
          <p className="text-center text-muted-foreground">
            &copy; {currentYear} FeedSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCommon;
