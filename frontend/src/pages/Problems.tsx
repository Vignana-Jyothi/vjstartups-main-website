import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, ArrowUpDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import { PageHero } from "@/components/design-system/PageHero";
import axios from "axios";
import { useUser } from "../pages/UserContext"; 

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

  const itemsPerPage = 12; // Works well: mobile=12 rows, tablet=6 rows, desktop=4 rows

  // Fetch all problems at once
  const fetchAllProblems = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems?limit=1000`);
      const problemsData = res.data.problems || res.data; // Handle both old and new API response
      
      // Mark which problems the current user has already liked
      const updatedProblems = problemsData.map((p: any) => ({
        ...p,
        likedByUser: p.upvotedBy.includes(user.email)
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
            problemCard.classList.add('ring-2', 'ring-orange-400');
            setTimeout(() => {
              problemCard.classList.remove('ring-2', 'ring-orange-400');
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

    // Apply sorting
    const sorted = filtered.sort((a, b) => {
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
  if (!user?.email) return;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problemId}/upvote`,
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
              likedByUser: res.data.upvotedBy.includes(user.email),
            }
          : p
      )
    );
  } catch (err) {
    console.error("Error upvoting problem:", err);
  }
};


  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Problem discovery"
        title="Problems Worth Solving"
        description="Real challenges identified by our community. Each problem represents an opportunity to create meaningful impact through innovative solutions."
        stats={[
          { value: String(allProblems.length), label: "Total problems" },
          { value: String(filteredProblems.length), label: "Matching results" },
          { value: String(selectedTags.length), label: "Active tags" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[420px] md:min-h-[520px]"
      />

      <section className="page-section">
        <div className="section-container space-y-8">
          <div className="flex justify-end">
            <Link to="/submit-problem">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Submit Problem
              </Button>
            </Link>
          </div>

          {/* Filters & Search - Only show when user is logged in */}
          {user && (
            <div className="section-panel p-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vj-muted" size={20} />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-vj-muted" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="upvotes">Most Upvoted</option>
                    <option value="comments">Most Discussed</option>
                  </select>
                </div>

                <Button
                  variant={showMyProblems ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMyProblems(!showMyProblems)}
                  className="flex items-center gap-2"
                >
                  <Filter size={14} />
                  My Problems
                </Button>
              </div>

              {(searchTerm || selectedTags.length > 0 || showMyProblems) && (
                <div className="flex items-center justify-between border-t border-vj-border/50 pt-4">
                  <div className="flex items-center gap-2 text-sm text-vj-muted">
                    <span>Active filters:</span>
                    {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
                    {selectedTags.length > 0 && <Badge variant="secondary">{selectedTags.length} tag(s)</Badge>}
                    {showMyProblems && <Badge variant="secondary">My Problems</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                      setShowMyProblems(false);
                    }}
                    className="text-sm"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-vj-muted" />
                    <span className="text-sm font-medium text-vj-primary">
                      {showAllTags ? "All tags:" : "Top tags:"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs"
                  >
                    {showAllTags ? "Show top 20" : "Show all tags"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllTags ? tagsWithCounts : tagsWithCounts.slice(0, 20)).map(([tag, count]) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-all flex items-center gap-1"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedTags.includes(tag)
                          ? 'bg-white/20 text-white'
                          : 'bg-vj-neutral text-vj-muted'
                      }`}>
                        {count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPageProblems.map(problem => (
            <div 
              key={problem.id || problem.problemId} 
              id={`problem-${problem.problemId}`}
              className="vj-card-problem group rounded-xl shadow-lg overflow-hidden transition-all duration-300">
              {/* Problem Image */}
              <Link to={`/problems/${problem.problemId}`} className="block cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img 
                    src={problem.image || '/problem_placeholder_cover1.png'}
                    alt={problem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-white text-xs font-medium">Problem</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                  <UpvoteButton
                    upvotes={problem.upvotes}
                    hasUpvoted={problem.likedByUser} // this controls the highlight
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      e.stopPropagation(); // Stop event bubbling
                      handleUpvote(problem.problemId);
                    }}
                  />
                  </div>
                </div>
              </Link>

              <div className="p-4 space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {problem.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-problem-primary/30 text-problem-primary">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                      +{problem.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-vj-primary group-hover:text-problem-primary transition-colors">
                  <Link to={`/problems/${problem.problemId}`} className="hover:underline">
                    {problem.title}
                  </Link>
                </h3>

                <Link to={`/problems/${problem.problemId}`}>
                  <p className="text-vj-muted leading-relaxed h-[168px] overflow-hidden relative cursor-pointer hover:text-vj-primary transition-colors">
                    {problem.briefparagraph}
                    <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent w-full h-8 dark:from-[rgb(25,15,17)] dark:via-[rgb(25,15,17)]"></span>
                    {/* Only show ellipsis if the text is actually truncated/overflowing, TODO(mkrishna): Above colors to be adjusted */}
                    {problem.briefparagraph && problem.briefparagraph.length > 300 && (
                      <span className="absolute bottom-0 right-0 mr-2 text-vj-muted">...</span>
                    )}
                  </p>
                </Link>

                <div className="flex items-center justify-between text-sm text-vj-muted pt-2 border-t border-vj-border/50">
                  <span>by {problem.addedByName}</span>

                  <span>{problem.comments.length} comments</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to={`/problems/${problem.problemId}`} className="flex-1">
                  <Button 
  size="default"
  variant="outline"
  className="w-full"
>
  View Details
</Button>
                  </Link>
                  {/* <Link to={`/ideas?problem=${problem.problemId}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full border-problem-primary/30 text-problem-primary hover:bg-problem-light">
                      View Ideas
                    </Button>
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-vj-border/50">
            {/* Page Info */}
            <div className="text-sm text-vj-muted">
              Showing {currentPageProblems.length} of {paginationInfo.totalItems} problems
              <span className="hidden sm:inline"> (Page {paginationInfo.currentPage} of {paginationInfo.totalPages})</span>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={!paginationInfo.hasPrevPage}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {(() => {
                  const current = paginationInfo.currentPage;
                  const total = paginationInfo.totalPages;
                  const pages = [];

                  // Always show first page
                  if (current > 3) {
                    pages.push(1);
                    if (current > 4) pages.push('...');
                  }

                  // Show pages around current
                  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
                    pages.push(i);
                  }

                  // Always show last page
                  if (current < total - 2) {
                    if (current < total - 3) pages.push('...');
                    pages.push(total);
                  }

                  return pages.map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-vj-muted">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={page === current ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className={`min-w-[40px] ${page === current ? 'bg-problem-primary hover:bg-problem-primary/90' : ''}`}
                      >
                        {page}
                      </Button>
                    )
                  ));
                })()}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={!paginationInfo.hasNextPage}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* No problems on current page but have filtered results */}
        {currentPageProblems.length === 0 && filteredProblems.length > 0 && (
          <div className="text-center py-16">
            <p className="text-vj-muted text-lg">No problems on this page.</p>
            <p className="text-vj-muted text-sm mt-2">
              Found {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} matching your filters on {paginationInfo.totalPages} page{paginationInfo.totalPages !== 1 ? 's' : ''}.
            </p>
            <Button 
              variant="outline" 
              onClick={() => goToPage(1)}
              className="mt-4"
            >
              Go to Page 1
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-problem-primary"></div>
          </div>
        )}

{!user ? (
  <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950/30 dark:via-gray-900 dark:to-orange-900/30 rounded-xl shadow-inner border border-orange-200 dark:border-orange-800/50">
    <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-3">Join the Community 🚀</h2>
    <p className="text-vj-muted max-w-md text-center mb-6">
      You need to be logged in to explore community problems, upvote ideas, and submit your own challenges.  
      Sign in and start making an impact today!
    </p>
    <Link to="/login">
      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105">
        Login to Continue
      </Button>
    </Link>
  </div>
) : filteredProblems.length === 0 && (
  <div className="text-center py-16">
    <p className="text-vj-muted text-lg">No problems match your current filters.</p>
    <Button 
      variant="ghost" 
      onClick={() => { setSearchTerm(""); setSelectedTags([]); setShowMyProblems(false); }}
      className="mt-4"
    >
      Clear Filters
    </Button>
  </div>
)}

      </div>
    </section>
    </div>
  );
};

export default Problems;
