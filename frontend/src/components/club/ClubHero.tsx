import { Users, Rocket, TrendingUp, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubInfo } from "@/data/clubInfo";
import { ClubStatCard } from "./ClubStatCard";
import { PageHero } from "@/components/design-system/PageHero";

interface ClubHeroProps {
  onExploreWings: () => void;
  onGetInvolved: () => void;
}

export function ClubHero({ onExploreWings, onGetInvolved }: ClubHeroProps) {
  const stats = [
    { value: `${clubInfo.totalMembers}+`, label: "Active Members", icon: Users, delay: "delay-100" },
    { value: `${clubInfo.totalStartups}+`, label: "Potential Startups", icon: Rocket, delay: "delay-200" },
    { value: clubInfo.totalFunding, label: "Funding Raise Target", icon: TrendingUp, delay: "delay-300" },
    { value: clubInfo.outReach, label: "Members Outreach", icon: Award, delay: "delay-400" },
  ];

  return (
    <PageHero
      eyebrow="Club"
      title={clubInfo.name}
      description={clubInfo.tagline}
      stats={stats}
      backgroundClassName="bg-[hsl(var(--background-secondary))] relative"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-sm animate-scale-in">
        <Sparkles className="h-4 w-4 text-vj-accent" aria-hidden="true" />
        <span className="text-[hsl(var(--foreground))]">Empowering Startup Ecosystem at VNRVJIET</span>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in delay-200">
        <Button
          size="lg"
          className="min-h-[44px] rounded-vj-button bg-[hsl(var(--foreground))] px-8 font-semibold text-[hsl(var(--vj-accent-foreground))] hover:opacity-90"
          onClick={onExploreWings}
        >
          Explore Wings
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="min-h-[44px] rounded-vj-button border-[hsl(var(--border))/0.12] bg-transparent px-8 text-[hsl(var(--foreground))] hover:bg-white/6"
          onClick={onGetInvolved}
        >
          Get Involved
        </Button>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4" role="list" aria-label="Club statistics">
        {stats.map((stat) => (
          <ClubStatCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} delay={stat.delay} />
        ))}
      </div>
    </PageHero>
  );
}
