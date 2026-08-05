import { useEffect, useState } from "react";
import { Users, Rocket, Lightbulb, AlertCircle, TrendingUp, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import StatCard from "../components/StatCard";
import { fetchStats } from "../services/adminApi";
import { format } from "date-fns";

interface Stats {
  totalUsers: number;
  totalStartups: number;
  totalIdeas: number;
  totalProblems: number;
  adminCount: number;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
  updatedAt: string;
}

interface RecentStartup {
  _id: string;
  startupName: string;
  tagline: string;
  stage: number;
  createdAt: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const buildChartData = (userGrowth: any[], startupGrowth: any[]) => {
  const monthMap: Record<string, { month: string; users: number; startups: number }> = {};

  userGrowth.forEach(({ _id, count }) => {
    const key = `${_id.year}-${_id.month}`;
    if (!monthMap[key]) monthMap[key] = { month: MONTHS[_id.month - 1], users: 0, startups: 0 };
    monthMap[key].users = count;
  });

  startupGrowth.forEach(({ _id, count }) => {
    const key = `${_id.year}-${_id.month}`;
    if (!monthMap[key]) monthMap[key] = { month: MONTHS[_id.month - 1], users: 0, startups: 0 };
    monthMap[key].startups = count;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, val]) => val);
};

const STAGE_LABELS: Record<number, string> = {
  1: "Idea", 2: "Research", 3: "Prototype", 4: "MVP",
  5: "Beta", 6: "Launch", 7: "Growth", 8: "Scale", 9: "Mature"
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentStartups, setRecentStartups] = useState<RecentStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data.stats);
        setChartData(buildChartData(data.charts.userGrowth, data.charts.startupGrowth));
        setRecentUsers(data.recent.users);
        setRecentStartups(data.recent.startups);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="spinner mx-auto" />
          <p className="text-sm text-[#64748b]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card border-red-800/30 bg-red-950/20 text-center p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#111120] border border-[rgba(139,92,246,0.2)] rounded-lg p-3 text-xs shadow-xl">
          <p className="text-[#94a3b8] mb-1 font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          iconColor="#7c3aed"
          gradient="linear-gradient(135deg, #7c3aed 0%, transparent 60%)"
        />
        <StatCard
          label="Startups"
          value={stats?.totalStartups || 0}
          icon={Rocket}
          iconColor="#3b82f6"
          gradient="linear-gradient(135deg, #3b82f6 0%, transparent 60%)"
        />
        <StatCard
          label="Ideas"
          value={stats?.totalIdeas || 0}
          icon={Lightbulb}
          iconColor="#f59e0b"
          gradient="linear-gradient(135deg, #f59e0b 0%, transparent 60%)"
        />
        <StatCard
          label="Problems"
          value={stats?.totalProblems || 0}
          icon={AlertCircle}
          iconColor="#10b981"
          gradient="linear-gradient(135deg, #10b981 0%, transparent 60%)"
        />
      </div>

      {/* Chart */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Growth — Last 6 Months</h2>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gStartups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "12px" }}
              />
              <Area
                type="monotone" dataKey="users" name="Users"
                stroke="#7c3aed" strokeWidth={2} fill="url(#gUsers)" dot={false}
              />
              <Area
                type="monotone" dataKey="startups" name="Startups"
                stroke="#3b82f6" strokeWidth={2} fill="url(#gStartups)" dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-sm text-[#475569] py-8">No data for the last 6 months yet.</p>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent users */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#64748b]" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Recent Users</h2>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <img src={u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=7c3aed&color=fff`} alt={u.name} className="avatar w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#e2e8f0] truncate">{u.name}</p>
                  <p className="text-xs text-[#64748b] truncate">{u.email}</p>
                </div>
                <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                  {u.role}
                </span>
              </div>
            ))}
            {!recentUsers.length && <p className="text-sm text-[#475569] text-center py-4">No users yet</p>}
          </div>
        </div>

        {/* Recent startups */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#64748b]" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Recent Startups</h2>
          </div>
          <div className="space-y-3">
            {recentStartups.map((s) => (
              <div key={s.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#e2e8f0] truncate">{s.startupName}</p>
                  <p className="text-xs text-[#64748b] truncate">{s.tagline}</p>
                </div>
                <span className="badge badge-blue text-[10px] flex-shrink-0">
                  Stage {s.stage}: {STAGE_LABELS[s.stage]}
                </span>
              </div>
            ))}
            {!recentStartups.length && <p className="text-sm text-[#475569] text-center py-4">No startups yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
