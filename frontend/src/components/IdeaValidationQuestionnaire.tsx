import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import "@/components/design-system/forms.css";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/pages/UserContext";
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
      description: "Define the problem you're solving"
    },
    {
      title: "Target Audience",
      description: "Identify your target customers"
    },
    {
      title: "Value Proposition",
      description: "Describe your solution"
    },
    {
      title: "Market Analysis",
      description: "Analyze the market opportunity"
    },
    {
      title: "Feasibility",
      description: "Assess technical and resource feasibility"
    }
  ];

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

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const scoreTone = (score: number) => (score >= 70 ? "is-high" : score >= 50 ? "is-mid" : "is-low");

  if (results) {
    const overall = results.score.overallScore;
    return (
      <div className="iq fm" data-accent="lime">
        <div className="iq-result">
          <div className="lx-sec-head">
            <span>Assessment / results</span>
            <h2>How the idea scores</h2>
          </div>
          <div className={`iq-overall ${scoreTone(overall)}`}>
            <b>{overall}</b>
            <span>Overall / {getScoreLabel(overall)}</span>
          </div>
          <dl className="iq-scores">
            {Object.entries(results.score).filter(([key]) => key !== "overallScore").map(([key, score]) => (
              <div key={key} className={scoreTone(score)}>
                <dt>{key.replace(/([A-Z])/g, " $1").trim()}</dt>
                <dd>{score}</dd>
                <i aria-hidden="true"><b style={{ width: `${Math.max(0, Math.min(score, 100))}%` }} /></i>
                <small>{getScoreLabel(score)}</small>
              </div>
            ))}
          </dl>
          {results.recommendations.length > 0 && (
            <section className="dt-field">
              <span>Next</span>
              <div>
                <h3>Recommendations</h3>
                <ul className="lx-list">
                  {results.recommendations.map((recommendation, index) => <li key={index}>{recommendation}</li>)}
                </ul>
              </div>
            </section>
          )}
          {overall >= 70 && (
            <div className="iq-ready">
              <span>Ready for the next step</span>
              <p>A score of 70 or more means the idea is ready to be set up as a startup on the platform.</p>
              <Link to="/startup-form" className="lx-cta">Create your startup ↗</Link>
            </div>
          )}
          <div className="iq-actions">
            <button type="button" className="lx-cta" onClick={() => window.location.reload()}>Take another assessment ↗</button>
            <button type="button" className="lx-textbtn" onClick={() => window.print()}>Print the results</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iq fm" data-accent="lime">
      <div className="iq-head">
        <div className="lx-sec-head">
          <span>Step {pad(currentStep + 1)} / {pad(steps.length)}</span>
          <h2>{stageTransition ? "Stage transition check" : "Validate your idea"}</h2>
        </div>
        <p>
          {stageTransition
            ? `Check your idea is ready to move from ${stageTransition.stageLabels[stageTransition.from]} to ${stageTransition.stageLabels[stageTransition.to]}.`
            : "Five short steps. Answer honestly; the score is only as useful as the answers."}
        </p>
      </div>

      <ol className="iq-steps" aria-label="Assessment steps">
        {steps.map((step, index) => (
          <li key={step.title} className={index < currentStep ? "is-done" : index === currentStep ? "is-on" : ""} aria-current={index === currentStep ? "step" : undefined}>
            <i aria-hidden="true" />
            <span>{pad(index + 1)}</span>
            <b>{step.title}</b>
          </li>
        ))}
      </ol>

      <div className="iq-panel">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 0: Problem Definition */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="iq-step-intro">
                  <h3>Problem Definition</h3>
                  <p className="text-vj-muted">Help us understand the problem you're trying to solve</p>
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
                <div className="iq-step-intro">
                  <h3>Target Audience</h3>
                  <p className="text-vj-muted">Define who your customers are</p>
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
                <div className="iq-step-intro">
                  <h3>Value Proposition</h3>
                  <p className="text-vj-muted">Explain your solution and its unique value</p>
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
                <div className="iq-step-intro">
                  <h3>Market Analysis</h3>
                  <p className="text-vj-muted">Analyze the market opportunity and competition</p>
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
                <div className="iq-step-intro">
                  <h3>Feasibility Assessment</h3>
                  <p className="text-vj-muted">Evaluate the technical and resource requirements</p>
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
            <div className="iq-actions">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                                ← Previous
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
               
              >
                {currentStep === steps.length - 1 ? (
                  isSubmitting ? "Analyzing..." : "Complete Assessment"
                ) : (
                  <>
                    Next ↗
                  </>
                )}
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default IdeaValidationQuestionnaire;
