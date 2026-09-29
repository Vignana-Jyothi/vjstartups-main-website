import { ReactNode, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SiteNav, SiteFooter } from "./site/SiteChrome";
import { ScrollReveal } from "./site/ScrollReveal";
import { SiteCursor } from "./site/SiteCursor";
import FloatingActionButton from "./FloatingActionButton";

interface LayoutProps {
  children?: ReactNode;
}

const RouteLoading = () => (
  <div className="route-loading" aria-busy="true" aria-label="Loading page">
    <span />
  </div>
);

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="overflow-x-clip">
        <Suspense fallback={<RouteLoading />}>{children ?? <Outlet />}</Suspense>
      </main>
      <SiteFooter />
      <FloatingActionButton />
      <ScrollReveal />
      <SiteCursor />
    </div>
  );
};

export default Layout;
