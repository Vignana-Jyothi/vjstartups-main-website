import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHero } from '@/components/design-system/PageHero';
import { useUser } from './UserContext';
import { Megaphone, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-vj-neutral">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-700 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-zinc-400 mb-6">
            You need admin or wing master privileges to post announcements.
          </p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
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
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          posterEmail: user.email,
          posterName: user.name,
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
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Admin Portal"
        title="Post Announcement"
        description="Share important news and updates with the VJ Startups community."
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[320px]"
      />

      <section className="page-section">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="section-panel p-6 sm:p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-vj-primary">
                Announcement Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Upcoming Hackathon Registration Open"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full min-h-[44px]"
                required
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-vj-primary">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                placeholder="Write your announcement content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full min-h-[200px] resize-none"
                required
              />
              <p className="text-xs text-vj-muted">
                Keep it concise and informative. This will be displayed on the landing page.
              </p>
            </div>

            {/* Poster Info Display */}
            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <p className="text-sm text-zinc-400">
                <span className="font-medium">Posted by:</span> {user.name} ({user.email})
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Your name will be visible on the announcement.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto min-h-[44px] order-2 sm:order-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white min-h-[44px] order-1 sm:order-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Posting...
                  </>
                ) : (
                  <>
                    <Megaphone className="mr-2 h-4 w-4" />
                    Post Announcement
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PostAnnouncement;
