import { useState } from "react";
import { CardCover } from "@/components/design-system/CardCover";
import { Link } from "react-router-dom";
import { getIdeaNavigationSlug } from "@/utils/slugUtils";
import StageTransitionModal from "./StageTransitionModal";
import { stageLabels } from "@/data/mockData";
import { useUser } from "@/pages/UserContext";

interface IdeaCardProps {
  idea: {
    ideaId: string;
    title: string;
    description: string;
    titleImage?: string;
    stage: number;
    upvotes: number;
    likedByUser?: boolean;
    comments?: any[];
    team?: Array<{
      name: string;
      role: string;
      email?: string;
    }>;
    mentor?: string;
    addedByEmail: string;
    createdAt: string;
    relatedProblemId?: string;
    relatedProblemTitle?: string;
  };
  onUpvote: (ideaId: string) => void;
  onStageUpdate: (ideaId: string, newStage: number) => void;
}

const IdeaCard = ({ idea, onUpvote, onStageUpdate }: IdeaCardProps) => {
  const [showStageTransition, setShowStageTransition] = useState(false);
  const { user } = useUser();

  const isOwner = user?.email === idea.addedByEmail;
  const canAdvanceStage = isOwner && idea.stage < 9;
  const nextStage = idea.stage + 1;
  const stageProgress = ((idea.stage - 1) / 8) * 100;

  const handleStageTransitionComplete = () => {
    onStageUpdate(idea.ideaId, nextStage);
    setShowStageTransition(false);
  };

  const getStageDescription = (stage: number) => {
    const descriptions: { [key: number]: string } = {
      2: "Conduct market research and user interviews",
      3: "Validate your concept with potential users",
      4: "Build a working prototype of your solution",
      5: "Test your prototype with real users",
      6: "Prepare for market launch",
      7: "Launch your minimum viable product",
      8: "Focus on user acquisition and growth",
      9: "Scale your business or consider exit opportunities"
    };
    return descriptions[stage] || "Continue developing your idea";
  };

  return (
    <>
      <article className="lx-card">
        <Link to={`/ideas/${getIdeaNavigationSlug(idea)}`} className="lx-card-link" aria-label={idea.title} />
        <div className="lx-card-media">
          <CardCover title={idea.title} image={idea.titleImage} />
          <span className="lx-card-kicker">Idea / {stageLabels[idea.stage - 1]}</span>
        </div>
        <div className="lx-card-body">
          <h3 className="lx-card-title">{idea.title}</h3>
          <p className="lx-card-text">{idea.description}</p>
          {idea.relatedProblemId && idea.relatedProblemTitle && (
            <p className="lx-card-line">
              Solves / <Link to={`/problems/${idea.relatedProblemId}`}>{idea.relatedProblemTitle}</Link>
            </p>
          )}
          <div className="lx-stage">
            <div className="lx-stage-bar"><span style={{ width: `${Math.max(stageProgress, 4)}%` }} /></div>
            <span>Stage {idea.stage}/9</span>
          </div>
          <div className="lx-card-meta">
            <span>{idea.comments?.length || 0} comments · ♥ {idea.upvotes}</span>
            <em>Open ↗</em>
          </div>
        </div>
      </article>

      {/* Stage Transition Modal */}
      {showStageTransition && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStageTransition(false);
            }
          }}
        >
          <div 
            className="bg-[hsl(var(--card))] border border-white/10 rounded-[22px] shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <StageTransitionModal
              ideaId={idea.ideaId}
              currentStage={idea.stage}
              targetStage={nextStage}
              onComplete={handleStageTransitionComplete}
              onCancel={() => setShowStageTransition(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default IdeaCard;
