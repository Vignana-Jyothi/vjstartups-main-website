import { CardCover } from "@/components/design-system/CardCover";
import { Link } from "react-router-dom";
import { stageLabels } from "@/data/mockData";
import { StartupListItem } from "@/types/startup";
import {
  formatFundingStatus,
  getStartupImageUrl,
  truncateText,
} from "@/utils/startupFormatters";

interface StartupCardProps {
  startup: StartupListItem;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  const imageUrl = getStartupImageUrl(startup.coverImage);

  return (
    <article className="lx-card">
      <Link to={`/startups/${startup.id}`} className="lx-card-link" aria-label={startup.startupName || "Startup"} />
      <div className="lx-card-media">
        <CardCover title={startup.startupName || "Startup"} image={imageUrl} />
        <span className="lx-card-kicker">Startup / {stageLabels[(startup.stage || 1) - 1]}</span>
      </div>
      <div className="lx-card-body">
        <p className="lx-card-line">Funding / <span className="lx-card-accent">{formatFundingStatus(startup.fundingStatus)}</span></p>
        <h3 className="lx-card-title">{startup.startupName || "Untitled startup"}</h3>
        {startup.tagline && <p className="lx-card-tagline">{startup.tagline}</p>}
        <p className="lx-card-text">{truncateText(startup.description)}</p>
        <div className="lx-card-meta">
          <span>♥ {startup.upvotes ?? 0}{typeof startup.views === "number" && <> · {startup.views} views</>}</span>
          <em>Open ↗</em>
        </div>
      </div>
    </article>
  );
};

export default StartupCard;
