import { useEffect, useState } from "react";
import { PageHero } from "@/components/design-system/PageHero";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import "@/components/design-system/listing.css";
import { generateIdeaSlug } from "@/utils/slugUtils";
import { API_BASE } from "@/config/api";

interface ChangeItem {
  id?: string;
  _id?: string;
  userName: string;
  userAvatar?: string;
  stageName: string;
  stageType: "problem" | "idea" | "startup";
  createdAt: string;
  ideaId?: string;
  ideaTitle?: string;
}

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${Math.max(diffInMinutes, 1)}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return `${Math.floor(diffInDays / 7)}w ago`;
};

const AllChanges = () => {
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllChanges = async () => {
      try {
        const pageSize = 100;
        let skip = 0;
        let hasMore = true;
        const allChanges: ChangeItem[] = [];

        while (hasMore) {
          const response = await fetch(
            `${API_BASE}/notification-api/stage-notifications?limit=${pageSize}&skip=${skip}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch changes");
          }

          const data = await response.json();
          const pageData = data.notifications || [];

          allChanges.push(...pageData);
          hasMore = Boolean(data.hasMore);
          skip += pageData.length;

          if (pageData.length === 0) {
            hasMore = false;
          }
        }

        setChanges(allChanges);
      } catch (error) {
        console.error("Error fetching all changes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChanges();
  }, []);

  const TIER: Record<ChangeItem["stageType"], string> = { problem: "var(--pink)", idea: "var(--lime)", startup: "var(--violet)" };
  const dayLabel = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };
  const groups = changes.reduce<{ day: string; items: ChangeItem[] }[]>((acc, change) => {
    const day = dayLabel(change.createdAt);
    const last = acc[acc.length - 1];
    if (last && last.day === day) last.items.push(change);
    else acc.push({ day, items: [change] });
    return acc;
  }, []);
  const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <PageHero
        kind="tool"
        eyebrow="Idea activity"
        title="Progress of Ideas"
        description="The complete history of idea stage unlocks across the platform."
        backLink={{ label: "Home", to: "/" }}
        stats={loading ? undefined : [
          { value: String(changes.length), label: changes.length === 1 ? "Stage unlock" : "Stage unlocks" },
          { value: String(new Set(changes.map((c) => c.userName)).size), label: "Builders" },
        ]}
      />
      <section className="lx-section">
        {loading ? (
          <div className="lx-loading">Loading the activity log</div>
        ) : changes.length === 0 ? (
          <div className="lx-empty">
            <strong>No stage unlocks yet</strong>
            When someone passes a stage on the startup journey, it shows up here.
            <Link to="/journey" className="lx-cta">Start the journey ↗</Link>
          </div>
        ) : (
          <div className="cg">
            {groups.map((group) => (
              <div key={group.day} className="cg-day">
                <h2>{group.day}</h2>
                <ol>
                  {group.items.map((change) => {
                    const ideaSlug = change.ideaId ? generateIdeaSlug(change.ideaTitle || "idea", change.ideaId) : null;
                    const body = (
                      <>
                        {change.userAvatar ? <img src={change.userAvatar} alt="" /> : <i aria-hidden="true">{initials(change.userName)}</i>}
                        <div>
                          <b>{change.userName}</b>
                          <small>{change.ideaTitle || "Journey progress"}</small>
                        </div>
                        <span className="cg-stage">{change.stageName}</span>
                        <em>{getTimeAgo(change.createdAt)}</em>
                      </>
                    );
                    return (
                      <li key={change.id || change._id} style={{ "--tier": TIER[change.stageType] || "var(--lime)" } as CSSProperties}>
                        {ideaSlug ? <Link to={`/ideas/${ideaSlug}`}>{body}</Link> : <div>{body}</div>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllChanges;
