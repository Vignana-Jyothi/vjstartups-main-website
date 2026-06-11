import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Lightbulb, 
  Users, 
  Award,
  ArrowRight,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface ValidationAssessment {
  id: string;
  date: string;
  overallScore: number;
  scores: {
    problemClarity: number;
    marketPotential: number;
    solutionViability: number;
    competitivePosition: number;
    executionReadiness: number;
  };
  status: 'completed' | 'in-progress';
  improvementAreas: string[];
}

// Mock data with realistic scores
const mockAssessments: ValidationAssessment[] = [
  {
    id: '66c288c1',
    date: 'Sep 11, 2025, 07:23 PM',
    overallScore: 78,
    scores: {
      problemClarity: 85,
      marketPotential: 72,
      solutionViability: 80,
      competitivePosition: 65,
      executionReadiness: 88
    },
    status: 'completed',
    improvementAreas: ['Competitive Analysis', 'Market Sizing']
  },
  {
    id: '66d9828a',
    date: 'Sep 10, 2025, 07:30 PM',
    overallScore: 65,
    scores: {
      problemClarity: 70,
      marketPotential: 58,
      solutionViability: 72,
      competitivePosition: 55,
      executionReadiness: 70
    },
    status: 'completed',
    improvementAreas: ['Market Research', 'Competitive Strategy']
  },
  {
    id: '597a33df',
    date: 'Sep 09, 2025, 07:30 PM',
    overallScore: 52,
    scores: {
      problemClarity: 60,
      marketPotential: 45,
      solutionViability: 58,
      competitivePosition: 40,
      executionReadiness: 57
    },
    status: 'completed',
    improvementAreas: ['Problem Definition', 'Market Validation']
  }
];

const ImprovedValidationJourney = () => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4 text-blue-600" />;
    return <Target className="w-4 h-4 text-yellow-600" />;
  };

  const getTrendDirection = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const categoryIcons = {
    problemClarity: <Target className="w-4 h-4" />,
    marketPotential: <Users className="w-4 h-4" />,
    solutionViability: <Lightbulb className="w-4 h-4" />,
    competitivePosition: <Award className="w-4 h-4" />,
    executionReadiness: <BarChart3 className="w-4 h-4" />
  };

  const categoryLabels = {
    problemClarity: 'Problem Clarity',
    marketPotential: 'Market Potential',
    solutionViability: 'Solution Viability',
    competitivePosition: 'Competitive Edge',
    executionReadiness: 'Execution Ready'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your Validation Journey</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your idea validation progress and see how your concepts evolve over time
          </p>
          
          {/* Progress Overview */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Journey Progress</span>
                <span className="text-sm text-gray-500">78% Complete</span>
              </div>
              <Progress value={78} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Started: 3 assessments ago</span>
                <span>Latest: 78/100</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Assessment History ({mockAssessments.length})
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              New Assessment
            </Button>
          </div>

          {mockAssessments.map((assessment, index) => (
            <Card key={assessment.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Left: Score & Overview */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${getScoreColor(assessment.overallScore)}`}>
                        {assessment.overallScore}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Assessment #{index + 1}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {assessment.date}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getScoreIcon(assessment.overallScore)}
                          <Badge variant={assessment.overallScore >= 70 ? "default" : "secondary"}>
                            {assessment.overallScore >= 80 ? 'Excellent' : 
                             assessment.overallScore >= 60 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Areas */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Focus Areas:</p>
                      {assessment.improvementAreas.map((area, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right: Detailed Scores */}
                  <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      {Object.entries(assessment.scores).map(([key, score]) => (
                        <div key={key} className="text-center space-y-2">
                          <div className="flex items-center justify-center gap-1">
                            {categoryIcons[key as keyof typeof categoryIcons]}
                            <span className="text-xs font-medium text-gray-600">
                              {categoryLabels[key as keyof typeof categoryLabels]}
                            </span>
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(score).split(' ')[0]}`}>
                            {score}
                          </div>
                          <Progress value={score} className="h-1" />
                          {index > 0 && getTrendDirection(score, mockAssessments[index - 1].scores[key as keyof typeof assessment.scores])}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                      
                      {index === 0 && (
                        <Button size="sm" className="flex items-center gap-2">
                          Improve Score
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Journey Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">+26</div>
                <p className="text-sm text-gray-600">Total Score Improvement</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-sm text-gray-600">Categories Improved</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                <p className="text-sm text-gray-600">Assessments Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImprovedValidationJourney;