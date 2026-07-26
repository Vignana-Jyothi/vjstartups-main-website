import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Rocket, Lightbulb,
  AlertCircle, ChevronLeft, ChevronRight, LogOut, Shield
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_LINKS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/startups", icon: Rocket, label: "Startups" },
  { to: "/ideas", icon: Lightbulb, label: "Ideas" },
  { to: "/problems", icon: AlertCircle, label: "Problems" },
];

const AdminSidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(139,92,246,0.12)]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-none">VJ Admin</p>
            <p className="text-xs text-[#64748b] mt-0.5 leading-none">Control Panel</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 space-y-0.5">
        {NAV_LINKS.map(({ to, icon: Icon, label }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="icon flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: user + collapse */}
      <div className="border-t border-[rgba(139,92,246,0.12)] p-3 space-y-2">
        {/* User */}
        {user && (
          <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${collapsed ? "justify-center" : ""}`}>
            <img src={user.picture} alt={user.name} className="avatar flex-shrink-0" />
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-medium text-[#f1f5f9] truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-[#64748b] truncate leading-tight">{user.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="sidebar-link w-full text-left hover:text-red-400 hover:bg-red-950/30"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="icon flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[#475569] hover:text-[#94a3b8] hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
