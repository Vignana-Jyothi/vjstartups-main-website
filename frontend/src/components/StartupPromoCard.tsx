import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Star, TrendingUp, ArrowRight } from 'lucide-react';

interface StartupPromoCardProps {
  ideaId: string;
  worthinessLevel: 'high' | 'medium' | 'low';
  className?: string;
}

const StartupPromoCard: React.FC<StartupPromoCardProps> = ({
  ideaId,
  worthinessLevel,
  className = ""
}) => {
  const navigate = useNavigate();

  const getPromoContent = () => {
    switch (worthinessLevel) {
      case 'high':
        return {
          icon: <Rocket className="w-8 h-8 text-green-600" />,
          badge: 'Ready for Startup',
          badgeVariant: 'default' as const,
          title: '🚀 Your Idea is Startup Ready!',
          description: 'Congratulations! Your idea has met the key criteria for startup formation. You\'re ready to take the next step.',
          buttonText: 'Create Your Startup',
          buttonClass: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
          bgClass: 'border-green-200 bg-green-50 dark:bg-green-900/10'
        };
      case 'medium':
        return {
          icon: <Star className="w-8 h-8 text-yellow-600" />,
          badge: 'Potential Startup',
          badgeVariant: 'secondary' as const,
          title: '⭐ Great Startup Potential!',
          description: 'Your idea shows strong startup potential. Consider addressing the remaining criteria to maximize your chances of success.',
          buttonText: 'Consider Startup Creation',
          buttonClass: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
          bgClass: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10'
        };
      default:
        return null;
    }
  };

  const content = getPromoContent();
  if (!content) return null;

  const handleCreateStartup = () => {
    navigate(`/startup-form?ideaId=${ideaId}`);
  };

  return (
    <Card className={`${className} ${content.bgClass} border-2`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.icon}
            <div>
              <CardTitle className="text-xl">{content.title}</CardTitle>
              <Badge variant={content.badgeVariant} className="mt-2">
                {content.badge}
              </Badge>
            </div>
          </div>
          <TrendingUp className="w-6 h-6 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {content.description}
        </p>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleCreateStartup}
            className={`flex-1 ${content.buttonClass} text-white`}
          >
            <Rocket className="w-4 h-4 mr-2" />
            {content.buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupPromoCard;