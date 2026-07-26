import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  change?: string;
  changePositive?: boolean;
  gradient?: string;
}

const StatCard = ({
  label, value, icon: Icon, iconColor = "#7c3aed",
  change, changePositive, gradient
}: StatCardProps) => {
  return (
    <div className="admin-card stat-card relative overflow-hidden">
      {/* Background glow */}
      {gradient && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: gradient }}
        />
      )}

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-xs mt-1.5 font-medium ${changePositive ? "text-emerald-400" : "text-red-400"}`}>
              {changePositive ? "↑" : "↓"} {change}
            </p>
          )}
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}22`, border: `1px solid ${iconColor}33` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
