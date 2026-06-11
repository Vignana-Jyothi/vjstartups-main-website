import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubSectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function ClubSectionHeader({ title, description, icon: Icon, className }: ClubSectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-vj-button bg-vj-accent-light">
            <Icon className="h-5 w-5 text-vj-accent" aria-hidden="true" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-vj-primary md:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-vj-muted md:text-base">{description}</p>}
        </div>
      </div>
    </div>
  );
}
