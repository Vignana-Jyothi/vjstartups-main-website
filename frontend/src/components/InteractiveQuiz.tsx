import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuizOption {
  text: string;
  correct: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  stage: 'problem' | 'ideation' | 'research' | 'validation' | 'prototype' | 'mvp' | 'scaling';
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'problem-statement',
    question: 'Which statement best describes a PROBLEM (not a solution)?',
    stage: 'problem',
    options: [
      {
        text: 'Students need an app that reminds them of classes.',
        correct: false,
        explanation: 'This is solution-focused. It assumes an app is the answer.'
      },
      {
        text: 'Missed classes due to schedule confusion increases by 30% during exams.',
        correct: true,
        explanation: 'Perfect! This describes the pain point with specific data.'
      },
      {
        text: 'Build a timetable feature with notifications.',
        correct: false,
        explanation: 'This is a feature specification, not a problem description.'
      }
    ]
  },
  {
    id: 'value-proposition',
    question: 'What makes a strong value proposition for an idea?',
    stage: 'ideation',
    options: [
      {
        text: 'Lists all the cool features we plan to build.',
        correct: false,
        explanation: 'Features don\'t create value - outcomes do.'
      },
      {
        text: 'Clearly states the specific benefit for a defined customer segment.',
        correct: true,
        explanation: 'Exactly! Focus on WHO benefits and HOW they benefit.'
      },
      {
        text: 'Uses the latest buzzwords and technology trends.',
        correct: false,
        explanation: 'Buzzwords don\'t solve real problems for real people.'
      }
    ]
  },
  {
    id: 'market-research',
    question: 'What\'s the most important aspect of market research?',
    stage: 'research',
    options: [
      {
        text: 'Finding the total addressable market size.',
        correct: false,
        explanation: 'TAM is important but not the most critical for early validation.'
      },
      {
        text: 'Understanding competitor pricing strategies.',
        correct: false,
        explanation: 'Competitor analysis is valuable but secondary to customer needs.'
      },
      {
        text: 'Identifying real customer pain points and willingness to pay.',
        correct: true,
        explanation: 'Perfect! Customer pain + willingness to pay = viable market.'
      }
    ]
  },
  {
    id: 'user-validation',
    question: 'What\'s the best way to validate your solution with users?',
    stage: 'validation',
    options: [
      {
        text: 'Ask friends and family if they like the idea.',
        correct: false,
        explanation: 'Friends and family are biased. Get objective feedback from strangers.'
      },
      {
        text: 'Interview target customers about their current pain points.',
        correct: true,
        explanation: 'Yes! Understanding real pain points leads to better solutions.'
      },
      {
        text: 'Build the full product and launch it publicly.',
        correct: false,
        explanation: 'Too risky and expensive. Validate first, then build.'
      }
    ]
  },
  {
    id: 'prototype-testing',
    question: 'What\'s the main goal of prototype testing?',
    stage: 'prototype',
    options: [
      {
        text: 'To show off your technical skills.',
        correct: false,
        explanation: 'Prototypes are for learning, not showing off.'
      },
      {
        text: 'To validate core user workflows and identify usability issues.',
        correct: true,
        explanation: 'Exactly! Test the core experience before building everything.'
      },
      {
        text: 'To build the complete feature set.',
        correct: false,
        explanation: 'Prototypes should focus on core functionality, not complete features.'
      }
    ]
  },
  {
    id: 'mvp-success',
    question: 'Which metric best indicates MVP success?',
    stage: 'mvp',
    options: [
      {
        text: 'High daily active users and high churn rate.',
        correct: false,
        explanation: 'High churn means users aren\'t finding lasting value.'
      },
      {
        text: 'Strong user retention and growing engagement.',
        correct: true,
        explanation: 'Perfect! Retention shows users find real value in your solution.'
      },
      {
        text: 'Viral growth only, regardless of retention.',
        correct: false,
        explanation: 'Viral growth without retention is like a leaky bucket.'
      }
    ]
  },
  {
    id: 'startup-scaling',
    question: 'Which metric mix best signals readiness to scale?',
    stage: 'scaling',
    options: [
      {
        text: 'High daily active users and high churn rate.',
        correct: false,
        explanation: 'High churn means users aren\'t finding lasting value.'
      },
      {
        text: 'Low customer acquisition cost, rising lifetime value, positive unit economics.',
        correct: true,
        explanation: 'Perfect! This shows sustainable, profitable growth potential.'
      },
      {
        text: 'Viral growth only, regardless of retention.',
        correct: false,
        explanation: 'Viral growth without retention is like a leaky bucket.'
      }
    ]
  }
];

