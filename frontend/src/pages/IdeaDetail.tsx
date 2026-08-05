import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { extractIdeaIdFromSlug, generateIdeaSlug } from "@/utils/slugUtils";
import { ArrowLeft, Users, MessageCircle, Share2, Bookmark, Eye, Mail, Award, Target, Lightbulb, TrendingUp, Github, Globe, FileText, Video, Image, Download, ExternalLink, Link as LinkIcon, ArrowRight, Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import StageTransitionModal from "@/components/StageTransitionModal";
import StartupPromoCard from "@/components/StartupPromoCard";
import { PageHero } from "@/components/design-system/PageHero";
import { stageLabels } from "@/data/mockData";
import axios from "axios";
import { useUser } from "./UserContext";
import foodshareImage from "@/assets/foodshare-idea.jpg";
import mindbridge from "@/assets/mindbridge-idea.jpg";

const imageMap: Record<string, string> = {
  "1": foodshareImage,
  "2": mindbridge,
};

// Helper function to get appropriate icon for links
const getLinkIcon = (url: string, title?: string) => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title?.toLowerCase() || '';
  
  if (lowerUrl.includes('github.com') || lowerTitle.includes('github')) {
    return <Github className="w-4 h-4" />;
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com') || lowerTitle.includes('video') || lowerTitle.includes('demo')) {
    return <Video className="w-4 h-4" />;
  }
  if (lowerUrl.includes('docs.google.com') || lowerUrl.includes('notion.so') || lowerTitle.includes('document') || lowerTitle.includes('docs')) {
    return <FileText className="w-4 h-4" />;
  }
  if (lowerUrl.includes('figma.com') || lowerUrl.includes('dribbble.com') || lowerTitle.includes('design') || lowerTitle.includes('mockup')) {
    return <Image className="w-4 h-4" />;
  }
  if (lowerUrl.includes('drive.google.com') || lowerUrl.includes('dropbox.com') || lowerTitle.includes('download') || lowerTitle.includes('file')) {
    return <Download className="w-4 h-4" />;
  }
  if (lowerUrl.startsWith('http') || lowerUrl.startsWith('https')) {
    return <Globe className="w-4 h-4" />;
  }
  return <LinkIcon className="w-4 h-4" />;
};

