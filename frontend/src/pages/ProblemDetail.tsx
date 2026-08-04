import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, TrendingUp, Users, Target, Lightbulb, BarChart3, Zap, AlertCircle, Calendar, User, Eye, Edit, Trash2, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/design-system/PageHero";
import UpvoteButton from "@/components/UpvoteButton";
import axios from "axios";
import { useEffect, useState } from "react";
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

const ProblemDetail = () => {
  const { id } = useParams();
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
      isLiked: Array.isArray(c.likedBy) ? c.likedBy.includes(user?.email) : false,
      replies: Array.isArray(c.replies)
        ? c.replies.map((r: any) => ({
            id: r.replyId,
            author: r.name || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${r.name || "A"}`,
            content: r.reply || r.text || "",
            timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
            likes: Array.isArray(r.likedBy) ? r.likedBy.length : 0,
            isLiked: Array.isArray(r.likedBy) ? r.likedBy.includes(user?.email) : false,
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
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${problem.problemId}`,
        { data: { email: user?.email } }
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
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${id}`
        );
        setProblem(res.data);

        const commentsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${res.data.problemId}/comments`
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
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment`,
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
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment/${commentId}/like`,
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
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment/${commentId}/reply`,
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
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-problem-primary mx-auto mb-4"></div>
          <p className="text-vj-muted">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Problem Not Found</h1>
          <Link to="/problems">
            <Button className="bg-problem-primary hover:bg-problem-primary/90 text-white">
              Back to Problems
            </Button>
          </Link>
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

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Problem detail"
        title={problem.title}
        description={problem.briefparagraph || problem.description || ""}
        backLink={{ label: "Problems", to: `/problems#problem-${problem.problemId}` }}
        stats={[
          { value: String(problem.upvotes || 0), label: "Upvotes" },
          { value: String(comments.length), label: "Comments" },
          { value: formatDate(problem.createdAt), label: "Published" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[320px] md:min-h-[460px]"
      />

      <div className="page-section">
        <div className="section-container max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to={`/problems#problem-${problem.problemId}`} className="inline-flex items-center text-vj-muted hover:text-problem-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Problems
          </Link>
        </div>

        {/* Problem Header */}
        <div className="vj-card-problem mb-8">
          {/* Problem Image */}
          {problem.image && (
            <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6 bg-problem-light/50">
              <img 
                src={problem.image}
                alt={problem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                  <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-sm font-medium">🎯 Problem Statement</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                      {problem.title}
                    </h1>
                    {problem.briefparagraph && (
                      <p className="text-white/90 text-lg">
                        {problem.briefparagraph}
                      </p>
                    )}
                  </div>
                  <UpvoteButton 
                    upvotes={problem.upvotes || 0}
                    hasUpvoted={problem.upvotedBy?.includes(user?.email || "")}
                    onClick={async () => {
                      try {
                        const res = await axios.post(
                          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/upvote`,
                          { email: user?.email }
                        );
                        setProblem(res.data);
                      } catch (err) {
                        console.error("Error upvoting problem:", err);
                      }
                    }}
                    className="bg-white/90 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {!problem.image && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-problem-light rounded-full">
                  <span className="w-3 h-3 bg-problem-primary rounded-full animate-pulse"></span>
                  <span className="text-problem-primary text-sm font-medium">🎯 Problem Statement</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-vj-primary mb-2 font-playfair">
                    {problem.title}
                  </h1>
                  {problem.briefparagraph && (
                    <p className="text-vj-muted text-lg">
                      {problem.briefparagraph}
                    </p>
                  )}
                </div>
                <UpvoteButton 
                  upvotes={problem.upvotes || 0}
                  hasUpvoted={problem.upvotedBy?.includes(user?.email || "")}
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/upvote`,
                        { email: user?.email }
                      );
                      setProblem(res.data);
                    } catch (err) {
                      console.error("Error upvoting problem:", err);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-vj-muted">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{problem.views || 0} views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{comments.length} comments</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(problem.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEditDelete && (
                <>
                  <Link to={`/update-problem/${problem.problemId}`} state={{ problem }}>
                    <Button variant="ghost" size="sm" className="text-problem-primary hover:bg-red-50 hover:text-red-700 transition-colors">
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the problem
                          "{problem.title}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteProblem}
                          disabled={deleting}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting ? "Deleting..." : "Delete Problem"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-problem-light text-problem-primary border-problem-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Problem Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Problem Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6 whitespace-pre-line">
              {problem.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Customers */}
            {problem.targetCustomers && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Users className="text-problem-primary" />
                  Target Customer(s)
                </h3>
                <div className="prose prose-gray max-w-none text-vj-muted leading-relaxed">
                  <p className="whitespace-pre-line">{problem.targetCustomers}</p>
                </div>
              </div>
            )}

            {/* Background */}
            {problem.background && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Lightbulb className="text-problem-primary" />
                  Background
                </h3>
                <div className="prose prose-gray max-w-none text-vj-muted leading-relaxed">
                  <p className="whitespace-pre-line">{problem.background}</p>
                </div>
              </div>
            )}

            {/* Current Gaps */}
            {problem.currentGaps && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <AlertCircle className="text-problem-primary" />
                  Current Gaps
                </h3>
                <div className="prose prose-gray max-w-none text-vj-muted leading-relaxed">
                  <p className="whitespace-pre-line">{problem.currentGaps}</p>
                </div>
              </div>
            )}

            {/* Existing Solutions */}
            {problem.existingSolutions && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="text-problem-primary" />
                  Existing Solutions
                </h3>
                <div className="prose prose-gray max-w-none text-vj-muted leading-relaxed">
                  <p className="whitespace-pre-line">{problem.existingSolutions}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scalability */}
            {problem.scalability && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Zap className="text-problem-primary" />
                  Scalability
                </h3>
                <div className="text-vj-muted leading-relaxed whitespace-pre-line">
                  {problem.scalability}
                </div>
              </div>
            )}

            {/* Market Size */}
            {problem.marketSize && (
              <div className="vj-card-problem">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <BarChart3 className="text-problem-primary" />
                  Market Size & Stats
                </h3>
                <div className="text-vj-muted leading-relaxed whitespace-pre-line">
                  {problem.marketSize}
                </div>
              </div>
            )}

            {/* Problem Metadata */}
            <div className="vj-card-problem">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Problem Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Posted by</span>
                  <span className="font-medium text-problem-primary">
                    {problem.addedBy || 'Anonymous'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Category</span>
                  <span className="font-medium text-problem-primary">
                    {problem.category || 'General'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Community Interest</span>
                  <span className="font-medium text-problem-primary">{problem.upvotes || 0} upvotes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Discussions</span>
                  <span className="font-medium text-problem-primary">{comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
