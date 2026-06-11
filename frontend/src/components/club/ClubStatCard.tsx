import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubStatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  className?: string;
  delay?: string;
}

export function ClubStatCard({ value, label, icon: Icon, className, delay }: ClubStatCardProps) {
  return (
    <div
      role="group"
      aria-label={`${value} ${label}`}
      className={cn(
        "group rounded-vj-large border border-white/20 bg-white/10 p-5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[var(--vj-shadow-glow)] animate-fade-in-up",
        delay,
        className
      )}
    >
      <div className="mb-3 flex justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-vj-button bg-white/15 transition-colors group-hover:bg-white/25">
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-white md:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-white/75">{label}</p>
    </div>
  );
}
