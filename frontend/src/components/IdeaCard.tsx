import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, MessageCircle, ArrowRight, Lock, CheckCircle, Clock, Target, Lightbulb, Heart, Mail, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { user } = useUser();

  const isOwner = user?.email === idea.addedByEmail;
  const canAdvanceStage = isOwner && idea.stage < 9;
  const nextStage = idea.stage + 1;
  const stageProgress = Math.max(0, ((idea.stage - 1) / 8) * 100); // 8 total transitions (1-9 stages)

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
        onClick={() => setShowDetailModal(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1">
            <Lightbulb className="w-3 h-3 mr-1" />
            Idea
          </Badge>
          <Badge variant="outline" className="text-idea-primary border-idea-primary px-3 py-1">
            {stageLabels[idea.stage - 1] || `Stage ${idea.stage}`}
          </Badge>
        </div>

        {/* Idea Icon/Image */}
        <div className="mb-4">
          {idea.titleImage ? (
            <div className="w-12 h-12 mx-auto rounded-full overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src={idea.titleImage} 
                alt={idea.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(idea.ideaId);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Heart className={`w-4 h-4 ${idea.likedByUser ? 'text-red-500 fill-current' : 'text-red-500'}`} />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{idea.upvotes}</span>
            </button>
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
          {canAdvanceStage && (
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-idea-primary to-green-600 hover:from-idea-primary/90 hover:to-green-600/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowStageTransition(true);
              }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Advance to {stageLabels[nextStage - 1] || `Stage ${nextStage}`}
            </Button>
          )}
        </div>
      </Card>

      {/* Detailed View Modal */}
      {showDetailModal && (
        <div 
          className="fixed inset-0 z-[9998] bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Idea
                  </Badge>
                  <Badge variant="outline" className="text-idea-primary border-idea-primary">
                    {stageLabels[idea.stage - 1] || `Stage ${idea.stage}`}
                  </Badge>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Idea Content */}
              <div className="space-y-6">
                <div className="text-center">
                  {idea.titleImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src={idea.titleImage} 
                        alt={idea.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{idea.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{idea.description}</p>
                  {idea.relatedProblemId && idea.relatedProblemTitle && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Linked Problem: </span>
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

                {/* Stats */}
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">{idea.comments?.length || 0} Comments</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpvote(idea.ideaId);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{idea.upvotes} Upvotes</span>
                  </button>
                </div>

                {/* Stage Progress */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development Stage</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{idea.stage}/9 - {stageLabels[idea.stage - 1] || `Stage ${idea.stage}`}</span>
                  </div>
                  <Progress value={stageProgress} className="h-2 mb-3" />
                  
                  {canAdvanceStage && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Ready to advance?
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {getStageDescription(nextStage)}
                          </p>
                        </div>
                        <Target className="w-5 h-5 text-idea-primary" />
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-idea-primary to-green-600 hover:from-idea-primary/90 hover:to-green-600/90 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStageTransition(true);
                        }}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Advance to {stageLabels[nextStage - 1] || `Stage ${nextStage}`}
                      </Button>
                    </div>
                  ) : idea.stage >= 9 ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Journey Complete!</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                      Only the idea owner can advance stages
                    </div>
                  )}
                </div>

                {/* Team Members */}
                {(idea.team && idea.team.length > 0) && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Team Members</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {idea.team.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{member.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentor */}
                {idea.mentor && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Mentor: </span>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">{idea.mentor}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {/* TODO: Add contact team functionality */}}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Team
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
