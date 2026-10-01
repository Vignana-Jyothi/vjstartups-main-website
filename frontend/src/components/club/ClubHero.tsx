import { countWord, wingDisplayName } from "@/data/clubInfo";
import { useSiteContent } from "@/data/siteContent";
import { WordLine } from "@/components/design-system/HeroSignatures";
import { PageHero } from "@/components/design-system/PageHero";

interface ClubHeroProps {
  onExploreWings: () => void;
  onGetInvolved: () => void;
  onOpenWing: (wingId: string) => void;
}

export function ClubHero({ onExploreWings, onGetInvolved, onOpenWing }: ClubHeroProps) {
  const { club, wings } = useSiteContent();

  return (
    <PageHero
      eyebrow="Club"
      title={club.name}
      description={club.tagline}
      stats={club.stats}
      layout="center"
      signature={<WordLine words={wings.map((w) => ({ id: w.id, label: wingDisplayName(w.name).replace(/ Wing$/, "") }))} onPick={onOpenWing} />}
    >
      <div className="lx-gate-actions">
        <button type="button" className="lx-cta" onClick={onGetInvolved}>
          Get involved ↗
        </button>
        <button type="button" className="lx-textbtn" onClick={onExploreWings}>
          Explore the {countWord(wings.length)} wings ↗
        </button>
      </div>
    </PageHero>
  );
}
