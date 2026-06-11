import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Lightbulb, AlertCircle, MessageSquare, Users, UserCheck, ExternalLink, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '../pages/UserContext';

interface FABAction {
  icon: React.ElementType;
  label: string;
  action: () => void;
  color: string;
  bgColor: string;
}

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // Hide FAB if user is not logged in
  if (!user) {
    return null;
  }

  // Get context-aware actions based on current page
  const getActions = (): FABAction[] => {
    const baseActions: FABAction[] = [
      {
        icon: AlertCircle,
        label: 'Add Problem',
        action: () => {
          navigate('/problems?action=submit');
          setIsOpen(false);
        },
        color: 'text-red-600',
        bgColor: 'bg-red-50 hover:bg-red-100'
      },
      {
        icon: Lightbulb,
        label: 'Add Idea',
        action: () => {
          navigate('/ideas?action=submit');
          setIsOpen(false);
        },
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 hover:bg-yellow-100'
      },
      {
        icon: MessageSquare,
        label: 'Give Feedback',
        action: () => {
          // Replace with your actual Google Form URL
          window.open('https://forms.gle/MoSnmC9PhxXq5CmD9', '_blank');
          setIsOpen(false);
        },
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100'
      }
    ];

    const currentPath = location.pathname;

    if (currentPath === '/startups') {
      baseActions.unshift({
        icon: Trophy,
        label: 'Submit Startup',
        action: () => {
          navigate('/startup-form');
          setIsOpen(false);
        },
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 hover:bg-emerald-100'
      });
    }


    // Always add help as last option
    baseActions.push({
      icon: ExternalLink,
      label: 'Get Help',
      action: () => {
        // Replace with your actual community/help link
        window.open('https://chat.whatsapp.com/IBfChZgpT8qJoHKbBWMvqA', '_blank');
        setIsOpen(false);
      },
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    });

    return baseActions;
  };

  const actions = getActions();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 mb-safe mr-safe">
        {/* Action Items */}
        <div className={`flex flex-col-reverse items-end space-y-reverse space-y-3 mb-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  onClick={action.action}
                  className={`
                    w-12 h-12 rounded-full shadow-lg border border-gray-200 
                    ${action.bgColor} ${action.color}
                    transform transition-all duration-300 hover:scale-110
                  `}
                  style={{
                    animation: `bounceIn 0.5s ease-out ${index * 50}ms backwards`
                  }}
                >
                  <action.icon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-gray-900 text-white">
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Main FAB */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                w-14 h-14 rounded-full shadow-lg
                bg-gradient-to-r from-vj-accent to-vj-accent/80
                hover:from-vj-accent/90 hover:to-vj-accent/70
                text-white border-0
                transform transition-all duration-300 hover:scale-110
                ${isOpen ? 'rotate-45' : 'rotate-0'}
              `}
            >
              <Plus size={24} className="transition-transform duration-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white">
            <p>{isOpen ? 'Close actions' : 'Quick actions'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </TooltipProvider>
  );
};

export default FloatingActionButton;