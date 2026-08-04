import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lightbulb, Users, Target, Upload, X, Plus, Trash2, UserPlus, Link as LinkIcon, FileText, ExternalLink, TrendingUp } from 'lucide-react';
import { useUser } from '@/pages/UserContext';
import { useToast } from '@/hooks/use-toast';
import { stageLabels } from '@/data/mockData';

interface TeamMember {
  name: string;
  email: string;
  role: string;
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
  titleImage: File | null;
  teammates: TeamMember[];
  links: IdeaLink[];
  attachments: IdeaAttachment[];
}

const SubmitIdea: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    problemId: '',
    stage: 1,
    mentor: '',
    contact: '',
    targetCustomers: '',
    titleImage: null,
    teammates: [{ name: '', email: '', role: '' }],
    links: [{ title: '', description: '', url: '', accessLevel: 'public' }],
    attachments: [{ name: '', file: null, accessLevel: 'public' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleImagePreview, setTitleImagePreview] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<any[]>([]);
  const [problemSearch, setProblemSearch] = useState("");
  const [showProblemDropdown, setShowProblemDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Submit Idea - VJHub";
    return () => {
      document.title = "VJHub";
    };
  }, []);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit an idea.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  // Fetch problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems?limit=1000`);
        const problemsData = response.data?.problems || response.data || [];
        setProblems(problemsData);
        setFilteredProblems(problemsData);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems([]);
        setFilteredProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

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
      
      if (searchTerm.startsWith('id:')) {
        const idSearch = searchTerm.substring(3).trim();
        const filtered = problems.filter(problem => 
          problem?.problemId?.toLowerCase().includes(idSearch)
        );
        setFilteredProblems(filtered);
      } else {
        const filtered = problems.filter(problem => {
          const title = problem?.title?.toLowerCase() || '';
          const description = problem?.description?.toLowerCase() || '';
          const briefParagraph = problem?.briefparagraph?.toLowerCase() || '';
          const problemId = problem?.problemId?.toLowerCase() || '';
          
          return title.includes(searchTerm) ||
                 briefParagraph.includes(searchTerm) ||
                 description.includes(searchTerm) ||
                 problemId.includes(searchTerm);
        });
        
        filtered.sort((a, b) => {
          const aTitle = a?.title?.toLowerCase() || '';
          const bTitle = b?.title?.toLowerCase() || '';
          const aTitleMatch = aTitle.includes(searchTerm);
          const bTitleMatch = bTitle.includes(searchTerm);
          
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          
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

  const handleInputChange = (field: keyof IdeaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('titleImage', file);
      const reader = new FileReader();
      reader.onload = () => {
        setTitleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTitleImage = () => {
    setTitleImagePreview(null);
    handleInputChange('titleImage', null);
  };

  const addTeammate = () => {
    setFormData(prev => ({
      ...prev,
      teammates: [...prev.teammates, { name: '', email: '', role: '' }]
    }));
  };

  const removeTeammate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teammates: prev.teammates.filter((_, i) => i !== index)
    }));
  };

  const updateTeammate = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teammates: prev.teammates.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', description: '', url: '', accessLevel: 'public' }]
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index: number, field: keyof IdeaLink, value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: '', file: null, accessLevel: 'public' }]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const updateAttachment = (index: number, field: keyof IdeaAttachment, value: any) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map((attachment, i) => 
        i === index ? { ...attachment, [field]: value } : attachment
      )
    }));
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAttachment(index, 'file', file);
      if (!formData.attachments[index].name) {
        updateAttachment(index, 'name', file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.email) {
      toast({
        title: "Login Required",
        description: "Please log in to submit an idea.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    try {
      const formattedTeam = formData.teammates
        .filter(member => member.name && member.email && member.role)
        .map(teammate => ({
          name: teammate.name,
          email: teammate.email,
          role: teammate.role,
        }));

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('relatedProblemId', formData.problemId);
      submitData.append('stage', String(formData.stage || 1));
      submitData.append('mentor', formData.mentor || '');
      submitData.append('contact', formData.contact);
      submitData.append('targetCustomers', formData.targetCustomers);
      submitData.append('addedByName', user?.name || "Anonymous User");
      submitData.append('addedByEmail', user?.email || "");
      submitData.append('team', JSON.stringify(formattedTeam));
      submitData.append('tags', JSON.stringify(["New Idea"]));

      // Format and append links
      const formattedLinks = formData.links
        .filter(link => link.title && link.url && link.title.trim() && link.url.trim())
        .map(link => ({
          title: link.title,
          description: link.description || '',
          url: link.url,
          accessLevel: link.accessLevel
        }));

      if (formattedLinks.length > 0) {
        submitData.append('links', JSON.stringify(formattedLinks));
      }

      // Format and append attachments
      const validAttachments = formData.attachments.filter(attachment => attachment.file && attachment.name && attachment.name.trim());
      const attachmentMetadata = validAttachments.map(attachment => ({
        name: attachment.name,
        accessLevel: attachment.accessLevel
      }));

      if (attachmentMetadata.length > 0) {
        submitData.append('attachmentMetadata', JSON.stringify(attachmentMetadata));
      }

      validAttachments.forEach((attachment) => {
        if (attachment.file) {
          submitData.append('attachments', attachment.file);
        }
      });

      // Append title image
      if (formData.titleImage) {
        submitData.append('titleImage', formData.titleImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast({
          title: "Idea Submitted Successfully!",
          description: "Your idea has been added to the community.",
        });

        navigate('/ideas');
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Submit Your Idea
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform a problem into an innovative solution. Share your idea with the community and take the first step toward building something meaningful.
            </p>
            
            <div className="mt-4 p-3 bg-amber-900/30 border border-amber-600 text-amber-200 rounded-lg text-sm max-w-2xl mx-auto">
              ⚠️ Note: Off-topic or irrelevant submissions will be rejected by the admin team.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Idea Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a clear, compelling idea title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="problemId">Related Problem *</Label>
                <div className="relative" ref={dropdownRef}>
                  <Input
                    type="text"
                    placeholder="Search problems... (use 'id:123' for ID search)"
                    value={problemSearch}
                    onChange={(e) => {
                      setProblemSearch(e.target.value);
                      setShowProblemDropdown(true);
                    }}
                    onFocus={() => setShowProblemDropdown(true)}
                    className="w-full"
                    autoComplete="off"
                    required
                  />
                  
                  {showProblemDropdown && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {loading ? (
                        <div className="p-3 text-center text-gray-500">Loading problems...</div>
                      ) : !Array.isArray(problems) || problems.length === 0 ? (
                        <div className="p-3 text-center text-gray-500">
                          No problems available. Please add problems first.
                        </div>
                      ) : Array.isArray(filteredProblems) && filteredProblems.length > 0 ? (
                        filteredProblems.map((problem) => (
                          <div
                            key={problem?._id || problem?.problemId}
                            className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => {
                              if (problem?.problemId && problem?.title) {
                                handleInputChange('problemId', problem.problemId);
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
                              <Badge variant="secondary" className="text-xs">
                                ID: {problem?.problemId || 'N/A'}
                              </Badge>
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
              </div>

              <div>
                <Label htmlFor="titleImage">Idea Cover Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
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
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Recommended: 1280x720 or 16:9 aspect ratio
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Idea Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your solution in detail. How does it solve the problem?"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetCustomers">Target Customers *</Label>
                <Textarea
                  id="targetCustomers"
                  value={formData.targetCustomers}
                  onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                  placeholder="Who will use your solution? Describe your target market segment."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Stage & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Development Stage & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">Development Stage</Label>
                  <Select
                    value="1"
                    onValueChange={() => {}}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="1. Idea & Concept" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageLabels.map((stage, index) => (
                        <SelectItem
                          key={index}
                          value={(index + 1).toString()}
                          disabled={index !== 0}
                        >
                          {index + 1}. {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    All new ideas start at the Ideation stage
                  </p>
                </div>

                <div>
                  <Label htmlFor="mentor">Mentor (Optional)</Label>
                  <Input
                    id="mentor"
                    value={formData.mentor}
                    onChange={(e) => handleInputChange('mentor', e.target.value)}
                    placeholder="e.g., Dr. Rajesh Kumar"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact">Contact Phone Number *</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="+91 9XXXXXXXXX"
                  pattern="^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid Indian phone number
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </div>
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.teammates.map((member, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Team Member {index + 1}</h4>
                    {formData.teammates.length > 1 && (
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeammate(index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeammate(index, 'email', e.target.value)}
                        placeholder="email@vnrvjiet.in"
                      />
                    </div>

                    <div>
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeammate(index, 'role', e.target.value)}
                        placeholder="e.g., Developer, Designer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Related Links (Optional)
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.links.map((link, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Link {index + 1}</h4>
                    {formData.links.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Link Title</Label>
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                        placeholder="e.g., GitHub Repository, Demo Video"
                      />
                    </div>

                    <div>
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={link.description}
                        onChange={(e) => updateLink(index, 'description', e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>

                    <div>
                      <Label>Access Level</Label>
                      <Select
                        value={link.accessLevel}
                        onValueChange={(value) => updateLink(index, 'accessLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Visible to everyone</SelectItem>
                          <SelectItem value="private">Private - Only visible to you</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/ideas')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitIdea;
