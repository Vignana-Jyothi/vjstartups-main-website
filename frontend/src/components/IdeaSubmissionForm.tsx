import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X, UserPlus, Trash2, CheckCircle, Link as LinkIcon, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stageLabels } from "@/data/mockData";
import axios from "axios";
import { useUser } from "@/pages/UserContext";
import { Link } from "react-router-dom";
import StageTransitionValidator from "./StageTransitionValidator";

interface TeamMember {
  name: string;
  email: string;
  role: string;
  image: File | null;
}

interface IdeaLink {
  title: string;
  description: string;
  url: string;
  accessLevel: 'public' | 'private';
}

interface IdeaAttachment {
  name: string;
  file: File | null;
  accessLevel: 'public' | 'private';
}

interface IdeaFormData {
  title: string;
  description: string;
  problemId: string;
  stage: number;
  mentor: string;
  contact: string;
  targetCustomers: string;
  titleImage: FileList | null;
  teammates: TeamMember[];
  links: IdeaLink[];
  attachments: IdeaAttachment[];
}

const IdeaSubmissionForm = () => {
  const [open, setOpen] = useState(false);
  const [teamImagePreviews, setTeamImagePreviews] = useState<{ [key: number]: string }>({});
  const [titleImagePreview, setTitleImagePreview] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<any[]>([]);
  const [problemSearch, setProblemSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [showProblemDropdown, setShowProblemDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStageValidator, setShowStageValidator] = useState(false);
  const [pendingStage, setPendingStage] = useState<number | null>(null);
  const [currentSelectedStage, setCurrentSelectedStage] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        console.log("Fetching problems from:", `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems`);
        // Set a high limit (1000) to fetch all problems at once
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems?limit=1000`);
        console.log("Problems response:", response.data);
        
        // Extract problems array from the response structure
        const problemsData = response.data?.problems || response.data || [];
        console.log("Extracted problems:", problemsData);
        
        setProblems(problemsData);
        setFilteredProblems(problemsData);
      } catch (error) {
        console.error("Error fetching problems:", error);
        // Set empty array on error to prevent undefined issues
        setProblems([]);
        setFilteredProblems([]);
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProblems();
    }
  }, [open]);

  // Filter problems based on search
  useEffect(() => {
    if (!Array.isArray(problems)) {
      setFilteredProblems([]);
      return;
    }
    
    if (!problemSearch.trim()) {
      setFilteredProblems(problems);
    } else {
      const searchTerm = problemSearch.toLowerCase().trim();
      
      // Check if search starts with "id:" for ID-specific search
      if (searchTerm.startsWith('id:')) {
        const idSearch = searchTerm.substring(3).trim();
        const filtered = problems.filter(problem => 
          problem?.problemId?.toLowerCase().includes(idSearch)
        );
        setFilteredProblems(filtered);
      } else {
        // Regular search with improved relevance scoring
        const filtered = problems.filter(problem => {
          const title = problem?.title?.toLowerCase() || '';
          const description = problem?.description?.toLowerCase() || '';
          const briefParagraph = problem?.briefparagraph?.toLowerCase() || '';
          const problemId = problem?.problemId?.toLowerCase() || '';
          
          // Prioritize title matches, then description, then other fields
          return title.includes(searchTerm) ||
                 briefParagraph.includes(searchTerm) ||
                 description.includes(searchTerm) ||
                 problemId.includes(searchTerm);
        });
        
        // Sort by relevance - title matches first
        filtered.sort((a, b) => {
          const aTitle = a?.title?.toLowerCase() || '';
          const bTitle = b?.title?.toLowerCase() || '';
          const aTitleMatch = aTitle.includes(searchTerm);
          const bTitleMatch = bTitle.includes(searchTerm);
          
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          
          // If both or neither match title, sort by problemId (newer problems first)
          const aId = parseInt(a?.problemId || '0');
          const bId = parseInt(b?.problemId || '0');
          return bId - aId;
        });
        
        setFilteredProblems(filtered);
      }
    }
  }, [problemSearch, problems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProblemDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<IdeaFormData>({
    defaultValues: {
      teammates: [{ name: "", email: "", role: "", image: null }],
      links: [{ title: "", description: "", url: "", accessLevel: "public" }],
      attachments: [{ name: "", file: null, accessLevel: "public" }],
      stage: 0 // Default to "Ideation" (index 0)
    }
  });

  const watchedTitle = watch("title");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teammates"
  });

  const { fields: linkFields, append: appendLink, remove: removeLinkField } = useFieldArray({
    control,
    name: "links"
  });

  const { fields: attachmentFields, append: appendAttachment, remove: removeAttachmentField } = useFieldArray({
    control,
    name: "attachments"
  });

  const onSubmit = async (data: IdeaFormData) => {
    try {
      const formattedTeam = data.teammates.map((teammate, index) => ({
        name: teammate.name,
        email: teammate.email,
        role: teammate.role,
        // We'll handle image upload separately in a production app
      }));

      // Create a FormData object to send files
      const formData = new FormData();

      // Append text data
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('relatedProblemId', data.problemId);
      formData.append('stage', String(data.stage || 1));
      formData.append('mentor', data.mentor || '');
      formData.append('contact', data.contact);
      formData.append('targetCustomers', data.targetCustomers);
      formData.append('addedByName', user?.name || "Anonymous User");
      formData.append('addedByEmail', user?.email || "anonymous@example.com");
      formData.append('team', JSON.stringify(formattedTeam));
      formData.append('tags', JSON.stringify(["New Idea"]));

      // Format and append links data
      const formattedLinks = data.links
        .filter(link => link.title && link.url && link.title.trim() && link.url.trim()) // Only include links with title and URL
        .map(link => ({
          title: link.title,
          description: link.description || '',
          url: link.url,
          accessLevel: link.accessLevel
        }));

      if (formattedLinks.length > 0) {
        formData.append('links', JSON.stringify(formattedLinks));
      }

      // Format and append attachments data
      const validAttachments = data.attachments.filter(attachment => attachment.file && attachment.name && attachment.name.trim());
      const attachmentMetadata = validAttachments.map(attachment => ({
        name: attachment.name,
        accessLevel: attachment.accessLevel
      }));

      if (attachmentMetadata.length > 0) {
        formData.append('attachmentMetadata', JSON.stringify(attachmentMetadata));
      }

      // Append attachment files
      validAttachments.forEach((attachment, index) => {
        if (attachment.file) {
          formData.append('attachments', attachment.file);
        }
      });

      // Append title image if available
      if (data.titleImage && data.titleImage[0]) {
        console.log('📸 Frontend Debug - Appending title image:', data.titleImage[0].name, data.titleImage[0].type);
        formData.append('titleImage', data.titleImage[0]);
      } else {
        console.log('📸 Frontend Debug - No title image to append:', data.titleImage);
      }

      // Send data to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast({
          title: "Idea submitted successfully!",
          description: "Your idea has been submitted for review.",
        });

        reset();
        setTeamImagePreviews({});
        setProblemSearch("");
        setSelectedProblem(null);
        setShowProblemDropdown(false);
        setOpen(false);

        // Force a reload of ideas data if we're on the ideas page
        if (window.location.pathname.includes('/ideas')) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleTitleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in the form data
      setValue("titleImage", e.target.files);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setTitleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      console.log('📸 Frontend Debug - File selected:', file.name, file.type, file.size);
    }
  };

  const removeTitleImage = () => {
    setTitleImagePreview(null);
    setValue("titleImage", null);
  };

  const handleTeamImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTeamImagePreviews(prev => ({
          ...prev,
          [index]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTeamImage = (index: number) => {
    setTeamImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const addTeammate = () => {
    append({ name: "", email: "", role: "", image: null });
  };

  const addLink = () => {
    appendLink({ title: "", description: "", url: "", accessLevel: "public" });
  };

  const addAttachment = () => {
    appendAttachment({ name: "", file: null, accessLevel: "public" });
  };

  const removeTeammate = (index: number) => {
    remove(index);
    removeTeamImage(index);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`attachments.${index}.file`, file);
      if (!watch(`attachments.${index}.name`)) {
        setValue(`attachments.${index}.name`, file.name);
      }
    }
  };

  const handleStageChange = (newStage: string) => {
    const newStageIndex = parseInt(newStage);

    // Specifically trigger validation when moving from Ideation (0) to Research (1)
    if (currentSelectedStage === 0 && newStageIndex === 1) {
      setPendingStage(newStageIndex);
      setShowStageValidator(true);
    } else {
      // Allow all other stage changes without validation
      setCurrentSelectedStage(newStageIndex);
      setValue("stage", newStageIndex);
    }
  };

  const handleStageTransitionConfirm = () => {
    if (pendingStage !== null) {
      setCurrentSelectedStage(pendingStage);
      setValue("stage", pendingStage);
      setPendingStage(null);
    }
  };

  const handleStageValidatorClose = () => {
    setShowStageValidator(false);
    setPendingStage(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Submit Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="idea-form-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">Submit a New Idea</DialogTitle>
        </DialogHeader>
        <p id="idea-form-description" className="sr-only">
          Form to submit a new startup idea with details, team members, links, and file attachments.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Idea Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter your idea title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="problemId">Related Problem *</Label>
            <div className="relative" ref={dropdownRef}>
                <Input
                  type="text"
                  placeholder="Search problems... (use 'id:123' for ID search)"
                  value={problemSearch}
                  onChange={(e) => {
                    e.preventDefault();
                    setProblemSearch(e.target.value);
                    setShowProblemDropdown(true);
                  }}
                  onFocus={(e) => {
                    e.preventDefault();
                    setShowProblemDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full ${errors.problemId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="off"
                />
                
                {showProblemDropdown && (
                  <div 
                    className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {loading ? (
                      <div className="p-3 text-center text-gray-500">Loading problems...</div>
                    ) : !Array.isArray(problems) || problems.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        No problems available. Please add problems first.
                      </div>
                    ) : Array.isArray(filteredProblems) && filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <div
                          key={problem?._id || problem?.problemId || Math.random()}
                          className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-150"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (problem?.problemId && problem?.title) {
                              setValue("problemId", problem.problemId);
                              setProblemSearch(problem.title);
                              setShowProblemDropdown(false);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-3">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                {problem?.title || 'Untitled Problem'}
                              </div>
                              {problem?.briefparagraph && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {problem.briefparagraph.length > 100 
                                    ? problem.briefparagraph.substring(0, 100) + '...' 
                                    : problem.briefparagraph}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/50 px-2.5 py-1 rounded">
                                ID: {problem?.problemId || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        {problemSearch ? 'No problems found matching your search' : 'Start typing to search problems'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <input type="hidden" {...register("problemId", { required: "Please select a problem" })} />
              {errors.problemId && <p className="text-red-500 text-sm mt-1">Please select a problem</p>}
          </div>

          {/* Title Image Upload */}
          <div>
            <Label htmlFor="titleImage">Idea Title Image</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="titleImage"
                type="file"
                accept="image/*"
                onChange={handleTitleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="titleImage"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-idea-primary/10 text-idea-primary hover:bg-idea-primary/20 cursor-pointer"
              >
                <Upload size={18} />
                <span>Upload Image</span>
              </label>

              {titleImagePreview && (
                <div className="relative">
                  <img
                    src={titleImagePreview}
                    alt="Title preview"
                    className="h-16 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeTitleImage}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="text-xs text-vj-muted">
                Recommended: 1280x720 or 16:9 aspect ratio
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Idea Description *</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Describe your solution in detail"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="targetCustomers">Target Customers *</Label>
            <Textarea
              id="targetCustomers"
              {...register("targetCustomers", { required: "Target customers is required" })}
              placeholder="Describe your target customers and market segment"
              rows={3}
            />
            {errors.targetCustomers && <p className="text-red-500 text-sm mt-1">{errors.targetCustomers.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Development Stage</Label>
              <Select
                value="0"
                onValueChange={() => { }} // Prevent any changes
              >
                <SelectTrigger>
                  <SelectValue placeholder="1. Idea & Concept" />
                </SelectTrigger>
                <SelectContent>
                  {stageLabels.map((stage, index) => (
                    <SelectItem
                      key={index}
                      value={index.toString()}
                      disabled={index !== 0} // Only Ideation (index 0) is enabled
                    >
                      {index + 1}. {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("stage")} value={0} />
              <p className="text-xs text-gray-500 mt-1">
                All new ideas start at the Ideation stage
              </p>
            </div>

            <div>
              <Label htmlFor="mentor">Mentor (Optional)</Label>
              <Input
                id="mentor"
                {...register("mentor")}
                placeholder="e.g., Dr. Rajesh Kumar - IIT Delhi"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Contact Phone Number *</Label>
            <Input
              id="contact"
              type="tel"
              {...register("contact", {
                required: "Contact phone number is required",
                pattern: {
                  value: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
                  message: "Invalid Indian phone number format"
                }
              })}
              placeholder="+91 9XXXXXXXXX"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTeammate}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeammate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      {...register(`teammates.${index}.name`, { required: "Name is required" })}
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      {...register(`teammates.${index}.email`, {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email"
                        }
                      })}
                      placeholder="email@iit.ac.in"
                    />
                  </div>

                  <div>
                    <Label>Role *</Label>
                    <Input
                      {...register(`teammates.${index}.role`, { required: "Role is required" })}
                      placeholder="e.g., Programmer, UI Designer, ML Engineer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Related Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>

            {linkFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Link {index + 1}</h4>
                  {linkFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLinkField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 mb-3">
                  <div>
                    <Label>Link Title</Label>
                    <Input
                      {...register(`links.${index}.title`)}
                      placeholder="e.g., GitHub Repository, Demo Video, Research Paper"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      {...register(`links.${index}.description`)}
                      placeholder="Brief description of the link content"
                    />
                  </div>

                  <div>
                    <Label>URL</Label>
                    <Input
                      type="url"
                      {...register(`links.${index}.url`, {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Please enter a valid URL starting with http:// or https://"
                        }
                      })}
                      placeholder="https://example.com"
                    />
                    {errors.links?.[index]?.url && (
                      <p className="text-red-500 text-sm mt-1">{errors.links[index]?.url?.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Access Level</Label>
                    <Select
                      defaultValue="public"
                      onValueChange={(value) => setValue(`links.${index}.accessLevel`, value as 'public' | 'private')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>Public - Visible to everyone</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            <span>Private - Only visible to you and your team</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register(`links.${index}.accessLevel`)} />
                    <p className="text-xs text-gray-500 mt-1">
                      Public links are visible to all users, private links only to you and your team
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* File Attachments Section */}
          {/* <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">File Attachments</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttachment}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Add File
              </Button>
            </div>

            {attachmentFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Attachment {index + 1}</h4>
                  {attachmentFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachmentField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 mb-3">
                  <div>
                    <Label>File Name</Label>
                    <Input
                      {...register(`attachments.${index}.name`)}
                      placeholder="e.g., Project Proposal, Technical Specs, Demo"
                    />
                  </div>

                  <div>
                    <Label>Upload File</Label>
                    <div className="mt-2">
                      <Input
                        type="file"
                        onChange={(e) => handleFileUpload(index, e)}
                        className="cursor-pointer"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: PDF, DOC, PPT, Images, Videos (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Access Level</Label>
                    <Select
                      defaultValue="public"
                      onValueChange={(value) => setValue(`attachments.${index}.accessLevel`, value as 'public' | 'private')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>Public - Visible to everyone</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span>Private - Only visible to you and your team</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register(`attachments.${index}.accessLevel`)} />
                    <p className="text-xs text-gray-500 mt-1">
                      Public files are visible to all users, private files only to you and your team
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

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
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
        
        {/* Stage Transition Validator */}
        <StageTransitionValidator
          currentStage={currentSelectedStage}
          targetStage={pendingStage || 0}
          isOpen={showStageValidator}
          onClose={handleStageValidatorClose}
          onConfirm={handleStageTransitionConfirm}
          ideaTitle={watchedTitle || "your idea"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IdeaSubmissionForm;