import { Menu, ExternalLink } from "lucide-react";
import { useLocation } from "react-router-dom";

interface TopbarProps {
  onMenuToggle: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of VJ Startups platform activity" },
  "/users": { title: "Users", subtitle: "Manage registered users and roles" },
  "/startups": { title: "Startups", subtitle: "Review and manage all startup registrations" },
  "/ideas": { title: "Ideas", subtitle: "Browse and moderate submitted ideas" },
  "/problems": { title: "Problems", subtitle: "Review problem submissions" },
};

const AdminTopbar = ({ onMenuToggle }: TopbarProps) => {
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || { title: "Admin Panel", subtitle: "" };

  return (
    <header className="admin-topbar gap-4">
      <button
        onClick={onMenuToggle}
        className="p-1.5 rounded-lg text-[#64748b] hover:text-[#f1f5f9] hover:bg-white/5 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-[#f1f5f9] leading-none">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <p className="text-xs text-[#64748b] mt-0.5 leading-none hidden sm:block">{pageInfo.subtitle}</p>
        )}
      </div>

      {/* Quick link to main site */}
      <a
        href="https://hub.vjstartup.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#a78bfa] transition-colors px-3 py-1.5 rounded-lg border border-[rgba(139,92,246,0.12)] hover:border-[rgba(139,92,246,0.3)]"
      >
        <ExternalLink className="w-3 h-3" />
        <span className="hidden sm:inline">Main Site</span>
      </a>
    </header>
  );
};

export default AdminTopbar;
