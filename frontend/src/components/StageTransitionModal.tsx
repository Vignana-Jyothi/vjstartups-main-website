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
import { CheckCircle, ArrowLeft, ArrowRight, Target, Users, Lightbulb, TrendingUp, Cog, FileText, Activity, Rocket, Settings, BarChart, LineChart, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/pages/UserContext";
import { getQuestionnaireForStage, getStageTransitionTitle } from "@/config/stageQuestionnaireConfig";
import { stageLabels } from "@/data/mockData";
import QuestionHelp from "@/components/QuestionHelp";
import axios from "axios";

interface StageTransitionModalProps {
  ideaId: string;
  currentStage: number;
  targetStage: number;
  isOpen?: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

const iconMap = {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Cog,
  FileText,
  Activity,
  Rocket,
  Settings,
  BarChart,
  LineChart,
  Zap,
  CheckCircle
};

const StageTransitionModal = ({ 
  ideaId, 
  currentStage, 
  targetStage,  
  isOpen = false, 
  onComplete, 
  onCancel 
}: StageTransitionModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { user } = useUser();

  const questionnaireConfig = getQuestionnaireForStage(currentStage);
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setShowSummary(false);
      setResponses({});
      reset();
      
      // Load previous questionnaire responses for this idea
      loadPreviousResponses();
    }
  }, [isOpen, reset]);

  const loadPreviousResponses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/questionnaire-api/responses/idea/${ideaId}`
      );
      
      console.log('Previous questionnaire data:', response.data);
      
      if (response.data && response.data.length > 0) {
        // Merge all previous responses into one object
        const mergedResponses = {};
        response.data.forEach(questionnaire => {
          if (questionnaire.responses) {
            console.log('Merging responses from questionnaire:', questionnaire._id, questionnaire.responses);
            Object.assign(mergedResponses, questionnaire.responses);
          }
        });
        
        console.log('Final merged responses after loading previous:', mergedResponses);
        console.log('TRL 6 fields in merged responses:', {
          revenueModelIdentified: (mergedResponses as any).revenueModelIdentified,
          customerWillingnessToPay: (mergedResponses as any).customerWillingnessToPay,
          marketValidationScore: (mergedResponses as any).marketValidationScore
        });
        setResponses(mergedResponses);
      } else {
        console.log('No previous responses found for idea:', ideaId);
      }
    } catch (error) {
      console.error('Error loading previous responses:', error);
      // Continue without previous responses if there's an error
    }
  };

  if (!questionnaireConfig) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">No questionnaire configuration found for this stage transition.</p>
        <Button onClick={onCancel} className="mt-4">Close</Button>
      </div>
    );
  }

  const steps = questionnaireConfig.steps;
  const currentStepConfig = steps[currentStep];
  const progress = ((currentStep + 1) / (steps.length + 1)) * 100; // +1 for summary step

  const onSubmit = async (data: any) => {
    // Store current step responses
    const stepResponses = {};
    currentStepConfig.questions.forEach(question => {
      stepResponses[question.id] = data[question.id];
    });
    
    const updatedResponses = { ...responses, ...stepResponses };
    setResponses(updatedResponses);
    
    console.log('Step responses for current step:', stepResponses);
    console.log('Previous responses:', responses);
    console.log('Updated merged responses:', updatedResponses);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Show summary before final submission
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit questionnaire response
      const questionnaireResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/questionnaire-api/response`,
        {
          userId: user?.email,
          userEmail: user?.email || "anonymous@example.com",
          userName: user?.name || "Anonymous User",
          ideaId: ideaId,
          stageTransition: {
            from: currentStage,
            to: targetStage
          },
          responses: responses,
          status: 'completed'
        }
      );

      // Update idea stage
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${ideaId}`,
        {
          stage: targetStage,
          email: user?.email
        }
      );

      toast({
        title: "Stage Transition Complete!",
        description: `Successfully advanced to ${stageLabels[targetStage - 1]}`,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error completing stage transition:", error);
      toast({
        title: "Transition Failed",
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

  if (showSummary) {
    return (
      <div className="w-full max-w-4xl mx-auto p-1 md:p-6 space-y-3 md:space-y-6">
        <Card className="bg-background w-full border-0 md:border shadow-none md:shadow-sm rounded-none md:rounded-lg">
          <CardHeader className="text-center p-2 md:p-6">
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Review Your Responses
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Please review your answers before confirming the stage transition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-2 md:p-6">
            {/* Stage Transition Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-3">
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700">
                  {currentStage}. {stageLabels[currentStage - 1]}
                </Badge>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                  {targetStage}. {stageLabels[targetStage - 1]}
                </Badge>
              </div>
            </div>

            {/* Response Summary */}
            <div className="space-y-4">
              {steps.map((step, stepIndex) => (
                <Card key={step.id} className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {step.questions.map((question) => (
                      <div key={question.id}>
                        <Label className="font-medium text-sm text-foreground/90">
                          {question.label}
                        </Label>
                        <div className="mt-1 p-3 bg-muted/30 dark:bg-muted/10 rounded-md border text-sm text-foreground/90">
                          {responses[question.id] || (
                            <span className="text-muted-foreground">Not answered</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Startup recommendation is now handled on the idea landing page */}

            <div className="flex gap-4 justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowSummary(false)}
                className="hover:bg-secondary/80"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Stage Transition"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 md:space-y-6 p-1 md:p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">
          {getStageTransitionTitle(currentStage - 1, targetStage - 1, stageLabels)}
        </h1>
        <p className="text-gray-600">
          Complete this validation to advance from {stageLabels[currentStage - 1]} to {stageLabels[targetStage - 1]}
        </p>
        
        {/* Stage Transition Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-4 rounded-lg border-blue-200 border dark:border-blue-800 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200  ">
              {currentStage}. {stageLabels[currentStage - 1]}
            </Badge>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200  ">
              {targetStage}. {stageLabels[targetStage - 1]}
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
          </p>
        </div>
      </div>

      <Card className="w-full border-0 md:border shadow-none md:shadow-sm rounded-none md:rounded-lg">
        <CardHeader className="p-2 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-green-600">
                {currentStepConfig.title}
              </CardTitle>
              <CardDescription>
                {currentStepConfig.description}
              </CardDescription>
            </div>
            <div className="text-right">
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-2 md:p-6">
          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || CheckCircle;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-green-100 text-green-600 border-2 border-green-500' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                  </div>
                  <div className={`text-xs text-center ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Step Questions */}
            <div className="space-y-8">
              {currentStepConfig.questions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-center mb-2">
                    <QuestionHelp 
                      questionKey={question.id}
                      questionText={question.label}
                    />
                    <Label htmlFor={question.id} className="text-foreground font-medium">
                      {question.label} {question.required && <span className="text-red-500">*</span>}
                    </Label>
                  </div>
                  
                  {question.type === 'textarea' && (
                    <Textarea
                      id={question.id}
                      {...register(question.id, { 
                        required: question.required ? `${question.label} is required` : false,
                        minLength: question.validation?.minLength ? {
                          value: question.validation.minLength,
                          message: `Minimum ${question.validation.minLength} characters required`
                        } : undefined
                      })}
                      placeholder={question.placeholder}
                      rows={4}
                      className="mt-2 border-input bg-background text-foreground"
                      defaultValue={responses[question.id] || ''}
                    />
                  )}
                  
                  {question.type === 'text' && (
                    <Input
                      id={question.id}
                      {...register(question.id, { 
                        required: question.required ? `${question.label} is required` : false 
                      })}
                      placeholder={question.placeholder}
                      className="mt-2 border-input bg-background text-foreground"
                      defaultValue={responses[question.id] || ''}
                    />
                  )}
                  
                  {question.type === 'select' && (
                    <>
                      <Select onValueChange={(value) => setValue(question.id, value)} defaultValue={responses[question.id]}>
                        <SelectTrigger className="mt-2 border-input bg-background text-foreground">
                          <SelectValue placeholder={question.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent 
                          className="z-[9999] max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                          position="popper"
                          sideOffset={5}
                        >
                          {question.options?.map((option) => (
                            <SelectItem key={option} value={option} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register(question.id, { required: question.required ? `${question.label} is required` : false })} />
                    </>
                  )}
                  
                  {question.type === 'scale' && (
                    <>
                      <Select onValueChange={(value) => setValue(question.id, parseInt(value))} defaultValue={responses[question.id]?.toString()}>
                        <SelectTrigger className="mt-2 border-input bg-background text-foreground">
                          <SelectValue placeholder="Select a rating (1-5)" />
                        </SelectTrigger>
                        <SelectContent 
                          className="z-[9999] max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                          position="popper"
                          sideOffset={5}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                              {num} - {num === 1 ? 'Poor' : num === 2 ? 'Fair' : num === 3 ? 'Good' : num === 4 ? 'Very Good' : 'Excellent'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register(question.id, { required: question.required ? `${question.label} is required` : false })} />
                    </>
                  )}
                  
                  {errors[question.id] && (
                    <p className="text-red-500 text-sm mt-1">{String(errors[question.id]?.message || '')}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Acceptance Criteria Section */}
            {currentStepConfig.acceptanceCriteria && currentStepConfig.acceptanceCriteria.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-vj-primary mb-4">Confirm that your answers address these</h3>
                <div className="space-y-3">
                  {currentStepConfig.acceptanceCriteria.map((criteria, index) => (
                    <div key={criteria.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <input
                        type="checkbox"
                        id={`criteria-${criteria.id}`}
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        defaultChecked={criteria.completed}
                        onChange={(e) => {
                          // Handle acceptance criteria completion
                          const updatedCriteria = [...currentStepConfig.acceptanceCriteria!];
                          updatedCriteria[index].completed = e.target.checked;
                          // You can add state management here if needed
                        }}
                      />
                      <label 
                        htmlFor={`criteria-${criteria.id}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {criteria.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 0 ? onCancel : prevStep}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 0 ? 'Cancel' : 'Previous'}
              </Button>

              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Review Responses
                    <FileText className="w-4 h-4 ml-2" />
                  </>
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

export default StageTransitionModal;
