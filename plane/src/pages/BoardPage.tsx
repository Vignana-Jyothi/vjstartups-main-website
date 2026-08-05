import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, ArrowLeft, MessageSquare, Clock, CheckCircle2, Circle, AlertCircle, PlayCircle, HelpCircle } from "lucide-react";
import { fetchProjectById, fetchTasks, createTask, updateTaskStatus } from "../services/planeApi";
import { useAuth } from "../context/AuthContext";
import TaskDetailPage from "./TaskDetailPage";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "urgent" | "high" | "medium" | "low" | "none";
  dueDate: string | null;
  comments: any[];
  assignee?: { userId: string | null; name: string | null; picture: string | null };
  createdBy: { userId: string; name: string };
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const COLUMNS: { id: Task["status"]; label: string; icon: any; color: string }[] = [
  { id: "todo", label: "To Do", icon: Circle, color: "#64748b" },
  { id: "in-progress", label: "In Progress", icon: PlayCircle, color: "#38bdf8" },
  { id: "review", label: "In Review", icon: HelpCircle, color: "#f59e0b" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "#10b981" },
];

const PRIORITY_BADGES: Record<string, string> = {
  urgent: "badge-urgent",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const BoardPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [projData, tasksData] = await Promise.all([
        fetchProjectById(projectId),
        fetchTasks(projectId),
      ]);
      setProject(projData.project);
      setTasks(tasksData.tasks || []);
    } catch {
      console.error("Failed to load board");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId || !user) return;

    setSubmitting(true);
    try {
      await createTask({
        title,
        description,
        projectId,
        priority,
        createdById: user.id,
        createdByName: user.name,
        assignee: { userId: user.id, name: user.name, picture: user.picture },
      });
      setTitle("");
      setDescription("");
      setShowCreateModal(false);
      loadData();
    } catch {
      alert("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoveStatus = async (taskId: string, newStatus: Task["status"]) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch {
      loadData(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16 plane-card">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
        <p className="text-white font-semibold">Project not found</p>
        <Link to="/" className="btn btn-ghost mt-4">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[rgba(56,189,248,0.12)] pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg text-[#64748b] hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-3xl">{project.emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-xs text-[#64748b]">{project.description || "Public Task Board"}</p>
          </div>
        </div>

        {user ? (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        ) : (
          <div className="text-xs text-[#64748b] bg-sky-950/30 border border-sky-900/30 px-3 py-1.5 rounded-lg">
            Sign in with Google to create or comment on tasks
          </div>
        )}
      </div>

      {/* Kanban Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const ColIcon = col.icon;
          return (
            <div key={col.id} className="kanban-column flex flex-col p-3">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4" style={{ color: col.color }} />
                  <span className="font-semibold text-xs text-[#f8fafc] uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs font-mono text-[#64748b] px-1.5 py-0.5 rounded bg-white/5">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="kanban-card space-y-2.5"
                  >
                    {/* Priority & Move status */}
                    <div className="flex items-center justify-between text-xs">
                      {task.priority !== "none" ? (
                        <span className={`badge ${PRIORITY_BADGES[task.priority]}`}>
                          {task.priority}
                        </span>
                      ) : <span />}

                      {/* Quick Move dropdown */}
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleMoveStatus(task.id, e.target.value as Task["status"]);
                        }}
                        className="bg-black/40 text-[11px] text-[#94a3b8] rounded px-1.5 py-0.5 border border-white/10 outline-none cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-medium text-white leading-snug hover:text-sky-400 transition-colors">
                      {task.title}
                    </h4>

                    {/* Footer stats */}
                    <div className="flex items-center justify-between text-xs text-[#64748b] pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {task.comments?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {task.comments.length}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Assignee Avatar */}
                      {task.assignee?.name && (
                        <img
                          src={task.assignee.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=0ea5e9&color=fff`}
                          alt={task.assignee.name}
                          className="w-5 h-5 rounded-full border border-sky-500/30"
                          title={`Assigned to ${task.assignee.name}`}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#475569] border border-dashed border-white/5 rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailPage
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdated={loadData}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="plane-card w-full max-w-md space-y-4">
            <h3 className="font-semibold text-white border-b border-[rgba(56,189,248,0.12)] pb-3">
              Add New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Title</label>
                <input
                  className="plane-input"
                  placeholder="Task title (e.g., Design homepage mockup)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Description</label>
                <textarea
                  className="plane-input h-24 resize-none"
                  placeholder="Details, requirements, links..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="plane-input"
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Creating…" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
