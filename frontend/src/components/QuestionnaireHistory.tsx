import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Calendar, TrendingUp, Eye, Download } from "lucide-react";
import { useUser } from "@/pages/UserContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface QuestionnaireResponse {
  responseId: string;
  userName: string;
  score: {
    problemClarity: number;
    marketPotential: number;
    solutionViability: number;
    competitivePosition: number;
    executionReadiness: number;
    overallScore: number;
  };
  recommendations: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

const QuestionnaireHistory = () => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<QuestionnaireResponse | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      fetchResponses();
    }
  }, [user]);

  const fetchResponses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/questionnaire-api/responses/${user?.email}`
      );
      setResponses(response.data);
    } catch (error) {
      console.error("Error fetching questionnaire responses:", error);
      toast({
        title: "Error loading responses",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportResponse = (response: QuestionnaireResponse) => {
    const exportData = {
      assessmentDate: formatDate(response.createdAt),
      overallScore: response.score.overallScore,
      scores: response.score,
      recommendations: response.recommendations,
      status: response.status
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `idea-validation-${response.responseId.slice(0, 8)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view your questionnaire history.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your assessments...</p>
        </CardContent>
      </Card>
    );
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Idea Validations
          </CardTitle>
          <CardDescription>
            Track your idea validation assessments and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">You haven't completed any idea validations yet.</p>
          <Button asChild>
            <a href="/validate-idea">Take Your First Assessment</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Idea Validations ({responses.length})
          </CardTitle>
          <CardDescription>
            Track your idea validation assessments and progress
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {responses.map((response) => (
          <Card key={response.responseId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getScoreColor(response.score.overallScore)}`}>
                    {response.score.overallScore}
                  </div>
                  <div>
                    <h3 className="font-semibold">Assessment #{response.responseId.slice(0, 8)}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(response.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={response.status === 'completed' ? 'default' : 'secondary'}>
                    {response.status}
                  </Badge>
                  <Badge className={getScoreColor(response.score.overallScore)}>
                    {getScoreLabel(response.score.overallScore)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {Object.entries(response.score).filter(([key]) => key !== 'overallScore').map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div className={`text-lg font-semibold ${getScoreColor(score).split(' ')[0]}`}>
                      {score}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Assessment Details</DialogTitle>
                    </DialogHeader>
                    {selectedResponse && (
                      <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                          <div className={`text-4xl font-bold ${getScoreColor(selectedResponse.score.overallScore).split(' ')[0]}`}>
                            {selectedResponse.score.overallScore}
                          </div>
                          <div className="text-lg font-semibold text-gray-700">
                            Overall Score ({getScoreLabel(selectedResponse.score.overallScore)})
                          </div>
                        </div>

                        {/* Detailed Scores */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedResponse.score).filter(([key]) => key !== 'overallScore').map(([key, score]) => (
                            <div key={key} className="p-3 border rounded-lg text-center">
                              <div className={`text-xl font-bold ${getScoreColor(score).split(' ')[0]}`}>
                                {score}
                              </div>
                              <div className="text-sm font-medium text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {selectedResponse.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportResponse(response)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireHistory;
