import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Medal, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/design-system/PageHero";

interface LeaderboardEntry {
  rank: number;
  email: string;
  name: string;
  avatar?: string;
  stagesCompleted: number;
  lastActivityAt: string;
  badgeType: 'founder' | 'innovator' | 'pioneer';
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

const getStageAchievementName = (stagesCompleted: number): string => {
  const stages = [
    { id: 'problem', name: 'Problem Pathfinder' },
    { id: 'ideation', name: 'Concept Architect' },
    { id: 'research', name: 'Feasibility Explorer' },
    { id: 'validation', name: 'Validation Champion' },
    { id: 'prototype', name: 'Prototype Builder' },
    { id: 'mvp', name: 'Launch Leader' },
    { id: 'scaling', name: 'Scale Strategist' }
  ];

  if (stagesCompleted <= 0) {
    return 'Journey Starter';
  }

  const stageIndex = Math.min(stagesCompleted, stages.length) - 1;
  return stages[stageIndex]?.name || 'Journey Achiever';
};

const getAchievementStyles = (stagesCompleted: number) => {
  if (stagesCompleted >= 7) {
    return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300';
  }
  if (stagesCompleted >= 5) {
    return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300';
  }
  if (stagesCompleted >= 3) {
    return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300';
  }
  if (stagesCompleted >= 1) {
    return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300';
  }
  return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
  return <span className="text-sm font-bold text-gray-600 dark:text-gray-300">#{rank}</span>;
};

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification-api/stage-notifications/leaderboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const data = await response.json();
        setEntries(data.leaderboard || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Virtual startup journey"
        title="Leaderboard"
        description="All users ranked by completed stages."
        backLink={{ label: "Home", to: "/" }}
        stats={[
          { value: String(entries.length), label: "Ranked users", icon: Trophy },
          { value: "Live", label: "Activity feed", icon: Clock },
        ]}
      />

      <section className="page-section">
        <div className="section-container">
        <Card className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-vj-accent-light text-vj-accent rounded-full mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Virtual Startup Journey</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-vj-primary mb-2">Leaderboard</h2>
            <p className="text-vj-muted">All users ranked by completed stages</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading leaderboard...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No leaderboard data available yet.</div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.email}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
                >
                  <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>

                  <img
                    src={entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&size=48`}
                    alt={entry.name}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{entry.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{entry.email}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{entry.stagesCompleted} stages</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(entry.lastActivityAt)}
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getAchievementStyles(entry.stagesCompleted)}`}>
                    {getStageAchievementName(entry.stagesCompleted)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
