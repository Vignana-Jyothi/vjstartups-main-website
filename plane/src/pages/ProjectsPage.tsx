import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, CheckSquare, Layers, FolderPlus, X } from "lucide-react";
import { fetchProjects, createProject } from "../services/planeApi";
import { useAuth } from "../context/AuthContext";

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  taskCount: number;
  completedCount: number;
  createdAt: string;
}

const EMOJI_OPTIONS = ["📋", "🚀", "💡", "⚡", "🎯", "🔬", "🛠️", "📊"];
const COLOR_OPTIONS = ["#0ea5e9", "#7c3aed", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#0ea5e9");
  const [emoji, setEmoji] = useState("📋");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProjects()
      .then((data) => setProjects(data.projects || []))
      .catch(() => console.error("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    setSubmitting(true);
    try {
      await createProject({
        name,
        description,
        color,
        emoji,
        createdBy: user.id,
        creatorName: user.name,
      });
      setName("");
      setDescription("");
      setShowModal(false);
      load();
    } catch {
      alert("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[rgba(56,189,248,0.12)] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-400" />
            Projects & Roadmaps
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Track startup tasks, sprint goals, and public feature boards.
          </p>
        </div>

        {user ? (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        ) : (
          <div className="text-xs text-[#64748b] bg-sky-950/30 border border-sky-900/30 px-3 py-2 rounded-lg">
            Sign in with Google to create new projects
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 plane-card">
          <FolderPlus className="w-12 h-12 text-[#475569] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-[#f8fafc]">No projects created yet</h3>
          <p className="text-sm text-[#64748b] mt-1 mb-4">
            Be the first to create a project roadmap!
          </p>
          {user && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const pct = proj.taskCount > 0 ? Math.round((proj.completedCount / proj.taskCount) * 100) : 0;
            return (
              <Link
                key={proj.id}
                to={`/projects/${proj.id}`}
                className="plane-card no-underline group block relative overflow-hidden"
              >
                {/* Top color strip */}
                <div className="h-1.5 absolute top-0 left-0 right-0" style={{ background: proj.color }} />

                <div className="flex items-start justify-between mb-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{proj.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[#64748b] line-clamp-1">{proj.description || "No description"}</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-xs text-[#64748b]">
                    <span>{proj.completedCount} of {proj.taskCount} tasks done</span>
                    <span className="font-semibold text-sky-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, background: proj.color }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {proj.taskCount} tasks
                  </span>
                  <span>View Board →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="plane-card w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(56,189,248,0.12)] pb-3">
              <h3 className="font-semibold text-white">Create New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-[#64748b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Emoji & Name</label>
                <div className="flex gap-2">
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="plane-input w-16 text-center text-lg p-1"
                  >
                    {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input
                    className="plane-input flex-1"
                    placeholder="Project Name (e.g., Mobile App Launch)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Description</label>
                <textarea
                  className="plane-input h-20 resize-none"
                  placeholder="What is this project about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1 font-mono">Accent Color</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? "scale-125 ring-2 ring-white" : ""}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Creating…" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
