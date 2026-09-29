import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "@/components/design-system/listing.css";
import "@/components/design-system/detail.css";
import "@/components/design-system/programs.css";
import { PageHero } from "@/components/design-system/PageHero";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { PROGRAM_CATEGORIES, PROGRAM_STATUS } from "@/data/startupPrograms";
import { useSiteContent } from "@/data/siteContent";
import { useStories } from "@/data/storiesApi";

const accent = { "--lx-accent": "var(--lime)" } as CSSProperties;

// Some names are stored in capitals ("Dr. TEJASWI POTLURI"); initials like "CH.V.L.L." stay as they are.
const displayName = (name: string) =>
  name.replace(/\b[A-Z]{4,}\b/g, (word) => word[0] + word.slice(1).toLowerCase());

const scrollToMentors = () =>
  document.getElementById("faculty-mentor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const program = useSiteContent().programs.find((p) => p.id === id);
  const { stories } = useStories(program?.id ?? "none");

  // Deep links (the footer's "Mentor network") land on the mentor panel once the page has entered.
  useEffect(() => {
    if (!program?.mentors) return;
    const wantsMentors =
      new URLSearchParams(location.search).get("tab") === "mentors" ||
      /^#(mentors|faculty-mentor-panel)$/i.test(location.hash);
    if (!wantsMentors) return;
    const timer = window.setTimeout(scrollToMentors, 700);
    return () => window.clearTimeout(timer);
  }, [location.search, location.hash, program]);

  if (!program) {
    return (
      <div className="page-shell lx dt" style={accent}>
        <div className="lx-section">
          <div className="lx-empty">
            <strong>Program not found</strong>
            <Link to="/programs" className="lx-cta">All programs ↗</Link>
          </div>
        </div>
      </div>
    );
  }

  const edition = program.edition
    ? `#${program.edition}`
    : program.status === "planned" ? "Not run yet" : "Ongoing";
  const mail = (subject: string) => `mailto:${program.contact.email}?subject=${encodeURIComponent(subject)}`;
  const applyLabel =
    program.status === "planned" ? "Register your interest" : program.status === "completed" ? "Ask about the next run" : "Apply by email";

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: program.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* share sheet dismissed */
    }
  };

  const sections: { label: string; body: ReactNode }[] = [];
  if (program.howToParticipate?.length)
    sections.push({ label: "How to join", body: <ol className="pg-steps">{program.howToParticipate.map((s) => <li key={s}>{s}</li>)}</ol> });
  if (program.support?.length)
    sections.push({ label: "What you get", body: <ul className="lx-list">{program.support.map((s) => <li key={s}>{s}</li>)}</ul> });
  if (program.benefits?.length)
    sections.push({ label: "What you take away", body: <ul className="lx-list">{program.benefits.map((s) => <li key={s}>{s}</li>)}</ul> });
  if (program.eligibility?.length)
    sections.push({ label: "Who can join", body: <ul className="lx-list">{program.eligibility.map((s) => <li key={s}>{s}</li>)}</ul> });
  if (program.timeline?.length)
    sections.push({ label: "Timeline", body: <ol className="pg-steps">{program.timeline.map((s) => <li key={s}>{s}</li>)}</ol> });
  if (program.resources?.length)
    sections.push({
      label: "Resources",
      body: (
        <ul className="dt-links">
          {program.resources.map((r) => (
            <li key={r.title}>
              {r.link ? (
                <a href={r.link} target="_blank" rel="noopener noreferrer"><b>{r.title}</b><small>{r.description}</small><em>Open ↗</em></a>
              ) : (
                <div className="pg-resource"><b>{r.title}</b><small>{r.description}</small></div>
              )}
            </li>
          ))}
        </ul>
      ),
    });

  return (
    <div className="page-shell lx dt" style={accent}>
      <PageHero
        kind="document"
        eyebrow={`Program / ${PROGRAM_CATEGORIES[program.category]}`}
        title={program.title}
        description={program.subtitle}
        backLink={{ label: "Programs", to: "/programs" }}
        stats={[
          { value: program.duration, label: "Duration" },
          { value: PROGRAM_STATUS[program.status], label: "Status" },
          { value: edition, label: "Edition" },
        ]}
      />

      <section className="lx-section dt-grid">
        <div className="dt-main">
          <p className="dt-lead">{program.overview}</p>

          <div className="dt-fields">
            {sections.map((section, i) => (
              <section key={section.label} className="dt-field">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{section.label}</h3>
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          {program.mentors && (
            <section id="faculty-mentor-panel" className="pg-mentors">
              <div className="lx-sec-head">
                <span>Faculty mentors / {program.mentors.length}</span>
                <h2>Pick a mentor</h2>
              </div>
              <div className="pg-mentor-grid">
                {program.mentors.map((mentor) => {
                  const name = displayName(mentor.name);
                  const initials = name.replace(/^Dr\.?\s*/i, "").split(/[\s.]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2);
                  return (
                    <article key={mentor.email || mentor.name} className="pg-mentor">
                      <header>
                        <i aria-hidden="true">{initials}</i>
                        <div>
                          <h3>{name}</h3>
                          <p>{mentor.designation}{mentor.department ? ` / ${mentor.department}` : ""}</p>
                        </div>
                      </header>
                      {mentor.expertise?.length > 0 && (
                        <div className="lx-tags">{mentor.expertise.map((e) => <span key={e} className="lx-tag is-static">{e}</span>)}</div>
                      )}
                      <dl className="dt-facts">
                        {mentor.availability && <div><dt>When</dt><dd>{mentor.availability}</dd></div>}
                        {mentor.location && <div><dt>Where</dt><dd>{mentor.location}</dd></div>}
                        {mentor.contact && <div><dt>Phone</dt><dd>{mentor.contact}</dd></div>}
                      </dl>
                      {mentor.note && <p className="pg-mentor-note">{mentor.note}</p>}
                      <div className="pg-mentor-actions">
                        {mentor.whatsappNumber && (
                          <a href={`https://wa.me/${mentor.whatsappNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="lx-cta">WhatsApp ↗</a>
                        )}
                        {mentor.contact && <a href={`tel:${mentor.contact.replace(/\s/g, "")}`} className="lx-textbtn">Call</a>}
                        {mentor.email && <a href={`mailto:${mentor.email}`} className="lx-textbtn">Email</a>}
                        {mentor.resumeLink && <a href={mentor.resumeLink} target="_blank" rel="noopener noreferrer" className="lx-textbtn">Profile ↗</a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {stories.length > 0 && (
            <section className="pg-stories">
              <div className="lx-sec-head">
                <span>Success stories / {stories.length}</span>
                <h2>From this program</h2>
              </div>
              <div className="lx-grid pg-story-grid">
                {stories.slice(0, 2).map((story) => <SuccessStoryCard key={story.id} story={story} programId={program.id} />)}
              </div>
              <Link to={`/programs/${program.id}/success-stories`} className="lx-textbtn">
                {stories.length > 2 ? `All ${stories.length} stories ↗` : "Open the stories page ↗"}
              </Link>
            </section>
          )}
        </div>

        <aside className="dt-side">
          <div className="dt-card">
            <dl className="dt-facts">
              <div><dt>Duration</dt><dd>{program.duration}</dd></div>
              <div><dt>Status</dt><dd><b className={`pg-status is-${program.status}`}>{PROGRAM_STATUS[program.status]}</b></dd></div>
              <div><dt>Edition</dt><dd>{edition}</dd></div>
              <div><dt>Run by</dt><dd>{program.contact.coordinator}</dd></div>
            </dl>
            <div className="dt-actions">
              {program.mentors ? (
                <>
                  <button type="button" className="lx-cta" onClick={scrollToMentors}>Pick a mentor ↓</button>
                  <a href={mail(`${program.title}: a question`)} className="lx-textbtn">Email the coordinator ↗</a>
                </>
              ) : (
                <a href={mail(`${applyLabel === "Apply by email" ? "Joining" : "Interested in"} ${program.title}`)} className="lx-cta">{applyLabel} ↗</a>
              )}
              <button type="button" className="lx-textbtn" onClick={share}>Share ↗</button>
            </div>
            <p className="pg-mail">{program.contact.email}</p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ProgramDetail;
