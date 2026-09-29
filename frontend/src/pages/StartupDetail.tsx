import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import "@/components/design-system/listing.css";
import "@/components/design-system/detail.css";
import { CardCover } from "@/components/design-system/CardCover";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { PageHero } from "@/components/design-system/PageHero";
import { stageLabels } from "@/data/mockData";
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
      await deleteStartup(id, user?.sessionToken);
      
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

  const accent = { "--lx-accent": "var(--violet)" } as CSSProperties;

  if (loading) {
    return (
      <div className="page-shell lx dt" style={accent}>
        <div className="lx-section"><div className="lx-loading">Loading startup</div></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="page-shell lx dt" style={accent}>
        <div className="lx-section">
          <div className="lx-empty">
            <strong>Startup not found</strong>
            <Link to="/startups" className="lx-cta">All startups ↗</Link>
          </div>
        </div>
      </div>
    );
  }

  const name = startup.startupName || startup.name;
  const startupImage = getStartupImageUrl(startup?.coverImage) ?? undefined;
  const stage = Math.min(Math.max(startup.stage || 1, 1), stageLabels.length);
  const has = (value: unknown) => (Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim()));
  const website = startup.website ? (startup.website.startsWith("http") ? startup.website : `https://${startup.website}`) : null;
  const introHref = `mailto:kp@vjstartup.com?subject=${encodeURIComponent(`Intro to ${name}`)}`;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* share sheet dismissed */
    }
  };

  // Only what the startup has actually filled in; no "coming soon" or N/A placeholders.
  const sections: { label: string; body: ReactNode }[] = [];
  if (has(startup.description) && startup.description !== startup.tagline)
    sections.push({ label: "What they do", body: <p>{startup.description}</p> });
  if (has(startup.businessModel) && startup.businessModel !== startup.description)
    sections.push({ label: "Business model", body: <p>{startup.businessModel}</p> });
  if (has(startup.keyFeatures))
    sections.push({ label: "Key features", body: <ul className="lx-list">{startup.keyFeatures.map((f: string) => <li key={f}>{f}</li>)}</ul> });
  if (has(startup.technologyStack))
    sections.push({ label: "Technology", body: <div className="lx-tags">{startup.technologyStack.map((t: string) => <span key={t} className="lx-tag is-static">{t}</span>)}</div> });
  const market = [["Market size", startup.marketSize], ["Growth rate", startup.annualGrowthRate], ["Target users", startup.targetUsers]].filter(([, v]) => has(v));
  if (market.length)
    sections.push({ label: "Market", body: <dl className="dt-facts dt-facts-inline">{market.map(([k, v]) => <div key={k as string}><dt>{k}</dt><dd>{v}</dd></div>)}</dl> });
  if (has(startup.milestones))
    sections.push({
      label: "Milestones",
      body: (
        <ul className="dt-milestones">
          {startup.milestones.map((m: any, i: number) => (
            <li key={i} className={m.completed ? "is-done" : ""}><b>{m.title}</b>{m.date && <small>{formatDate(m.date)}</small>}</li>
          ))}
        </ul>
      ),
    });
  if (has(startup.founders)) sections.push({ label: "Founders", body: <p>{startup.founders}</p> });

  return (
    <div className="page-shell lx dt" style={accent}>
      <PageHero
        kind="document"
        eyebrow={`Startup / ${stageLabels[stage - 1]}`}
        title={name}
        description={startup.tagline || startup.description || ""}
        backLink={{ label: "Startups", to: "/startups" }}
        accent="violet"
        stats={[
          { value: String(startup.upvotes || 0), label: "Upvotes" },
          { value: String(startup.views || 0), label: "Views" },
          { value: formatFundingStatus(startup.fundingStatus), label: "Funding" },
        ]}
      />

      <section className="lx-section dt-grid">
        <div className="dt-main">
          <figure className="dt-figure dt-cover">
            <CardCover title={name} image={startupImage} />
            {startup.logo && (
              <img className="dt-logo" src={getStartupImageUrl(startup.logo) ?? undefined} alt={`${name} logo`} />
            )}
          </figure>

          <div className="dt-stages" aria-label={`Stage ${stage} of ${stageLabels.length}: ${stageLabels[stage - 1]}`}>
            <div className="dt-stages-head">
              <span>Where it stands</span>
              <b>{String(stage).padStart(2, "0")} / {stageLabels[stage - 1]}</b>
            </div>
            <ol>
              {stageLabels.map((label, i) => (
                <li key={label} className={i + 1 < stage ? "is-done" : i + 1 === stage ? "is-on" : ""} title={label}><i /></li>
              ))}
            </ol>
          </div>

          {sections.length > 0 && (
            <div className="dt-fields">
              {sections.map((section, i) => (
                <section key={section.label} className="dt-field">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{section.label}</h3>
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <aside className="dt-side">
          <div className="dt-card">
            <div className="dt-vote">
              <UpvoteButton upvotes={startup.upvotes || 0} hasUpvoted={hasUpvoted} onClick={handleUpvote} />
              <span>{startup.upvotes === 1 ? "person backs this" : "people back this"}</span>
            </div>
            <dl className="dt-facts">
              <div><dt>Funding</dt><dd>{formatFundingStatus(startup.fundingStatus)}</dd></div>
              <div><dt>Stage</dt><dd>{stageLabels[stage - 1]}</dd></div>
              {has(startup.teamSize || startup.team?.length) && <div><dt>Team</dt><dd>{startup.teamSize || startup.team.length}</dd></div>}
              {has(startup.revenue) && <div><dt>Revenue</dt><dd>₹{startup.revenue}</dd></div>}
              {has(startup.customers) && <div><dt>Customers</dt><dd>{startup.customers}</dd></div>}
            </dl>

            {has(startup.supportPrograms) && (
              <div className="lx-tags">
                {startup.supportPrograms.map((program: string) => <span key={program} className="lx-tag is-static">{program}</span>)}
              </div>
            )}

            {has(startup.team) && (
              <div className="dt-team">
                <span>Team</span>
                <ul>
                  {startup.team.map((member: any, index: number) => (
                    <li key={index}>
                      <i aria-hidden="true">{member.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}</i>
                      <div><b>{member.name}</b><small>{member.role || "Team member"}</small></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="dt-actions">
              {website ? (
                <a href={website} target="_blank" rel="noopener noreferrer" className="lx-cta">Visit the website ↗</a>
              ) : (
                <a href={introHref} className="lx-cta">Ask VJ Startups for an intro ↗</a>
              )}
              {website && <a href={introHref} className="lx-textbtn">Ask for an intro ↗</a>}
              {startup.pitchDeck && (
                <a href={`${import.meta.env.VITE_API_BASE_URL}/startup-api/${startup.id}/download/pitchDeck`} download className="lx-textbtn">Pitch deck ↗</a>
              )}
              {startup.onePager && (
                <a href={`${import.meta.env.VITE_API_BASE_URL}/startup-api/${startup.id}/download/onePager`} download className="lx-textbtn">One-pager ↗</a>
              )}
              <button type="button" className="lx-textbtn" onClick={share}>Share ↗</button>
              {canEditDelete && (
                <>
                  <Link to={`/startup-form?edit=${id}`} className="lx-textbtn">Edit ↗</Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="lx-textbtn dt-danger">Delete</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this startup?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes "{name}" and its data. It cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                          {deleting ? "Deleting..." : "Delete startup"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
