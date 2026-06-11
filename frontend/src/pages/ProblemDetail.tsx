import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, TrendingUp, Users, Target, Lightbulb, BarChart3, Zap, AlertCircle, Calendar, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/design-system/PageHero";
import UpvoteButton from "@/components/UpvoteButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../pages/UserContext";
import CommentSection from "@/components/CommentSection";

// Helper function to convert text with newlines to JSX with line breaks
const TextWithLineBreaks = ({ text }: { text: string }) => {
  if (!text) return null;
  
  return (
    <>
      {text.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [comments, setComments] = useState<any[]>([]);

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

  // Scroll to top when component mounts
  useEffect(() => {
    // Scroll to top when viewing problem details
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Card className="max-w-md mx-auto text-center bg-white dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Problem Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
            <Link to={`/problems#problem-${id}`}>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          { value: new Date(problem.createdAt).toLocaleDateString(), label: "Published" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[300px] md:min-h-[420px]"
      />

      <section className="page-section">
        <div className="section-container">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {problem.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-vj-accent-light text-vj-accent">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {(user?.email === problem.addedByEmail || (problem.collaborators && problem.collaborators.includes(user?.email))) && (
                <>
                  <Link to={`/update-problem/${problem.problemId}`} state={{ problem }}>
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this problem?")) {
                        try {
                          await axios.delete(
                            `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${problem.problemId}`,
                            {
                              data: { email: user?.email }
                            }
                          );
                          alert("Problem deleted successfully!");
                          window.location.href = '/problems';
                        } catch (err: any) {
                          console.error("Error deleting problem:", err);
                          alert(err.response?.data?.message || "Failed to delete problem");
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}

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
      </div>
      
      {/* Main Content */}
      <div className="page-section pt-0 relative">
        <div className="section-container relative">

          {/* Problem Image */}
          {problem.image && (
            <Card className="mb-6 overflow-hidden transform hover:scale-[1.01] transition-all duration-500 bg-transparent">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <img 
                  src={problem.image} 
                  alt={problem.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out" 
                />
              </div>
            </Card>
          )}
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {problem.targetCustomers && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg mr-3 animate-slide-in-left">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      Target Customer(s)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.targetCustomers || "Not specified."} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.description && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg mr-3 animate-slide-in-left delay-100">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      Problem Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.description || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.background && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg mr-3 animate-slide-in-left delay-200">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.background || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.currentGaps && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg mr-3 animate-slide-in-left delay-300">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      Current Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.currentGaps || "No gaps specified."} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {problem.scalability && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg mr-3 animate-fade-in">
                        <Zap className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Scalability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.scalability || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.marketSize && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right delay-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-lg mr-3 animate-fade-in delay-100">
                        <BarChart3 className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Market Size & Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.marketSize || "Not available."} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.existingSolutions && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right delay-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-lg mr-3 animate-fade-in delay-200">
                        <TrendingUp className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Existing Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.existingSolutions || "No competitors listed."} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-8 relative animate-fade-in-up delay-400">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 dark:to-gray-900/10 pointer-events-none backdrop-blur-sm rounded-lg"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-xl">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReply={handleReply}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default ProblemDetail;