export default function IdeaDetail() {
  const { slug } = useParams();
  const id = extractIdeaIdFromSlug(slug || '');
  const [idea, setIdea] = useState<any>(null);
  const [problem, setProblem] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [showStageTransition, setShowStageTransition] = useState(false);
  const [showAddAttachment, setShowAddAttachment] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', description: '', url: '', accessLevel: 'public' });
  const { user } = useUser();
  
  // Handle upvoting an idea
  const handleUpvote = async (ideaId: string) => {
    if (!user?.email) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${ideaId}/upvote`,
        { email: user.email }
      );

      // Update the idea in state
      setIdea(prev => ({
        ...prev,
        upvotes: res.data.upvotes,
        upvotedBy: res.data.upvotedBy
      }));
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  // Handle stage transition completion
  const handleStageTransitionComplete = async () => {
    // Reload the entire idea data to get updated startup status
    if (id && user?.email) {
      try {
        const ideaResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}`, {
          params: { userEmail: user?.email },
          headers: { 'user-email': user?.email }
        });
        setIdea(ideaResponse.data);
        
        console.log('✅ Idea reloaded after stage transition');
        console.log('New startup status:', ideaResponse.data.startupStatus);
      } catch (error) {
        console.error('❌ Error reloading idea after stage transition:', error);
        // Fallback to just updating stage if reload fails
        if (idea) {
          setIdea(prev => ({
            ...prev,
            stage: prev.stage + 1
          }));
        }
      }
    }
    setShowStageTransition(false);
  };

  // Debug function to reset stage for testing
  const handleResetStage = async (newStage: number) => {
    if (!idea || !user?.email) return;
    
    try {
      const formData = new FormData();
      formData.append('stage', newStage.toString());
      formData.append('email', user.email);
      
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${idea.ideaId}`, formData);
      
      setIdea(prev => ({
        ...prev,
        stage: newStage
      }));
      
      console.log(`Stage reset to ${newStage} successfully`);
    } catch (error) {
      console.error('Error resetting stage:', error);
    }
  };
  
  // Fetch idea details
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!id) return;
      
      try {
        const ideaResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}`, {
          params: { userEmail: user?.email },
          headers: { 'user-email': user?.email }
        });
        setIdea(ideaResponse.data);
        
        console.log('Idea loaded:', ideaResponse.data);
        console.log('Startup Status:', ideaResponse.data.startupStatus);
        console.log('Is Startup Worthy?', ideaResponse.data.startupStatus?.isWorthy);
        console.log('Has Startup Created?', ideaResponse.data.startupStatus?.hasStartupCreated);
        
        // Fetch related problem if available
        if (ideaResponse.data.relatedProblemId) {
          const problemResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${ideaResponse.data.relatedProblemId}`
          );
          setProblem(problemResponse.data);
        }
        
        // Fetch comments
        const commentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments`
        );
        console.log("Comments data received:", commentsResponse.data);
        
        // Make sure we have a proper array of comment objects
        const safeComments = Array.isArray(commentsResponse.data) 
          ? commentsResponse.data.map(comment => typeof comment === 'object' ? {...comment} : {})
          : [];
          
        setComments(safeComments);
      } catch (error) {
        console.error("Error fetching idea details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeaDetails();
  }, [id]);

  if (!idea) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Idea Not Found</h1>
          <Link to="/ideas">
            <Button>Back to Ideas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = async (content: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments`,
        {
          author: user.name || user.email,
          content,
          email: user.email
        }
      );
      
      // Add the new comment to the list
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments/${commentId}/like`,
        { email: user.email }
      );
      
      // Update the comment in the list - make sure we don't accidentally use the whole comment object directly
      setComments(comments.map(comment =>
        comment.id === commentId ? {...response.data} : comment
      ));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments/${commentId}/replies`,
        {
          author: user.name || user.email,
          content,
          email: user.email
        }
      );
      
      // Update the comment with the new reply - use a copy to avoid React rendering issues
      setComments(comments.map(comment =>
        comment.id === commentId ? {...response.data} : comment
      ));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Handle file upload for attachments
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.email || !id) return;

    setUploadingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);
      formData.append('name', file.name);
      formData.append('type', file.type);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the idea with new attachment
      setIdea(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), response.data]
      }));

      setShowAddAttachment(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle attachment deletion
  const handleDeleteAttachment = async (index: number) => {
    if (!user?.email || !id) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/attachments/${index}`,
        { data: { email: user.email } }
      );

      // Update the idea by removing the attachment
      setIdea(prev => ({
        ...prev,
        attachments: prev.attachments?.filter((_, i) => i !== index) || []
      }));
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  // Handle adding a new link
  const handleAddLink = async () => {
    if (!user?.email || !id || !newLink.title || !newLink.url) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/links`,
        {
          ...newLink,
          email: user.email
        }
      );

      // Update the idea with new link
      setIdea(prev => ({
        ...prev,
        links: [...(prev.links || []), response.data]
      }));

      setNewLink({ title: '', description: '', url: '', accessLevel: 'public' });
      setShowAddLink(false);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  // Handle link deletion
  const handleDeleteLink = async (index: number) => {
    if (!user?.email || !id) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/links/${index}`,
        { data: { email: user.email } }
      );

      // Update the idea by removing the link
      setIdea(prev => ({
        ...prev,
        links: prev.links?.filter((_, i) => i !== index) || []
      }));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  // Check if user can edit (creator, team member, or collaborator)
  const canEdit = user?.email && (
    user.email === idea?.addedByEmail ||
    idea?.team?.some(member => member.email === user.email) ||
    idea?.collaborators?.includes(user.email)
  );

  // Safely determine which image to use
  const getIdeaImage = () => {
    if (idea?.titleImage) return idea.titleImage;
    if (idea?.ideaId && imageMap[idea.ideaId.substring(0, 1)]) return imageMap[idea.ideaId.substring(0, 1)];
    return "/placeholder.svg";
  };
  
  const ideaImage = getIdeaImage();
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-idea-primary/30 border-t-idea-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-vj-muted">Loading idea details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Idea detail"
        title={idea.title}
        description={idea.description}
        backLink={{ label: "Ideas", to: `/ideas#idea-${idea.ideaId}` }}
        stats={[
          { value: String(idea.upvotes || 0), label: "Upvotes" },
          { value: String(comments?.length || 0), label: "Comments" },
          { value: `Stage ${idea.stage}`, label: "Progress" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[320px] md:min-h-[460px]"
      />

      <div className="page-section">
        <div className="section-container max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to={`/ideas#idea-${idea.ideaId}`} className="inline-flex items-center text-vj-muted hover:text-idea-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Ideas
          </Link>
        </div>

        {/* Idea Header */}
        <div className="vj-card-idea mb-8">
          {/* Idea Image */}
          <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6">
            <img 
              src={ideaImage}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">Innovation Idea</span>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <div className="flex flex-col gap-2">
                <StatusBadge stage={idea.stage} />
                {/* Debug Stage Reset Buttons - Controlled by environment variable */}
                {import.meta.env.VITE_DEBUG_MODE === 'true' && user?.email === idea.addedByEmail && (
                  <div className="flex flex-col gap-1 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-white text-xs font-medium">Debug:</span>
                    <div className="flex gap-1">
                      {[5, 6, 7, 8].map(stage => (
                        <Button
                          key={stage}
                          size="sm"
                          variant="outline" 
                          onClick={() => handleResetStage(stage)}
                          className="text-xs h-6 w-8 p-0 bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                          {stage}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                    {idea.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Stage {idea.stage}: {stageLabels[idea.stage - 1]}
                  </p>
                </div>
                <UpvoteButton 
                  upvotes={idea.upvotes || 0} 
                  hasUpvoted={idea.upvotedBy?.includes(user?.email)}
                  onClick={() => handleUpvote(idea.ideaId)}
                />
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-vj-muted">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>89 views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{comments?.length || 0} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Problem Link */}
          {problem && (
            <Link 
              to={`/problems/${problem.problemId}`}
              target="_blank"
              className="text-lg font-semibold text-green-600 dark:text-green-400 hover:underline inline-flex items-center"
            >
              View Problem : {problem.title}
              <svg 
                className="ml-1 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </Link>
          )}


          {/* Idea Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Solution Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Startup Promo Card - Show if idea is startup worthy and no startup has been created */}
        {(() => {
          console.log('Evaluating startup promo display:');
          console.log('- isWorthy:', idea.startupStatus?.isWorthy);
          console.log('- hasStartupCreated:', idea.startupStatus?.hasStartupCreated);
          console.log('- level:', idea.startupStatus?.level);
          console.log('- Should show promo:', idea.startupStatus?.isWorthy && !idea.startupStatus?.hasStartupCreated);
          
          if (idea.startupStatus?.isWorthy && !idea.startupStatus?.hasStartupCreated) {
            return (
              <StartupPromoCard 
                ideaId={idea.ideaId}
                worthinessLevel={idea.startupStatus.level}
                className="mb-8"
              />
            );
          }
          return null;
        })()}

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Target Customers */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Users className="text-idea-primary" />
                Target Customers
              </h3>
              <div className="space-y-4 text-vj-muted">
                <p>
                  {idea.targetCustomers || "Our primary target customers are students, faculty, and staff members who are actively seeking innovative solutions to improve their campus experience and academic performance."}
                </p>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-idea-light/50 rounded-lg">
                    <h4 className="font-medium text-idea-primary mb-2">Primary Users</h4>
                    <p className="text-sm text-vj-muted">University students across all academic levels</p>
                  </div>
                  <div className="p-3 bg-idea-light/50 rounded-lg">
                    <h4 className="font-medium text-idea-primary mb-2">Secondary Users</h4>
                    <p className="text-sm text-vj-muted">Faculty and institutional administrators</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Project Materials */}
            {/* <div className="vj-card-idea">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-vj-primary">Project Materials</h3>
                {canEdit && (
                  <Dialog open={showAddAttachment} onOpenChange={setShowAddAttachment}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-idea-primary hover:bg-idea-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-1" />
                        Add File
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Project Material</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Select File</label>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={uploadingFile}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        {uploadingFile && (
                          <div className="text-center">
                            <div className="inline-block w-6 h-6 border-2 border-idea-primary/30 border-t-idea-primary rounded-full animate-spin"></div>
                            <p className="mt-2 text-sm text-vj-muted">Uploading...</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {idea.attachments && idea.attachments.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {idea.attachments
                      .slice(0, showAllAttachments ? idea.attachments.length : 4)
                      .map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-idea-primary" />
                          <div>
                            <span className="font-medium text-idea-primary block">
                              {attachment.name || attachment}
                            </span>
                            {attachment.size && (
                              <span className="text-sm text-vj-muted">{attachment.size}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-idea-primary/30 text-idea-primary hover:bg-idea-light"
                            onClick={() => window.open(attachment.url || attachment, '_blank')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteAttachment(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {idea.attachments.length > 4 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-idea-primary hover:text-idea-primary/80"
                        onClick={() => setShowAllAttachments(!showAllAttachments)}
                      >
                        {showAllAttachments ? 'Show Less' : `Show More (${idea.attachments.length - 4} more)`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-vj-muted">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No project materials uploaded yet</p>
                  {canEdit && (
                    <p className="text-sm mt-1">Upload files to share with your team</p>
                  )}
                </div>
              )}
            </div> */}

            {/* More Links */}
            <div className="vj-card-idea">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-vj-primary">More Links</h3>
                {canEdit && (
                  <Dialog open={showAddLink} onOpenChange={setShowAddLink}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-idea-primary hover:bg-idea-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Link</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input
                            value={newLink.title}
                            onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                            placeholder="e.g., GitHub Repository"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">URL</label>
                          <Input
                            value={newLink.url}
                            onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                          <Textarea
                            value={newLink.description}
                            onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                            placeholder="Brief description of the link"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Access Level</label>
                          <Select value={newLink.accessLevel} onValueChange={(value) => setNewLink({...newLink, accessLevel: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Visible to everyone</SelectItem>
                              <SelectItem value="team">Team - Visible to team members</SelectItem>
                              <SelectItem value="creator">Creator - Only visible to you</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddLink} className="flex-1">Add Link</Button>
                          <Button variant="outline" onClick={() => setShowAddLink(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {idea.links && idea.links.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {idea.links
                      .slice(0, showAllLinks ? idea.links.length : 4)
                      .map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="text-idea-primary">
                            {getLinkIcon(link.url, link.title)}
                          </div>
                          <div>
                            <span className="font-medium text-idea-primary block">
                              {link.title}
                            </span>
                            {link.description && (
                              <span className="text-sm text-vj-muted">
                                {link.description}
                              </span>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {link.accessLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-idea-primary/30 text-idea-primary hover:bg-idea-light"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteLink(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {idea.links.length > 4 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-idea-primary hover:text-idea-primary/80"
                        onClick={() => setShowAllLinks(!showAllLinks)}
                      >
                        {showAllLinks ? 'Show Less' : `Show More (${idea.links.length - 4} more)`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-vj-muted">
                  <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No links added yet</p>
                  {canEdit && (
                    <p className="text-sm mt-1">Add links to share resources with your team</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            {idea.team && idea.team.length > 0 && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Users className="text-idea-primary" />
                  Team
                </h3>
                <div className="space-y-4">
                  {idea.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-idea-primary/20 text-idea-primary">
                          {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-vj-primary">{member.name}</p>
                        <p className="text-sm text-idea-muted dark:text-gray-300">{member.role || 'Team Member'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <Button className="w-full bg-idea-primary hover:bg-idea-primary/90 text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Team
                  </Button>
                  {idea.contact && (
                    <div className="text-center">
                      <p className="text-xs text-vj-muted mb-1">Contact Us:</p>
                      <a 
                        href={`tel:${idea.contact}`}
                        className="text-sm font-medium text-idea-primary hover:text-idea-primary/80 transition-colors"
                      >
                        {idea.contact}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mentor */}
            {idea.mentor && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Award className="text-idea-primary" />
                  Mentor
                </h3>
                <p className="font-medium text-vj-primary mb-3">{idea.mentor}</p>
                <Button variant="outline" size="sm" className="border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                  Connect
                </Button>
              </div>
            )}

            {/* Stage Advancement */}
            {user?.email === idea.addedByEmail && idea.stage < 9 && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Target className="text-idea-primary" />
                  Ready to Advance?
                </h3>
                <div className="space-y-4">
                  <div className="text-sm text-vj-muted">
                    Current Stage: {idea.stage}/9 - {stageLabels[idea.stage - 1]}
                  </div>
                  <div className="text-sm text-vj-muted">
                    Next: {stageLabels[idea.stage]} 
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-idea-primary to-green-600 hover:from-idea-primary/90 hover:to-green-600/90 text-white"
                    onClick={() => setShowStageTransition(true)}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Advance to {stageLabels[idea.stage]}
                  </Button>
                  
                  {/* Debug: Refresh idea data - Controlled by environment variable */}
                  {import.meta.env.VITE_DEBUG_MODE === 'true' && (
                    <Button 
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => window.location.reload()}
                    >
                      🔄 Refresh Page (Debug)
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Community Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Upvotes</span>
                  <span className="font-medium text-idea-primary">{idea.upvotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Comments</span>
                  <span className="font-medium text-idea-primary">{comments?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Stage Progress</span>
                  <span className="font-medium text-idea-primary">{idea.stage ? Math.round((idea.stage / 9) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={(comments || []).map(comment => {
            // Ensure we're working with a proper object, not a raw MongoDB document
            const safeComment = typeof comment === 'object' ? comment : {};
            
            return {
              id: safeComment.id || safeComment.commentId || `temp-${Math.random().toString(36).substring(7)}`,
              author: safeComment.author || "Anonymous",
              avatar: "",  // We don't have avatars in our API
              content: safeComment.content || "",
              timestamp: safeComment.createdAt ? new Date(safeComment.createdAt).toLocaleString() : new Date().toLocaleString(),
              likes: safeComment.likes?.length || 0,
              isLiked: safeComment.likes?.includes(user?.email) || false,
              replies: (safeComment.replies || []).map(reply => {
                // Also ensure each reply is properly formatted
                const safeReply = typeof reply === 'object' ? reply : {};
                
                return {
                  id: safeReply.id || safeReply.replyId || `temp-reply-${Math.random().toString(36).substring(7)}`,
                  author: safeReply.author || "Anonymous",
                  avatar: "",
                  content: safeReply.content || "",
                  timestamp: safeReply.createdAt ? new Date(safeReply.createdAt).toLocaleString() : new Date().toLocaleString(),
                  likes: safeReply.likes?.length || 0,
                  isLiked: safeReply.likes?.includes(user?.email) || false
                };
              })
            };
          })}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />

        {/* Stage Transition Modal */}
        {showStageTransition && (
          <div 
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowStageTransition(false);
              }
            }}
          >
            <div 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <StageTransitionModal
                ideaId={idea.ideaId}
                currentStage={idea.stage}
                targetStage={idea.stage + 1}
                onComplete={handleStageTransitionComplete}
                onCancel={() => setShowStageTransition(false)}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}