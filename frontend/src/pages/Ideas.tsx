import { useState, useEffect, type CSSProperties } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import IdeaCard from "@/components/IdeaCardCompact";
import { PageHero } from "@/components/design-system/PageHero";
import { BigCount } from "@/components/design-system/HeroSignatures";
import "@/components/design-system/listing.css";
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
  const navigate = useNavigate();
  
  // Fetch ideas from backend
  useEffect(() => {
    // Ideas are public to read; signing in is only needed to post or upvote.
    const fetchIdeas = async () => {
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
          likedByUser: Boolean(user?.email && (i.upvotedBy || []).includes(user.email)),
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
    if (!user?.email) {
      navigate("/login");
      return;
    }

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
  
  const clearFilters = () => {
    setSearchTerm("");
    setStageFilter("");
  };

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <PageHero
        eyebrow="Idea validation"
        title={problemFilter && relatedProblem ? `Ideas for: ${relatedProblem.title}` : "Innovative Ideas"}
        description={problemFilter
          ? "Student teams working on solutions for this specific problem"
          : "Discover innovative solutions being developed by student entrepreneurs across all problem areas"
        }
        stats={[
          { value: String(filteredIdeas.length), label: "Visible ideas" },
          { value: String(tagsWithCounts.length), label: "Popular tags" },
        ]}
        primaryAction={user ? { label: "Submit an idea", to: "/submit-idea", icon: Plus } : undefined}
        layout="split"
        side={<BigCount value={ideas.length} label={ideas.length === 1 ? "Idea taking shape" : "Ideas taking shape"} />}
      />

      <section className="lx-section">
        {(
          <div className="lx-toolbar">
            <div className="lx-toolbar-row">
              <label className="lx-search">
                <Search size={18} aria-hidden="true" />
                <input
                  placeholder="Search ideas"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search ideas"
                />
              </label>
              <select className="lx-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} aria-label="Filter by stage">
                <option value="">All stages</option>
                <option value="1">Idea & concept</option>
                <option value="2">Research & feasibility</option>
                <option value="3">Validation</option>
                <option value="4">Prototype</option>
                <option value="5">MVP</option>
                <option value="6">Testing & iteration</option>
                <option value="7">Launch & early growth</option>
                <option value="8">Scaling</option>
                <option value="9">Maturity & exit</option>
              </select>
              <select className="lx-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort ideas">
                <option value="newest">Latest added</option>
                <option value="upvotes">Highest rated</option>
                <option value="stage">Most advanced</option>
                <option value="comments">Most discussed</option>
              </select>
            </div>

            {(searchTerm || stageFilter) && (
              <div className="lx-active">
                <span>
                  Filtering
                  {searchTerm && <> / search <b>"{searchTerm}"</b></>}
                  {stageFilter && <> / stage <b>{stageFilter}</b></>}
                </span>
                <button className="lx-textbtn" onClick={clearFilters}>Clear all ×</button>
              </div>
            )}

            {tagsWithCounts.length > 0 && (
              <div>
                <div className="lx-tags-head">
                  <span>Popular tags</span>
                  {tagsWithCounts.length > 20 && (
                    <button className="lx-textbtn" onClick={() => setShowAllTags(!showAllTags)}>
                      {showAllTags ? "Show less" : `Show all (${tagsWithCounts.length})`}
                    </button>
                  )}
                </div>
                <div className="lx-tags">
                  {tagsWithCounts.slice(0, showAllTags ? tagsWithCounts.length : 20).map(([tag, count]) => (
                    <span key={tag} className="lx-tag is-static">{tag}<small>{count}</small></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="lx-loading">Loading ideas</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="lx-empty">
            <strong>{problemFilter ? "No ideas for this problem yet." : ideas.length ? "No matches." : "No ideas yet."}</strong>
            {problemFilter || !ideas.length ? (
              <Link to={user ? "/submit-idea" : "/login"} className="lx-textbtn">Submit the first idea ↗</Link>
            ) : (
              <button className="lx-textbtn" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        ) : (
          <div className="lx-grid">
            {filteredIdeas.map((idea) => (
              <div key={idea.ideaId} id={`idea-${idea.ideaId}`} className="flex">
                <IdeaCard idea={idea} onUpvote={handleUpvote} onStageUpdate={handleStageUpdate} />
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div className="lx-gate">
            <span>Join in</span>
            <h2>Have a way <em>to solve one?</em></h2>
            <p>Sign in with your college Google account to post your idea, back the ones you believe in and follow how they move through the stages.</p>
            <Link to="/login" className="lx-cta">Sign in to post ↗</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Ideas;