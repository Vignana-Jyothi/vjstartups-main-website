import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  GraduationCap,
  ChevronRight,
  CheckCircle,
  Clock,
  PlayCircle,
  Trophy,
  Zap,
  Brain,
  Rocket,
  Globe,
  MapPin,
  Calendar,
  Star,
  Activity,
  ArrowRight,
  Timer,
  Play,
  RotateCcw,
  Circle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/pages/UserContext';
import { generateIdeaSlug } from '@/utils/slugUtils';
import InteractiveQuiz from './InteractiveQuiz';

interface Stage {
  id: string;
  name: string;
  description: string;
  trl: string;
  tier: 'problem' | 'idea' | 'startup';
  checks: Array<{
    text: string;
    mandatory: boolean;
    completed?: boolean;
  }>;
  kpis?: Array<{
    label: string;
    target: string;
    current?: number;
  }>;
}

interface RecentProgress {
  userName: string;
  userAvatar?: string;
  stageName: string;
  stageType: 'problem' | 'idea' | 'startup';
  completedAt: Date;
  progress: number;
  ideaId?: string;
  ideaTitle?: string;
}

interface CommunityStats {
  totalJourneyStarters: number;
  activeThisWeek: number;
  recentProgress: RecentProgress[];
  topContributors: Array<{
    name: string;
    avatar?: string;
    stagesCompleted: number;
    badgeType: 'pioneer' | 'innovator' | 'founder';
  }>;
}

const stages: Stage[] = [
  {
    id: 'problem',
    name: 'Problem Discovery',
    description: 'Identify and define real-world problems worth solving',
    trl: 'Pre-TRL',
    tier: 'problem',
    checks: [
      { text: 'Problem title written clearly (≤ 120 chars)', mandatory: true },
      { text: 'Brief summary (2–3 sentences)', mandatory: true },
      { text: 'Target customers identified', mandatory: true },
      { text: 'Detailed description provided', mandatory: true },
      { text: 'Background stats/links added', mandatory: false },
      { text: 'Current gaps described', mandatory: false }
    ]
  },
  {
    id: 'ideation',
    name: 'Idea & Concept',
    description: 'Transform problems into innovative solution concepts',
    trl: 'TRL 1-2',
    tier: 'idea',
    checks: [
      { text: 'One-line value proposition defined', mandatory: true },
      { text: 'Solution concept mapped to problem', mandatory: true },
      { text: 'Initial user persona drafted', mandatory: true },
      { text: 'Competitor scan documented', mandatory: false }
    ],
    kpis: [
      { label: 'Value Prop Score', target: '≥8/10', current: 0 },
      { label: 'Problem-Solution Fit', target: '✓', current: 0 }
    ]
  },
  {
    id: 'research',
    name: 'Research & Feasibility',
    description: 'Validate market opportunity and technical feasibility',
    trl: 'TRL 2-3',
    tier: 'idea',
    checks: [
      { text: 'Market research completed', mandatory: true },
      { text: 'Unique differentiator identified', mandatory: true },
      { text: 'Tech stack feasibility confirmed', mandatory: true },
      { text: 'Top 3 risks documented', mandatory: true }
    ],
    kpis: [
      { label: 'Market Size', target: '$10M+', current: 0 },
      { label: 'Feasibility Score', target: '≥7/10', current: 0 }
    ]
  },
  {
    id: 'validation',
    name: 'User Validation',
    description: 'Test assumptions with real users and gather feedback',
    trl: 'TRL 3-4',
    tier: 'idea',
    checks: [
      { text: '≥20 customer interviews completed', mandatory: true },
      { text: '≥70% confirm problem relevance', mandatory: true },
      { text: 'Evidence of willingness to pay', mandatory: true },
      { text: 'User personas refined', mandatory: false }
    ],
    kpis: [
      { label: 'Interviews', target: '≥20', current: 0 },
      { label: 'Problem Validation', target: '≥70%', current: 0 }
    ]
  },
  {
    id: 'prototype',
    name: 'Prototype Development',
    description: 'Build and test a working prototype with users',
    trl: 'TRL 4-5',
    tier: 'idea',
    checks: [
      { text: 'Clickable prototype developed', mandatory: true },
      { text: '5-10 users tested prototype', mandatory: true },
      { text: 'Usability issues documented', mandatory: true },
      { text: 'Core features prioritized', mandatory: true }
    ],
    kpis: [
      { label: 'User Tests', target: '≥10', current: 0 },
      { label: 'Task Success Rate', target: '≥80%', current: 0 }
    ]
  },
  {
    id: 'mvp',
    name: 'MVP & Launch',
    description: 'Launch minimum viable product and acquire first users',
    trl: 'TRL 6-7',
    tier: 'startup',
    checks: [
      { text: 'MVP launched publicly', mandatory: true },
      { text: '≥100 users or ≥10 paying customers', mandatory: true },
      { text: 'Analytics and tracking implemented', mandatory: true },
      { text: 'CAC/LTV baseline calculated', mandatory: true }
    ],
    kpis: [
      { label: 'Active Users', target: '≥100', current: 0 },
      { label: 'Retention Rate', target: '≥40%', current: 0 }
    ]
  },
  {
    id: 'scaling',
    name: 'Growth & Scaling',
    description: 'Scale operations and prepare for investment',
    trl: 'TRL 8-9',
    tier: 'startup',
    checks: [
      { text: 'Repeatable sales process established', mandatory: true },
      { text: 'Business model validated', mandatory: true },
      { text: 'Team and governance in place', mandatory: true },
      { text: 'Expansion plan drafted', mandatory: true }
    ],
    kpis: [
      { label: 'Monthly Growth', target: '≥20%', current: 0 },
      { label: 'Revenue', target: '$10K+', current: 0 }
    ]
  }
];

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return `${Math.floor(diffInDays / 7)}w ago`;
};

// Mock community data - in real app, this would come from your backend
const mockCommunityStats: CommunityStats = {
  totalJourneyStarters: 847,
  activeThisWeek: 23,
  recentProgress: [
    {
      userName: "Karthik",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      stageName: "User Validation",
      stageType: "idea",
      completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      progress: 70
    },
    {
      userName: "Bhargavi",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      stageName: "Problem Discovery",
      stageType: "problem",
      completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      progress: 100
    },
    {
      userName: "Bhaviswa",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      stageName: "Prototype Development",
      stageType: "idea",
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      progress: 90
    },
    {
      userName: "Sriram",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
      stageName: "Research & Feasibility",
      stageType: "idea",
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      progress: 75
    }
  ],
  topContributors: [
    {
      name: "Anirudh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      stagesCompleted: 7,
      badgeType: "founder"
    },
    {
      name: "Sahithi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
      stagesCompleted: 5,
      badgeType: "innovator"
    },
    {
      name: "Siddharth",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=32&h=32&fit=crop&crop=face",
      stagesCompleted: 3,
      badgeType: "pioneer"
    }
  ]
};

const VirtualStartupJourney: React.FC = () => {
  const { user } = useUser();
  const [activeStage, setActiveStage] = useState<string>('problem');
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [userProgress, setUserProgress] = useState<{ [stageId: string]: { [checkIndex: number]: boolean } }>({});
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalJourneyStarters: 0,
    activeThisWeek: 0,
    recentProgress: [],
    topContributors: []
  });
  type QuizScoreMap = { [stageId: string]: { score: number; total: number; passed: boolean } };
  const [quizScores, setQuizScores] = useState<QuizScoreMap>({});
  const [isProgressing, setIsProgressing] = useState(false);
  const [progressingToStage, setProgressingToStage] = useState<string | null>(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [showQuizUnlockedPopup, setShowQuizUnlockedPopup] = useState(false);
  const [quizUnlockedForStage, setQuizUnlockedForStage] = useState<string | null>(null);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);

  const getUnlockedStageFromScores = (scores: QuizScoreMap): string => {
    let stageIndex = 0;

    while (
      stageIndex < stages.length - 1 &&
      Boolean(scores[stages[stageIndex].id]?.passed)
    ) {
      stageIndex += 1;
    }

    return stages[stageIndex]?.id || 'problem';
  };

  const isStageAccessibleFromScores = (stageId: string, scores: QuizScoreMap): boolean => {
    const stageIndex = stages.findIndex(stage => stage.id === stageId);

    if (stageIndex === 0) return true;
    if (stageIndex < 0) return false;

    const previousStageId = stages[stageIndex - 1]?.id;
    return Boolean(previousStageId && scores[previousStageId]?.passed);
  };

  const getQuizPopupSeenMap = () => {
    if (!user?.email) return {};
    try {
      return JSON.parse(localStorage.getItem(`quiz_unlocked_seen_${user.email}`) || '{}');
    } catch {
      return {};
    }
  };

  const markQuizPopupSeen = (stageId: string) => {
    if (!user?.email) return;
    const currentSeenMap = getQuizPopupSeenMap();
    currentSeenMap[stageId] = true;
    localStorage.setItem(`quiz_unlocked_seen_${user.email}`, JSON.stringify(currentSeenMap));
  };

  const closeQuizUnlockedPopup = () => {
    if (quizUnlockedForStage) {
      markQuizPopupSeen(quizUnlockedForStage);
    }
    setShowQuizUnlockedPopup(false);
    setQuizUnlockedForStage(null);
  };

  const handleTakeQuizNow = () => {
    closeQuizUnlockedPopup();
    setTimeout(() => scrollToGameZone(), 100);
  };

  const trackJourneyStageCompletion = async (completedStageId: string, unlockedStageId: string) => {
    if (!user?.email) return;

    const completedStageIndex = stages.findIndex(stage => stage.id === completedStageId);
    const unlockedStageIndex = stages.findIndex(stage => stage.id === unlockedStageId);
    const completedStage = stages[completedStageIndex];

    if (completedStageIndex < 0 || unlockedStageIndex < 0 || !completedStage) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification-api/stage-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || user.email,
          userAvatar: user.picture || '',
          previousStage: completedStageIndex + 1,
          newStage: unlockedStageIndex + 1,
          stageName: completedStage.name,
          stageType: completedStage.tier
        })
      });

      fetchCommunityStats();
    } catch (error) {
      console.error('Failed to track journey stage completion:', error);
    }
  };

  // Fetch community stats from API
  const fetchCommunityStats = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification-api/stage-notifications/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      
      // Transform API data to match component interface
      setCommunityStats({
        totalJourneyStarters: data.totalCount || 0,
        activeThisWeek: data.weekCount || 0,
        recentProgress: (data.recentNotifications || []).map((notif: any) => ({
          userName: notif.userName,
          userAvatar: notif.userAvatar,
          stageName: notif.stageName,
          stageType: notif.stageType,
          completedAt: new Date(notif.completedAt),
          progress: 0,
          ideaId: notif.ideaId,
          ideaTitle: notif.ideaTitle
        })),
        topContributors: data.topContributors || []
      });
    } catch (error) {
      console.error('Failed to fetch community stats:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCommunityStats();
  }, []);

  const currentStage = stages.find(s => s.id === activeStage) || stages[0];
  const currentStageIndex = stages.findIndex(s => s.id === activeStage);
  const progressPercentage = (completedStages.size / stages.length) * 100;

  // Load user progress from localStorage
  useEffect(() => {
    if (!user?.email) {
      setIsProgressLoaded(false);
      return;
    }

    const savedProgress = localStorage.getItem(`journey_progress_${user.email}`);

    if (!savedProgress) {
      setIsProgressLoaded(true);
      return;
    }

    try {
      const progress = JSON.parse(savedProgress);
      const stageProgress = progress.stageProgress || {};
      const convertedProgress: { [stageId: string]: { [checkIndex: number]: boolean } } = {};

      Object.entries(stageProgress).forEach(([stageId, value]) => {
        if (typeof value === 'number') {
          const checkboxStates: { [checkIndex: number]: boolean } = {};
          for (let index = 0; index < value; index += 1) {
            checkboxStates[index] = true;
          }
          convertedProgress[stageId] = checkboxStates;
        } else {
          convertedProgress[stageId] = value as { [checkIndex: number]: boolean };
        }
      });

      const savedQuizScores: QuizScoreMap = progress.quizScores || {};
      const savedActiveStage = typeof progress.activeStage === 'string' ? progress.activeStage : null;
      const fallbackStage = getUnlockedStageFromScores(savedQuizScores);
      const stageToRestore =
        savedActiveStage && isStageAccessibleFromScores(savedActiveStage, savedQuizScores)
          ? savedActiveStage
          : fallbackStage;

      setCompletedStages(new Set(progress.completed || []));
      setUserProgress(convertedProgress);
      setQuizScores(savedQuizScores);
      setActiveStage(stageToRestore);
    } catch (error) {
      console.error('Failed to restore journey progress:', error);
    } finally {
      setIsProgressLoaded(true);
    }
  }, [user?.email]);

  // Persist progress to localStorage
  useEffect(() => {
    if (!user?.email || !isProgressLoaded) {
      return;
    }

    const progress = {
      completed: Array.from(completedStages),
      stageProgress: userProgress,
      quizScores,
      activeStage,
      lastUpdated: Date.now()
    };

    localStorage.setItem(`journey_progress_${user.email}`, JSON.stringify(progress));
  }, [user?.email, completedStages, userProgress, quizScores, activeStage, isProgressLoaded]);

  const handleCheckboxChange = (stageId: string, checkIndex: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;

    setUserProgress(prev => {
      const stageProgress = prev[stageId] || {};
      const newStageProgress = {
        ...stageProgress,
        [checkIndex]: !stageProgress[checkIndex] // Toggle the specific checkbox
      };

      return {
        ...prev,
        [stageId]: newStageProgress
      };
    });
  };

  // Update completed stages when userProgress changes
  useEffect(() => {
    const newCompletedStages = new Set<string>();
    
    stages.forEach(stage => {
      const stageProgress = userProgress[stage.id] || {};
      const completedCount = Object.values(stageProgress).filter(Boolean).length;
      const mandatoryChecks = stage.checks.filter(c => c.mandatory).length;
      
      if (completedCount >= mandatoryChecks) {
        newCompletedStages.add(stage.id);
      }
    });
    
    setCompletedStages(newCompletedStages);
  }, [userProgress]);

  // Handle quiz completion
  const handleQuizComplete = (score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.7); // 70% pass rate
    const newQuizScore = { score, total, passed };
    
    // Check if this is the first time passing this quiz
    const wasAlreadyPassed = quizScores[activeStage]?.passed;
    
    setQuizScores(prev => ({
      ...prev,
      [activeStage]: newQuizScore
    }));

    // Only auto-advance if this is the first time passing (not on retakes)
    if (passed && !wasAlreadyPassed) {
      if (quizUnlockedForStage === activeStage) {
        markQuizPopupSeen(activeStage);
        setShowQuizUnlockedPopup(false);
        setQuizUnlockedForStage(null);
      }

      const currentIndex = stages.findIndex(s => s.id === activeStage);
      if (currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1];
        trackJourneyStageCompletion(activeStage, nextStage.id);
        animateProgressionToStage(nextStage.id);
      }
    }
  };

  // Animate progression to next stage
  const animateProgressionToStage = (targetStageId: string) => {
    if (!user?.picture) {
      // If no profile picture, just advance without animation
      setActiveStage(targetStageId);
      return;
    }

    setIsProgressing(true);
    setProgressingToStage(targetStageId);

    // After animation completes, update the active stage
    setTimeout(() => {
      setActiveStage(targetStageId);
      setIsProgressing(false);
      setProgressingToStage(null);
      
      // Show success notification
      if (user) {
        // You could use a toast library here or create a custom notification
        console.log(`🎉 Congratulations ${user.name}! You've advanced to ${stages.find(s => s.id === targetStageId)?.name}!`);
      }
    }, 2000); // 2 second animation
  };

  // Check if user can access a stage (quiz-gated)
  const canAccessStage = (stageId: string): boolean => {
    const stageIndex = stages.findIndex(s => s.id === stageId);
    
    // First stage is always accessible
    if (stageIndex === 0) return true;
    
    // Check if previous stage quiz was passed (strict requirement)
    const previousStage = stages[stageIndex - 1];
    const previousQuizScore = quizScores[previousStage.id];
    
    // Only quiz pass unlocks next stage, not just checklist completion
    return previousQuizScore?.passed === true;
  };

  // Get the highest unlocked stage index
  const getHighestUnlockedStageIndex = (): number => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (canAccessStage(stages[i].id)) {
        return i;
      }
    }
    return 0; // At least first stage is always unlocked
  };

  // Get the highest unlocked stage that has been passed
  const getHighestPassedStageIndex = (): number => {
    for (let i = stages.length - 1; i >= 0; i--) {
      const stageId = stages[i].id;
      if (quizScores[stageId]?.passed) {
        return i;
      }
    }
    return -1; // No stages passed yet
  };

  // Handle stage click with validation
  const handleStageClick = (stageId: string) => {
    if (!canAccessStage(stageId)) {
      // Show tooltip or message about completing previous stage quiz
      return;
    }
    
    if (isProgressing) return; // Prevent clicks during animation
    
    setActiveStage(stageId);
  };

  // Reset all progress
  const handleResetJourney = () => {
    if (user) {
      // Clear localStorage
      localStorage.removeItem(`journey_progress_${user.email}`);
      
      // Reset all state
      setActiveStage('problem');
      setCompletedStages(new Set());
      setUserProgress({});
      setQuizScores({});
      setIsProgressing(false);
      setProgressingToStage(null);
      setShowQuizUnlockedPopup(false);
      setQuizUnlockedForStage(null);
      localStorage.removeItem(`quiz_unlocked_seen_${user.email}`);
    }
  };

  // Get journey status
  const getJourneyStatus = () => {
    const hasAnyProgress = completedStages.size > 0 || Object.keys(quizScores).length > 0;
    const hasStarted = hasAnyProgress || activeStage !== 'problem';
    
    return {
      hasStarted,
      hasProgress: hasAnyProgress,
      isComplete: completedStages.size === stages.length
    };
  };

  // Calculate completion percentage for current stage
  const getCurrentStageCompletionPercentage = (): number => {
    if (!user || !currentStage) return 0;
    
    const stageProgress = userProgress[currentStage.id] || {};
    const completedChecks = Object.values(stageProgress).filter(Boolean).length;
    const totalChecks = currentStage.checks.length;
    
    return totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;
  };

  // Check if quiz should be enabled (70% checklist completion)
  const isQuizEnabled = (): boolean => {
    return getCurrentStageCompletionPercentage() >= 70;
  };

  useEffect(() => {
    if (!user || !currentStage) return;

    const hasNextStage = currentStageIndex < stages.length - 1;
    const quizUnlocked = isQuizEnabled();
    const quizAlreadyPassed = quizScores[currentStage.id]?.passed === true;
    const seenMap = getQuizPopupSeenMap();
    const popupAlreadySeen = Boolean(seenMap[currentStage.id]);

    if (hasNextStage && quizUnlocked && !quizAlreadyPassed && !popupAlreadySeen) {
      setQuizUnlockedForStage(currentStage.id);
      setShowQuizUnlockedPopup(true);
    }
  }, [
    user?.email,
    activeStage,
    userProgress,
    quizScores,
    currentStage?.id,
    currentStageIndex
  ]);

  // Scroll to game zone
  const scrollToGameZone = () => {
    const gameZone = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    if (gameZone) {
      gameZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle start journey with scroll
  const handleStartJourney = () => {
    setActiveStage('problem');
    setTimeout(() => scrollToGameZone(), 100);
  };

  const getTierColor = (tier: 'problem' | 'idea' | 'startup') => {
    switch (tier) {
      case 'problem': return 'from-orange-500 to-red-500';
      case 'idea': return 'from-blue-500 to-indigo-500';
      case 'startup': return 'from-green-500 to-emerald-500';
    }
  };

  const getTierIcon = (tier: 'problem' | 'idea' | 'startup') => {
    switch (tier) {
      case 'problem': return <Target className="w-5 h-5" />;
      case 'idea': return <Lightbulb className="w-5 h-5" />;
      case 'startup': return <Rocket className="w-5 h-5" />;
    }
  };

  const getStageAchievementName = (stagesCompleted: number): string => {
    const achievementByStage: Record<string, string> = {
      problem: 'Problem Pathfinder',
      ideation: 'Concept Architect',
      research: 'Feasibility Explorer',
      validation: 'Validation Champion',
      prototype: 'Prototype Builder',
      mvp: 'Launch Leader',
      scaling: 'Scale Strategist'
    };

    if (stagesCompleted <= 0) {
      return 'Journey Starter';
    }

    const stageIndex = Math.min(stagesCompleted, stages.length) - 1;
    const stageId = stages[stageIndex]?.id;

    return achievementByStage[stageId] || 'Journey Achiever';
  };

  const getPersonalizedMessage = () => {
    if (!user) {
      return {
        title: "Join the Virtual Startup Journey",
        subtitle: "Experience the complete entrepreneur's path from problem to scale-up",
        cta: "Start Your Journey Today"
      };
    }

    const completedCount = completedStages.size;
    if (completedCount === 0) {
      return {
        title: `Welcome to the Journey, ${user.name}!`,
        subtitle: "Ready to walk the entrepreneur's path? Let's transform ideas into impact together!",
        cta: "Begin Your Adventure"
      };
    } else if (completedCount < 3) {
      return {
        title: `Journey in Progress, ${user.name}!`,
        subtitle: `${completedCount} milestone${completedCount > 1 ? 's' : ''} completed. You're building great momentum!`,
        cta: "Continue the Adventure"
      };
    } else if (completedCount < 6) {
      return {
        title: `Excellent Progress, ${user.name}!`,
        subtitle: `${completedCount} stages mastered. You're well on your entrepreneurial journey!`,
        cta: "Sprint to Launch"
      };
    } else {
      return {
        title: `Journey Master, ${user.name}!`,
        subtitle: "You've reached the advanced stages. Time to scale and create lasting impact!",
        cta: "Scale to Success"
      };
    }
  };

  const personalizedMsg = getPersonalizedMessage();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Personalization */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {user?.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
              />
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 rounded-full">
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Virtual Startup Journey</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-playfair">
            {personalizedMsg.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {personalizedMsg.subtitle}
          </p>

          {/* Journey Control Buttons */}
          {user && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {(() => {
                const journeyStatus = getJourneyStatus();
                return (
                  <>
                    <Button 
                      onClick={handleStartJourney}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      {journeyStatus.hasStarted ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Resume Journey
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Journey
                        </>
                      )}
                    </Button>
                    
                    {journeyStatus.hasProgress && (
                      <Button 
                        onClick={handleResetJourney}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Progress
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Community Stats Preview */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{communityStats.totalJourneyStarters} entrepreneurs on this journey</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span>{communityStats.activeThisWeek} active this week</span>
            </div>
          </div>

          {/* Progress Overview */}
          {user && (
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{completedStages.size}/{stages.length} stages</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">{completedStages.size} Completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">{Math.round(progressPercentage)}% Progress</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Dashboard */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Progress */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Stages Unlocked</h3>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-indigo-500" />
                  {isLoadingNotifications && (
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
              {communityStats.recentProgress.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No recent stage unlocks yet.</p>
                  <p className="text-sm mt-2">Be the first to advance your idea!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {communityStats.recentProgress.slice(0, 4).map((progress, index) => {
                    const ideaSlug = progress.ideaId
                      ? generateIdeaSlug(progress.ideaTitle || 'idea', progress.ideaId)
                      : null;
                    const notificationLink = ideaSlug ? `/ideas/${ideaSlug}` : '/ideas';

                    const notificationContent = (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <img 
                          src={progress.userAvatar || `https://ui-avatars.com/api/?name=${progress.userName}&size=32`}
                          alt={progress.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {progress.userName}
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 truncate">
                            Idea: {progress.ideaTitle || 'Untitled Idea'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Completed "{progress.stageName}" • {getTimeAgo(progress.completedAt)}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          progress.stageType === 'problem' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                          progress.stageType === 'idea' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {progress.stageType}
                        </div>
                      </div>
                    );

                    return (
                      <Link
                        key={index}
                        to={notificationLink}
                        className="block"
                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
                      >
                        {notificationContent}
                      </Link>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 text-center space-y-2">
                {/* <div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={fetchCommunityStats}
                    disabled={isLoadingNotifications}
                  >
                    {isLoadingNotifications ? 'Refreshing...' : 'Refresh'} <RotateCcw className="w-4 h-4 ml-1" />
                  </Button>
                </div> */}
                <div>
                  <Link
                    to="/changes"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
                  >
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      View All Changes <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Top Contributors */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Virtual Startup Journey Leaders</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {communityStats.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="relative">
                      <img 
                        src={contributor.avatar || `https://ui-avatars.com/api/?name=${contributor.name}&size=32`}
                        alt={contributor.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        contributor.badgeType === 'founder' ? 'bg-yellow-500 text-white' :
                        contributor.badgeType === 'innovator' ? 'bg-gray-400 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contributor.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {contributor.stagesCompleted} stages completed
                      </div>
                      <div className="text-xs font-medium text-indigo-600 dark:text-indigo-300 mt-1">
                        Achievement: {getStageAchievementName(contributor.stagesCompleted)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/leaderboard"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
                >
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                    View Leaderboard <Star className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Quiz Unlocked Popup */}
        {showQuizUnlockedPopup && quizUnlockedForStage && !isProgressing && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg mx-4 text-center shadow-2xl border border-indigo-200 dark:border-indigo-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎯 Quiz Unlocked!
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Great job! You completed the stage requirements for
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 font-semibold mb-4">
                {stages.find(stage => stage.id === quizUnlockedForStage)?.name}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Complete this quiz to progress to
                <span className="font-semibold text-gray-900 dark:text-white"> {stages[(stages.findIndex(stage => stage.id === quizUnlockedForStage) + 1)]?.name}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleTakeQuizNow}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Take Quiz Now
                </Button>
                <Button
                  variant="outline"
                  onClick={closeQuizUnlockedPopup}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Progression Animation Overlay */}
        {isProgressing && progressingToStage && user?.picture && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl border">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <img 
                  src={user.picture} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-indigo-500 animate-pulse"
                />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-300 animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Congratulations {user.name}!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You're advancing to <strong>{stages.find(s => s.id === progressingToStage)?.name}</strong>
              </p>
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <Rocket className="w-5 h-5 animate-bounce" />
                <span className="text-sm font-medium">Keep up the great work!</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stage Timeline */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStage.name}
                </h3>
                <Badge variant="outline" className={`bg-gradient-to-r ${getTierColor(currentStage.tier)} text-white border-none px-3 py-1`}>
                  {currentStage.trl}
                </Badge>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {currentStage.description}
              </p>

              {/* Stage Unlock Guidance */}
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 Understand and check ≥70% 'Stage Requirements' & clear the 'Stage Quiz' to unlock the next stage
                </p>
              </div>

              {/* Stage Navigation with User Avatar Progression */}
              <div className="relative pt-4">
                {/* Progress line connecting stages */}
                <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-green-200 dark:from-gray-700 dark:via-blue-700 dark:to-green-700 z-0"></div>
                
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 relative z-10 pt-16">
                  {stages.map((stage, index) => {
                    const isAccessible = canAccessStage(stage.id);
                    const hasQuizPassed = quizScores[stage.id]?.passed;
                    const isCurrentProgression = progressingToStage === stage.id;
                    const highestUnlockedIndex = getHighestUnlockedStageIndex();
                    const highestPassedIndex = getHighestPassedStageIndex();
                    
                    // Show profile picture on the highest unlocked stage (current frontier)
                    const showProfilePicture = user?.picture && index === highestUnlockedIndex && !hasQuizPassed;
                    
                    // Show tick mark on completed stages (quiz passed)
                    const showTickMark = hasQuizPassed && index <= highestPassedIndex;
                    
                    return (
                      <div key={stage.id} className="relative">
                        <button
                          onClick={() => handleStageClick(stage.id)}
                          disabled={!isAccessible}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap relative z-10 ${
                            activeStage === stage.id
                              ? `bg-gradient-to-r ${getTierColor(stage.tier)} text-white border-transparent shadow-lg`
                              : hasQuizPassed
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                              : !isAccessible
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          {!isAccessible ? (
                            <Clock className="w-4 h-4" />
                          ) : hasQuizPassed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            getTierIcon(stage.tier)
                          )}
                          <span className="text-sm font-medium">{stage.name}</span>
                          
                          {/* Quiz completion indicator */}
                          {hasQuizPassed && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                        
                        {/* User Profile Picture - Shows on highest unlocked stage */}
                        {showProfilePicture && (
                          <div className={`absolute top-[-56px] left-1/2 transform -translate-x-1/2 transition-all duration-500 z-20 ${
                            isProgressing ? 'animate-bounce' : ''
                          }`}>
                            <div className="relative">
                              <img 
                                src={user.picture} 
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-3 border-white shadow-lg object-cover"
                              />
                              <div className="absolute inset-0 rounded-full ring-2 ring-blue-400 ring-opacity-50 animate-pulse"></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Completed Stage Tick Mark */}
                        {showTickMark && (
                          <div className="absolute top-[-56px] left-1/2 transform -translate-x-1/2 z-20">
                            <div className="w-12 h-12 rounded-full bg-green-500 border-3 border-white shadow-lg flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Progress Animation Target */}
                        {user?.picture && isCurrentProgression && (
                          <div className="absolute top-[-56px] left-1/2 transform -translate-x-1/2 animate-pulse z-20">
                            <div className="w-12 h-12 rounded-full border-3 border-indigo-400 bg-indigo-100 flex items-center justify-center shadow-lg">
                              <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stage Requirements</h4>
                {currentStage.checks.map((check, index) => (
                  <label key={index} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={user ? Boolean(userProgress[currentStage.id]?.[index]) : false}
                      onChange={() => user && handleCheckboxChange(currentStage.id, index)}
                      disabled={!user}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{check.text}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {check.mandatory ? 'Mandatory' : 'Optional'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* KPIs */}
              {currentStage.kpis && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStage.kpis.map((kpi, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          Target: {kpi.target}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="space-y-6">


            {/* Interactive Quiz */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Stage Quiz</h4>
                {quizScores[currentStage.id]?.passed ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Passed!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-600">
                    <PlayCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Pass to unlock next stage</span>
                  </div>
                )}
              </div>
              
              {!isQuizEnabled() ? (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">Complete more tasks to unlock quiz</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      You need to complete at least 70% of the checklist items before taking the quiz.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-700 dark:text-yellow-300">Progress</span>
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">
                          {Math.round(getCurrentStageCompletionPercentage())}% / 70%
                        </span>
                      </div>
                      <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(getCurrentStageCompletionPercentage(), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {quizScores[currentStage.id] && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Last Score: {quizScores[currentStage.id].score}/{quizScores[currentStage.id].total} 
                        ({Math.round((quizScores[currentStage.id].score / quizScores[currentStage.id].total) * 100)}%)
                        {quizScores[currentStage.id].passed ? ' ✅' : ' (Need 70% to pass)'}
                      </div>
                    </div>
                  )}
                  
                  <InteractiveQuiz 
                    stageId={currentStage.id} 
                    onComplete={handleQuizComplete}
                    hasPassedQuiz={quizScores[currentStage.id]?.passed || false}
                    hasNextStage={currentStageIndex < stages.length - 1}
                    currentStageName={currentStage.name}
                    nextStageName={currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1].name : ''}
                  />
                </>
              )}
            </Card>

            {/* Quick Start Actions */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Take Your Next Step</h4>
              <div className="space-y-3">
                {currentStage.tier === 'problem' && (
                  <Link to="/problems">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      Discover Problems
                    </Button>
                  </Link>
                )}
                
                {currentStage.tier === 'idea' && (
                  <Link to="/ideas">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Share Your Idea
                    </Button>
                  </Link>
                )}
                
                {currentStage.tier === 'startup' && (
                  <Link to="/startups">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Startup
                    </Button>
                  </Link>
                )}

                <Link to="/club">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Connect with Peers
                  </Button>
                </Link>
                
                <Link to="/programs">
                  <Button variant="outline" className="w-full">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Join Programs
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Hub Navigation */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Explore Hubs</h4>
              <div className="space-y-3">
                <Link to="/problems" className="block">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">ProblemHub</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Discover challenges</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                  </div>
                </Link>

                <Link to="/ideas" className="block">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">IdeaHub</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Build solutions</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </Link>

                <Link to="/startups" className="block">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">StartupHub</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Scale your venture</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                  </div>
                </Link>
              </div>
            </Card>

            {/* Login CTA for non-logged users */}
            {!user && (
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Join the Journey</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Track your progress, connect with peers, and get personalized guidance on your startup journey
                  </p>
                  <Link to="/login">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualStartupJourney;
