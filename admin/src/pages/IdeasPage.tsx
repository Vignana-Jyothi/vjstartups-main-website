import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw, Lightbulb } from "lucide-react";
import { fetchIdeas } from "../services/adminApi";

interface Idea {
  _id: string;
  title: string;
  description?: string;
  submittedBy?: string;
  upvotes?: number;
  stage?: string;
  createdAt: string;
}

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
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
      const data = await fetchIdeas(page, LIMIT, search);
      setIdeas(data.ideas);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      console.error("Failed to load ideas");
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
          <h1 className="page-title">Ideas</h1>
          <p className="page-subtitle">{total} total idea submissions</p>
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
            placeholder="Search by idea title…"
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
                <th>Stage</th>
                <th>Upvotes</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : ideas.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <Lightbulb className="w-10 h-10" />
                      <p className="font-medium text-[#94a3b8]">No ideas found</p>
                    </div>
                  </td>
                </tr>
              ) : ideas.map((idea) => (
                <tr key={idea._id}>
                  <td>
                    <p className="font-medium text-[#e2e8f0]">{idea.title}</p>
                    {idea.description && (
                      <p className="text-xs text-[#64748b] truncate max-w-[260px] mt-0.5">
                        {idea.description}
                      </p>
                    )}
                  </td>
                  <td className="text-sm text-[#94a3b8]">{idea.submittedBy || "—"}</td>
                  <td>
                    {idea.stage ? (
                      <span className="badge badge-yellow text-[10px]">{idea.stage}</span>
                    ) : <span className="text-[#475569]">—</span>}
                  </td>
                  <td className="text-sm text-[#94a3b8]">{idea.upvotes ?? "—"}</td>
                  <td className="text-xs text-[#64748b]">{new Date(idea.createdAt).toLocaleDateString()}</td>
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

export default IdeasPage;
