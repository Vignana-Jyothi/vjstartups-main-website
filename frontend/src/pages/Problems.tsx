import { hasUpvoted } from "@/utils/upvotes";
import { useEffect, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import UpvoteButton from "@/components/UpvoteButton";
import { PageHero } from "@/components/design-system/PageHero";
import { CardCover } from "@/components/design-system/CardCover";
import { TitleMarquee } from "@/components/design-system/HeroSignatures";
import { isReadableTitle } from "@/utils/readableTitle";
import "@/components/design-system/listing.css";
import axios from "axios";
import { useUser } from "../pages/UserContext";
import { API_BASE } from "@/config/api";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Problems = () => {
  const [allProblems, setAllProblems] = useState<any[]>([]); // All problems from server
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showAllTags, setShowAllTags] = useState(false);
  const [showMyProblems, setShowMyProblems] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const itemsPerPage = 12; // Works well: mobile=12 rows, tablet=6 rows, desktop=4 rows

  // Fetch all problems at once
  // Problems are public (every problem page already is); signing in is only needed to post,
  // upvote or comment.
  const fetchAllProblems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/problem-api/problems?limit=1000`);
      const problemsData = res.data.problems || res.data; // Handle both old and new API response
      
      // Mark which problems the current user has already liked
      const updatedProblems = problemsData.map((p: any) => ({
        ...p,
        likedByUser: hasUpvoted(p.upvotedBy, user?.email)
      }));
      
      setAllProblems(updatedProblems);
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllProblems();
  }, [user?.email]);

  // Handle scrolling to a specific problem card based on URL hash
  useEffect(() => {
    // Only run after the problems data has been loaded
    if (allProblems.length > 0) {
      // Check if there's a problem ID in the URL hash
      const hash = window.location.hash;
      if (hash && hash.startsWith('#problem-')) {
        // Extract the problem ID from the hash
        const problemId = hash.replace('#problem-', '');
        
        // Use a longer timeout to ensure DOM is fully rendered and images are loaded
        setTimeout(() => {
          const problemCard = document.getElementById(`problem-${problemId}`);
          if (problemCard) {
            // First scroll to ensure the element is in the DOM view
            problemCard.scrollIntoView({ behavior: 'auto' });
            
            // Then calculate and set the final scroll position with header offset
            const cardPosition = problemCard.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + cardPosition - 120; // 120px offset for header
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto'
            });
            
            // Add a highlight effect to make the card more noticeable
            problemCard.classList.add('lx-flash');
            setTimeout(() => {
              problemCard.classList.remove('lx-flash');
            }, 2000); // Remove highlight after 2 seconds
          }
        }, 500); // Longer timeout to ensure everything is loaded
      }
    }
  }, [allProblems.length]);

  // Get all unique tags and tag counts from all problems (not just current page)
  const getTagsWithCounts = (problems: any[]) => {
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    problems.forEach(problem => {
      problem.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA);
  };
  
  // Get all tags sorted by popularity (from all problems)
  const tagsWithCounts = getTagsWithCounts(allProblems);
  
  // Get all unique tags
  const allTags = tagsWithCounts.map(([tag]) => tag);
  
  // Get top 20 tags
  const topTags = allTags.slice(0, 20);

  // Filter logic for all problems with client-side pagination
  const getFilteredProblems = () => {
    let filtered = allProblems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.briefparagraph.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(problem =>
        selectedTags.some(tag => problem.tags.includes(tag))
      );
    }

    // Apply "My Problems" filter
    if (showMyProblems) {
      filtered = filtered.filter(problem =>
        problem.addedByEmail === user?.email || 
        (problem.collaborators && problem.collaborators.includes(user?.email))
      );
    }

    // Apply sorting. Placeholder submissions ("dsa", one-word tests) still appear, but after
    // the real problems, so the page never opens on a junk card.
    const sorted = filtered.sort((a, b) => {
      const readable = Number(isReadableTitle(b.title || "")) - Number(isReadableTitle(a.title || ""));
      if (readable !== 0) return readable;
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "comments":
          return b.comments.length - a.comments.length;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredProblems = getFilteredProblems();

  // Client-side pagination calculation
  const totalFilteredItems = filteredProblems.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProblems = filteredProblems.slice(startIndex, endIndex);

  // Create pagination info for consistency
  const paginationInfo = {
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalFilteredItems,
    itemsPerPage: itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags, showMyProblems, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (paginationInfo.hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (paginationInfo.hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

const handleUpvote = async (problemId: string) => {
  if (!user?.email) {
    navigate("/login");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE}/problem-api/problem/${problemId}/upvote`,
      { email: user.email }
    );

    // Update the problem in allProblems state dynamically
    setAllProblems(prev =>
      prev.map(p =>
        p.problemId === problemId
          ? {
              ...p,
              upvotes: res.data.upvotes,
              upvotedBy: res.data.upvotedBy,
              likedByUser: hasUpvoted(res.data.upvotedBy, user.email),
            }
          : p
      )
    );
  } catch (err) {
    console.error("Error upvoting problem:", err);
  }
};


  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setShowMyProblems(false);
  };

  const pageNumbers = (() => {
    const current = paginationInfo.currentPage;
    const total = paginationInfo.totalPages;
    const pages: (number | "...")[] = [];
    if (current > 3) {
      pages.push(1);
      if (current > 4) pages.push("...");
    }
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i);
    if (current < total - 2) {
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }
    return pages;
  })();

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--pink)" } as CSSProperties}>
      <PageHero
        eyebrow="Problem discovery"
        title="Problems Worth Solving"
        description="Real challenges identified by our community. Each problem represents an opportunity to create meaningful impact through innovative solutions."
        stats={[
          { value: String(allProblems.length), label: "Total problems" },
          { value: String(filteredProblems.length), label: "Matching results" },
          { value: String(selectedTags.length), label: "Active tags" },
        ]}
        primaryAction={{ label: "Submit a problem", to: "/submit-problem", icon: Plus }}
        layout="center"
        accent="pink"
        signature={
          <TitleMarquee
            items={allProblems
              .filter((p) => p.title && isReadableTitle(p.title))
              .slice(0, 28)
              .map((p) => ({ title: p.title.trim(), href: `/problems/${p.problemId}` }))}
          />
        }
      />

      <section className="lx-section">
        {(
          <div className="lx-toolbar">
            <div className="lx-toolbar-row">
              <label className="lx-search">
                <Search size={18} aria-hidden="true" />
                <input
                  placeholder="Search problems"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search problems"
                />
              </label>
              <select className="lx-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort problems">
                <option value="newest">Newest</option>
                <option value="upvotes">Most upvoted</option>
                <option value="comments">Most discussed</option>
              </select>
              {user && (
                <button className={`lx-toggle${showMyProblems ? " is-on" : ""}`} onClick={() => setShowMyProblems(!showMyProblems)} aria-pressed={showMyProblems}>
                  My problems
                </button>
              )}
            </div>

            {(searchTerm || selectedTags.length > 0 || showMyProblems) && (
              <div className="lx-active">
                <span>
                  Filtering
                  {searchTerm && <> / search <b>"{searchTerm}"</b></>}
                  {selectedTags.length > 0 && <> / <b>{selectedTags.length}</b> tag{selectedTags.length > 1 ? "s" : ""}</>}
                  {showMyProblems && <> / <b>mine</b></>}
                </span>
                <button className="lx-textbtn" onClick={clearFilters}>Clear all ×</button>
              </div>
            )}

            {tagsWithCounts.length > 0 && (
              <div>
                <div className="lx-tags-head">
                  <span>{showAllTags ? "All tags" : "Top tags"}</span>
                  <button className="lx-textbtn" onClick={() => setShowAllTags(!showAllTags)}>
                    {showAllTags ? "Show top 20" : "Show all tags"}
                  </button>
                </div>
                <div className={`lx-tags${showAllTags ? " is-all" : ""}`}>
                  {(showAllTags ? tagsWithCounts : tagsWithCounts.slice(0, 20)).map(([tag, count]) => (
                    <button
                      key={tag}
                      className={`lx-tag${selectedTags.includes(tag) ? " is-on" : ""}`}
                      onClick={() => toggleTag(tag)}
                      aria-pressed={selectedTags.includes(tag)}
                    >
                      {tag}<small>{count}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPageProblems.length > 0 && (
          <div className="lx-grid">
            {currentPageProblems.map((problem, i) => (
              <article key={problem.id || problem.problemId} id={`problem-${problem.problemId}`} className="lx-card">
                <Link to={`/problems/${problem.problemId}`} className="lx-card-link" aria-label={problem.title} />
                <div className="lx-card-media">
                  <CardCover title={problem.title} image={problem.image} />
                  <span className="lx-card-kicker">{String(startIndex + i + 1).padStart(2, "0")} / Problem</span>
                  <div className="lx-card-vote">
                    <UpvoteButton
                      upvotes={problem.upvotes}
                      hasUpvoted={problem.likedByUser}
                      onClick={(e) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        handleUpvote(problem.problemId);
                      }}
                    />
                  </div>
                </div>
                <div className="lx-card-body">
                  {problem.tags.length > 0 && (
                    <div className="lx-card-tags">
                      {problem.tags.slice(0, 3).map((tag: string) => <span key={tag}>{tag}</span>)}
                      {problem.tags.length > 3 && <span>+{problem.tags.length - 3}</span>}
                    </div>
                  )}
                  <h3 className="lx-card-title">{problem.title}</h3>
                  <p className="lx-card-text">{problem.briefparagraph}</p>
                  <div className="lx-card-meta">
                    <span>{problem.addedByName ? `By ${problem.addedByName} · ` : ""}{problem.comments?.length ?? 0} comments</span>
                    <em>Read ↗</em>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {paginationInfo.totalPages > 1 && (
          <nav className="lx-pager" aria-label="Pagination">
            <span>Showing {currentPageProblems.length} of {paginationInfo.totalItems} / page {paginationInfo.currentPage} of {paginationInfo.totalPages}</span>
            <div className="lx-pages">
              <button className="lx-page" onClick={goToPrevPage} disabled={!paginationInfo.hasPrevPage} aria-label="Previous page">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span key={`gap-${index}`}>…</span>
                ) : (
                  <button
                    key={page}
                    className={`lx-page${page === paginationInfo.currentPage ? " is-on" : ""}`}
                    onClick={() => goToPage(page)}
                    aria-current={page === paginationInfo.currentPage ? "page" : undefined}
                  >
                    {String(page).padStart(2, "0")}
                  </button>
                )
              )}
              <button className="lx-page" onClick={goToNextPage} disabled={!paginationInfo.hasNextPage} aria-label="Next page">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}

        {currentPageProblems.length === 0 && filteredProblems.length > 0 && (
          <div className="lx-empty">
            <strong>Nothing on this page.</strong>
            <button className="lx-textbtn" onClick={() => goToPage(1)}>Go to page 01</button>
          </div>
        )}

        {isLoading && <div className="lx-loading">Loading problems</div>}

        {!isLoading && filteredProblems.length === 0 && (
            <div className="lx-empty">
              <strong>{allProblems.length ? "No matches." : "No problems yet."}</strong>
              {allProblems.length ? (
                <button className="lx-textbtn" onClick={clearFilters}>Clear filters</button>
              ) : (
                <Link to="/submit-problem" className="lx-textbtn">Be the first to submit one ↗</Link>
              )}
            </div>
        )}

        {!user && (
          <div className="lx-gate">
            <span>Join in</span>
            <h2>Seen a problem <em>worth solving?</em></h2>
            <p>Sign in with your college Google account to post your own, upvote the ones that matter and join the discussion.</p>
            <Link to="/login" className="lx-cta">Sign in to post ↗</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Problems;
