import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Lightbulb, AlertCircle, MessageSquare, Users, UserCheck, ExternalLink, BookOpen, Trophy } from 'lucide-react';
import { useUser } from '../pages/UserContext';
import './quick-actions.css';

interface FABAction {
  icon: React.ElementType;
  label: string;
  action: () => void;
  color: string;
}

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  // Tucked away while the reader scrolls down; back on scroll up or at the end of the page.
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (Math.abs(y - last) < 6) return;
      setTucked(y > last && y > 160 && !atEnd);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          navigate('/submit-problem');
          setIsOpen(false);
        },
        color: 'text-pink-400'
      },
      {
        icon: Lightbulb,
        label: 'Add Idea',
        action: () => {
          navigate('/submit-idea');
          setIsOpen(false);
        },
        color: 'text-lime-400'
      },
      {
        icon: MessageSquare,
        label: 'Give Feedback',
        action: () => {
          // Replace with your actual Google Form URL
          window.open('https://forms.gle/MoSnmC9PhxXq5CmD9', '_blank');
          setIsOpen(false);
        },
        color: 'text-white'
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
        color: 'text-violet-400'
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
      color: 'text-white'
    });

    return baseActions;
  };

  const actions = getActions();

  return (
    <>
      <div className={`qa${tucked && !isOpen ? ' is-tucked' : ''}${isOpen ? ' is-open' : ''}`}>
        {/* Labelled actions: touch screens have no hover, so every action shows its name. */}
        <div className="qa-actions" aria-hidden={!isOpen}>
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={action.action}
              tabIndex={isOpen ? 0 : -1}
              className="qa-action"
              style={{ transitionDelay: isOpen ? `${index * 40}ms` : '0ms' }}
            >
              <span>{action.label}</span>
              <i className={action.color}><action.icon size={18} /></i>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
          className="qa-main"
        >
          <Plus size={24} />
        </button>
      </div>
      {isOpen && <div className="qa-backdrop" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingActionButton;