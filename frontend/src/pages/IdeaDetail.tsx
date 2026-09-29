import { hasUpvoted } from "@/utils/upvotes";
import { useState, useEffect, type CSSProperties } from "react";
import "@/components/design-system/listing.css";
import "@/components/design-system/detail.css";
import { CardCover } from "@/components/design-system/CardCover";
import { useParams, Link } from "react-router-dom";
import { extractIdeaIdFromSlug, generateIdeaSlug } from "@/utils/slugUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UpvoteButton from "@/components/UpvoteButton";
import CommentSection from "@/components/CommentSection";
import StageTransitionModal from "@/components/StageTransitionModal";
import StartupPromoCard from "@/components/StartupPromoCard";
import { PageHero } from "@/components/design-system/PageHero";
import { stageLabels } from "@/data/mockData";
import axios from "axios";
import { useUser } from "./UserContext";

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
      
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${idea.ideaId}`, formData, {
        headers: { Authorization: `Bearer ${user.sessionToken}` }
      });
      
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
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: idea.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* share sheet dismissed */
    }
  };

  const accent = { "--lx-accent": "var(--lime)" } as CSSProperties;

  if (loading) {
    return (
      <div className="page-shell lx dt" style={accent}>
        <div className="lx-section"><div className="lx-loading">Loading idea</div></div>
      </div>
    );
  }

  const stage = Math.min(Math.max(idea.stage || 1, 1), stageLabels.length);
  const mappedComments = (comments || []).map((comment: any) => {
    const c = typeof comment === "object" ? comment : {};
    return {
      id: c.id || c.commentId || `temp-${Math.random().toString(36).substring(7)}`,
      author: c.author || "Anonymous",
      avatar: "",
      content: c.content || "",
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : "",
      likes: c.likes?.length || 0,
      isLiked: c.likes?.includes(user?.email) || false,
      replies: (c.replies || []).map((reply: any) => {
        const r = typeof reply === "object" ? reply : {};
        return {
          id: r.id || r.replyId || `temp-reply-${Math.random().toString(36).substring(7)}`,
          author: r.author || "Anonymous",
          avatar: "",
          content: r.content || "",
          timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
          likes: r.likes?.length || 0,
          isLiked: r.likes?.includes(user?.email) || false,
        };
      }),
    };
  });
  const links: any[] = idea.links || [];

  return (
    <div className="page-shell lx dt" style={accent}>
      <PageHero
        kind="document"
        eyebrow={`Idea / ${stageLabels[stage - 1]}`}
        title={idea.title}
        description={idea.description}
        backLink={{ label: "Ideas", to: `/ideas#idea-${idea.ideaId}` }}
        stats={[
          { value: String(idea.upvotes || 0), label: "Upvotes" },
          { value: String(comments?.length || 0), label: "Comments" },
          { value: `${stage} / ${stageLabels.length}`, label: "Stage" },
        ]}
      />

      <section className="lx-section dt-grid">
        <div className="dt-main">
          <figure className="dt-figure dt-cover">
            <CardCover title={idea.title} image={idea.titleImage} />
          </figure>

          {problem && (
            <Link to={`/problems/${problem.problemId}`} className="dt-answers">
              <span>Answers the problem</span>
              <b>{problem.title}</b>
              <em>Read the problem ↗</em>
            </Link>
          )}

          <div className="dt-stages" aria-label={`Stage ${stage} of ${stageLabels.length}: ${stageLabels[stage - 1]}`}>
            <div className="dt-stages-head">
              <span>Where it stands</span>
              <b>{String(stage).padStart(2, "0")} / {stageLabels[stage - 1]}</b>
            </div>
            <ol>
              {stageLabels.map((label, i) => (
                <li key={label} className={i + 1 < stage ? "is-done" : i + 1 === stage ? "is-on" : ""} title={label}>
                  <i />
                </li>
              ))}
            </ol>
          </div>

          {idea.startupStatus?.isWorthy && !idea.startupStatus?.hasStartupCreated && (
            <StartupPromoCard ideaId={idea.ideaId} worthinessLevel={idea.startupStatus.level} />
          )}

          <div className="dt-fields">
            <section className="dt-field">
              <span>01</span>
              <div>
                <h3>Target customers</h3>
                <p>{idea.targetCustomers || "Not specified yet."}</p>
              </div>
            </section>

            {(links.length > 0 || canEdit) && (
              <section className="dt-field">
                <span>02</span>
                <div>
                  <div className="dt-field-head">
                    <h3>Links</h3>
                    {canEdit && (
                      <Dialog open={showAddLink} onOpenChange={setShowAddLink}>
                        <DialogTrigger asChild>
                          <button type="button" className="lx-textbtn">Add link ↗</button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add a link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Title</label>
                              <Input value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="e.g. GitHub repository" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">URL</label>
                              <Input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (optional)</label>
                              <Textarea value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })} placeholder="What is behind this link?" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Who can see it</label>
                              <Select value={newLink.accessLevel} onValueChange={(value) => setNewLink({ ...newLink, accessLevel: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="public">Everyone</SelectItem>
                                  <SelectItem value="team">Team members</SelectItem>
                                  <SelectItem value="creator">Only you</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleAddLink} className="flex-1">Add link</Button>
                              <Button variant="outline" onClick={() => setShowAddLink(false)}>Cancel</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  {links.length > 0 ? (
                    <ul className="dt-links">
                      {links.slice(0, showAllLinks ? links.length : 4).map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <b>{link.title}</b>
                            {link.description && <small>{link.description}</small>}
                            <em>{link.accessLevel === "public" ? "Open" : link.accessLevel} ↗</em>
                          </a>
                          {canEdit && (
                            <button type="button" className="lx-textbtn dt-danger" onClick={() => handleDeleteLink(index)}>Remove</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No links yet. Add the repo, a demo or the pitch deck.</p>
                  )}
                  {links.length > 4 && (
                    <button type="button" className="lx-textbtn" onClick={() => setShowAllLinks(!showAllLinks)}>
                      {showAllLinks ? "Show fewer" : `Show all ${links.length}`}
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        <aside className="dt-side">
          <div className="dt-card">
            <div className="dt-vote">
              <UpvoteButton upvotes={idea.upvotes || 0} hasUpvoted={hasUpvoted(idea.upvotedBy, user?.email)} onClick={() => handleUpvote(idea.ideaId)} />
              <span>{idea.upvotes === 1 ? "person backs this" : "people back this"}</span>
            </div>
            <dl className="dt-facts">
              <div><dt>Stage</dt><dd>{stageLabels[stage - 1]}</dd></div>
              {idea.mentor && <div><dt>Mentor</dt><dd>{idea.mentor}</dd></div>}
              <div><dt>Discussion</dt><dd>{comments?.length || 0} {comments?.length === 1 ? "comment" : "comments"}</dd></div>
            </dl>

            {idea.team?.length > 0 && (
              <div className="dt-team">
                <span>Team</span>
                <ul>
                  {idea.team.map((member: any, index: number) => (
                    <li key={index}>
                      <i aria-hidden="true">{member.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}</i>
                      <div><b>{member.name}</b><small>{member.role || "Team member"}</small></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="dt-actions">
              {user?.email === idea.addedByEmail && stage < stageLabels.length ? (
                <button type="button" className="lx-cta" onClick={() => setShowStageTransition(true)}>
                  Advance to {stageLabels[stage]} ↗
                </button>
              ) : idea.contact ? (
                <a href={`tel:${idea.contact}`} className="lx-cta">Contact the team ↗</a>
              ) : null}
              <button type="button" className="lx-textbtn" onClick={share}>Share ↗</button>
            </div>

            {import.meta.env.VITE_DEBUG_MODE === "true" && user?.email === idea.addedByEmail && (
              <div className="dt-debug">
                <span>Debug: reset stage</span>
                {[5, 6, 7, 8].map((n) => (
                  <button key={n} type="button" onClick={() => handleResetStage(n)}>{n}</button>
                ))}
                <button type="button" onClick={() => window.location.reload()}>Reload</button>
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="lx-section dt-discussion">
        <div className="lx-sec-head">
          <span>Discussion / {comments?.length || 0}</span>
          <h2>What people think</h2>
        </div>
        <CommentSection comments={mappedComments} onAddComment={handleAddComment} onLikeComment={handleLikeComment} onReply={handleReply} />
      </section>

      {showStageTransition && (
        <div className="dt-modal" onClick={(e) => { if (e.target === e.currentTarget) setShowStageTransition(false); }}>
          <div className="dt-modal-panel" onClick={(e) => e.stopPropagation()}>
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
  );
}
