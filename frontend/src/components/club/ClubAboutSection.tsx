import { Building, Target, Eye } from "lucide-react";
import { clubInfo } from "@/data/clubInfo";
import { ClubSectionHeader } from "./ClubSectionHeader";

export function ClubAboutSection() {
  return (
    <div className="vj-card-innovation animate-fade-in-up">
      <ClubSectionHeader
        title="About VJ Startups Club"
        icon={Building}
      />
      <p className="mb-8 text-lg leading-relaxed text-vj-muted">{clubInfo.description}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-vj-large border border-vj-border bg-vj-surface p-6 transition-shadow duration-300 hover:shadow-[var(--vj-shadow-subtle)]">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-vj-primary">
            <Target className="h-5 w-5 text-green-600" aria-hidden="true" />
            Our Mission
          </h3>
          <p className="text-vj-muted leading-relaxed">{clubInfo.mission}</p>
        </div>

        <div className="rounded-vj-large border border-vj-border bg-vj-surface p-6 transition-shadow duration-300 hover:shadow-[var(--vj-shadow-subtle)]">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-vj-primary">
            <Eye className="h-5 w-5 text-purple-600" aria-hidden="true" />
            Our Vision
          </h3>
          <p className="text-vj-muted leading-relaxed">{clubInfo.vision}</p>
        </div>
      </div>
    </div>
  );
}
