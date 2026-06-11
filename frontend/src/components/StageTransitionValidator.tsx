import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, X } from "lucide-react";
import { stageLabels } from "@/data/mockData";
import IdeaValidationQuestionnaire from "./IdeaValidationQuestionnaire";

interface StageTransitionValidatorProps {
  currentStage: number;
  targetStage: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ideaTitle?: string;
}

const StageTransitionValidator = ({
  currentStage,
  targetStage,
  isOpen,
  onClose,
  onConfirm,
  ideaTitle = "your idea"
}: StageTransitionValidatorProps) => {
  const [hasValidated, setHasValidated] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const isMovingForward = targetStage > currentStage;
  const stageGap = targetStage - currentStage;

  const handleValidationComplete = () => {
    setHasValidated(true);
    setShowQuestionnaire(false);
  };

  const handleStartValidation = () => {
    setShowQuestionnaire(true);
  };

  const handleProceedWithoutValidation = () => {
    onConfirm();
    onClose();
  };

  const handleProceedWithValidation = () => {
    if (hasValidated) {
      onConfirm();
      onClose();
    }
  };

  if (showQuestionnaire) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Stage Transition Validation
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowQuestionnaire(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <IdeaValidationQuestionnaire 
            stageTransition={{
              from: currentStage,
              to: targetStage,
              stageLabels: stageLabels
            }}
            onComplete={handleValidationComplete}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Stage Transition Validation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage Transition Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center">
                <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                  {currentStage + 1}. {stageLabels[currentStage]}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600" />
              <div className="text-center">
                <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium text-green-800">
                  {targetStage + 1}. {stageLabels[targetStage]}
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-blue-700">
            <p className="font-medium">🚀 Ready to start researching your idea?</p>
            <p>Let's validate your foundation first to ensure productive research.</p>
          </div>
          </div>

          {/* Validation Recommendation */}
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">
                    Validation Required for Research Stage
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Moving from <strong>Ideation</strong> to <strong>Research</strong> is a critical milestone. 
                    Before proceeding to research your market and competitors, we need to validate that {ideaTitle} has a solid foundation.
                  </p>
                  
                  <div className="space-y-2 text-sm text-amber-700">
                    <p><strong>Why validation is essential at this stage:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ensure your problem definition is clear and compelling</li>
                      <li>Validate there's genuine market demand</li>
                      <li>Confirm your target audience is well-defined</li>
                      <li>Assess initial solution-market fit potential</li>
                      <li>Get strategic guidance for your research phase</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            {hasValidated ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Validation Complete!</h3>
                    <p className="text-sm text-green-700">
                      Great! You've completed the validation assessment. You can now proceed with the stage transition.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-gray-800">Ready to Validate?</h3>
                  <p className="text-sm text-gray-600">
                    Take our comprehensive validation questionnaire to assess your idea's readiness.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handleStartValidation}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Validation Assessment
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Complete the assessment to validate your stage transition.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleProceedWithoutValidation}
              className="flex-1 text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              Skip Validation
            </Button>
            
            <Button 
              onClick={handleProceedWithValidation}
              disabled={!hasValidated}
              className={`flex-1 ${
                hasValidated 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasValidated ? 'Proceed with Validation' : 'Complete Validation First'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StageTransitionValidator;
