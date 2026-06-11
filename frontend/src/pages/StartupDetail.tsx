import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle, Share2, Bookmark, Eye, Download, Award, TrendingUp, Target, Building, Calendar, CheckCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import { PageHero } from "@/components/design-system/PageHero";
import { stageLabels, mockComments } from "@/data/mockData";
import { useUser } from "@/pages/UserContext";
import { deleteStartup, upvoteStartup } from "@/services/startupsService";
import { formatFundingStatus, getStartupImageUrl } from "@/utils/startupFormatters";
import axios from "axios";

export default function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [comments, setComments] = useState(mockComments);

  const createdByEmail =
    typeof startup?.createdBy === "object"
      ? startup?.createdBy?.email
      : typeof startup?.createdBy === "string"
        ? startup.createdBy
        : null;

  const canEditDelete = Boolean(
    user?.email && createdByEmail && user.email.toLowerCase() === createdByEmail.toLowerCase()
  );

  // Format date to readable format
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

  const handleUpvote = async () => {
    if (!id || hasUpvoted) return;

    try {
      const upvotes = await upvoteStartup(id);
      setStartup((current: any) => (current ? { ...current, upvotes } : current));
      setHasUpvoted(true);
    } catch (error) {
      console.error("Error upvoting startup:", error);
      toast({
        title: "Upvote failed",
        description: "Could not register your upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await deleteStartup(id);
      
      toast({
        title: "Startup Deleted",
        description: "The startup has been successfully deleted.",
      });
      
      navigate('/startups');
    } catch (error) {
      console.error('Error deleting startup:', error);
      toast({
        title: "Error",
        description: "Failed to delete startup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/startup-api/${id}`);
        setStartup(response.data);
      } catch (err) {
        console.error('Error fetching startup:', err);
        setStartup(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchStartup();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-startup-primary mx-auto mb-4"></div>
          <p className="text-vj-muted">Loading startup...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Startup Not Found</h1>
          <Link to="/startups">
            <Button className="bg-startup-primary hover:bg-startup-primary/90 text-white">
              Back to Startups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    setComments([...comments, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  const startupImage =
    getStartupImageUrl(startup?.coverImage) ?? undefined;

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Startup detail"
        title={startup.startupName || startup.name}
        description={startup.tagline || startup.description || ""}
        backLink={{ label: "Startups", to: "/startups" }}
        stats={[
          { value: String(startup.upvotes || 0), label: "Upvotes" },
          { value: String(startup.views || 0), label: "Views" },
          { value: String(comments.length), label: "Comments" },
        ]}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[320px] md:min-h-[460px]"
      />

      <div className="page-section">
        <div className="section-container max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/startups" className="inline-flex items-center text-vj-muted hover:text-startup-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Startups
          </Link>
        </div>

        {/* Startup Header */}
        <div className="vj-card-startup mb-8">
          {/* Startup Image */}
          <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6 bg-startup-light/50">
            {startupImage ? (
              <img 
                src={startupImage}
                alt={startup.startupName || startup.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-startup-primary/60 text-lg font-medium">
                No cover image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">🚀 Startup</span>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <StatusBadge stage={startup.stage} />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-4">
                  {startup.logo && (
                    <div className="w-16 h-16 bg-white rounded-lg p-2 border-2 border-white/20">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${startup.logo}`}
                        alt={`${startup.startupName || startup.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                      {startup.startupName || startup.name}
                    </h1>
                    {startup.tagline && (
                      <p className="text-white/80 text-base mb-1 italic">
                        "{startup.tagline}"
                      </p>
                    )}
                    <p className="text-white/90 text-lg">
                      Stage {startup.stage}: {stageLabels[startup.stage - 1]}
                    </p>
                  </div>
                </div>
                <UpvoteButton 
                  upvotes={startup.upvotes}
                  hasUpvoted={hasUpvoted}
                  onClick={handleUpvote}
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-vj-muted">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{startup.views} views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{comments.length} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEditDelete && (
                <>
                  <Link to={`/startup-form?edit=${id}`}>
                    <Button variant="ghost" size="sm" className="text-startup-primary hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the startup
                          "{startup?.startupName || startup?.name}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deleting}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting ? "Deleting..." : "Delete Startup"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              
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

          {/* Funding Status */}
          <div className="p-4 bg-startup-light rounded-lg border border-startup-primary/20 mb-6">
            <h3 className="font-semibold mb-2 flex items-center text-startup-primary">
              💰 Funding Status
            </h3>
            <p className="text-vj-primary font-medium">{formatFundingStatus(startup.fundingStatus)}</p>
          </div>

          {/* Startup Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Company Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6">
              {startup.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Details */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Building className="text-startup-primary" />
                Business Model
              </h3>
              <div className="space-y-4 text-vj-muted">
                <p>
                  {startup.businessModel || startup.description || "Business model information will be available soon."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Key Features</h4>
                    <ul className="text-sm space-y-1">
                      {startup.keyFeatures && startup.keyFeatures.length > 0 ? 
                        startup.keyFeatures.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        )) : (
                          <li>• Key features will be available soon</li>
                        )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Technology</h4>
                    <ul className="text-sm space-y-1">
                      {startup.technologyStack && startup.technologyStack.length > 0 ? 
                        startup.technologyStack.map((tech, index) => (
                          <li key={index}>• {tech}</li>
                        )) : (
                          <li>• Technology stack will be available soon</li>
                        )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <TrendingUp className="text-startup-primary" />
                Market Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.marketSize || "N/A"}
                  </p>
                  <p className="text-sm text-vj-muted">Market Size</p>
                </div>
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.annualGrowthRate || "N/A"}
                  </p>
                  <p className="text-sm text-vj-muted">Market Growth Rate</p>
                </div>
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.targetUsers || "N/A"}
                  </p>
                  <p className="text-sm text-vj-muted">Target Users</p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Target className="text-startup-primary" />
                Milestones & Progress
              </h3>
              <div className="space-y-4">
                {startup.milestones && startup.milestones.length > 0 ? startup.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${milestone.completed ? 'bg-startup-primary' : 'bg-startup-muted/30'}`}>
                      <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-white' : 'text-startup-muted'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'text-vj-primary' : 'text-vj-muted'}`}>
                        {milestone.title}
                      </p>
                      <p className="text-sm text-startup-muted flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(milestone.date)}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm">No milestones added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Users className="text-startup-primary" />
                Leadership Team
              </h3>
              <div className="space-y-4">
                {/* Founders */}
                {startup.founders && (
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Founders & Team</h4>
                    <p className="text-vj-muted text-sm whitespace-pre-line">{startup.founders}</p>
                  </div>
                )}
                
                {/* Team Members */}
                {startup.team && startup.team.length > 0 && (
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Team Members</h4>
                    <div className="space-y-2">
                      {startup.team.map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-startup-primary/20 text-startup-primary text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-vj-primary text-sm">{member.name}</p>
                            <p className="text-xs text-startup-muted">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!startup.founders && (!startup.team || startup.team.length === 0)) && (
                  <p className="text-gray-500 text-sm">Team information will be available soon</p>
                )}
              </div>
            </div>

            {/* Funding & Schemes */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Award className="text-startup-primary" />
                Support & Recognition
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-startup-primary mb-2">Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.supportPrograms && startup.supportPrograms.length > 0 ? startup.supportPrograms.map((program, index) => (
                      <Badge key={index} variant="outline" className="border-startup-primary/30 text-startup-primary text-xs">
                        {program}
                      </Badge>
                    )) : (
                      <p className="text-gray-500 text-sm">No support programs listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="vj-card-startup bg-startup-light/50">
              <h3 className="font-semibold mb-2 text-startup-primary">Interested in {startup.startupName || startup.name}?</h3>
              <p className="text-sm text-vj-muted mb-4">
                Connect for partnerships, investment opportunities, or collaboration.
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-startup-primary hover:bg-startup-primary/90 text-white">
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                {startup.website && (
                  <a 
                    href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                      <Building className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  </a>
                )}
                {startup.pitchDeck && (
                  <a 
                    href={`${import.meta.env.VITE_API_BASE_URL}/startup-api/${startup._id}/download/pitchDeck`}
                    download
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                      <Download className="mr-2 h-4 w-4" />
                      Download Pitch Deck
                    </Button>
                  </a>
                )}
                {startup.onePager && (
                  <a 
                    href={`${import.meta.env.VITE_API_BASE_URL}/startup-api/${startup._id}/download/onePager`}
                    download
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                      <Download className="mr-2 h-4 w-4" />
                      Download One Pager
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Company Stats */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Company Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Revenue</span>
                  <span className="font-medium text-startup-primary">
                    {startup.revenue ? `₹${startup.revenue}` : 'Not disclosed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Customers</span>
                  <span className="font-medium text-startup-primary">
                    {startup.customers || 'Not disclosed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Community Support</span>
                  <span className="font-medium text-startup-primary">{startup.upvotes} upvotes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Development Stage</span>
                  <span className="font-medium text-startup-primary">{Math.round((startup.stage / 9) * 100)}% complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Team Size</span>
                  <span className="font-medium text-startup-primary">
                    {startup.teamSize || startup.team?.length || 'Not specified'} 
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Milestones Achieved</span>
                  <span className="font-medium text-startup-primary">
                    {startup.milestones?.filter(m => m.completed).length || 0}/{startup.milestones?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
        </div>
      </div>
    </div>
  );
}