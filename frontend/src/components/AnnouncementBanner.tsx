import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  postedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6220';
        const response = await fetch(`${backendUrl}/announcements-api/`);
        const data = await response.json();

        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (isLoading || isDismissed || announcements.length === 0) {
    return null;
  }

  // Show the most recent announcement
  const announcement = announcements[0];

  return (
    <div className="relative z-40 border-b border-purple-500/30 bg-zinc-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <Megaphone className="h-5 w-5 text-purple-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                NEWS
              </Badge>
              <h3 className="text-sm font-semibold text-white">
                {announcement.title}
              </h3>
            </div>
            <p className="text-sm text-gray-300">
              {announcement.content}
            </p>
            {announcement.postedBy?.name && (
              <p className="mt-1 text-xs text-gray-500">
                Posted by {announcement.postedBy.name}
              </p>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 rounded-md p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Dismiss announcement"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
