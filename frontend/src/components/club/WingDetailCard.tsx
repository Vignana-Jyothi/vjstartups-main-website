import { Wing, clubContactHref, wingDisplayName } from "@/data/clubInfo";

interface WingDetailCardProps {
  wing: Wing;
  index: number;
  teamCount?: number;
  onMeetTeam: () => void;
}

const STATUS_TEXT = { active: "Active", planned: "Planned", completed: "Completed" } as const;

// People are listed only in the Team tab, which reads the live team sheet; the roster in
// clubInfo is out of date, so this card sticks to what each wing and program does.
export function WingDetailCard({ wing, index, teamCount, onMeetTeam }: WingDetailCardProps) {
  const name = wingDisplayName(wing.name);

  return (
    <article id={`wing-${wing.id}`} className="cl-wing">
      <header className="cl-wing-head">
        <span className="cl-wing-num">Wing {String(index + 1).padStart(2, "0")}</span>
        <h2>{name}</h2>
        <p>{wing.description}</p>
        <div className="cl-wing-actions">
          {teamCount ? (
            <button type="button" className="lx-textbtn" onClick={onMeetTeam}>
              Meet the team ({teamCount}) ↗
            </button>
          ) : null}
          <a href={clubContactHref(wing.name)} className="lx-textbtn">
            Contact this wing ↗
          </a>
        </div>
      </header>

      <div className="cl-wing-body">
        <div className="lx-field">
          <h3>Purpose</h3>
          <p>{wing.purpose}</p>
        </div>

        <div className="lx-field">
          <h3>Focus areas</h3>
          <div className="lx-tags">
            {wing.focusAreas.map((area) => (
              <span key={area} className="lx-tag is-static">{area}</span>
            ))}
          </div>
        </div>

        {(wing.achievements || wing.currentProjects) && (
          <div className="lx-pair">
            {wing.achievements && (
              <div className="lx-field">
                <h3>Key achievements</h3>
                <ul className="lx-list">
                  {wing.achievements.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
            {wing.currentProjects && (
              <div className="lx-field">
                <h3>Current projects</h3>
                <ul className="lx-list is-violet">
                  {wing.currentProjects.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {wing.subWings && wing.subWings.length > 0 && (
          <details className="cl-subs">
            <summary>
              Program sub-wings <small>{wing.subWings.length}</small>
            </summary>
            <div className="cl-sub-grid">
              {wing.subWings.map((sub) => (
                <div key={sub.id} className="cl-sub-card">
                  <div className="lx-card-status">
                    <span>{sub.edition ? `Season ${sub.edition}` : "Program"}</span>
                    <b className={`is-${sub.status}`}>{STATUS_TEXT[sub.status]}</b>
                  </div>
                  <h4>{sub.name.replace(/\s*Sub-Wing$/, "")}</h4>
                  <p>{sub.description}</p>
                  {sub.currentActivity && (
                    <p className="cl-sub-now">
                      <span>Now</span>
                      {sub.currentActivity}
                    </p>
                  )}
                  {sub.achievements && sub.achievements.length > 0 && (
                    <ul className="lx-list">
                      {sub.achievements.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                  <a href={clubContactHref(sub.name.replace(/\s*Sub-Wing$/, ""))} className="lx-textbtn">
                    Ask about this program ↗
                  </a>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </article>
  );
}
