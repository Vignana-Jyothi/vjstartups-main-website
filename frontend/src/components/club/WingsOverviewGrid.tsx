import { wings, wingDisplayName } from "@/data/clubInfo";

interface WingsOverviewGridProps {
  teamCounts: Record<string, number | undefined>;
  onOpenWing: (wingId: string) => void;
}

export function WingsOverviewGrid({ teamCounts, onOpenWing }: WingsOverviewGridProps) {
  return (
    <section className="lx-block">
      <div className="lx-sec-head">
        <span>02 / Structure</span>
        <h2>Our eight wings</h2>
      </div>
      <p className="cl-sub">Each wing adds a different kind of support to the startups in our ecosystem.</p>
      <div className="lx-grid cl-wings">
        {wings.map((wing, index) => {
          const count = teamCounts[wing.id];
          return (
            <article key={wing.id} className="lx-card">
              <button
                type="button"
                className="lx-card-link"
                aria-label={`${wingDisplayName(wing.name)} details`}
                onClick={() => onOpenWing(wing.id)}
              />
              <div className="lx-card-body">
                <div className="lx-card-status">
                  <span>Wing {String(index + 1).padStart(2, "0")}</span>
                  {count ? <b className="is-active">{count} on the team</b> : null}
                </div>
                <h3 className="lx-card-title">{wingDisplayName(wing.name)}</h3>
                <p className="lx-card-text">{wing.description}</p>
                <div className="lx-card-meta">
                  <span>{wing.subWings?.length ? `${wing.subWings.length} programs` : ""}</span>
                  <em>Details ↗</em>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
