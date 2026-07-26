import { useState, useEffect, useCallback } from "react";
import { Search, Shield, UserX, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { fetchUsers, updateUserRole, deleteUser } from "../services/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: "user" | "admin";
  updatedAt: string;
}

const UsersPage = () => {
  const { user: currentAdmin } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(page, LIMIT, search);
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    setActionLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setTotal((t) => t - 1);
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{total} total registered users</p>
        </div>
        <button onClick={load} className="btn btn-ghost btn-sm" disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            className="admin-input pl-9"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Seen</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <Search className="w-10 h-10" />
                      <p className="font-medium text-[#94a3b8]">No users found</p>
                      <p>Try a different search term</p>
                    </div>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=7c3aed&color=fff&size=32`}
                        alt={u.name}
                        className="avatar w-7 h-7"
                      />
                      <span className="font-medium text-[#e2e8f0]">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-[#94a3b8] text-xs font-mono">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-[#64748b] text-xs">
                    {new Date(u.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {/* Role toggle — disabled for self */}
                      {currentAdmin?._id !== u._id ? (
                        <button
                          onClick={() => handleRoleChange(u._id, u.role === "admin" ? "user" : "admin")}
                          disabled={actionLoading === u._id}
                          className={`btn btn-xs ${u.role === "admin" ? "btn-ghost" : "btn-ghost"}`}
                          title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                        >
                          {actionLoading === u._id ? (
                            <div className="spinner w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {u.role === "admin" ? "Demote" : "Make Admin"}
                        </button>
                      ) : (
                        <span className="text-xs text-[#475569] px-2">(you)</span>
                      )}

                      {currentAdmin?._id !== u._id && (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={actionLoading === u._id}
                          className="btn btn-xs btn-danger"
                        >
                          <UserX className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[rgba(139,92,246,0.08)] flex items-center justify-between">
            <p className="text-xs text-[#64748b]">
              Page {page} of {totalPages} · {total} users
            </p>
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
