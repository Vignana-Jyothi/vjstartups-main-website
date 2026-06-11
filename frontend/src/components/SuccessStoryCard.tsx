import { Link } from "react-router-dom";
import { Trophy, Calendar, Users, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuccessStory {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  participants: { name: string; branch?: string }[];
  achievements: string[];
  tags: string[];
  featured?: boolean;
  season?: string;
  contentType?: string;
  pdfUrl?: string;
  coverImage?: string;
}

export default function SuccessStoryCard({ story, programId }: { story: SuccessStory; programId: string }) {
  const hasMedia = Boolean(story.coverImage);

  return (
    <article className="vj-card group overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDuration: '600ms' }}>
      {/* Media / visual */}
      <div className={cn("w-full h-44 bg-[hsl(var(--card))] relative overflow-hidden", hasMedia ? "" : "flex items-center justify-center") }>
        {hasMedia ? (
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-[hsl(var(--text-muted))]">
            <Trophy className="w-10 h-10" />
            <span className="text-sm mt-2">Featured Story</span>
          </div>
        )}
        {story.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="text-xs bg-[hsl(var(--vj-accent))] text-[hsl(var(--vj-accent-foreground))]">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-muted))]">
              <Calendar className="w-4 h-4" />
              <span>{new Date(story.date).toLocaleDateString()}</span>
            </div>
            {story.season && <Badge variant="secondary" className="text-xs">{story.season}</Badge>}
          </div>

          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] leading-tight mb-2">
            {story.title}
          </h3>
          {story.subtitle && <p className="text-sm text-[hsl(var(--text-muted))] mb-3">{story.subtitle}</p>}

          <div className="mb-3">
            <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">Team</h4>
            <div className="flex items-center gap-3 text-sm text-[hsl(var(--text-muted))]">
              {story.participants.slice(0,3).map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[hsl(var(--vj-accent))] text-white flex items-center justify-center text-xs font-semibold">{p.name.charAt(0)}</div>
                  <div>
                    <div className="font-medium text-[hsl(var(--foreground))] text-sm">{p.name}</div>
                    {p.branch && <div className="text-xs text-[hsl(var(--text-muted))]">{p.branch}</div>}
                  </div>
                </div>
              ))}
              {story.participants.length > 3 && (
                <div className="text-sm text-[hsl(var(--text-muted))]">+{story.participants.length - 3} more</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">Key Achievements</h4>
            <ul className="list-none space-y-1 text-sm text-[hsl(var(--text-muted))]">
              {story.achievements.slice(0,3).map((a, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.slice(0,3).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
            {story.tags.length > 3 && <Badge variant="secondary" className="text-xs">+{story.tags.length - 3}</Badge>}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          { (story.contentType === 'web' || story.contentType === 'hybrid') && (
            <Button asChild size="sm" className="flex-1 btn-primary">
              <Link to={`/programs/${programId}/success-stories/${story.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Story
              </Link>
            </Button>
          )}

          {story.pdfUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>{story.contentType === 'pdf' ? 'Download Report' : 'PDF'}</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
