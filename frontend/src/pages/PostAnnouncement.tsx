import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHero } from '@/components/design-system/PageHero';
import { useUser } from './UserContext';
import '@/components/design-system/listing.css';
import '@/components/design-system/forms.css';
import { toast } from '@/components/ui/use-toast';

const PostAnnouncement = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Check if user has permission (admin or wing_master)
  if (!user || (user.role !== 'admin' && user.role !== 'wing_master')) {
    return (
      <div className="page-shell lx">
        <PageHero
        kind="tool"
          eyebrow="Admin portal"
          title="Post Announcement"
          description="Share important news and updates with the VJ Startups community."
          backLink={{ label: "Home", to: "/" }}
        />
        <section className="lx-section">
          <div className="lx-empty">
            <strong>Admins and wing masters only</strong>
            {user ? "Your account can't post announcements." : "Log in with an admin or wing master account to post."}
            <Link to={user ? "/" : "/login"} className="lx-cta">{user ? "Back home ↗" : "Log in ↗"}</Link>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6220';
      const response = await fetch(`${backendUrl}/announcements-api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.adminToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Announcement posted successfully.',
        });
        setFormData({ title: '', content: '' });
        navigate('/');
      } else {
        throw new Error(data.message || 'Failed to post announcement');
      }
    } catch (error: any) {
      console.error('Error posting announcement:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to post announcement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell lx">
      <PageHero
        kind="tool"
        eyebrow="Admin portal"
        title="Post Announcement"
        description="Share important news and updates with the VJ Startups community."
        backLink={{ label: "Home", to: "/" }}
      />
      <div className="form-shell fm" data-accent="lime">
        <form onSubmit={handleSubmit}>
          <div className="vj-card">
            <div>
              <h3>Announcement</h3>
              <p>Shown on the landing page with your name. Keep it short and specific.</p>
            </div>
            <div>
              <div>
                <label htmlFor="title">Title *</label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Upcoming Hackathon Registration Open"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="content">Content *</label>
                <Textarea
                  id="content"
                  placeholder="Write your announcement content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="mt-2 w-full resize-y"
                  required
                />
              </div>
              <p className="text-xs">Posting as {user.name} ({user.email}).</p>
            </div>
          </div>
          <div>
            <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting…' : 'Post announcement ↗'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAnnouncement;
