import type { CSSProperties } from "react";
import { useParams, Link } from "react-router-dom";
import { getSuccessStoryById, formatStoryDate, Participant } from "@/data/successStories";
import { startupPrograms } from "@/data/startupPrograms";
import { usePdfAvailable } from "@/hooks/usePdfAvailable";
import { PageHero } from "@/components/design-system/PageHero";
import "@/components/design-system/listing.css";
import "./success-story.css";

function participantLinks(p: Participant) {
  const links = [
    p.linkedinUrl && { url: p.linkedinUrl, label: "LinkedIn" },
    p.instagramUrl && { url: p.instagramUrl, label: "Instagram" },
    ...(p.socialLinks ?? []).map((link) => ({ url: link.url, label: link.displayName || link.platform })),
  ].filter(Boolean) as { url: string; label: string }[];
  return links.filter((link, i) => links.findIndex((l) => l.url === link.url) === i);
}

const SuccessStoryDetail = () => {
  const { programId, storyId } = useParams();
  const story = storyId ? getSuccessStoryById(storyId) : undefined;
  const program = startupPrograms.find((p) => p.id === programId);
  const pdfLive = usePdfAvailable(story?.pdfUrl);

  if (!story || !program) {
    return (
      <div className="page-shell lx">
        <div className="lx-section">
          <div className="lx-empty">
            <strong>Story not found</strong>
            <Link to={program ? `/programs/${program.id}/success-stories` : "/programs"} className="lx-cta">
              Back to stories ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const storiesHref = `/programs/${program.id}/success-stories`;
  const headline = story.outcomes?.find((o) => o.metrics);
  let section = 0;
  const nextSection = () => String(++section).padStart(2, "0");

  return (
    <div className="page-shell lx st" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <PageHero
        kind="document"
        eyebrow={`${program.title} / ${story.season}`}
        title={story.title}
        description={story.subtitle}
        backLink={{ label: "Success stories", to: storiesHref }}
        stats={[
          { value: formatStoryDate(story.date), label: "When" },
          { value: String(story.participants.length), label: story.participants.length === 1 ? "Participant" : "Participants" },
          ...(headline ? [{ value: headline.metrics!, label: headline.title }] : []),
        ]}
      >
        {pdfLive && (
          <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer" className="lx-cta">
            Download the report ↗
          </a>
        )}
      </PageHero>

      <section className="lx-section st-grid">
        <div className="st-main">
          {story.overview && <p className="lx-lead st-lead">{story.overview}</p>}

          {story.journey && story.journey.length > 0 && (
            <div className="lx-block">
              <div className="lx-sec-head">
                <span>{nextSection()} / Journey</span>
                <h2>How it went</h2>
              </div>
              <ol className="lx-steps st-steps">
                {story.journey.map((phase, index) => (
                  <li key={phase.phase}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{phase.phase}</strong>
                      <p>{phase.description}</p>
                      {phase.achievement && <p className="st-win">{phase.achievement}</p>}
                      {phase.imageUrl && <img src={phase.imageUrl} alt="" loading="lazy" className="st-phase-img" />}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {story.outcomes && story.outcomes.length > 0 && (
            <div className="lx-block">
              <div className="lx-sec-head">
                <span>{nextSection()} / Outcomes</span>
                <h2>What came of it</h2>
              </div>
              <div className="st-outcomes">
                {story.outcomes.map((outcome) => (
                  <div key={outcome.title} className="st-outcome">
                    {outcome.metrics && <b>{outcome.metrics}</b>}
                    <h3>{outcome.title}</h3>
                    <p>{outcome.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {story.quotes && story.quotes.length > 0 && (
            <div className="lx-block">
              <div className="lx-sec-head">
                <span>{nextSection()} / In their words</span>
                <h2>What the team says</h2>
              </div>
              {story.quotes.map((quote) => (
                <figure key={quote.text} className="st-quote">
                  <blockquote>“{quote.text}”</blockquote>
                  <figcaption>
                    {quote.author} / {quote.designation}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {story.gallery && story.gallery.length > 0 && (
            <div className="lx-block">
              <div className="lx-sec-head">
                <span>{nextSection()} / Gallery</span>
                <h2>From the ground</h2>
              </div>
              <div className="st-gallery">
                {story.gallery.map((media) => (
                  <figure key={media.url}>
                    {media.type === "image" ? (
                      <img src={media.url} alt={media.caption ?? ""} loading="lazy" />
                    ) : (
                      <a href={media.url} target="_blank" rel="noopener noreferrer" className="st-video">
                        <span aria-hidden="true">▶</span>
                        Watch the video ↗
                      </a>
                    )}
                    {media.caption && <figcaption>{media.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="st-side">
          <div className="lx-field">
            <h3>{story.participants.length === 1 ? "Participant" : "Team"}</h3>
            <div className="st-people">
              {story.participants.map((p) => (
                <div key={p.name} className="st-person">
                  <div className="st-avatar">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" /> : p.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{p.name}</strong>
                    {p.role && <em>{p.role}</em>}
                    <small>{p.branch} / {p.year} year</small>
                    <div className="st-links">
                      {participantLinks(p).map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lx-field">
            <h3>Key achievements</h3>
            <ul className="lx-list">
              {story.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
            </ul>
          </div>

          <div className="lx-field">
            <h3>Tags</h3>
            <div className="lx-tags">
              {story.tags.map((tag) => (
                <span key={tag} className="lx-tag is-static">{tag.replace(/-/g, " ")}</span>
              ))}
            </div>
          </div>

          <div className="st-cta">
            <p>Join {program.title} and write your own story.</p>
            <Link to={`/programs/${program.id}`} className="lx-cta">About {program.title} ↗</Link>
            <Link to={storiesHref} className="lx-textbtn">More stories ↗</Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default SuccessStoryDetail;
