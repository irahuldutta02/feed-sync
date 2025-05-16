import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  lastUpdated,
  children,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {title}
            </CardTitle>
            <CardDescription>Last updated: {lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
            {children}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPageLayout;
