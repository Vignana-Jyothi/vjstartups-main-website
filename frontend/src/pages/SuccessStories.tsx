import type { CSSProperties } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { startupPrograms } from "@/data/startupPrograms";
import { canWriteStories, useStories } from "@/data/storiesApi";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { PageHero } from "@/components/design-system/PageHero";
import { useUser } from "./UserContext";
import "@/components/design-system/listing.css";

// /stories lists every published story; /programs/:programId/success-stories lists one
// program's. Both read the stories table through the API (see data/storiesApi.ts).
const SuccessStories = () => {
  const { programId } = useParams();
  const { user } = useUser();
  const program = startupPrograms.find((p) => p.id === programId);
  const { stories, status } = useStories(programId);
  const people = stories.reduce((acc, s) => acc + s.participants.length, 0);
  const write = canWriteStories(user?.role) ? { label: "Write up a story", to: "/stories/new", icon: Plus } : undefined;

  if (programId && !program) {
    return (
      <div className="page-shell lx">
        <div className="lx-section">
          <div className="lx-empty">
            <strong>Program not found</strong>
            <Link to="/programs" className="lx-cta">All programs ↗</Link>
          </div>
        </div>
      </div>
    );
  }

  const list =
    status === "loading" ? (
      <div className="lx-loading">Loading stories</div>
    ) : stories.length === 0 ? (
      <div className="lx-empty">
        <strong>{program ? "No stories written up for this program yet" : "No stories written up yet"}</strong>
      </div>
    ) : (
      <div className="ss-features">
        {stories.map((story) => (
          <SuccessStoryCard key={story.id} story={story} programId={story.programId} feature />
        ))}
      </div>
    );

  return (
    <div className="page-shell lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      {program ? (
        <PageHero
          eyebrow="Success stories"
          title="Success Stories"
          description={`${program.title}. What participants built, and what came of it.`}
          backLink={{ label: program.title, to: `/programs/${program.id}` }}
          primaryAction={write}
          stats={[
            { value: String(stories.length), label: stories.length === 1 ? "Story" : "Stories" },
            { value: String(people), label: people === 1 ? "Participant" : "Participants" },
          ]}
        />
      ) : (
        <PageHero
          eyebrow="Student stories"
          title="Student Stories"
          description="What students built through the programs, and what came of it. More are written up as each program runs."
          backLink={{ label: "Home", to: "/" }}
          primaryAction={write}
          stats={[
            { value: String(stories.length), label: stories.length === 1 ? "Story" : "Stories" },
            { value: String(people), label: people === 1 ? "Student" : "Students" },
          ]}
        />
      )}

      <section className="lx-section">
        {list}
        <div className="lx-gate">
          <span>Your turn</span>
          <h2>Write the next <em>one.</em></h2>
          {program ? (
            <>
              <p>Join {program.title} and become part of VNRVJIET's innovation ecosystem.</p>
              <div className="lx-gate-actions">
                <Link to={`/programs/${program.id}`} className="lx-cta">About {program.title} ↗</Link>
                <Link to="/programs" className="lx-textbtn">All programs ↗</Link>
              </div>
            </>
          ) : (
            <>
              <p>Every story here started with a student joining a program.</p>
              <div className="lx-gate-actions">
                <Link to="/programs" className="lx-cta">Find a program ↗</Link>
                <Link to="/problems" className="lx-textbtn">Explore problems ↗</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
