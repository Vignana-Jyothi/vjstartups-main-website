import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Target, Users, TrendingUp, BarChart3, Lightbulb, Upload, X, CheckCircle, Eye } from 'lucide-react';
import { useUser } from '@/pages/UserContext';
import { useToast } from '@/hooks/use-toast';
import { QuestionHelp } from '@/components/QuestionHelp';

interface ProblemFormData {
  title: string;
  briefparagraph: string;
  description: string;
  targetCustomers: string;
  background: string;
  scalability: string;
  marketSize: string;
  existingSolutions: string;
  currentGaps: string;
  collaborators: string;
  tags: string;
  image: File | null;
}

const SubmitProblem: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    briefparagraph: '',
    description: '',
    targetCustomers: '',
    background: '',
    scalability: '',
    marketSize: '',
    existingSolutions: '',
    currentGaps: '',
    collaborators: '',
    tags: '',
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [collaboratorErrors, setCollaboratorErrors] = useState<string[]>([]);
  
  // Duplicate detection states
  const [verificationStep, setVerificationStep] = useState<'input' | 'checking' | 'verified' | 'duplicates'>('input');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [verificationStats, setVerificationStats] = useState<any>(null);
  const [lastVerifiedContent, setLastVerifiedContent] = useState<{title: string, excerpt: string} | null>(null);

  useEffect(() => {
    document.title = "Submit Problem - VJHub";
    return () => {
      document.title = "VJHub";
    };
  }, []);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a problem.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  // Reset verification when title or brief paragraph changes
  useEffect(() => {
    const currentContent = { title: formData.title || '', excerpt: formData.briefparagraph || '' };
    
    if (lastVerifiedContent && (verificationStep === 'verified' || verificationStep === 'duplicates')) {
      const titleChanged = currentContent.title !== lastVerifiedContent.title;
      const excerptChanged = currentContent.excerpt !== lastVerifiedContent.excerpt;
      
      if (titleChanged || excerptChanged) {
        const timeoutId = setTimeout(() => {
          if (formData.title !== lastVerifiedContent.title || formData.briefparagraph !== lastVerifiedContent.excerpt) {
            setVerificationStep('input');
            setDuplicates([]);
            setVerificationStats(null);
            setLastVerifiedContent(null);
            
            if (Math.abs(formData.title.length - lastVerifiedContent.title.length) > 5 || 
                Math.abs(formData.briefparagraph.length - lastVerifiedContent.excerpt.length) > 10) {
              toast({
                title: "Content Changed", 
                description: "Please verify for duplicates again",
                variant: "default",
              });
            }
          }
        }, 2000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [formData.title, formData.briefparagraph, verificationStep, lastVerifiedContent, toast]);

  const handleInputChange = (field: keyof ProblemFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      handleInputChange('image', file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    handleInputChange('image', null);
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
    const title = formData.title;
    const briefparagraph = formData.briefparagraph;
    
    if (!title || !briefparagraph) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Title and Brief Summary before verifying",
        variant: "destructive",
      });
      return;
    }
    
    setVerificationStep('checking');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/check-duplicates`,
        { title, briefparagraph }
      );
      
      const data = response.data;
      setDuplicates(data.duplicates);
      setVerificationStats(data.stats);
      setLastVerifiedContent({ title, excerpt: briefparagraph });
      
      if (data.duplicates.length > 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.email) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a problem.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    if (verificationStep === 'input') {
      toast({
        title: "Verification Required",
        description: "Please verify for duplicates before submitting",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const validCollaborators = validateCollaborators(formData.collaborators);
    if (collaboratorErrors.length > 0) {
      toast({
        title: "Invalid collaborators",
        description: `Only @vnrvjiet.in emails are allowed: ${collaboratorErrors.join(", ")}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("briefparagraph", formData.briefparagraph);
      submitData.append("description", formData.description);
      submitData.append("targetCustomers", formData.targetCustomers);
      submitData.append("background", formData.background || "");
      submitData.append("scalability", formData.scalability || "");
      submitData.append("marketSize", formData.marketSize || "");
      submitData.append("existingSolutions", formData.existingSolutions || "");
      submitData.append("currentGaps", formData.currentGaps || "");
      submitData.append("addedByName", user.name);
      submitData.append("addedByEmail", user.email);

      validCollaborators.forEach(email => submitData.append("collaborators[]", email));

      const tagsArray = formData.tags ? formData.tags.split(",").map(t => t.trim()) : [];
      tagsArray.forEach(tag => submitData.append("tags[]", tag));

      if (selectedImage) submitData.append("image", selectedImage);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem`,
        submitData
      );
      
      toast({
        title: "Problem Submitted Successfully!",
        description: "Your problem has been added to the community.",
      });
      
      navigate('/problems');
    } catch (error) {
      console.error('Error submitting problem:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4">
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
              <div className="p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Submit a New Problem
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Identify real-world challenges that need innovative solutions. Help the community understand problems worth solving and inspire breakthrough ideas.
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
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="title">Problem Title *</Label>
                  <QuestionHelp 
                    questionKey="problemTitle" 
                    questionText="What makes a good problem title?"
                  />
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a clear, concise problem title"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="briefparagraph">Brief Summary *</Label>
                  <QuestionHelp 
                    questionKey="problemSummary" 
                    questionText="How to write an effective problem summary?"
                  />
                </div>
                <Textarea
                  id="briefparagraph"
                  value={formData.briefparagraph}
                  onChange={(e) => handleInputChange('briefparagraph', e.target.value)}
                  placeholder="Explain why this problem is important to solve (2-3 sentences)"
                  rows={3}
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="targetCustomers">Target Customer(s) *</Label>
                  <QuestionHelp 
                    questionKey="targetAudience" 
                    questionText="How to identify your target customers?"
                  />
                </div>
                <Textarea
                  id="targetCustomers"
                  value={formData.targetCustomers}
                  onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                  placeholder="Who has this problem? (e.g., College students, Small business owners, etc.)"
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Detailed Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Problem Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <QuestionHelp 
                    questionKey="problemDescription" 
                    questionText="What details should a problem description include?"
                  />
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Who has the problem, intensity, what they tried, why it's still an issue, urgency..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="background">Problem Background</Label>
                  <QuestionHelp 
                    questionKey="problemBackground" 
                    questionText="What background information should I include?"
                  />
                </div>
                <Textarea
                  id="background"
                  value={formData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="Stats, reports, surveys, research work, links that provide deeper insights"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market & Scale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market & Scale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="scalability">Problem Scale</Label>
                  <QuestionHelp 
                    questionKey="problemScale" 
                    questionText="How big is this problem geographically and population-wise?"
                  />
                </div>
                <Textarea
                  id="scalability"
                  value={formData.scalability}
                  onChange={(e) => handleInputChange('scalability', e.target.value)}
                  placeholder="How big is this problem geographically and population-wise?"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="marketSize">Market Potential</Label>
                  <QuestionHelp 
                    questionKey="problemMarketSize" 
                    questionText="What's the revenue potential of this problem area?"
                  />
                </div>
                <Input
                  id="marketSize"
                  value={formData.marketSize}
                  onChange={(e) => handleInputChange('marketSize', e.target.value)}
                  placeholder="e.g., $2.3B annual market potential"
                />
              </div>
            </CardContent>
          </Card>

          {/* Existing Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Competitive Landscape
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="existingSolutions">Existing Solutions/Competitors</Label>
                  <QuestionHelp 
                    questionKey="problemExistingSolutions" 
                    questionText="What existing solutions should I research?"
                  />
                </div>
                <Input
                  id="existingSolutions"
                  value={formData.existingSolutions}
                  onChange={(e) => handleInputChange('existingSolutions', e.target.value)}
                  placeholder="List existing solutions (comma-separated)"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="currentGaps">Current Gaps</Label>
                  <QuestionHelp 
                    questionKey="problemCurrentGaps" 
                    questionText="How to identify gaps in existing solutions?"
                  />
                </div>
                <Textarea
                  id="currentGaps"
                  value={formData.currentGaps}
                  onChange={(e) => handleInputChange('currentGaps', e.target.value)}
                  placeholder="What's missing in current solutions? Why can't they fully address the problem?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="collaborators">Collaborators (Optional)</Label>
                  <QuestionHelp 
                    questionKey="problemCollaborators" 
                    questionText="What should I know about adding collaborators?"
                  />
                </div>
                <Textarea
                  id="collaborators"
                  value={formData.collaborators}
                  onChange={(e) => {
                    handleInputChange('collaborators', e.target.value);
                    validateCollaborators(e.target.value);
                  }}
                  placeholder="Co-developers who will help edit this problem (comma-separated emails)"
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
                  Only @vnrvjiet.in emails allowed. Collaborators can edit/delete this problem.
                </p>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
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
                        className="w-48 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Upload Image</span>
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
                  Preferred: ≤ 200KB, aspect ratio 16:9
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Duplicate Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Duplicate Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStep === 'input' && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleVerifyDuplicates}
                    disabled={!formData.title || !formData.briefparagraph}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    🔍 VERIFY FOR DUPLICATES
                  </Button>
                  {(!formData.title || !formData.briefparagraph) && (
                    <p className="text-xs text-gray-500 text-center">
                      Fill in Title and Brief Summary to verify
                    </p>
                  )}
                </div>
              )}

              {verificationStep === 'checking' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700">Checking for similar problems...</span>
                  </div>
                </div>
              )}

              {verificationStep === 'verified' && duplicates.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-green-700 font-medium">✅ No similar problems found!</p>
                      <p className="text-green-600 text-sm">
                        Verified against {verificationStats?.totalProblems} existing problems
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === 'duplicates' && duplicates.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-700 font-medium mb-3">
                        ⚠️ Found {duplicates.length} similar problem{duplicates.length > 1 ? 's' : ''}:
                      </p>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {duplicates.map((duplicate, index) => (
                          <div key={duplicate.problemId} className="bg-white rounded-md p-3 border">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">
                                {index + 1}. {duplicate.title}
                              </h4>
                              <Badge variant="destructive" className="text-xs">
                                {duplicate.similarity}%
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                              {duplicate.briefparagraph}
                            </p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>By: {duplicate.addedByName}</span>
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
                          onClick={() => setVerificationStep('verified')}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          ✅ PROCEED ANYWAY
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/problems')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || verificationStep !== 'verified'}
              className={`flex-1 ${
                verificationStep === 'verified' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
              } text-white`}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : verificationStep === 'verified' ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  ✅ SUBMIT PROBLEM
                </>
              ) : (
                "Submit Problem"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProblem;
