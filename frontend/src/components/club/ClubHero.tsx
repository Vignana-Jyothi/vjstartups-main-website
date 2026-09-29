import { clubInfo, wings, wingDisplayName } from "@/data/clubInfo";
import { WordLine } from "@/components/design-system/HeroSignatures";
import { PageHero } from "@/components/design-system/PageHero";

interface ClubHeroProps {
  onExploreWings: () => void;
  onGetInvolved: () => void;
  onOpenWing: (wingId: string) => void;
}

export function ClubHero({ onExploreWings, onGetInvolved, onOpenWing }: ClubHeroProps) {
  const stats = [
    { value: `${clubInfo.totalMembers}+`, label: "Active members" },
    { value: `${clubInfo.totalStartups}+`, label: "Potential startups" },
    { value: clubInfo.totalFunding, label: "Funding raise target" },
    { value: clubInfo.outReach, label: "Members outreach" },
  ];

  return (
    <PageHero
      eyebrow="Club"
      title={clubInfo.name}
      description={clubInfo.tagline}
      stats={stats}
      layout="center"
      signature={<WordLine words={wings.map((w) => ({ id: w.id, label: wingDisplayName(w.name).replace(/ Wing$/, "") }))} onPick={onOpenWing} />}
    >
      <div className="lx-gate-actions">
        <button type="button" className="lx-cta" onClick={onGetInvolved}>
          Get involved ↗
        </button>
        <button type="button" className="lx-textbtn" onClick={onExploreWings}>
          Explore the eight wings ↗
        </button>
      </div>
    </PageHero>
  );
}
