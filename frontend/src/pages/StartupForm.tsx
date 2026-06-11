import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Rocket, Users, DollarSign, Target, Upload, X, Plus, Image, FileText, Building, TrendingUp, Edit } from 'lucide-react';
import { useUser } from '@/pages/UserContext';
import { useToast } from '@/hooks/use-toast';
import { QuestionHelp } from '@/components/QuestionHelp';

interface StartupFormData {
  startupName: string;
  tagline: string;
  description: string;
  founders: string;
  stage: string;
  fundingStatus: string;
  fundingAmount: string;
  revenue: string;
  customers: string;
  markets: string;
  incorporationStatus: string;
  website: string;
  
  // Visual Assets
  coverImage: File | null;
  logo: File | null;
  
  // Business Model & Strategy
  businessModel: string;
  keyFeatures: string[];
  technologyStack: string[];
  
  // Market Analysis
  marketSize: string;
  annualGrowthRate: string;
  targetUsers: string;
  
  // Progress & Recognition
  supportPrograms: string[];
  teamSize: number | string;
  milestones: Array<{
    title: string;
    date: string;
    completed: boolean;
  }>;
  
  // Documents
  pitchDeck: File | null;
  onePager: File | null;
  
  // Pre-populated from idea
  problemStatement?: string;
  solution?: string;
  targetAudience?: string;
  competitiveAdvantage?: string;
}

const StartupForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get('ideaId');
  const editId = searchParams.get('edit'); // Changed from 'editId' to 'edit' to match the URL parameter
  const isEditMode = !!editId;
  const { user } = useUser();
  const { toast } = useToast();
  
  // Format date to readable format (consistent with StartupDetail)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };
  
  const [formData, setFormData] = useState<StartupFormData>({
    startupName: '',
    tagline: '',
    description: '',
    founders: user?.name || '',
    stage: '1',
    fundingStatus: 'bootstrapped',
    fundingAmount: '',
    revenue: '',
    customers: '',
    markets: '',
    incorporationStatus: 'not-incorporated',
    website: '',
    
    // Visual Assets
    coverImage: null,
    logo: null,
    
    // Business Model & Strategy
    businessModel: '',
    keyFeatures: [],
    technologyStack: [],
    
    // Market Analysis
    marketSize: '',
    annualGrowthRate: '',
    targetUsers: '',
    
    // Progress & Recognition
    supportPrograms: [],
    teamSize: 1,
    milestones: [],
    
    // Documents
    pitchDeck: null,
    onePager: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionnaireResponses, setQuestionnaireResponses] = useState<any>(null);
  
  // Additional state for dynamic arrays
  const [newFeature, setNewFeature] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: '',
    completed: false
  });

  // Pre-populate form with idea and questionnaire data if ideaId is provided
  useEffect(() => {
    const loadDataForIdea = async () => {
      if (!ideaId || isEditMode) return; // Skip if in edit mode

      try {
        // Check if responses were passed via URL parameters first
        const responsesParam = searchParams.get('responses');
        if (responsesParam) {
          const parsedResponses = JSON.parse(responsesParam);
          setQuestionnaireResponses(parsedResponses);
          populateFormFromResponses(parsedResponses);
          return;
        }

        // Otherwise, fetch questionnaire responses from API
        const responseData = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/questionnaire-api/responses/idea/${ideaId}`
        );

        if (responseData.data && responseData.data.length > 0) {
          // Merge all questionnaire responses
          const mergedResponses = {};
          responseData.data.forEach((questionnaire: any) => {
            if (questionnaire.responses) {
              Object.assign(mergedResponses, questionnaire.responses);
            }
          });

          setQuestionnaireResponses(mergedResponses);
          populateFormFromResponses(mergedResponses);
        }

        // Also fetch idea data if available
        // TODO: Add idea API call here if you have an idea details endpoint

      } catch (error) {
        console.error('Error loading data for startup form:', error);
        // Continue with empty form if data loading fails
      }
    };

    loadDataForIdea();
  }, [ideaId, searchParams, isEditMode]);

  // Load existing startup data for editing
  useEffect(() => {
    const loadStartupForEdit = async () => {
      if (!isEditMode || !editId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/startup-api/${editId}`);
        const startup = response.data;
        
        const newFormData = {
          startupName: startup.startupName || '',
          tagline: startup.tagline || '',
          description: startup.description || '',
          founders: startup.founders || '',
          stage: startup.stage?.toString() || '1',
          fundingStatus: startup.fundingStatus || 'bootstrapped',
          fundingAmount: startup.fundingAmount || '',
          revenue: startup.revenue || '',
          customers: startup.customers || '',
          markets: startup.markets || '',
          incorporationStatus: startup.incorporationStatus || 'not-incorporated',
          website: startup.website || '',
          businessModel: startup.businessModel || '',
          keyFeatures: startup.keyFeatures || [],
          technologyStack: startup.technologyStack || [],
          marketSize: startup.marketSize || '',
          annualGrowthRate: startup.annualGrowthRate || '',
          targetUsers: startup.targetUsers || '',
          supportPrograms: startup.supportPrograms || [],
          teamSize: startup.teamSize || 1,
          milestones: startup.milestones || [],
          
          // Visual assets and documents - these will remain null for editing
          // User will need to re-upload if they want to change them
          coverImage: null,
          logo: null,
          pitchDeck: null,
          onePager: null,
          
          // Pre-populated fields
          problemStatement: startup.problemStatement || '',
          solution: startup.solution || '',
          targetAudience: startup.targetAudience || '',
          competitiveAdvantage: startup.competitiveAdvantage || '',
        };
        
        setFormData(newFormData);
        
      } catch (error) {
        console.error('Error loading startup for edit:', error);
        toast({
          title: "Error",
          description: "Failed to load startup data for editing.",
          variant: "destructive",
        });
        navigate('/startups');
      }
    };

    loadStartupForEdit();
  }, [editId, isEditMode, navigate, toast]);

  // Update page title based on mode
  useEffect(() => {
    document.title = isEditMode ? "Update Startup - VJHub" : "Create Startup - VJHub";
    
    return () => {
      document.title = "VJHub"; // Reset title when component unmounts
    };
  }, [isEditMode]);

  const populateFormFromResponses = (responses: any) => {
    setFormData(prev => ({
      ...prev,
      // Map questionnaire responses to startup form fields
      description: responses.solutionDescription || responses.solution || prev.description,
      problemStatement: responses.problemDescription || responses.problem || prev.problemStatement,
      solution: responses.solutionDescription || responses.solution || prev.solution,
      targetAudience: responses.targetAudience || prev.targetAudience,
      competitiveAdvantage: responses.competitiveAdvantage || responses.uniqueValue || prev.competitiveAdvantage,
      
      // Revenue and business model information
      revenue: responses.revenueAmount || prev.revenue,
      customers: responses.customerBase || prev.customers,
      
      // Market information
      markets: responses.marketSize || responses.targetMarket || prev.markets,
      
      // Funding information
      fundingStatus: responses.fundingNeeds === "Yes, actively seeking funding" ? "seeking" : 
                    responses.fundingNeeds === "Bootstrapping for now" ? "bootstrapped" : prev.fundingStatus,
    }));
  };

  // Helper functions for dynamic arrays
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologyStack: [...prev.technologyStack, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologyStack: prev.technologyStack.filter((_, i) => i !== index)
    }));
  };

  const addProgram = () => {
    if (newProgram.trim()) {
      setFormData(prev => ({
        ...prev,
        supportPrograms: [...prev.supportPrograms, newProgram.trim()]
      }));
      setNewProgram('');
    }
  };

  const removeProgram = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportPrograms: prev.supportPrograms.filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    if (newMilestone.title.trim()) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }));
      setNewMilestone({
        title: '',
        date: '',
        completed: false
      });
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (field: keyof StartupFormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate teamSize before submission
      if (formData.teamSize === '' || formData.teamSize === 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid team size (minimum 1).",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('startupName', formData.startupName);
      formDataToSend.append('tagline', formData.tagline);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('founders', formData.founders);
      formDataToSend.append('stage', formData.stage);
      formDataToSend.append('fundingStatus', formData.fundingStatus);
      formDataToSend.append('fundingAmount', formData.fundingAmount);
      formDataToSend.append('revenue', formData.revenue);
      formDataToSend.append('customers', formData.customers);
      formDataToSend.append('markets', formData.markets);
      formDataToSend.append('incorporationStatus', formData.incorporationStatus);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('businessModel', formData.businessModel);
      formDataToSend.append('marketSize', formData.marketSize);
      formDataToSend.append('annualGrowthRate', formData.annualGrowthRate);
      formDataToSend.append('targetUsers', formData.targetUsers);
      
      // Add array fields as JSON strings
      formDataToSend.append('keyFeatures', JSON.stringify(formData.keyFeatures));
      formDataToSend.append('technologyStack', JSON.stringify(formData.technologyStack));
      formDataToSend.append('supportPrograms', JSON.stringify(formData.supportPrograms));
      formDataToSend.append('milestones', JSON.stringify(formData.milestones));
      
      // Handle teamSize - ensure it's a valid number
      const teamSizeValue = typeof formData.teamSize === 'string' ? 
        (formData.teamSize === '' ? 1 : parseInt(formData.teamSize)) : 
        formData.teamSize;
      
      formDataToSend.append('teamSize', teamSizeValue.toString());
      
      // Add pre-populated fields if they exist
      if (formData.problemStatement) formDataToSend.append('problemStatement', formData.problemStatement);
      if (formData.solution) formDataToSend.append('solution', formData.solution);
      if (formData.targetAudience) formDataToSend.append('targetAudience', formData.targetAudience);
      if (formData.competitiveAdvantage) formDataToSend.append('competitiveAdvantage', formData.competitiveAdvantage);
      
      // Add files if they exist
      if (formData.coverImage) formDataToSend.append('coverImage', formData.coverImage);
      if (formData.logo) formDataToSend.append('logo', formData.logo);
      if (formData.pitchDeck) formDataToSend.append('pitchDeck', formData.pitchDeck);
      if (formData.onePager) formDataToSend.append('onePager', formData.onePager);
      
      // Add user ID and ideaId only for create (not update)
      if (!isEditMode) {
        if (user?.id) {
          formDataToSend.append('createdBy', user.id);
        }
        if (ideaId) formDataToSend.append('ideaId', ideaId);
      }

      // Determine API endpoint and method
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/startup-api/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/startup-api`;
      
      const method = isEditMode ? 'put' : 'post';

      const response = await axios[method](url, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({
        title: isEditMode ? "Startup Updated Successfully!" : "Startup Created Successfully!",
        description: isEditMode 
          ? "Your startup profile has been updated." 
          : "Your startup profile has been created and added to our ecosystem.",
      });
      
      navigate('/startups');
    } catch (error) {
      console.error('Error creating startup:', error);
      toast({
        title: "Error",
        description: "Failed to create startup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StartupFormData, value: string | string[] | File | null | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const PrePopulatedIndicator = () => (
    <Badge variant="secondary" className="ml-2 text-xs">
      Pre-filled from questionnaire
    </Badge>
  );

  const isPrePopulated = (field: keyof StartupFormData) => {
    return questionnaireResponses && formData[field] && formData[field] !== '';
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
              <div className={`p-4 rounded-full ${
                isEditMode 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                  : "bg-gradient-to-r from-green-500 to-blue-600"
              }`}>
                {isEditMode ? (
                  <Edit className="w-8 h-8 text-white" />
                ) : (
                  <Rocket className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditMode ? "Update Your Startup" : "Create Your Startup"}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isEditMode 
                ? "Enhance your startup profile to attract more investors, mentors, and collaborators. Keep your information current and showcase your latest achievements."
                : "Transform your validated idea into an official startup. Join our ecosystem and get access to funding, mentorship, and growth opportunities."
              }
            </p>
            
            {ideaId && !isEditMode && (
              <Badge className="mt-4 bg-green-100 text-green-800">
                ✨ Pre-populated from Idea Validation
              </Badge>
            )}
            
            {isEditMode && (
              <Badge className="mt-4 bg-blue-100 text-blue-800">
                ✏️ Editing Mode - Update your startup profile
              </Badge>
            )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startupName" className="flex items-center">
                    Startup Name *
                    <QuestionHelp 
                      questionKey="startupName" 
                      questionText="What should I name my startup?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="startupName"
                    value={formData.startupName}
                    onChange={(e) => handleInputChange('startupName', e.target.value)}
                    placeholder="Enter your startup name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tagline" className="flex items-center">
                    Tagline *
                    <QuestionHelp 
                      questionKey="tagline" 
                      questionText="How do I create an effective tagline?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="One-line description of your startup"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="flex items-center">
                  Description *
                  {isPrePopulated('description') && <PrePopulatedIndicator />}
                  <QuestionHelp 
                    questionKey="description" 
                    questionText="How to write a compelling startup description?"
                    helpType="startup"
                  />
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your startup and what you do"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div>
                  <Label htmlFor="founders" className="flex items-center">
                    Founders & Team *
                    <QuestionHelp 
                      questionKey="founders" 
                      questionText="How to present founder information for college startups?"
                      helpType="startup"
                    />
                  </Label>
                  <Textarea
                    id="founders"
                    value={formData.founders}
                    onChange={(e) => handleInputChange('founders', e.target.value)}
                    placeholder="List all founders with their names, academic background, and roles. Click the help icon for examples."
                    rows={4}
                    required
                  />
                  <p className="text-sm text-vj-muted mt-1">
                    Include all students and faculty involved as founders. Mention their academic background and roles.
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="teamSize" className="flex items-center">
                  Team Size
                  <QuestionHelp 
                    questionKey="teamSize" 
                    questionText="How to count team size for college startups?"
                    helpType="startup"
                  />
                </Label>
                <input
                  id="teamSize"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  max="9999"
                  autoComplete="off"
                  value={formData.teamSize}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    // Only allow numeric values for text input
                    if (!/^\d*$/.test(value) && value !== '') {
                      return;
                    }
                    
                    if (value === '') {
                      // Allow empty input for editing purposes
                      handleInputChange('teamSize', '');
                    } else {
                      const numValue = parseInt(value);
                      
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleInputChange('teamSize', numValue);
                      }
                    }
                  }}
                  placeholder="Enter team size (e.g., 5)"
                />
                <p className="text-sm text-vj-muted mt-1">
                  Include all committed students and faculty working regularly on the startup
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage" className="flex items-center">
                    Current Stage *
                    <QuestionHelp 
                      questionKey="stage" 
                      questionText="How to determine my startup's current stage?"
                      helpType="startup"
                    />
                  </Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Stage 1: Idea & Concept</SelectItem>
                      <SelectItem value="2">Stage 2: Research & Feasibility</SelectItem>
                      <SelectItem value="3">Stage 3: Validation</SelectItem>
                      <SelectItem value="4">Stage 4: Prototype</SelectItem>
                      <SelectItem value="5">Stage 5: MVP</SelectItem>
                      <SelectItem value="6">Stage 6: Testing & Iteration</SelectItem>
                      <SelectItem value="7">Stage 7: Launch & Early Growth</SelectItem>
                      <SelectItem value="8">Stage 8: Scaling</SelectItem>
                      <SelectItem value="9">Stage 9: Maturity & Exit Options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fundingStatus" className="flex items-center">
                    Funding Status *
                    <QuestionHelp 
                      questionKey="fundingStatus" 
                      questionText="What funding status should I choose?"
                      helpType="startup"
                    />
                  </Label>
                  <Select value={formData.fundingStatus} onValueChange={(value) => handleInputChange('fundingStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                      <SelectItem value="seeking-funding">Seeking Funding</SelectItem>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="later-stage">Later Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="revenue" className="flex items-center">
                    Revenue (Monthly)
                    {isPrePopulated('revenue') && <PrePopulatedIndicator />}
                    <QuestionHelp 
                      questionKey="revenue" 
                      questionText="How to report revenue accurately?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="revenue"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    placeholder="₹50,000"
                  />
                </div>
                <div>
                  <Label htmlFor="customers" className="flex items-center">
                    Number of Customers
                    {isPrePopulated('customers') && <PrePopulatedIndicator />}
                    <QuestionHelp 
                      questionKey="customers" 
                      questionText="How to count and report customers?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="customers"
                    value={formData.customers}
                    onChange={(e) => handleInputChange('customers', e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourstartu.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Visual Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={(e) => handleFileChange('coverImage', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('coverImage')?.click()}
                      className="w-full h-32 border-dashed"
                    >
                      {formData.coverImage ? (
                        <div className="text-center">
                          <div className="text-green-600 mb-1">✓ {formData.coverImage.name}</div>
                          <div className="text-xs text-muted-foreground">Click to change</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <div>Upload Cover Image</div>
                          <div className="text-xs text-muted-foreground">Recommended: 1200x600px</div>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="logo">Startup Logo</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo')?.click()}
                      className="w-full h-32 border-dashed"
                    >
                      {formData.logo ? (
                        <div className="text-center">
                          <div className="text-green-600 mb-1">✓ {formData.logo.name}</div>
                          <div className="text-xs text-muted-foreground">Click to change</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <div>Upload Logo</div>
                          <div className="text-xs text-muted-foreground">Recommended: 400x400px</div>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Model & Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Model & Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessModel" className="flex items-center">
                  Business Model *
                  <QuestionHelp 
                    questionKey="businessModel" 
                    questionText="How to describe my business model effectively?"
                    helpType="startup"
                  />
                </Label>
                <Textarea
                  id="businessModel"
                  value={formData.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  placeholder="Describe your business model, revenue streams, and go-to-market strategy"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyFeatures">Key Features</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a key feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.keyFeatures.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="technologyStack">Technology Stack</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a technology"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      />
                      <Button type="button" onClick={addTechnology} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologyStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeTechnology(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="marketSize" className="flex items-center">
                    Market Size
                    <QuestionHelp 
                      questionKey="marketSize" 
                      questionText="How to calculate and present market size?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="marketSize"
                    value={formData.marketSize}
                    onChange={(e) => handleInputChange('marketSize', e.target.value)}
                    placeholder="e.g., $1.2B"
                  />
                </div>
                <div>
                  <Label htmlFor="annualGrowthRate" className="flex items-center">
                    Market Growth Rate (CAGR)
                    <QuestionHelp 
                      questionKey="marketGrowthRate" 
                      questionText="How to find and present market growth rate?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="annualGrowthRate"
                    value={formData.annualGrowthRate}
                    onChange={(e) => handleInputChange('annualGrowthRate', e.target.value)}
                    placeholder="e.g., 15% annually"
                  />
                  <p className="text-sm text-vj-muted mt-1">
                    Expected annual growth rate of your target market
                  </p>
                </div>
                <div>
                  <Label htmlFor="targetUsers" className="flex items-center">
                    Target Users
                    <QuestionHelp 
                      questionKey="targetUsers" 
                      questionText="How to define and quantify target users?"
                      helpType="startup"
                    />
                  </Label>
                  <Input
                    id="targetUsers"
                    value={formData.targetUsers}
                    onChange={(e) => handleInputChange('targetUsers', e.target.value)}
                    placeholder="e.g., 2.5M"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Programs & Recognition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Support Programs & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supportPrograms" className="flex items-center">
                  Support Programs
                  <QuestionHelp 
                    questionKey="supportPrograms" 
                    questionText="What support programs should I include?"
                    helpType="startup"
                  />
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Tech Stars Accelerator"
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                    />
                    <Button type="button" onClick={addProgram} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.supportPrograms.map((program, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {program}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeProgram(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Milestones & Progress
                <QuestionHelp 
                  questionKey="milestones" 
                  questionText="How to set and track meaningful milestones?"
                  helpType="startup"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="milestoneTitle">Milestone Title</Label>
                    <Input
                      id="milestoneTitle"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., MVP Development"
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestoneDate">Target Date</Label>
                    <Input
                      id="milestoneDate"
                      type="date"
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="milestoneCompleted"
                    checked={newMilestone.completed}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, completed: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="milestoneCompleted">Already completed</Label>
                </div>
                
                <Button
                  type="button"
                  onClick={addMilestone}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
                
                {formData.milestones.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Milestones:</Label>
                    {formData.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{milestone.title}</span>
                            {milestone.completed && (
                              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          {milestone.date && (
                            <span className="text-sm text-vj-muted">
                              Due: {formatDate(milestone.date)}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents & Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pitchDeck" className="flex items-center">
                    Pitch Deck
                    <QuestionHelp 
                      questionKey="pitchDeck" 
                      questionText="What should I include in my pitch deck?"
                      helpType="startup"
                    />
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="pitchDeck"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => handleFileChange('pitchDeck', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('pitchDeck')?.click()}
                      className="w-full h-20 border-dashed"
                    >
                      {formData.pitchDeck ? (
                        <div className="text-center">
                          <div className="text-green-600 mb-1">✓ {formData.pitchDeck.name}</div>
                          <div className="text-xs text-muted-foreground">Click to change</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-sm">Upload Pitch Deck</div>
                          <div className="text-xs text-muted-foreground">PDF or PPT</div>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="onePager" className="flex items-center">
                    One Pager
                    <QuestionHelp 
                      questionKey="onePager" 
                      questionText="How to create an effective one-pager?"
                      helpType="startup"
                    />
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="onePager"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('onePager', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('onePager')?.click()}
                      className="w-full h-20 border-dashed"
                    >
                      {formData.onePager ? (
                        <div className="text-center">
                          <div className="text-green-600 mb-1">✓ {formData.onePager.name}</div>
                          <div className="text-xs text-muted-foreground">Click to change</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-sm">Upload One Pager</div>
                          <div className="text-xs text-muted-foreground">PDF or DOC</div>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                isEditMode ? "Updating Startup..." : "Creating Startup..."
              ) : (
                <>
                  <Rocket className="w-5 h-5 mr-2" />
                  {isEditMode ? "Update Startup" : "Create Startup"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartupForm;