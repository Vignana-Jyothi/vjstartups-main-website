import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, Rocket } from "lucide-react";
import { fetchStartups, updateStartupStage } from "../services/adminApi";

interface Startup {
  _id: string;
  startupName: string;
  tagline: string;
  stage: number;
  fundingStatus: string;
  upvotes: number;
  views: number;
  createdAt: string;
  createdBy?: { name: string; email: string };
}

const STAGE_LABELS: Record<number, string> = {
  1: "Idea", 2: "Research", 3: "Prototype", 4: "MVP",
  5: "Beta", 6: "Launch", 7: "Growth", 8: "Scale", 9: "Mature"
};

const FUNDING_BADGE: Record<string, string> = {
  "bootstrapped": "badge-green",
  "seeking-funding": "badge-yellow",
  "pre-seed": "badge-blue",
  "seed": "badge-blue",
  "series-a": "badge-admin",
  "later-stage": "badge-admin",
};

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const LIMIT = 20;
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStartups(page, LIMIT, search);
      setStartups(data.startups);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      console.error("Failed to load startups");
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

  const handleStageChange = async (id: string, stage: number) => {
    setActionLoading(id);
    try {
      await updateStartupStage(id, stage);
      setStartups((prev) => prev.map((s) => s._id === id ? { ...s, stage } : s));
    } catch {
      alert("Failed to update stage");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Startups</h1>
          <p className="page-subtitle">{total} total registered startups</p>
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
            placeholder="Search by startup name…"
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
                <th>Startup</th>
                <th>Stage</th>
                <th>Funding</th>
                <th>Upvotes</th>
                <th>Views</th>
                <th>Founder</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : startups.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Rocket className="w-10 h-10" />
                      <p className="font-medium text-[#94a3b8]">No startups found</p>
                    </div>
                  </td>
                </tr>
              ) : startups.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div>
                      <p className="font-medium text-[#e2e8f0]">{s.startupName}</p>
                      <p className="text-xs text-[#64748b] truncate max-w-[200px]">{s.tagline}</p>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue text-[10px]">
                      {s.stage}: {STAGE_LABELS[s.stage]}
                    </span>
                  </td>
                  <td>
                    <span className={`badge text-[10px] ${FUNDING_BADGE[s.fundingStatus] || "badge-user"}`}>
                      {s.fundingStatus?.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="text-[#94a3b8] text-sm">{s.upvotes}</td>
                  <td className="text-[#94a3b8] text-sm">{s.views}</td>
                  <td className="text-xs text-[#64748b]">
                    {s.createdBy?.name || "—"}
                  </td>
                  <td className="text-xs text-[#64748b]">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {/* Stage selector */}
                      <select
                        value={s.stage}
                        onChange={(e) => handleStageChange(s._id, parseInt(e.target.value))}
                        disabled={actionLoading === s._id}
                        className="admin-select text-xs py-1 px-2"
                        title="Change stage"
                      >
                        {Object.entries(STAGE_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{val}: {label}</option>
                        ))}
                      </select>

                      {/* View on site */}
                      <a
                        href={`${API_URL.replace("6220", "4000")}/startups/${s._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-ghost"
                        title="View on main site"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
            <p className="text-xs text-[#64748b]">Page {page} of {totalPages}</p>
            <div className="pagination">
              <button className="page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupsPage;
