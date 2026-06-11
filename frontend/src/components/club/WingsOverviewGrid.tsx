import { Badge } from "@/components/ui/badge";
import { wings } from "@/data/clubInfo";
import { ClubSectionHeader } from "./ClubSectionHeader";
import { Layers } from "lucide-react";

export function WingsOverviewGrid() {
  return (
    <div className="vj-card-minimal animate-fade-in-up delay-100">
      <ClubSectionHeader
        title="Our Eight Wings"
        description="Each wing adds different level of support to startups in our ecosystem"
        icon={Layers}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {wings.map((wing, index) => (
          <div
            key={wing.id}
            className="group flex min-h-[180px] flex-col rounded-vj-large border border-vj-border bg-vj-surface p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--vj-shadow-card)]"
          >
            <div className="mb-3 inline-flex self-center rounded-full bg-vj-accent-light px-3 py-1 text-xs font-medium text-vj-accent">
              Wing {index + 1}
            </div>
            <h4 className="mb-2 font-semibold text-vj-primary">{wing.name}</h4>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-vj-muted">{wing.description}</p>
            <Badge variant="outline" className="self-center text-xs">
              {wing.coreTeam.length + 1} Team Members
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
