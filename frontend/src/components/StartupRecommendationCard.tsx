import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Star, Lightbulb, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { 
  StartupRecommendationCriteria, 
  getRecommendationLevel, 
  getRecommendationMessage,
  getMissingCriteria 
} from '@/utils/startupRecommendation';

interface StartupRecommendationCardProps {
  criteria: StartupRecommendationCriteria;
  ideaId: string;
  className?: string;
  onBack?: () => void; // Optional callback for back navigation
  onContinue?: () => void; // Optional callback for continue action
  questionnaireResponses?: any; // Actual questionnaire responses to pass to StartupForm
}

const StartupRecommendationCard: React.FC<StartupRecommendationCardProps> = ({
  criteria,
  ideaId,
  className = "",
  onBack,
  onContinue,
  questionnaireResponses
}) => {
  const navigate = useNavigate();
  const level = getRecommendationLevel(criteria);
  const message = getRecommendationMessage(level);
  const { trl6: currentStageMissing, trl7: nextStageMissing } = getMissingCriteria(criteria);
  
  const getIcon = () => {
    switch (level) {
      case 'high': return <Rocket className="w-6 h-6 text-green-600" />;
      case 'medium': return <Star className="w-6 h-6 text-yellow-600" />;
      case 'low': return <Lightbulb className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBadgeVariant = () => {
    switch (level) {
      case 'high': return 'default'; // green
      case 'medium': return 'secondary'; // yellow
      case 'low': return 'outline'; // gray
    }
  };

  const getBadgeText = () => {
    switch (level) {
      case 'high': return 'Ready for Startup';
      case 'medium': return 'Potential Startup';
      case 'low': return 'Early Stage';
    }
  };

  const handleCreateStartup = () => {
    // Pass questionnaire responses as URL-encoded data
    const searchParams = new URLSearchParams({ ideaId });
    if (questionnaireResponses) {
      searchParams.append('responses', JSON.stringify(questionnaireResponses));
    }
    navigate(`/startup-form?${searchParams.toString()}`);
  };

  const metCriteriaCount = Object.values(criteria).filter(Boolean).length;
  const totalCriteria = Object.values(criteria).length;

  return (
    <Card className={`${className} border-2 ${level === 'high' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 
      level === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' : 
      'border-blue-200 bg-blue-50 dark:bg-blue-900/10'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className="text-xl font-bold">Startup Recommendation</CardTitle>
              <Badge variant={getBadgeVariant()} className="mt-1">
                {getBadgeText()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{metCriteriaCount}/{totalCriteria}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Criteria Met</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        
        {/* Criteria Status */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Startup Readiness Criteria:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(criteria).map(([key, met]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {met ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={met ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Criteria */}
        {(currentStageMissing.length > 0 || nextStageMissing.length > 0) && (
          <div className="space-y-3">
            {currentStageMissing.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-red-700 dark:text-red-400">Current Stage Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {currentStageMissing.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {nextStageMissing.length > 0 && level !== 'low' && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Future Growth Areas (TRL 7+):</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {nextStageMissing.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {level === 'high' && (
            <Button 
              onClick={handleCreateStartup}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Create Startup Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {level === 'medium' && (
            <Button 
              onClick={handleCreateStartup}
              variant="outline"
              className="flex-1 border-yellow-600 text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            >
              <Star className="w-4 h-4 mr-2" />
              Consider Startup Creation
            </Button>
          )}
          
          <Button 
            variant="secondary"
            onClick={() => {
              if (onContinue) {
                onContinue();
              } else {
                navigate(`/idea-validation`);
              }
            }}
            className="flex-1"
          >
            Continue Validation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupRecommendationCard;