import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import StartupCard from "@/components/StartupCard";
import { PageHero } from "@/components/design-system/PageHero";
import { fetchStartups } from "@/services/startupsService";
import { StartupListItem, StartupSortOption } from "@/types/startup";
import {
  FUNDING_FILTER_OPTIONS,
  STAGE_FILTER_OPTIONS,
} from "@/utils/startupFormatters";
import { useUser } from "@/pages/UserContext";

const Startups = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [startups, setStartups] = useState<StartupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<StartupSortOption>("newest");
  const [fundingFilter, setFundingFilter] = useState("all");
  const [minStage, setMinStage] = useState("4");

  const loadStartups = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchStartups();
      setStartups(data);
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError("Unable to load startups. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  useEffect(() => {
    document.title = "Startups - VJ Startups";
    return () => {
      document.title = "VJ Startups - A Campus Startup Platform";
    };
  }, []);

  const stageThreshold = parseInt(minStage, 10) || 1;

  const filteredStartups = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let result = startups.filter((startup) => (startup.stage ?? 0) >= stageThreshold);

    if (fundingFilter !== "all") {
      result = result.filter((startup) => startup.fundingStatus === fundingFilter);
    }

    if (normalizedSearch) {
      result = result.filter((startup) => {
        const name = startup.startupName?.toLowerCase() ?? "";
        const tagline = startup.tagline?.toLowerCase() ?? "";
        const description = startup.description?.toLowerCase() ?? "";
        return (
          name.includes(normalizedSearch) ||
          tagline.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        );
      });
    }

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return (b.upvotes ?? 0) - (a.upvotes ?? 0);
        case "stage":
          return (b.stage ?? 0) - (a.stage ?? 0);
        case "newest":
        default:
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
      }
    });
  }, [startups, searchTerm, fundingFilter, minStage, sortBy, stageThreshold]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    fundingFilter !== "all" ||
    minStage !== "4";

  const eligibleCount = useMemo(
    () => startups.filter((s) => (s.stage ?? 0) >= stageThreshold).length,
    [startups, stageThreshold]
  );

  const renderEmptyState = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertTitle>Failed to load startups</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error}</p>
            <Button variant="outline" onClick={loadStartups} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (startups.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-vj-muted mb-4">
            No startups have been submitted yet. Be the first to showcase your venture.
          </p>
          {user ? (
            <Link to="/startup-form">
              <Button className="bg-startup-primary hover:bg-startup-primary/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Create First Startup
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-startup-primary hover:bg-startup-primary/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Create First Startup
              </Button>
            </Link>
          )}
        </div>
      );
    }

    if (eligibleCount === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-vj-muted mb-4">
            No startups match the current stage filter. Try showing all stages.
          </p>
          <Button variant="outline" onClick={() => setMinStage("1")}>
            Show all stages
          </Button>
        </div>
      );
    }

    if (hasActiveFilters) {
      return (
        <div className="text-center py-16">
          <p className="text-vj-muted mb-4">
            No startups match your search or filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFundingFilter("all");
              setMinStage("4");
            }}
          >
            Clear filters
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Startup portfolio"
        title="Startups"
        description="From campus ideas to funded companies."
        stats={[
          { value: String(startups.length), label: "Total startups" },
          { value: String(eligibleCount), label: "Eligible by stage" },
          { value: String(filteredStartups.length), label: "Visible with filters" },
        ]}
        primaryAction={{ label: "Submit Startup", to: "/startup-form", variant: "default", icon: Plus }}
        secondaryAction={{ label: "Explore Problems", to: "/problems", variant: "outline", icon: ArrowUpDown }}
      />

      <section className="page-section">
        <div className="section-container space-y-8">
          <div className="section-panel p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-vj-muted"
                  size={20}
                  aria-hidden
                />
                <Input
                  aria-label="Search startups"
                  placeholder="Search by name, tagline, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {user ? (
                <Link to="/startup-form" className="shrink-0">
                  <Button className="w-full lg:w-auto bg-startup-primary hover:bg-startup-primary/90 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Submit Startup
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="shrink-0">
                  <Button className="w-full lg:w-auto bg-startup-primary hover:bg-startup-primary/90 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Submit Startup
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <ArrowUpDown className="h-4 w-4 text-vj-muted shrink-0" />
                <select
                  aria-label="Sort startups"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as StartupSortOption)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="newest">Newest first</option>
                  <option value="upvotes">Most upvoted</option>
                  <option value="stage">Highest stage</option>
                </select>
              </div>
              <select
                aria-label="Filter by funding status"
                value={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.value)}
                className="w-full sm:flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {FUNDING_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by development stage"
                value={minStage}
                onChange={(e) => setMinStage(e.target.value)}
                className="w-full sm:flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {STAGE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" role="status" aria-live="polite">
              {[1, 2, 3].map((item) => (
                <div key={item} className="vj-card-startup space-y-4">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-28" />
                </div>
              ))}
              <span className="sr-only">Loading startups...</span>
            </div>
          ) : filteredStartups.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Startups;
