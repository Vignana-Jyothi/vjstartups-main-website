import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import StartupCard from "@/components/StartupCard";
import { PageHero } from "@/components/design-system/PageHero";
import { StageSignal } from "@/components/design-system/HeroSignatures";
import "@/components/design-system/listing.css";
import { fetchStartups } from "@/services/startupsService";
import { StartupListItem, StartupSortOption } from "@/types/startup";
import {
  FUNDING_FILTER_OPTIONS,
  STAGE_FILTER_OPTIONS,
} from "@/utils/startupFormatters";
import { useUser } from "@/pages/UserContext";
import { CardCover } from "@/components/design-system/CardCover";
import { FUNDED_VENTURES } from "@/data/ventures";
import { counters } from "@/data/mockData";

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

  const submitTo = user ? "/startup-form" : "/login";

  const resetFilters = () => {
    setSearchTerm("");
    setFundingFilter("all");
    setMinStage("4");
  };

  const renderEmptyState = () => {
    if (error) {
      return (
        <div className="lx-empty" role="alert">
          <strong>Couldn't load startups.</strong>
          {error}{" "}
          <button className="lx-textbtn" onClick={loadStartups}>Try again ↻</button>
        </div>
      );
    }
    if (startups.length === 0) {
      // No profiles on the platform yet: show the funded portfolio the homepage names instead of
      // telling visitors there are no startups.
      return (
        <div className="lx-block">
          <div className="lx-sec-head">
            <span>Funded ventures / {FUNDED_VENTURES.length}</span>
            <h2>Already moving</h2>
          </div>
          <div className="lx-grid">
            {FUNDED_VENTURES.map((venture) => (
              <article key={venture.name} className="lx-card">
                <div className="lx-card-media">
                  <CardCover title={venture.name} />
                  <span className="lx-card-kicker">{venture.sector}</span>
                </div>
                <div className="lx-card-body">
                  <h3 className="lx-card-title">{venture.name}</h3>
                  <p className="lx-card-text">{venture.description}</p>
                  <div className="lx-card-meta"><span>Funded venture</span></div>
                </div>
              </article>
            ))}
          </div>
          <p className="st-note">
            Full profiles for these ventures aren't on the platform yet.{" "}
            <Link to={submitTo} className="lx-textbtn">Add your startup ↗</Link>
          </p>
        </div>
      );
    }
    if (eligibleCount === 0) {
      return (
        <div className="lx-empty">
          <strong>Nothing at this stage.</strong>
          <button className="lx-textbtn" onClick={() => setMinStage("1")}>Show all stages</button>
        </div>
      );
    }
    if (hasActiveFilters) {
      return (
        <div className="lx-empty">
          <strong>No matches.</strong>
          <button className="lx-textbtn" onClick={resetFilters}>Clear filters</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--violet)" } as CSSProperties}>
      <PageHero
        eyebrow="Startup portfolio"
        title="Startups"
        description="From campus ideas to funded companies."
        stats={
          !loading && !error && startups.length === 0
            ? [
                { value: String(counters.funded), label: "Funded startups" },
                { value: String(FUNDED_VENTURES.length), label: "Featured below" },
              ]
            : [
                { value: String(startups.length), label: "Total startups" },
                { value: String(eligibleCount), label: "Eligible by stage" },
                { value: String(filteredStartups.length), label: "Visible with filters" },
              ]
        }
        primaryAction={{ label: "Submit a startup", to: submitTo, icon: Plus }}
        secondaryAction={{ label: "Explore problems", to: "/problems", variant: "outline" }}
        layout="stack"
        accent="violet"
        signature={
          <StageSignal
            counts={Array.from({ length: 9 }, (_, i) => startups.filter((s) => (s.stage ?? 0) === i + 1).length)}
          />
        }
      />

      <section className="lx-section">
        <div className="lx-toolbar" hidden={!loading && !error && startups.length === 0}>
          <div className="lx-toolbar-row">
            <label className="lx-search">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label="Search startups"
                placeholder="Search by name, tagline or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <select className="lx-select" aria-label="Sort startups" value={sortBy} onChange={(e) => setSortBy(e.target.value as StartupSortOption)}>
              <option value="newest">Newest first</option>
              <option value="upvotes">Most upvoted</option>
              <option value="stage">Highest stage</option>
            </select>
            <select className="lx-select" aria-label="Filter by funding status" value={fundingFilter} onChange={(e) => setFundingFilter(e.target.value)}>
              {FUNDING_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select className="lx-select" aria-label="Filter by development stage" value={minStage} onChange={(e) => setMinStage(e.target.value)}>
              {STAGE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <div className="lx-active">
              <span>
                Filtering
                {searchTerm.trim() && <> / search <b>"{searchTerm.trim()}"</b></>}
                {fundingFilter !== "all" && <> / funding <b>{fundingFilter}</b></>}
                {minStage !== "4" && <> / stage <b>{minStage}+</b></>}
              </span>
              <button className="lx-textbtn" onClick={resetFilters}>Reset ×</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="lx-loading" role="status" aria-live="polite">Loading startups</div>
        ) : filteredStartups.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="lx-grid">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Startups;
