import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import IdeaCard from "@/components/IdeaCardCompact";
import IdeaSubmissionForm from "@/components/IdeaSubmissionForm";
import { PageHero } from "@/components/design-system/PageHero";
import axios from "axios";
import { useUser } from "./UserContext";

const Ideas = () => {
  const [searchParams] = useSearchParams();
  const problemFilter = searchParams.get("problem");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showAllTags, setShowAllTags] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [relatedProblem, setRelatedProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  // Fetch ideas from backend
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let endpoint = `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas`;
        
        // If filtering by problem, use the problem-specific endpoint
        if (problemFilter) {
          endpoint = `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/problem/${problemFilter}`;
        }
        
        const res = await axios.get(endpoint);
        console.log('Ideas fetched:', res.data);

        // Build a map of related problemId -> problem (title) to avoid N+1 fetches
        const uniqueProblemIds: string[] = Array.from(
          new Set(
            (res.data || [])
              .map((i: any) => i.relatedProblemId)
              .filter((id: any) => id && id !== 'undefined' && id.trim() !== '')
          )
        );
        console.log('Unique problem IDs:', uniqueProblemIds);

        let problemMap: Record<string, any> = {};
        if (uniqueProblemIds.length > 0) {
          const results = await Promise.all(
            uniqueProblemIds.map((pid) =>
              axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${pid}`)
                .then((r) => ({ id: pid, data: r.data }))
                .catch((err) => {
                  console.error(`Failed to fetch problem ${pid}:`, err);
                  return { id: pid, data: null };
                })
            )
          );
          problemMap = results.reduce((acc: Record<string, any>, cur) => {
            acc[cur.id] = cur.data;
            return acc;
          }, {});
          console.log('Problem map:', problemMap);
        }

        // Mark which ideas the current user has already liked and attach problem info
        const updatedIdeas = res.data.map((i: any) => ({
          ...i,
          likedByUser: i.upvotedBy.includes(user.email),
          relatedProblemId: i.relatedProblemId,
          relatedProblemTitle: i.relatedProblemId && problemMap[i.relatedProblemId]
            ? problemMap[i.relatedProblemId].title
            : null,
        }));

        setIdeas(updatedIdeas);
      } catch (err) {
        console.error("Error fetching ideas:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [user?.email, problemFilter]);
  
  // Fetch problem details if filtering by problem
  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemFilter) {
        setRelatedProblem(null);
        return;
      }
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${problemFilter}`
        );
        setRelatedProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem details:", err);
      }
    };
    
    fetchProblemDetails();
  }, [problemFilter]);
  
  // Handle scroll position when navigating from idea detail page
  useEffect(() => {
    if (ideas.length > 0) {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#idea-')) {
        const ideaId = hash.replace('#idea-', '');
        
        setTimeout(() => {
          const ideaCard = document.getElementById(`idea-${ideaId}`);
          if (ideaCard) {
            // First scroll to ensure the element is in the DOM view
            ideaCard.scrollIntoView({ behavior: 'auto' });
            
            // Then calculate and set the final scroll position with header offset
            const cardPosition = ideaCard.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + cardPosition - 120; // 120px offset for header
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto'
            });
            
            // Add a highlight effect
            ideaCard.classList.add('ring-2', 'ring-idea-primary');
            setTimeout(() => {
              ideaCard.classList.remove('ring-2', 'ring-idea-primary');
            }, 2000);
          }
        }, 500);
      }
    }
  }, [ideas.length]);
  
  // Handle upvoting an idea
  const handleUpvote = async (ideaId: string) => {
    if (!user?.email) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${ideaId}/upvote`,
        { email: user.email }
      );

      // Update the idea in state dynamically
      setIdeas(prev =>
        prev.map(idea =>
          idea.ideaId === ideaId
            ? {
                ...idea,
                upvotes: res.data.upvotes,
                likedByUser: res.data.upvotedBy.includes(user.email)
              }
            : idea
        )
      );
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  // Handle stage updates
  const handleStageUpdate = async (ideaId: string, newStage: number) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.ideaId === ideaId
          ? { ...idea, stage: newStage }
          : idea
      )
    );
  };
  
  // Get all tags with counts from ideas
  const getTagsWithCounts = (ideas: any[]) => {
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    ideas.forEach(idea => {
      if (!idea.tags) return;
      
      idea.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA);
  };
  
  // Get tags with counts
  const tagsWithCounts = getTagsWithCounts(ideas);
  
  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter(idea => 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(idea => 
      !stageFilter || (idea.stage && idea.stage.toString() === stageFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "stage":
          return (b.stage || 1) - (a.stage || 1);
        case "comments":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Idea validation"
        title={problemFilter && relatedProblem ? `Ideas for: ${relatedProblem.title}` : "Innovative Ideas"}
        description={problemFilter
          ? "Student teams working on solutions for this specific problem"
          : "Discover innovative solutions being developed by student entrepreneurs across all problem areas"
        }
        stats={[
          { value: String(ideas.length), label: "Ideas total" },
          { value: String(filteredIdeas.length), label: "Visible ideas" },
          { value: String(tagsWithCounts.length), label: "Popular tags" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[420px] md:min-h-[520px]"
      />

      <section className="page-section">
        <div className="section-container space-y-8">
          {user && (
            <div className="flex justify-end">
              <IdeaSubmissionForm />
            </div>
          )}

          {user && (
            <div className="section-panel p-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vj-muted" size={20} />
                  <Input
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-vj-muted" />
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Stages</option>
                    <option value="1">Idea & concept</option>
                    <option value="2">Research & Feasability</option>
                    <option value="3">Validation</option>
                    <option value="4">Prototype</option>
                    <option value="5">MVP</option>
                    <option value="6">Testing & Iteration</option>
                    <option value="7">Launch & Early Growth</option>
                    <option value="8">Scaling</option>
                    <option value="9">Maturity & Exit</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="newest">Latest Added</option>
                  <option value="upvotes">Highest Rated</option>
                  <option value="stage">Most Advanced</option>
                  <option value="comments">Most Discussed</option>
                </select>
              </div>

              {tagsWithCounts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-vj-border">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-vj-muted">Popular Tags:</span>
                    {tagsWithCounts.slice(0, showAllTags ? tagsWithCounts.length : 20).map(([tag, count]) => (
                      <Badge key={tag} className="bg-idea-light text-idea-primary hover:bg-idea-light/80 cursor-pointer">
                        {tag} ({count})
                      </Badge>
                    ))}
                    {tagsWithCounts.length > 20 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-idea-primary hover:text-idea-primary/80"
                        onClick={() => setShowAllTags(!showAllTags)}
                      >
                        {showAllTags ? "Show Less" : `Show All (${tagsWithCounts.length})`}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!user ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-950/30 dark:via-gray-900 dark:to-green-900/30 rounded-xl shadow-inner border border-green-200 dark:border-green-800/50">
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">Join the Community 🚀</h2>
              <p className="text-vj-muted max-w-md text-center mb-6">
                You need to be logged in to explore innovative ideas, upvote solutions, and submit your own creative concepts.
                Sign in and start building the future today!
              </p>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105">
                  Login to Continue
                </Button>
              </Link>
            </div>
          ) : filteredIdeas.length === 0 && !loading ? (
            <div className="text-center py-16">
              <p className="text-vj-muted text-lg">
                {problemFilter ? "No ideas found for this problem yet." : "No ideas match your current filters."}
              </p>
              <div className="flex gap-4 justify-center mt-4">
                {problemFilter && (
                  <Button className="btn-primary" onClick={() => {}}>
                    Submit First Idea
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => { setSearchTerm(""); setStageFilter(""); }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Ideas;