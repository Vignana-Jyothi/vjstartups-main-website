import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, Lightbulb, Target, Users, TrendingUp, Cog, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/pages/UserContext";
import StartupRecommendationCard from "@/components/StartupRecommendationCard";
import { evaluateStartupReadiness, shouldRecommendStartup } from "@/utils/startupRecommendation";
import axios from "axios";

interface QuestionnaireData {
  // Problem Definition
  problemDescription: string;
  problemSeverity: number;
  problemFrequency: string;
  
  // Target Audience
  targetAudience: string;
  audienceSize: string;
  customerValidation: string;
  
  // Value Proposition
  solutionDescription: string;
  uniqueValue: string;
  competitiveAdvantage: string;
  
  // Market Analysis
  existingSolutions: string;
  marketGaps: string;
  marketSize: string;
  
  // Feasibility
  technicalFeasibility: number;
  resourceRequirements: string;
  timeToMarket: string;
  
  // Validation & Feedback
  feedbackSources: string[];
  validationMethods: string[];
  earlyAdopters: string;
  
  // Business Model
  revenueModel: string;
  pricingStrategy: string;
  costStructure: string;
  
  // Risk Assessment
  mainRisks: string[];
  mitigationStrategies: string;
  
  // Next Steps
  immediateActions: string[];
  resourceNeeds: string[];
  timeline: string;
}

interface QuestionnaireResults {
  responseId: string;
  score: {
    problemClarity: number;
    marketPotential: number;
    solutionViability: number;
    competitivePosition: number;
    executionReadiness: number;
    overallScore: number;
  };
  recommendations: string[];
}

interface IdeaValidationQuestionnaireProps {
  stageTransition?: {
    from: number;
    to: number;
    stageLabels: string[];
  };
  onComplete?: () => void;
}

