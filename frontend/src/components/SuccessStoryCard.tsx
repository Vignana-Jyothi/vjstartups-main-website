import { Link } from "react-router-dom";
import { CardCover } from "@/components/design-system/CardCover";
import { SuccessStory, formatStoryDate } from "@/data/successStories";
import { usePdfAvailable } from "@/hooks/usePdfAvailable";

/** `feature` lays the story out wide (media beside text) with its achievements, for the stories page. */
export default function SuccessStoryCard({ story, programId, feature = false }: { story: SuccessStory; programId: string; feature?: boolean }) {
  const hasPage = story.contentType === "web" || story.contentType === "hybrid";
  const pdfLive = usePdfAvailable(story.pdfUrl);
  const cover = story.gallery?.find((media) => media.type === "image")?.url;
  const names = story.participants.map((p) => p.name.split(" ")[0]).join(", ");

  return (
    <article className={feature ? "lx-card ss-feature" : "lx-card"}>
      {hasPage ? (
        <Link to={`/programs/${programId}/success-stories/${story.id}`} className="lx-card-link" aria-label={story.title} />
      ) : pdfLive ? (
        <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer" className="lx-card-link" aria-label={story.title} />
      ) : null}
      <div className="lx-card-media">
        <CardCover title={story.title} image={cover} />
        <span className="lx-card-kicker">{story.season}{story.featured ? " / Featured" : ""}</span>
      </div>
      <div className="lx-card-body">
        <h3 className="lx-card-title">{story.title}</h3>
        <p className="lx-card-tagline">{story.subtitle}</p>
        {story.overview && <p className="lx-card-text">{story.overview}</p>}
        {feature && story.achievements.length > 0 && (
          <ul className="ss-feature-wins">
            {story.achievements.slice(0, 4).map((a) => <li key={a}>{a}</li>)}
          </ul>
        )}
        <div className="lx-card-meta">
          <span>{names} / {formatStoryDate(story.date)}</span>
          {hasPage ? <em>Read ↗</em> : pdfLive ? <em>Report ↗</em> : <span>Report pending</span>}
        </div>
      </div>
    </article>
  );
}
