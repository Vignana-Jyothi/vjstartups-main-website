import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/design-system/PageHero";
import "@/components/design-system/listing.css";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  lastActivityAt: string;
  reputationScore?: number;
}

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return `${Math.floor(diffDays / 7)}w ago`;
};

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read through the site's backend, which fetches the VJOS leaderboard server-to-server (the
    // browser can't read VJOS directly) and returns only members who have earned points.
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6220';

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${apiBase}/leaderboard-api/members`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const data = await response.json();
        const mappedEntries: LeaderboardEntry[] = (data.members || []).map((member: any, index: number) => ({
          rank: index + 1,
          id: member.id,
          name: member.name,
          avatar: member.avatar || undefined,
          lastActivityAt: member.updatedAt || new Date().toISOString(),
          reputationScore: member.reputationScore
        }));
        setEntries(mappedEntries);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // 30 second poll for frontend feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-shell lx">
      <PageHero
        kind="tool"
        eyebrow="Virtual startup journey"
        title="Leaderboard"
        description="Members ranked by their reputation score on the platform."
        backLink={{ label: "Home", to: "/" }}
        stats={[
          { value: String(entries.length), label: entries.length === 1 ? "Ranked member" : "Ranked members" },
          {
            value: entries.length ? String(Math.round(Math.max(...entries.map((e) => Number(e.reputationScore ?? 0))))) : "0",
            label: "Top score",
          },
        ]}
      />

      <section className="lx-section">
        {loading ? (
          <div className="lx-loading">Loading leaderboard</div>
        ) : entries.length === 0 ? (
          <div className="lx-empty">
            <strong>No one ranked yet.</strong>
            <Link to="/journey" className="lx-textbtn">Start the journey ↗</Link>
          </div>
        ) : (
          <ol className="lb">
            {entries.map((entry) => (
              <li key={entry.id} className={`lb-row${entry.rank <= 3 ? " is-top" : ""}`}>
                <span className="lb-rank">{String(entry.rank).padStart(2, "0")}</span>
                {entry.avatar ? (
                  <img className="lb-avatar" src={entry.avatar} alt="" />
                ) : (
                  <i className="lb-avatar lb-initials" aria-hidden="true">{initials(entry.name)}</i>
                )}
                <div className="lb-who">
                  <b>{entry.name}</b>
                  <span>Active {getTimeAgo(entry.lastActivityAt)}</span>
                </div>
                <div className="lb-score">
                  <b>{Number(entry.reputationScore ?? 0).toFixed(entry.reputationScore && entry.reputationScore % 1 ? 2 : 0)}</b>
                  <span>Reputation</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default Leaderboard;