const IdeaValidationQuestionnaire = ({ stageTransition, onComplete }: IdeaValidationQuestionnaireProps = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<QuestionnaireResults | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuestionnaireData>({
    defaultValues: {
      problemSeverity: 3,
      technicalFeasibility: 3,
      feedbackSources: [],
      validationMethods: [],
      mainRisks: [],
      immediateActions: [],
      resourceNeeds: []
    }
  });

  const steps = [
    {
      title: "Problem Definition",
      icon: Target,
      description: "Define the problem you're solving"
    },
    {
      title: "Target Audience",
      icon: Users,
      description: "Identify your target customers"
    },
    {
      title: "Value Proposition",
      icon: Lightbulb,
      description: "Describe your solution"
    },
    {
      title: "Market Analysis",
      icon: TrendingUp,
      description: "Analyze the market opportunity"
    },
    {
      title: "Feasibility",
      icon: Cog,
      description: "Assess technical and resource feasibility"
    },
    {
      title: "Results",
      icon: FileText,
      description: "View your validation results"
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = async (data: QuestionnaireData) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/questionnaire-api/response`,
        {
          userId: user?.email,
          userEmail: user?.email || "anonymous@example.com",
          userName: user?.name || "Anonymous User",
          responses: data,
          status: 'completed'
        }
      );

      setResults(response.data);
      toast({
        title: "Assessment Complete!",
        description: "Your idea validation results are ready.",
      });
      
      // Call onComplete callback if provided (for stage transitions)
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-600">
              Idea Validation Results
            </CardTitle>
            <CardDescription>
              Your startup idea has been analyzed across key validation criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className={`text-6xl font-bold ${getScoreColor(results.score.overallScore)}`}>
                {results.score.overallScore}
              </div>
              <div className="text-xl font-semibold text-gray-700">
                Overall Score ({getScoreLabel(results.score.overallScore)})
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(results.score).filter(([key]) => key !== 'overallScore').map(([key, score]) => (
                <Card key={key}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </div>
                    <div className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <Badge variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "destructive"}>
                      {getScoreLabel(score)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Startup Recommendation - Show if criteria are met */}
            {(() => {
              // Mock questionnaire answers for demonstration - in real implementation, 
              // this would come from the actual form data or stored responses
              const mockAnswers = {
                revenueModelIdentified: "Yes, validated with customers",
                customerWillingnessToPay: "Yes, multiple customers confirmed", 
                marketValidationScore: 4,
                revenueGenerated: "Yes, initial sales completed",
                productMarketFit: "Strong evidence of product-market fit with high user retention and referrals",
                customerBase: "25",
                scalabilityPlan: "Detailed scaling plan with market expansion strategy and team growth roadmap"
              };
              
              const criteria = evaluateStartupReadiness(mockAnswers);
              const showRecommendation = shouldRecommendStartup(criteria);
              
              if (showRecommendation || results.score.overallScore >= 70) {
                return (
                  <StartupRecommendationCard 
                    criteria={criteria}
                    ideaId="demo-idea-id" // In real implementation, pass actual idea ID
                    className="mt-6"
                  />
                );
              }
              return null;
            })()}

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Take Another Assessment
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-green-600">
          {stageTransition ? 'Stage Transition Validation' : 'Idea Stage Validation Questionnaire'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {stageTransition ? 
            `Validate your idea's readiness to move from ${stageTransition.stageLabels[stageTransition.from]} to ${stageTransition.stageLabels[stageTransition.to]}` :
            'Validate your startup idea with our comprehensive assessment'
          }
        </p>
        
        {/* Stage Transition Info */}
        {stageTransition && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {stageTransition.from + 1}. {stageTransition.stageLabels[stageTransition.from]}
              </Badge>
              <ArrowRight className="w-4 h-4 text-blue-600" />
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {stageTransition.to + 1}. {stageTransition.stageLabels[stageTransition.to]}
              </Badge>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Idea Stage Validation Questionnaire
              </CardTitle>
              <CardDescription>
                Validate your startup idea with our comprehensive assessment
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-green-100 text-green-600 border-2 border-green-500' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className={`text-xs text-center ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 0: Problem Definition */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Problem Definition</h3>
                  <p className="text-gray-600">Help us understand the problem you're trying to solve</p>
                </div>

                <div>
                  <Label htmlFor="problemDescription">Describe the problem in detail *</Label>
                  <Textarea
                    id="problemDescription"
                    {...register("problemDescription", { required: "Problem description is required" })}
                    placeholder="What specific problem are you solving? Who experiences this problem?"
                    rows={4}
                  />
                  {errors.problemDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.problemDescription.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="problemSeverity">How severe is this problem? (1-5 scale) *</Label>
                  <Select onValueChange={(value) => setValue("problemSeverity", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Minor inconvenience</SelectItem>
                      <SelectItem value="2">2 - Noticeable issue</SelectItem>
                      <SelectItem value="3">3 - Significant problem</SelectItem>
                      <SelectItem value="4">4 - Major pain point</SelectItem>
                      <SelectItem value="5">5 - Critical/urgent problem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="problemFrequency">How often do people encounter this problem? *</Label>
                  <Select onValueChange={(value) => setValue("problemFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 1: Target Audience */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Target Audience</h3>
                  <p className="text-gray-600">Define who your customers are</p>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Describe your target audience *</Label>
                  <Textarea
                    id="targetAudience"
                    {...register("targetAudience", { required: "Target audience is required" })}
                    placeholder="Who are your ideal customers? Include demographics, behaviors, and characteristics."
                    rows={3}
                  />
                  {errors.targetAudience && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="audienceSize">What's the size of your target market? *</Label>
                  <Select onValueChange={(value) => setValue("audienceSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select market size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (under 10K people)</SelectItem>
                      <SelectItem value="medium">Medium (10K - 1M people)</SelectItem>
                      <SelectItem value="large">Large (over 1M people)</SelectItem>
                      <SelectItem value="unknown">Unknown/Need to research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customerValidation">Have you validated this with potential customers? *</Label>
                  <Textarea
                    id="customerValidation"
                    {...register("customerValidation", { required: "Customer validation info is required" })}
                    placeholder="Describe any customer interviews, surveys, or feedback you've gathered."
                    rows={3}
                  />
                  {errors.customerValidation && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerValidation.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Value Proposition */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Value Proposition</h3>
                  <p className="text-gray-600">Explain your solution and its unique value</p>
                </div>

                <div>
                  <Label htmlFor="solutionDescription">Describe your solution *</Label>
                  <Textarea
                    id="solutionDescription"
                    {...register("solutionDescription", { required: "Solution description is required" })}
                    placeholder="How does your solution solve the problem? What does it do?"
                    rows={4}
                  />
                  {errors.solutionDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.solutionDescription.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="uniqueValue">What makes your solution unique? *</Label>
                  <Textarea
                    id="uniqueValue"
                    {...register("uniqueValue", { required: "Unique value is required" })}
                    placeholder="What's your unique value proposition? Why would customers choose you?"
                    rows={3}
                  />
                  {errors.uniqueValue && (
                    <p className="text-red-500 text-sm mt-1">{errors.uniqueValue.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="competitiveAdvantage">What's your competitive advantage? *</Label>
                  <Textarea
                    id="competitiveAdvantage"
                    {...register("competitiveAdvantage", { required: "Competitive advantage is required" })}
                    placeholder="What gives you an edge over competitors or alternative solutions?"
                    rows={3}
                  />
                  {errors.competitiveAdvantage && (
                    <p className="text-red-500 text-sm mt-1">{errors.competitiveAdvantage.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Market Analysis */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                  <p className="text-gray-600">Analyze the market opportunity and competition</p>
                </div>

                <div>
                  <Label htmlFor="existingSolutions">What existing solutions are available? *</Label>
                  <Textarea
                    id="existingSolutions"
                    {...register("existingSolutions", { required: "Existing solutions analysis is required" })}
                    placeholder="List current competitors or alternative solutions. How do people solve this problem today?"
                    rows={3}
                  />
                  {errors.existingSolutions && (
                    <p className="text-red-500 text-sm mt-1">{errors.existingSolutions.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="marketGaps">What gaps exist in the current market? *</Label>
                  <Textarea
                    id="marketGaps"
                    {...register("marketGaps", { required: "Market gaps analysis is required" })}
                    placeholder="What's missing from existing solutions? What opportunities do you see?"
                    rows={3}
                  />
                  {errors.marketGaps && (
                    <p className="text-red-500 text-sm mt-1">{errors.marketGaps.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="marketSize">What's the estimated market size? *</Label>
                  <Select onValueChange={(value) => setValue("marketSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select market size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thousand">Thousands ($)</SelectItem>
                      <SelectItem value="million">Millions ($)</SelectItem>
                      <SelectItem value="billion">Billions ($)</SelectItem>
                      <SelectItem value="unknown">Unknown/Need to research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Feasibility */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Feasibility Assessment</h3>
                  <p className="text-gray-600">Evaluate the technical and resource requirements</p>
                </div>

                <div>
                  <Label htmlFor="technicalFeasibility">Technical feasibility (1-5 scale) *</Label>
                  <Select onValueChange={(value) => setValue("technicalFeasibility", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feasibility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very difficult/uncertain</SelectItem>
                      <SelectItem value="2">2 - Challenging but possible</SelectItem>
                      <SelectItem value="3">3 - Moderately feasible</SelectItem>
                      <SelectItem value="4">4 - Quite feasible</SelectItem>
                      <SelectItem value="5">5 - Very feasible/straightforward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resourceRequirements">What resources do you need? *</Label>
                  <Textarea
                    id="resourceRequirements"
                    {...register("resourceRequirements", { required: "Resource requirements are required" })}
                    placeholder="List the key resources needed: funding, team, technology, partnerships, etc."
                    rows={3}
                  />
                  {errors.resourceRequirements && (
                    <p className="text-red-500 text-sm mt-1">{errors.resourceRequirements.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timeToMarket">Expected time to market? *</Label>
                  <Select onValueChange={(value) => setValue("timeToMarket", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="2+ years">2+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="revenueModel">How will you make money? *</Label>
                  <Textarea
                    id="revenueModel"
                    {...register("revenueModel", { required: "Revenue model is required" })}
                    placeholder="Describe your business model and revenue streams."
                    rows={3}
                  />
                  {errors.revenueModel && (
                    <p className="text-red-500 text-sm mt-1">{errors.revenueModel.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {currentStep === steps.length - 1 ? (
                  isSubmitting ? "Analyzing..." : "Complete Assessment"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaValidationQuestionnaire;