interface InteractiveQuizProps {
  stageId?: string;
  onComplete?: (score: number, total: number) => void;
  hasPassedQuiz?: boolean;
  hasNextStage?: boolean;
  currentStageName?: string;
  nextStageName?: string;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ 
  stageId, 
  onComplete, 
  hasPassedQuiz = false, 
  hasNextStage = false, 
  currentStageName = 'this stage',
  nextStageName = 'next stage' 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const filteredQuestions = stageId 
    ? quizQuestions.filter(q => q.stage === stageId)
    : quizQuestions;

  // Reset quiz when stageId changes (when user switches stages)
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizComplete(false);
  }, [stageId]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizComplete) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));

    setShowResults(true);

    // Auto-advance to next question after showing result
    setTimeout(() => {
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowResults(false);
      } else {
        // Quiz complete
        setQuizComplete(true);
        const score = Object.entries(selectedAnswers).reduce((acc, [questionIndex, answerIndex]) => {
          const question = filteredQuestions[parseInt(questionIndex)];
          return acc + (question.options[answerIndex]?.correct ? 1 : 0);
        }, 0);
        
        if (onComplete) {
          onComplete(score + (filteredQuestions[currentQuestion].options[answerIndex]?.correct ? 1 : 0), filteredQuestions.length);
        }
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const totalCorrect = Object.entries(selectedAnswers).reduce((acc, [questionIndex, answerIndex]) => {
      const question = filteredQuestions[parseInt(questionIndex)];
      return acc + (question.options[answerIndex]?.correct ? 1 : 0);
    }, 0) + (showResults && filteredQuestions[currentQuestion].options[selectedAnswers[currentQuestion]]?.correct ? 1 : 0);

    const percentage = (totalCorrect / filteredQuestions.length) * 100;

    if (percentage >= 80) return { message: "Excellent! You have a strong understanding!", color: "text-green-600" };
    if (percentage >= 60) return { message: "Good job! Keep learning and growing!", color: "text-blue-600" };
    return { message: "Keep practicing! Every expert was once a beginner.", color: "text-orange-600" };
  };

  const question = filteredQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  if (quizComplete) {
    const scoreMsg = getScoreMessage();
    return (
      <Card className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete! 🎉</h3>
        <p className={`text-lg mb-4 ${scoreMsg.color}`}>{scoreMsg.message}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Continue exploring the platform to deepen your knowledge!
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetQuiz} variant="outline">
            Retake Quiz
          </Button>
          {hasPassedQuiz && hasNextStage && (
            <Button 
              onClick={resetQuiz} // Just reset the current quiz, don't trigger advancement
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Ready for {nextStageName} →
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Quick Quiz {currentQuestion + 1}/{filteredQuestions.length}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(((currentQuestion + 1) / filteredQuestions.length) * 100)}% Complete
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = option.correct;
          const showFeedback = showResults && isSelected;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResults}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showFeedback
                  ? isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {showFeedback && (
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <div className={`font-medium ${showFeedback && isCorrect ? 'text-green-700 dark:text-green-300' : showFeedback ? 'text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>
                    {option.text}
                  </div>
                  {showFeedback && option.explanation && (
                    <div className={`text-sm mt-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {option.explanation}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!showResults && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-4 h-4 inline mr-1" />
            Tip: Think about the difference between problems and solutions!
          </p>
        </div>
      )}
    </Card>
  );
};

export default InteractiveQuiz;
