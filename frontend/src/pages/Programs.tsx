import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { useUser } from "@/pages/UserContext";
import "@/components/design-system/listing.css";
import "@/components/design-system/programs.css";
import { startupPrograms, StartupProgram, PROGRAM_CATEGORIES, PROGRAM_STATUS } from "@/data/startupPrograms";
import { PageHero } from "@/components/design-system/PageHero";
import { ProgramStrip } from "@/components/design-system/HeroSignatures";

const Programs = () => {
  const { user } = useUser();

  const groups = startupPrograms.reduce((acc, program) => {
    (acc[program.category] ||= []).push(program);
    return acc;
  }, {} as Record<string, StartupProgram[]>);

  let n = 0;

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <PageHero
        eyebrow="Programs"
        title="VNRVJIET Startup Programs"
        description="Comprehensive ecosystem of programs, workshops, and initiatives designed to nurture student entrepreneurship."
        stats={[
          { value: String(startupPrograms.length), label: "Programs" },
          { value: String(startupPrograms.filter((p) => p.status === "active").length), label: "Running now" },
          { value: "1 hour to 2 months", label: "Program duration" },
        ]}
        signature={
          <ProgramStrip
            items={startupPrograms.map((p) => ({ id: p.id, title: p.title, meta: p.duration, status: p.status }))}
          />
        }
      />

      <section className="lx-section">
        <div className="pg-index">
          {Object.entries(groups).map(([category, programs], g) => (
            <div key={category} className="pg-group">
              <div className="pg-group-label">
                <span>{String(g + 1).padStart(2, "0")}</span>
                <b>{PROGRAM_CATEGORIES[category as StartupProgram["category"]] || category}</b>
              </div>
              <ol className="pg-rows">
                {programs.map((program) => {
                  n += 1;
                  return (
                    <li key={program.id}>
                      <Link to={`/programs/${program.id}`} className="pg-row">
                        <span className="pg-row-no">{String(n).padStart(2, "0")}</span>
                        <div className="pg-row-name">
                          <h3>{program.title}</h3>
                          <p>{program.subtitle}</p>
                        </div>
                        <p className="pg-row-desc">{program.shortDescription}</p>
                        <span className="pg-row-dur">{program.duration}</span>
                        <b className={`pg-status is-${program.status}`}>
                          {PROGRAM_STATUS[program.status]}
                          {program.edition ? <small> / #{program.edition}</small> : null}
                        </b>
                        <i aria-hidden="true">↗</i>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        <div className="lx-gate">
          <span>Your move</span>
          <h2>Ready to start <em>building?</em></h2>
          <p>Join the startup community and turn your ideas into something real.</p>
          <div className="lx-gate-actions">
            <a href="mailto:head.iie@vnrvjiet.in" className="lx-cta">Contact the innovation cell ↗</a>
            <Link to={user ? "/problems" : "/login"} className="lx-textbtn">Explore problems ↗</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
