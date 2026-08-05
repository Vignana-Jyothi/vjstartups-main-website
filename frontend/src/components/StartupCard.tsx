import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { StartupListItem } from "@/types/startup";
import {
  formatFundingStatus,
  getStartupImageUrl,
  truncateText,
} from "@/utils/startupFormatters";
import { Rocket } from "lucide-react";

interface StartupCardProps {
  startup: StartupListItem;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getStartupImageUrl(startup.coverImage);
  const showImage = imageUrl && !imageError;

  return (
    <article className="vj-card-startup hover-lift flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden rounded-lg mb-4 bg-startup-light/50">
        {showImage ? (
          <img
            src={imageUrl}
            alt={startup.startupName || "Startup cover"}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-startup-primary/60 gap-2">
            <Rocket className="h-10 w-10" />
            <span className="text-sm font-medium">No cover image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge stage={startup.stage ?? 1} />
        </div>
      </div>

      <div className="mb-3 flex-1">
        <h3 className="text-xl font-bold text-vj-primary mb-1">
          {startup.startupName || "Untitled Startup"}
        </h3>
        {startup.tagline && (
          <p className="text-sm text-startup-primary/90 italic mb-2 line-clamp-1">
            {startup.tagline}
          </p>
        )}
        <p className="text-sm text-startup-primary font-medium mb-3">
          {formatFundingStatus(startup.fundingStatus)}
        </p>
        <p className="text-vj-muted text-sm leading-relaxed">
          {truncateText(startup.description)}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-startup-primary/10">
        <Link to={`/startups/${startup.id}`}>
          <Button
            size="sm"
            className="bg-startup-primary hover:bg-startup-primary/90 text-white"
          >
            View Details
          </Button>
        </Link>
        <div className="text-sm text-vj-muted text-right">
          <div>{startup.upvotes ?? 0} upvotes</div>
          {typeof startup.views === "number" && (
            <div className="text-xs">{startup.views} views</div>
          )}
        </div>
      </div>
    </article>
  );
};

export default StartupCard;
