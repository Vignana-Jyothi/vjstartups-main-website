import { hasUpvoted } from "@/utils/upvotes";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/design-system/PageHero";
import UpvoteButton from "@/components/UpvoteButton";
import axios from "axios";
import { useEffect, useState, type CSSProperties } from "react";
import "@/components/design-system/listing.css";
import "@/components/design-system/detail.css";
import { useUser } from "../pages/UserContext";
import CommentSection from "@/components/CommentSection";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/config/api";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<any[]>([]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const mapCommentsFromBackend = (backendComments: any[]) => {
    return (backendComments || []).map((c: any) => ({
      id: c.commentId,
      author: c.name || "Anonymous",
      avatar: `https://ui-avatars.com/api/?name=${c.name || "A"}`,
      content: c.text || c.comment || "",
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : "",
      likes: Array.isArray(c.likedBy) ? c.likedBy.length : 0,
      isLiked: hasUpvoted(c.likedBy, user?.email),
      replies: Array.isArray(c.replies)
        ? c.replies.map((r: any) => ({
            id: r.replyId,
            author: r.name || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${r.name || "A"}`,
            content: r.reply || r.text || "",
            timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
            likes: Array.isArray(r.likedBy) ? r.likedBy.length : 0,
            isLiked: hasUpvoted(r.likedBy, user?.email),
            replies: [],
          }))
        : [],
    }));
  };

  const handleDeleteProblem = async () => {
    if (!problem?.problemId || !user?.email) return;

    try {
      setDeleting(true);
      await axios.delete(
        `${API_BASE}/problem-api/problems/${problem.problemId}`,
        { headers: { Authorization: `Bearer ${user?.sessionToken}` } }
      );
      
      toast({
        title: "Problem Deleted",
        description: "The problem has been successfully deleted.",
      });
      
      window.location.href = '/problems';
    } catch (err: any) {
      console.error("Error deleting problem:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete problem",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/problem-api/problems/${id}`
        );
        setProblem(res.data);

        const commentsRes = await axios.get(
          `${API_BASE}/problem-api/problem/${res.data.problemId}/comments`
        );

        setComments(mapCommentsFromBackend(commentsRes.data.comments || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [id, user?.email]);

  const handleAddComment = async (content: string) => {
    try {
      const res = await axios.post(
        `${API_BASE}/problem-api/problem/${problem.problemId}/comment`,
        {
          comment: content,
          name: user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
        }
      );
      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId: string, replyId?: string) => {
    try {
      const res = await axios.post(
        `${API_BASE}/problem-api/problem/${problem.problemId}/comment/${commentId}/like`,
        { email: user?.email, replyId: replyId || null }
      );
      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error liking comment/reply:", err);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    try {
      const res = await axios.post(
        `${API_BASE}/problem-api/problem/${problem.problemId}/comment/${commentId}/reply`,
        {
          reply: content,
          name: user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
        }
      );

      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  if (loading) {
    return (
      <div className="page-shell lx dt" style={{ "--lx-accent": "var(--pink)" } as CSSProperties}>
        <div className="lx-section"><div className="lx-loading">Loading problem</div></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="page-shell lx dt" style={{ "--lx-accent": "var(--pink)" } as CSSProperties}>
        <div className="lx-section">
          <div className="lx-empty">
            <strong>Problem not found</strong>
            <Link to="/problems" className="lx-cta">All problems ↗</Link>
          </div>
        </div>
      </div>
    );
  }

  const canEditDelete = Boolean(
    user?.email && (
      user.email === problem.addedByEmail ||
      problem.collaborators?.includes(user.email)
    )
  );

  const upvote = async () => {
    // Upvoting needs an account (it is recorded against the user); send visitors to sign in.
    if (!user?.email) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/problem-api/problem/${problem.problemId}/upvote`,
        { email: user?.email }
      );
      setProblem(res.data);
    } catch (err) {
      console.error("Error upvoting problem:", err);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: problem.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Share it with someone who feels this problem." });
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  const fields: [string, string | undefined][] = [
    ["Target customers", problem.targetCustomers],
    ["Background", problem.background],
    ["Current gaps", problem.currentGaps],
    ["Existing solutions", problem.existingSolutions],
    ["Scalability", problem.scalability],
    ["Market size & stats", problem.marketSize],
  ];
  const filled = fields.filter(([, value]) => value && String(value).trim());
  const lead = problem.description && problem.description !== problem.briefparagraph ? problem.description : "";

  return (
    <div className="page-shell lx dt" style={{ "--lx-accent": "var(--pink)" } as CSSProperties}>
      <PageHero
        kind="document"
        eyebrow="Problem"
        title={problem.title}
        description={problem.briefparagraph || problem.description || ""}
        backLink={{ label: "Problems", to: `/problems#problem-${problem.problemId}` }}
        accent="pink"
        stats={[
          { value: String(problem.upvotes || 0), label: "Upvotes" },
          { value: String(comments.length), label: "Comments" },
          { value: formatDate(problem.createdAt), label: "Published" },
        ]}
      />

      <section className="lx-section dt-grid">
        <div className="dt-main">
          {problem.image && (
            <figure className="dt-figure">
              <img src={problem.image} alt="" />
            </figure>
          )}
          {lead && <p className="lx-lead dt-lead">{lead}</p>}
          {filled.length > 0 && (
            <div className="dt-fields">
              {filled.map(([label, value], i) => (
                <section key={label} className="dt-field">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{label}</h3>
                    <p>{value}</p>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <aside className="dt-side">
          <div className="dt-card">
            <div className="dt-vote">
              <UpvoteButton upvotes={problem.upvotes || 0} hasUpvoted={hasUpvoted(problem.upvotedBy, user?.email)} onClick={upvote} />
              <span>{problem.upvotes === 1 ? "person feels this" : "people feel this"}</span>
            </div>
            <dl className="dt-facts">
              <div><dt>Posted by</dt><dd>{problem.addedByName || "Anonymous"}</dd></div>
              <div><dt>Published</dt><dd>{formatDate(problem.createdAt)}</dd></div>
              <div><dt>Discussion</dt><dd>{comments.length} {comments.length === 1 ? "comment" : "comments"}</dd></div>
            </dl>
            {problem.tags?.length > 0 && (
              <div className="lx-tags">
                {problem.tags.map((tag: string) => <span key={tag} className="lx-tag is-static">{tag}</span>)}
              </div>
            )}
            <div className="dt-actions">
              <Link to={`/ideas?problem=${problem.problemId}`} className="lx-cta">Ideas answering this ↗</Link>
              <button type="button" className="lx-textbtn" onClick={share}>Share ↗</button>
              {canEditDelete && (
                <>
                  <Link to={`/update-problem/${problem.problemId}`} state={{ problem }} data-no-transition className="lx-textbtn">Edit ↗</Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="lx-textbtn dt-danger">Delete</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this problem?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes "{problem.title}" and its discussion. It cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProblem} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                          {deleting ? "Deleting..." : "Delete problem"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="lx-section dt-discussion">
        <div className="lx-sec-head">
          <span>Discussion / {comments.length}</span>
          <h2>What people think</h2>
        </div>
        <CommentSection comments={comments} onAddComment={handleAddComment} onLikeComment={handleLikeComment} onReply={handleReply} />
      </section>
    </div>
  );
};

export default ProblemDetail;
