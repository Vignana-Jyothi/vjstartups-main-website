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
import { Plus, Upload, X } from "lucide-react";
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
  
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState, watch } = useForm<ProblemFormData>({
    defaultValues: initialData || {},
  });
  const { errors, isSubmitting } = formState;

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

  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen(isOpen);
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

        <div className="bg-amber-900/30 border border-amber-600 text-amber-200 rounded-lg p-3 text-sm mb-4">
          Note: Off-topic or irrelevant submissions will be rejected by the admin team.
        </div>

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

          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
            >
              {isSubmitting ? (initialData ? "Updating..." : "Submitting...") : initialData ? "Update Problem" : "Submit Problem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemSubmissionForm;
