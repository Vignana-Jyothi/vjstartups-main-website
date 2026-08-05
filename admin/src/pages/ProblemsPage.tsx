import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { fetchProblems } from "../services/adminApi";

interface Problem {
  _id: string;
  title: string;
  description?: string;
  submittedBy?: string;
  upvotes?: number;
  category?: string;
  createdAt: string;
}

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProblems(page, LIMIT, search);
      setProblems(data.problems);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      console.error("Failed to load problems");
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

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Problems</h1>
          <p className="page-subtitle">{total} total problem submissions</p>
        </div>
        <button onClick={load} className="btn btn-ghost btn-sm" disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            className="admin-input pl-9"
            placeholder="Search by problem title…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Submitted By</th>
                <th>Category</th>
                <th>Upvotes</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <AlertCircle className="w-10 h-10" />
                      <p className="font-medium text-[#94a3b8]">No problems found</p>
                    </div>
                  </td>
                </tr>
              ) : problems.map((problem) => (
                <tr key={problem.id}>
                  <td>
                    <p className="font-medium text-[#e2e8f0]">{problem.title}</p>
                    {problem.description && (
                      <p className="text-xs text-[#64748b] truncate max-w-[260px] mt-0.5">
                        {problem.description}
                      </p>
                    )}
                  </td>
                  <td className="text-sm text-[#94a3b8]">{problem.submittedBy || "—"}</td>
                  <td>
                    {problem.category ? (
                      <span className="badge badge-green text-[10px]">{problem.category}</span>
                    ) : <span className="text-[#475569]">—</span>}
                  </td>
                  <td className="text-sm text-[#94a3b8]">{problem.upvotes ?? "—"}</td>
                  <td className="text-xs text-[#64748b]">{new Date(problem.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

export default ProblemsPage;
