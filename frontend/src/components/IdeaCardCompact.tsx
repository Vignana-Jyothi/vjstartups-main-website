import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIdeaNavigationSlug } from "@/utils/slugUtils";
import { Users, MessageCircle, ArrowRight, CheckCircle, Target, Lightbulb, Heart, Mail, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  const navigate = useNavigate();

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
      {/* Compact Idea Card */}
      <Card 
        className="p-4 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer group"
        onClick={() => navigate(`/ideas/${getIdeaNavigationSlug(idea)}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1">
            <Lightbulb className="w-3
             h-3 mr-1" />
            Idea
          </Badge>
          <Badge variant="outline" className="text-idea-primary border-idea-primary px-3 py-1">
            {stageLabels[idea.stage - 1]}
          </Badge>
        </div>

        {/* Square Image Container */}
        <div className="relative mb-4 w-full aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300">
          {idea.titleImage ? (
            <div className="w-full h-full">
              <img
                src={idea.titleImage}
                alt={idea.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/80 dark:to-orange-900/80 rounded-xl flex items-center justify-center shadow-inner border border-yellow-200/50 dark:border-yellow-800/50">
                <Lightbulb className="w-20 h-20 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{idea.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{idea.description}</p>
            {idea.relatedProblemId && idea.relatedProblemTitle && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Linked Problem: {" "}
                <Link
                  to={`/problems/${idea.relatedProblemId}`}
                  className="text-idea-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {idea.relatedProblemTitle}
                </Link>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{idea.comments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{idea.upvotes}</span>
            </div>
          </div>

          {/* Stage Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Stage Progress</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{idea.stage}/9</span>
            </div>
            <Progress value={stageProgress} className="h-1.5" />
          </div>

          {/* Advance Button for Owners */}
          {/* {canAdvanceStage && (
            <Button 
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-idea-primary to-green-600 hover:from-idea-primary/90 hover:to-green-600/90 text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={(e) => {
                e.stopPropagation();
                setShowStageTransition(true);
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Advance to</span>
                <span className="font-semibold">{stageLabels[nextStage - 1]}</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          )} */}
        </div>
      </Card>


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
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
