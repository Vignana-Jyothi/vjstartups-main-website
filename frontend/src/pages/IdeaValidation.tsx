import IdeaValidationQuestionnaire from "@/components/IdeaValidationQuestionnaire";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp, Lightbulb } from "lucide-react";

const IdeaValidation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Idea Assessment Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive validation tool for startup ideas and stage transitions. 
            Assess your idea's potential, get personalized recommendations, and validate readiness for the next development stage.
          </p>
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Comprehensive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Evaluate your idea across 5 key dimensions: Problem clarity, market potential, solution viability, competitive position, and execution readiness.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Stage Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Validate your idea's readiness before moving between development stages - from ideation to research, validation, prototyping, and beyond.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Actionable Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Receive personalized recommendations and actionable next steps based on your assessment results to improve your idea's success potential.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Questionnaire */}
        <IdeaValidationQuestionnaire />
      </div>
    </div>
  );
};

export default IdeaValidation;
