import { authHeaders } from "@/lib/apiAuth";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/pages/UserContext';
import { generateIdeaSlug } from '@/utils/slugUtils';
import InteractiveQuiz from './InteractiveQuiz';
import { PageHero } from '@/components/design-system/PageHero';
import '@/components/design-system/listing.css';
import '@/components/design-system/detail.css';
import '@/components/design-system/journey-hub.css';

type Tier = 'problem' | 'idea' | 'startup';
const TIER_ACCENT: Record<Tier, string> = { problem: 'var(--pink)', idea: 'var(--lime)', startup: 'var(--violet)' };
const TIER_HERO: Record<Tier, 'pink' | 'lime' | 'violet'> = { problem: 'pink', idea: 'lime', startup: 'violet' };
const TIER_NAME: Record<Tier, string> = { problem: 'Problem', idea: 'Idea', startup: 'Startup' };
const NEXT_STEP: Record<Tier, { to: string; label: string }> = {
  problem: { to: '/problems', label: 'Discover problems' },
  idea: { to: '/ideas', label: 'Share your idea' },
  startup: { to: '/startups', label: 'Launch a startup' },
};

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
    setTimeout(() => document.getElementById('journey-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
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
          'Content-Type': 'application/json',
          ...authHeaders()
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
    setIsProgressing(true);
    setProgressingToStage(targetStageId);

    // After animation completes, update the active stage
    setTimeout(() => {
      setActiveStage(targetStageId);
      setIsProgressing(false);
      setProgressingToStage(null);
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
    document.getElementById('journey-game')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle start journey with scroll
  const handleStartJourney = () => {
    setActiveStage(stages[getHighestUnlockedStageIndex()].id);
    setTimeout(() => scrollToGameZone(), 100);
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

  const pad = (n: number) => String(n).padStart(2, '0');
  const initials = (name?: string) =>
    (name || '?').split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const journeyStatus = getJourneyStatus();
  const stagePct = Math.round(getCurrentStageCompletionPercentage());
  const lastScore = quizScores[currentStage.id];
  const highestUnlockedIndex = getHighestUnlockedStageIndex();
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;
  const nextStep = NEXT_STEP[currentStage.tier];
  const firstName = user?.name?.split(' ')[0];

  const resetWithConfirm = () => {
    if (window.confirm('Reset all of your journey progress? Ticked requirements and quiz scores are cleared.')) {
      handleResetJourney();
    }
  };

  return (
    <div className="page-shell lx dt jh" style={{ '--lx-accent': TIER_ACCENT[currentStage.tier] } as React.CSSProperties}>
      <PageHero
        kind="tool"
        eyebrow={firstName ? `Virtual startup journey / ${firstName}` : 'Virtual startup journey'}
        title="Virtual Startup Journey"
        description={personalizedMsg.subtitle}
        accent={TIER_HERO[currentStage.tier]}
        stats={
          user
            ? [
                { value: `${completedStages.size} / ${stages.length}`, label: 'Stages completed' },
                { value: `${Math.round(progressPercentage)}%`, label: 'Your progress' },
                { value: String(communityStats.totalJourneyStarters), label: 'On the journey' },
              ]
            : [
                { value: String(stages.length), label: 'Stages' },
                { value: String(communityStats.totalJourneyStarters), label: 'On the journey' },
                { value: String(communityStats.activeThisWeek), label: 'Active this week' },
              ]
        }
      />

      <section className="lx-section jh-board" id="journey-game">
        <div className="jh-board-head">
          <div className="lx-sec-head">
            <span>Stage {pad(currentStageIndex + 1)} / {pad(stages.length)}</span>
            <h2>Walk the path</h2>
          </div>
          {user ? (
            <div className="jh-controls">
              {journeyStatus.hasStarted && activeStage !== stages[highestUnlockedIndex].id && (
                <button type="button" className="lx-cta" onClick={handleStartJourney}>
                  Back to stage {pad(highestUnlockedIndex + 1)} ↗
                </button>
              )}
              {journeyStatus.hasProgress && (
                <button type="button" className="lx-textbtn dt-danger" onClick={resetWithConfirm}>Reset progress</button>
              )}
            </div>
          ) : (
            <Link to="/login" className="lx-cta">Log in to track your journey ↗</Link>
          )}
        </div>

        <ol className="jh-track">
          {stages.map((stage, index) => {
            const accessible = canAccessStage(stage.id);
            const passed = quizScores[stage.id]?.passed;
            const frontier = Boolean(user) && index === highestUnlockedIndex && !passed;
            const state = passed ? 'Passed' : !accessible ? 'Locked' : frontier ? 'You are here' : 'Open';
            return (
              <li
                key={stage.id}
                className={[
                  activeStage === stage.id && 'is-on',
                  passed && 'is-done',
                  !accessible && 'is-locked',
                  progressingToStage === stage.id && 'is-arriving',
                ].filter(Boolean).join(' ')}
                style={{ '--tier': TIER_ACCENT[stage.tier] } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => handleStageClick(stage.id)}
                  disabled={!accessible}
                  aria-current={activeStage === stage.id ? 'step' : undefined}
                >
                  <i aria-hidden="true" />
                  <span>{pad(index + 1)} / {stage.trl}</span>
                  <b>{stage.name}</b>
                  <small>{state}</small>
                  {frontier && user?.picture && <img className="jh-me" src={user.picture} alt="" />}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="dt-grid jh-grid">
          <div className="dt-main">
            <header className="jh-stage-head" key={currentStage.id}>
              <span>{TIER_NAME[currentStage.tier]} / {currentStage.trl}</span>
              <h3>{currentStage.name}</h3>
              <p className="dt-lead">{currentStage.description}.</p>
            </header>

            <div className="jh-checks">
              <div className="jh-checks-head">
                <span>Stage requirements</span>
                <b>{user ? `${stagePct}% ticked` : `${currentStage.checks.length} to tick`}</b>
              </div>
              {currentStage.checks.map((check, index) => {
                const checked = user ? Boolean(userProgress[currentStage.id]?.[index]) : false;
                return (
                  <label key={check.text} className={`jh-check${checked ? ' is-on' : ''}${user ? '' : ' is-off'}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => user && handleCheckboxChange(currentStage.id, index)}
                      disabled={!user}
                    />
                    <i aria-hidden="true" />
                    <span>{check.text}</span>
                    <small>{check.mandatory ? 'Required' : 'Optional'}</small>
                  </label>
                );
              })}
              <p className="jh-rule">
                Tick at least 70% of the requirements, then pass the stage quiz to unlock the next stage.
                {!user && <> <Link to="/login">Log in</Link> to tick them and keep your progress.</>}
              </p>
            </div>

            {currentStage.kpis && (
              <section className="dt-field">
                <span>KPI</span>
                <div>
                  <h3>Targets for this stage</h3>
                  <dl className="dt-facts dt-facts-inline">
                    {currentStage.kpis.map((kpi) => (
                      <div key={kpi.label}><dt>{kpi.label}</dt><dd>{kpi.target}</dd></div>
                    ))}
                  </dl>
                </div>
              </section>
            )}
          </div>

          <aside className="dt-side jh-side">
            <div className="dt-card jh-quiz" id="journey-quiz">
              <div className="jh-quiz-head">
                <span>Stage quiz</span>
                <b className={lastScore?.passed ? 'is-pass' : ''}>
                  {lastScore?.passed ? 'Passed' : nextStage ? `Unlocks ${nextStage.name}` : 'Final stage'}
                </b>
              </div>
              {!isQuizEnabled() ? (
                <div className="jh-lock">
                  <p>{user ? 'Tick at least 70% of the requirements to open the quiz.' : 'Log in and tick the requirements to open the quiz.'}</p>
                  <div className="jh-meter" role="progressbar" aria-valuemin={0} aria-valuemax={70} aria-valuenow={Math.min(stagePct, 70)}>
                    <i style={{ width: `${Math.min((stagePct / 70) * 100, 100)}%` }} />
                  </div>
                  <small>{stagePct}% of 70%</small>
                </div>
              ) : (
                <>
                  {lastScore && (
                    <p className="jh-score">
                      Last score {lastScore.score}/{lastScore.total} ({Math.round((lastScore.score / lastScore.total) * 100)}%)
                      {lastScore.passed ? '' : '. 70% needed to pass.'}
                    </p>
                  )}
                  <InteractiveQuiz
                    stageId={currentStage.id}
                    onComplete={handleQuizComplete}
                    hasPassedQuiz={lastScore?.passed || false}
                    hasNextStage={Boolean(nextStage)}
                    currentStageName={currentStage.name}
                    nextStageName={nextStage?.name || ''}
                  />
                </>
              )}
            </div>

            <div className="dt-card jh-next">
              <span>Your next step</span>
              <Link to={nextStep.to} className="lx-cta">{nextStep.label} ↗</Link>
              <div className="jh-next-links">
                <Link to="/club" className="lx-textbtn">Meet peers in the club ↗</Link>
                <Link to="/programs" className="lx-textbtn">Join a program ↗</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="lx-section jh-community">
        <div className="jh-col">
          <div className="lx-sec-head">
            <span>Community / latest</span>
            <h2>Recent unlocks</h2>
          </div>
          {communityStats.recentProgress.length === 0 ? (
            <p className="jh-empty">{isLoadingNotifications ? 'Loading' : 'No stage unlocks yet. Be the first to advance your idea.'}</p>
          ) : (
            <ul className="jh-feed">
              {communityStats.recentProgress.slice(0, 4).map((progress, index) => {
                const link = progress.ideaId ? `/ideas/${generateIdeaSlug(progress.ideaTitle || 'idea', progress.ideaId)}` : '/ideas';
                return (
                  <li key={index} style={{ '--tier': TIER_ACCENT[progress.stageType] || 'var(--lime)' } as React.CSSProperties}>
                    <Link to={link}>
                      {progress.userAvatar ? <img src={progress.userAvatar} alt="" /> : <i aria-hidden="true">{initials(progress.userName)}</i>}
                      <div>
                        <b>{progress.userName}</b>
                        <small>{progress.ideaTitle ? `${progress.ideaTitle} / ` : ''}completed {progress.stageName}</small>
                      </div>
                      <em>{getTimeAgo(progress.completedAt)}</em>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Link to="/changes" className="lx-textbtn">Everything that changed ↗</Link>
        </div>

        <div className="jh-col">
          <div className="lx-sec-head">
            <span>Leaders / top {Math.max(communityStats.topContributors.length, 3)}</span>
            <h2>Furthest along</h2>
          </div>
          {communityStats.topContributors.length === 0 ? (
            <p className="jh-empty">{isLoadingNotifications ? 'Loading' : 'No one has passed a stage quiz yet.'}</p>
          ) : (
            <ol className="jh-feed jh-leaders">
              {communityStats.topContributors.map((contributor, index) => (
                <li key={index}>
                  <div>
                    <strong>{pad(index + 1)}</strong>
                    {contributor.avatar ? <img src={contributor.avatar} alt="" /> : <i aria-hidden="true">{initials(contributor.name)}</i>}
                    <div>
                      <b>{contributor.name}</b>
                      <small>{getStageAchievementName(contributor.stagesCompleted)}</small>
                    </div>
                    <em>{contributor.stagesCompleted} / {stages.length}</em>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <Link to="/leaderboard" className="lx-textbtn">Full leaderboard ↗</Link>
        </div>
      </section>

      {showQuizUnlockedPopup && quizUnlockedForStage && !isProgressing && (
        <div className="dt-modal" role="dialog" aria-modal="true" aria-labelledby="jh-pop-title" onClick={(e) => { if (e.target === e.currentTarget) closeQuizUnlockedPopup(); }}>
          <div className="dt-modal-panel jh-pop">
            <span>Quiz unlocked</span>
            <h3 id="jh-pop-title">{stages.find((stage) => stage.id === quizUnlockedForStage)?.name}</h3>
            <p>
              You have ticked enough requirements. Pass the quiz to move on to{' '}
              <b>{stages[stages.findIndex((stage) => stage.id === quizUnlockedForStage) + 1]?.name}</b>.
            </p>
            <div className="jh-pop-actions">
              <button type="button" className="lx-cta" onClick={handleTakeQuizNow}>Take the quiz ↗</button>
              <button type="button" className="lx-textbtn" onClick={closeQuizUnlockedPopup}>Later</button>
            </div>
          </div>
        </div>
      )}

      {isProgressing && progressingToStage && (
        <div className="dt-modal jh-arrive" role="status">
          <div className="dt-modal-panel jh-pop">
            {user?.picture && <img className="jh-pop-me" src={user.picture} alt="" />}
            <span>Stage passed</span>
            <h3>On to {stages.find((s) => s.id === progressingToStage)?.name}</h3>
            <p>Nice work{firstName ? `, ${firstName}` : ''}. The next stage is open.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualStartupJourney;
