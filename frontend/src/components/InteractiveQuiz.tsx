import React, { useState, useEffect } from 'react';

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

    if (percentage >= 80) return { message: "Excellent. You have a strong understanding.", tone: "is-high" };
    if (percentage >= 60) return { message: "Good. Review the requirements and try again for 70%.", tone: "is-mid" };
    return { message: "Not yet. Every expert was once a beginner.", tone: "is-low" };
  };

  const question = filteredQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  if (quizComplete) {
    const scoreMsg = getScoreMessage();
    return (
      <div className="jq jq-done">
        <span>Quiz complete</span>
        <p className={scoreMsg.tone}>{scoreMsg.message}</p>
        <button type="button" className="lx-textbtn" onClick={resetQuiz}>Retake the quiz ↻</button>
      </div>
    );
  }

  return (
    <div className="jq">
      <div className="jq-head">
        <span>Question {currentQuestion + 1} / {filteredQuestions.length}</span>
        <i aria-hidden="true"><b style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }} /></i>
      </div>
      <h4 key={question.id}>{question.question}</h4>
      <div className="jq-options">
        {question.options.map((option, index) => {
          const showFeedback = showResults && selectedAnswer === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleAnswerSelect(index)}
              disabled={showResults}
              className={showFeedback ? (option.correct ? "is-right" : "is-wrong") : ""}
            >
              <em aria-hidden="true">{showFeedback ? (option.correct ? "✓" : "✕") : String.fromCharCode(65 + index)}</em>
              <span>
                {option.text}
                {showFeedback && option.explanation && <small>{option.explanation}</small>}
              </span>
            </button>
          );
        })}
      </div>
      {!showResults && stageId === "problem" && (
        <p className="jq-tip">Tip: a problem describes the pain, not the fix.</p>
      )}
    </div>
  );
};

export default InteractiveQuiz;
