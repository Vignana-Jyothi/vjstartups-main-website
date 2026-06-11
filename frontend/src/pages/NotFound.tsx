import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageHero } from "@/components/design-system/PageHero";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Routing"
        title="404"
        description="Oops! Page not found."
        primaryAction={{ label: "Return to Home", to: "/" }}
      />
    </div>
  );
};

export default NotFound;
