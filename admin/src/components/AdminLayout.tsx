import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div
        className="admin-main"
        style={{ marginLeft: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
      >
        <AdminTopbar onMenuToggle={() => setCollapsed((v) => !v)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
