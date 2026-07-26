import { useEffect, useState } from "react";
import { X, Send, Trash2, Calendar, User, Tag } from "lucide-react";
import { fetchTaskById, addTaskComment, deleteTask, updateTaskStatus } from "../services/planeApi";
import { useAuth } from "../context/AuthContext";

interface TaskDetailPageProps {
  taskId: string;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const PRIORITY_BADGES: Record<string, string> = {
  urgent: "badge-urgent",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const TaskDetailPage = ({ taskId, onClose, onTaskUpdated }: TaskDetailPageProps) => {
  const { user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTaskById(taskId);
      setTask(data.task);
    } catch {
      console.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [taskId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTask((prev: any) => ({ ...prev, status: newStatus }));
      onTaskUpdated();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setSubmittingComment(true);
    try {
      await addTaskComment(taskId, {
        content: commentText,
        authorId: user.id,
        authorName: user.name,
        authorPicture: user.picture,
      });
      setCommentText("");
      load();
    } catch {
      alert("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      onTaskUpdated();
      onClose();
    } catch {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="plane-card w-full max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden relative">
        {/* Top bar */}
        <div className="p-4 border-b border-[rgba(56,189,248,0.12)] flex items-center justify-between bg-[#121721]">
          <div className="flex items-center gap-2">
            {task?.projectId?.name && (
              <span className="text-xs text-[#64748b] flex items-center gap-1 font-medium">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                {task.projectId.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button onClick={handleDelete} className="p-1.5 rounded text-red-400 hover:bg-red-950/40" title="Delete Task">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded text-[#64748b] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        {loading ? (
          <div className="p-12 text-center flex-1 flex items-center justify-center">
            <div className="spinner" />
          </div>
        ) : !task ? (
          <div className="p-8 text-center text-[#64748b]">Task not found</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Status */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold text-white leading-snug">{task.title}</h2>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="plane-input w-auto text-xs py-1 px-2.5 font-medium"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Meta tags */}
              <div className="flex items-center gap-3 text-xs text-[#64748b] flex-wrap">
                {task.priority !== "none" && (
                  <span className={`badge ${PRIORITY_BADGES[task.priority]}`}>{task.priority} priority</span>
                )}
                {task.assignee?.name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    Assigned to {task.assignee.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            {task.description ? (
              <div className="bg-[#121721] p-4 rounded-lg border border-[rgba(56,189,248,0.08)]">
                <h4 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">Description</h4>
                <p className="text-sm text-[#e2e8f0] whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            ) : (
              <p className="text-xs text-[#475569] italic">No description provided</p>
            )}

            {/* Comments Section */}
            <div className="border-t border-[rgba(56,189,248,0.12)] pt-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Comments ({task.comments?.length || 0})
              </h3>

              {/* Comment list */}
              <div className="space-y-3">
                {task.comments?.map((c: any, idx: number) => (
                  <div key={idx} className="flex gap-3 bg-[#121721] p-3 rounded-lg border border-white/5">
                    <img
                      src={c.authorPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName)}&background=0ea5e9&color=fff`}
                      alt={c.authorName}
                      className="w-7 h-7 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">{c.authorName}</span>
                        <span className="text-[10px] text-[#64748b]">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#e2e8f0] whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))}

                {(!task.comments || task.comments.length === 0) && (
                  <p className="text-xs text-[#475569]">No comments yet. Start the conversation below!</p>
                )}
              </div>

              {/* Add comment box */}
              {user ? (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    className="plane-input text-xs"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" disabled={submittingComment || !commentText.trim()} className="btn btn-primary btn-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="text-xs text-[#64748b] bg-sky-950/20 border border-sky-900/20 p-3 rounded-lg text-center">
                  Sign in with Google at the top of the page to comment.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;
