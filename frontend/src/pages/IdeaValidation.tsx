import type { CSSProperties } from "react";
import IdeaValidationQuestionnaire from "@/components/IdeaValidationQuestionnaire";
import { PageHero } from "@/components/design-system/PageHero";
import "@/components/design-system/listing.css";

const PRINCIPLES = [
  ["Comprehensive analysis", "Evaluate your idea across five dimensions: problem clarity, market potential, solution viability, competitive position and execution readiness."],
  ["Stage transitions", "Check your idea is ready before it moves between stages, from ideation to research, validation, prototyping and beyond."],
  ["Actionable insights", "Get recommendations and concrete next steps from your results, so the next iteration is sharper than the last."],
];

const IdeaValidation = () => (
  <div className="page-shell lx" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
    <PageHero
        kind="tool"
      eyebrow="Idea assessment"
      title="Idea Assessment Center"
      description="A validation tool for startup ideas and stage transitions. Assess your idea's potential, get recommendations, and check readiness for the next stage."
    />
    <section className="lx-section">
      <ol className="iv-steps">
        {PRINCIPLES.map(([title, text], i) => (
          <li key={title}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <IdeaValidationQuestionnaire />
    </section>
  </div>
);

export default IdeaValidation;
