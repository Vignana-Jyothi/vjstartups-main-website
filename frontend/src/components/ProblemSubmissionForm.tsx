import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, X, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../pages/UserContext";
import { useNavigate } from "react-router-dom";
import { QuestionHelp } from "./QuestionHelp";

interface ProblemFormData {
  title: string;
  excerpt: string;
  description: string;
  background: string;
  scalability: string;
  marketSize: string;
  competitors: string;
  currentGaps: string;
  targetCustomers: string;
  collaborators: string;
  tags: string;
  image: File | null;
}

interface ProblemSubmissionFormProps {
  onProblemAdded?: (problem: any) => void; // for new submissions
  initialData?: any; // for update
  onUpdate?: (updatedProblem: any) => void; // callback for update
}

const ProblemSubmissionForm = ({
  onProblemAdded,
  initialData,
  onUpdate,
}: ProblemSubmissionFormProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [collaboratorErrors, setCollaboratorErrors] = useState<string[]>([]);
  
  // Duplicate detection states
  const [verificationStep, setVerificationStep] = useState<'input' | 'checking' | 'verified' | 'duplicates'>('input');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [verificationStats, setVerificationStats] = useState<any>(null);
  const [lastVerifiedContent, setLastVerifiedContent] = useState<{title: string, excerpt: string} | null>(null);
  
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState, watch } = useForm<ProblemFormData>({
    defaultValues: initialData || {},
  });
  const { errors, isSubmitting } = formState;

  // Watch title and brief paragraph for changes
  const watchedTitle = watch('title');
  const watchedExcerpt = watch('excerpt');

  // Reset verification when title or brief paragraph changes (with proper debounce)
  useEffect(() => {
    if (!initialData) {
      const currentContent = { title: watchedTitle || '', excerpt: watchedExcerpt || '' };
      
      // Only reset if we have verified content and the current content is significantly different
      if (lastVerifiedContent && (verificationStep === 'verified' || verificationStep === 'duplicates')) {
        const titleChanged = currentContent.title !== lastVerifiedContent.title;
        const excerptChanged = currentContent.excerpt !== lastVerifiedContent.excerpt;
        
        // Add a delay to avoid flickering during typing
        if (titleChanged || excerptChanged) {
          const timeoutId = setTimeout(() => {
            // Double-check the content hasn't changed back
            const latestTitle = watch('title') || '';
            const latestExcerpt = watch('excerpt') || '';
            
            if (latestTitle !== lastVerifiedContent.title || latestExcerpt !== lastVerifiedContent.excerpt) {
              setVerificationStep('input');
              setDuplicates([]);
              setVerificationStats(null);
              setLastVerifiedContent(null);
              
              // Only show toast if user has actually made substantial changes
              if (Math.abs(latestTitle.length - lastVerifiedContent.title.length) > 5 || 
                  Math.abs(latestExcerpt.length - lastVerifiedContent.excerpt.length) > 10) {
                toast({
                  title: "Content Changed", 
                  description: "Please verify for duplicates again since you modified the title or description",
                  variant: "default",
                });
              }
            }
          }, 2000); // 2 second delay to prevent flicker
          
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [watchedTitle, watchedExcerpt, initialData, verificationStep, lastVerifiedContent, watch, toast]);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateCollaborators = (collaboratorsText: string) => {
    if (!collaboratorsText.trim()) {
      setCollaboratorErrors([]);
      return [];
    }

    const emails = collaboratorsText.split(",").map(email => email.trim()).filter(email => email);
    const invalidEmails = emails.filter(email => !email.endsWith('@vnrvjiet.in'));
    const validEmails = emails.filter(email => email.endsWith('@vnrvjiet.in'));
    
    setCollaboratorErrors(invalidEmails);
    return validEmails;
  };

  const handleVerifyDuplicates = async () => {
    const title = watchedTitle;
    const briefparagraph = watchedExcerpt;
    
    if (!title || !briefparagraph) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Title and Brief Paragraph before verifying",
        variant: "destructive",
      });
      return;
    }
    
    setVerificationStep('checking');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/problem-api/check-duplicates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, briefparagraph }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check duplicates');
      }
      
      const data = await response.json();
      console.log('📋 Duplicate check response:', data); // Debug log
      setDuplicates(data.duplicates);
      setVerificationStats(data.stats);
      
      // Store the content that was verified
      setLastVerifiedContent({ title, excerpt: briefparagraph });
      
      if (data.duplicates.length > 0) {
        console.log('⚠️ Duplicates found:', data.duplicates); // Debug log
        setVerificationStep('duplicates');
        toast({
          title: "Similar Problems Found",
          description: `Found ${data.duplicates.length} similar problems. Please review before submitting.`,
          variant: "default",
        });
      } else {
        setVerificationStep('verified');
        toast({
          title: "No Duplicates Found",
          description: "No similar problems found. You can submit your problem!",
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('Error checking duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to check for duplicates. Please try again.",
        variant: "destructive",
      });
      setVerificationStep('input');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen(isOpen);
    
    // Reset verification state when dialog closes or opens
    if (!isOpen || !initialData) {
      setVerificationStep('input');
      setDuplicates([]);
      setVerificationStats(null);
      setLastVerifiedContent(null);
    }
  };

  const onSubmit = async (data: ProblemFormData) => {
    if (!user?.email) {
      toast({
        title: "Login required",
        description: "Please login to submit a problem.",
        variant: "destructive",
      });
      return;
    }

    // Check if verification is completed for new submissions (not updates)
    if (!initialData && verificationStep === 'input') {
      toast({
        title: "Verification Required",
        description: "Please verify for duplicates before submitting",
        variant: "destructive",
      });
      return;
    }

    // Validate collaborators before submission
    const validCollaborators = validateCollaborators(data.collaborators || "");
    if (collaboratorErrors.length > 0) {
      toast({
        title: "Invalid collaborators",
        description: `The following emails are invalid: ${collaboratorErrors.join(", ")}. Only @vnrvjiet.in emails are allowed.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("briefparagraph", data.excerpt);
      formData.append("description", data.description || "");
      formData.append("background", data.background || "");
      formData.append("scalability", data.scalability || "");
      formData.append("marketSize", data.marketSize || "");
      formData.append("existingSolutions", data.competitors || "");
      formData.append("currentGaps", data.currentGaps || "");
      formData.append("targetCustomers", data.targetCustomers || "");
      formData.append("addedByName", user.name);
      formData.append("addedByEmail", user.email);

      // Process collaborators (use already validated emails)
      validCollaborators.forEach(email => formData.append("collaborators[]", email));

      const tagsArray = data.tags ? data.tags.split(",").map(t => t.trim()) : [];
      tagsArray.forEach(tag => formData.append("tags[]", tag));

      if (selectedImage) formData.append("image", selectedImage);

      let response;
      if (initialData) {
        // Update
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${initialData.problemId}`,
          { method: "PUT", body: formData }
        );
      } else {
        // New problem
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem`,
          { method: "POST", body: formData }
        );
      }

      if (!response.ok) throw new Error("Failed");

      const result = await response.json();
      toast({ title: initialData ? "Problem updated!" : "Problem submitted!" });

      if (initialData && onUpdate) onUpdate(result);
      if (!initialData && onProblemAdded) onProblemAdded(result);

      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setOpen(false);

    } catch (error) {
      console.error(error);
      toast({
        title: initialData ? "Update failed" : "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          {initialData ? "Update Problem" : "Submit Problem"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl md:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-3 md:p-6 m-0 md:m-4 rounded-none md:rounded-lg h-full md:h-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            {initialData ? "Update Problem" : "Submit a New Problem"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemTitle" 
                questionText="What makes a good problem title?"
              />
              <Label htmlFor="title">Problem Title *</Label>
            </div>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter problem title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemSummary" 
                questionText="How to write an effective problem summary?"
              />
              <Label htmlFor="excerpt">Brief Summary *</Label>
            </div>
            <Textarea
              id="excerpt"
              {...register("excerpt", { required: "Summary is required" })}
              placeholder="Explain why this problem is important to solve (2-3 sentences)"
              rows={2}
            />
            {errors.excerpt && (
              <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="targetAudience" 
                questionText="How to identify your target customers?"
              />
              <Label htmlFor="targetCustomers">Target Customer(s) *</Label>
            </div>
            <Textarea
              id="targetCustomers"
              {...register("targetCustomers", { required: "Target customers is required" })}
              placeholder="Who has this problem more often? (e.g., College students, Small business owners, Elderly people, etc.)"
              rows={2}
            />
            {errors.targetCustomers && (
              <p className="text-red-500 text-sm mt-1">{errors.targetCustomers.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemDescription" 
                questionText="What details should a problem description include?"
              />
              <Label htmlFor="description">Detailed Description *</Label>
            </div>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Who has the problem, intensity, what they tried, why it's still an issue, how badly they need solution & urgency"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemBackground" 
                questionText="What background information should I include?"
              />
              <Label htmlFor="background">Problem Background</Label>
            </div>
            <Textarea
              id="background"
              {...register("background")}
              placeholder="Stats, reports, surveys, research work, external links that provide deeper insights"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemScale" 
                questionText="How big is this problem geographically and population-wise?"
              />
              <Label htmlFor="scalability">Problem Scale</Label>
            </div>
            <Textarea
              id="scalability"
              {...register("scalability")}
              placeholder="How big is this problem geographically and population-wise?"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemMarketSize" 
                questionText="What's the revenue potential of this problem area?"
              />
              <Label htmlFor="marketSize">Market Potential</Label>
            </div>
            <Input
              id="marketSize"
              {...register("marketSize")}
              placeholder="e.g., $2.3B annual market potential"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemExistingSolutions" 
                questionText="What existing solutions should I research?"
              />
              <Label htmlFor="competitors">Existing Solutions/Competitors</Label>
            </div>
            <Input
              id="competitors"
              {...register("competitors")}
              placeholder="List existing solutions (comma-separated)"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemCurrentGaps" 
                questionText="How to identify gaps in existing solutions?"
              />
              <Label htmlFor="currentGaps">Current Gaps</Label>
            </div>
            <Textarea
              id="currentGaps"
              {...register("currentGaps")}
              placeholder="What's missing in current solutions? Why existing solutions couldn't address the problem fully?"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <QuestionHelp 
                questionKey="problemCollaborators" 
                questionText="What should I know about adding collaborators?"
              />
              <Label htmlFor="collaborators">Collaborators (Optional)</Label>
            </div>
            <Textarea
              id="collaborators"
              {...register("collaborators", {
                onChange: (e) => validateCollaborators(e.target.value)
              })}
              placeholder="Co-developers who will help edit and improve this problem statement"
              rows={2}
            />
            {collaboratorErrors.length > 0 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm font-medium">Invalid email addresses:</p>
                <ul className="text-red-600 text-sm mt-1">
                  {collaboratorErrors.map((email, index) => (
                    <li key={index}>• {email} (must end with @vnrvjiet.in)</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Collaborators can edit and delete this problem. Only @vnrvjiet.in emails are allowed.
            </p>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g., Sustainability, Technology, Healthcare (comma-separated)"
            />
          </div>

          <div>
            <Label htmlFor="image">Problem Cover Photo</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Preferred image size: ≤ 200KB
            </p>
          </div>

          {/* Duplicate Verification Section - Only for new submissions */}
          {!initialData && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Verification Button */}
              {verificationStep === 'input' && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleVerifyDuplicates}
                    disabled={!watchedTitle || !watchedExcerpt}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    🔍 VERIFY FOR DUPLICATES
                  </Button>
                  {(!watchedTitle || !watchedExcerpt) && (
                    <p className="text-xs text-gray-500 text-center">
                      Please fill in both Title and Brief Paragraph to verify
                    </p>
                  )}
                </div>
              )}

              {/* Checking State */}
              {verificationStep === 'checking' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 dark:text-blue-300">
                      Checking for similar problems... 
                      {verificationStats && ` (${verificationStats.totalProblems} problems to compare)`}
                    </span>
                  </div>
                </div>
              )}

              {/* No Duplicates Found */}
              {verificationStep === 'verified' && duplicates.length === 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        ✅ No similar problems found!
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        Verified against {verificationStats?.totalProblems} existing problems 
                        in {verificationStats?.processingTime}ms
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Duplicates Found */}
              {verificationStep === 'duplicates' && duplicates.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-700 dark:text-amber-300 font-medium">
                        ⚠️ Found {duplicates.length} similar problem{duplicates.length > 1 ? 's' : ''}:
                      </p>
                      
                      <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
                        {duplicates.map((duplicate, index) => (
                          <div key={duplicate.problemId} className="bg-white dark:bg-gray-800 rounded-md p-3 border">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm flex-1 pr-2">
                                {index + 1}. {duplicate.title}
                              </h4>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold text-center min-w-[60px] flex-shrink-0">
                                {duplicate.similarity}%
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 leading-relaxed">
                              {duplicate.briefparagraph}
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>By: {duplicate.addedByName}</span>
                              <span>{duplicate.upvotes} upvotes</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/problems/${duplicate.problemId}`, '_blank')}
                                className="h-6 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setVerificationStep('input');
                            setDuplicates([]);
                            setVerificationStats(null);
                            setLastVerifiedContent(null);
                          }}
                          className="flex-1"
                        >
                          ← Modify Problem
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setVerificationStep('verified');
                            // Keep the lastVerifiedContent so it doesn't reset when user continues
                          }}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          ✅ PROCEED ANYWAY
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">{!initialData && verificationStep !== 'verified' ? (
              // Show only Cancel button if not verified
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            ) : (
              // Show both Cancel and Submit/Update buttons
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 ${
                    verificationStep === 'verified' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                  } text-white border-0`}
                >
                  {verificationStep === 'verified' && !initialData ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "✅ SUBMIT PROBLEM"}
                    </>
                  ) : (
                    <>
                      {isSubmitting
                        ? initialData
                          ? "Updating..."
                          : "Submitting..."
                        : initialData
                        ? "Update Problem"
                        : "Submit Problem"}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemSubmissionForm;
