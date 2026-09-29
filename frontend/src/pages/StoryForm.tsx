import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/design-system/PageHero";
import { startupPrograms } from "@/data/startupPrograms";
import type { SuccessStory } from "@/data/successStories";
import { canWriteStories, createStory, updateStory, uploadStoryImage, useStory, type StoryDraft } from "@/data/storiesApi";
import { useUser } from "./UserContext";
import { toast } from "@/components/ui/use-toast";
import "@/components/design-system/listing.css";
import "@/components/design-system/forms.css";

// Write up a success story (/stories/new) or edit one (/stories/:id/edit). Admins and wing
// masters only; the backend checks the role again. Photos upload to Cloudinary as they're picked.

type Person = { name: string; branch: string; year: string; role: string; imageUrl: string; linkedin: string; instagram: string };
type Step = { phase: string; description: string; achievement: string };
type Outcome = { metrics: string; title: string; description: string };
type Quote = { text: string; author: string; designation: string };
type Photo = { url: string; caption: string };

type Form = {
  programId: string; season: string; title: string; subtitle: string; date: string; overview: string; featured: boolean;
  people: Person[]; journey: Step[]; outcomes: Outcome[]; quotes: Quote[]; photos: Photo[];
  videoUrl: string; videoCaption: string; achievements: string; tags: string;
};

const person = (): Person => ({ name: "", branch: "", year: "", role: "", imageUrl: "", linkedin: "", instagram: "" });
const step = (): Step => ({ phase: "", description: "", achievement: "" });
const outcome = (): Outcome => ({ metrics: "", title: "", description: "" });
const quote = (): Quote => ({ text: "", author: "", designation: "" });

const empty = (): Form => ({
  programId: "", season: "", title: "", subtitle: "", date: "", overview: "", featured: false,
  people: [person()], journey: [step()], outcomes: [outcome()], quotes: [quote()], photos: [],
  videoUrl: "", videoCaption: "", achievements: "", tags: "",
});

// Stored dates are "YYYY-MM" from this form; older ones like "Aug-2025" are turned into that shape.
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function toMonth(date: string) {
  if (/^\d{4}-\d{2}/.test(date)) return date.slice(0, 7);
  const m = /^([a-z]{3})[a-z]*[-\s](\d{4})$/i.exec(date.trim());
  return m && MONTHS.includes(m[1].toLowerCase()) ? `${m[2]}-${String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, "0")}` : "";
}

function fromStory(s: SuccessStory): Form {
  const link = (p: SuccessStory["participants"][number], platform: string) =>
    p.socialLinks?.find((l) => l.platform === platform)?.url || (platform === "linkedin" ? p.linkedinUrl : p.instagramUrl) || "";
  const video = s.gallery?.find((g) => g.type === "video");
  return {
    programId: s.programId, season: s.season, title: s.title, subtitle: s.subtitle, date: toMonth(s.date), overview: s.overview ?? "",
    featured: s.featured,
    people: s.participants.map((p) => ({ name: p.name, branch: p.branch, year: p.year, role: p.role ?? "", imageUrl: p.imageUrl ?? "", linkedin: link(p, "linkedin"), instagram: link(p, "instagram") })),
    journey: s.journey?.length ? s.journey.map((j) => ({ phase: j.phase, description: j.description, achievement: j.achievement ?? "" })) : [step()],
    outcomes: s.outcomes?.length ? s.outcomes.map((o) => ({ metrics: o.metrics ?? "", title: o.title, description: o.description })) : [outcome()],
    quotes: s.quotes?.length ? s.quotes.map((q) => ({ text: q.text, author: q.author, designation: q.designation })) : [quote()],
    photos: (s.gallery ?? []).filter((g) => g.type === "image").map((g) => ({ url: g.url, caption: g.caption ?? "" })),
    videoUrl: video?.url ?? "", videoCaption: video?.caption ?? "",
    achievements: s.achievements.join("\n"), tags: s.tags.join(", "),
  };
}

function toDraft(f: Form): StoryDraft {
  return {
    programId: f.programId, season: f.season.trim(), title: f.title.trim(), subtitle: f.subtitle.trim(), date: f.date, overview: f.overview.trim(),
    featured: f.featured,
    participants: f.people.filter((p) => p.name.trim()).map((p) => ({
      name: p.name.trim(), branch: p.branch.trim(), year: p.year.trim(), role: p.role.trim() || undefined, imageUrl: p.imageUrl || undefined,
      socialLinks: [
        p.linkedin.trim() && { platform: "linkedin" as const, url: p.linkedin.trim(), displayName: "LinkedIn" },
        p.instagram.trim() && { platform: "instagram" as const, url: p.instagram.trim(), displayName: "Instagram" },
      ].filter(Boolean) as NonNullable<SuccessStory["participants"][number]["socialLinks"]>,
    })),
    journey: f.journey.filter((j) => j.phase.trim()),
    outcomes: f.outcomes.filter((o) => o.title.trim()).map((o) => ({ ...o, metrics: o.metrics.trim() || undefined })),
    quotes: f.quotes.filter((q) => q.text.trim()),
    gallery: [
      ...f.photos.map((p) => ({ type: "image" as const, url: p.url, caption: p.caption.trim() || undefined })),
      ...(f.videoUrl.trim() ? [{ type: "video" as const, url: f.videoUrl.trim(), caption: f.videoCaption.trim() || undefined }] : []),
    ],
    achievements: f.achievements.split("\n").map((a) => a.trim()).filter(Boolean),
    tags: f.tags.split(",").map((t) => t.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean),
  };
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {hint && <p>{hint}</p>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

const StoryForm = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useUser();
  const navigate = useNavigate();
  const existing = useStory(id);
  const [form, setForm] = useState<Form>(empty);
  const [loaded, setLoaded] = useState(!editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);

  useEffect(() => {
    if (editing && existing.story && !loaded) {
      setForm(fromStory(existing.story));
      setLoaded(true);
    }
  }, [editing, existing.story, loaded]);

  const token = user?.adminToken;
  if (!user || !canWriteStories(user.role) || !token) {
    return (
      <div className="page-shell lx">
        <PageHero kind="tool" eyebrow="Student stories" title="Write up a story" description="Success stories are written up by admins and wing masters." backLink={{ label: "Stories", to: "/stories" }} />
        <section className="lx-section">
          <div className="lx-empty">
            <strong>Admins and wing masters only</strong>
            {user ? "Your account can't write stories." : "Log in with an admin or wing master account."}
            <Link to={user ? "/stories" : "/login"} className="lx-cta">{user ? "Back to stories ↗" : "Log in ↗"}</Link>
          </div>
        </section>
      </div>
    );
  }

  if (editing && !loaded) {
    return (
      <div className="page-shell lx">
        <div className="lx-section">
          {existing.status === "missing" ? (
            <div className="lx-empty"><strong>Story not found</strong><Link to="/stories" className="lx-cta">Back to stories ↗</Link></div>
          ) : (
            <div className="lx-loading">Loading the story</div>
          )}
        </div>
      </div>
    );
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setRow = <K extends "people" | "journey" | "outcomes" | "quotes" | "photos">(key: K, i: number, patch: Partial<Form[K][number]>) =>
    setForm((f) => ({ ...f, [key]: (f[key] as Form[K][number][]).map((row, j) => (j === i ? { ...row, ...patch } : row)) }));
  const addRow = <K extends "people" | "journey" | "outcomes" | "quotes">(key: K, row: Form[K][number]) =>
    setForm((f) => ({ ...f, [key]: [...(f[key] as Form[K][number][]), row] }));
  const removeRow = <K extends "people" | "journey" | "outcomes" | "quotes" | "photos">(key: K, i: number) =>
    setForm((f) => ({ ...f, [key]: (f[key] as Form[K][number][]).filter((_, j) => j !== i) }));

  const upload = async (files: FileList | null, onUrl: (url: string) => void) => {
    for (const file of Array.from(files ?? [])) {
      setUploading((n) => n + 1);
      try {
        onUrl(await uploadStoryImage(token, file));
      } catch (err) {
        toast({ title: "Upload failed", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const draft = toDraft(form);
    const missing = [!draft.programId && "program", !draft.season && "season or batch", !draft.title && "title", !draft.participants.length && "at least one student"].filter(Boolean);
    if (missing.length) {
      toast({ title: "Almost there", description: `Still needed: ${missing.join(", ")}.`, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const saved = editing ? await updateStory(token, id!, draft) : await createStory(token, draft);
      toast({ title: editing ? "Story updated" : "Story published", description: saved.title });
      navigate(`/programs/${saved.programId}/success-stories/${saved.id}`);
    } catch (err) {
      toast({ title: "Couldn't save the story", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
      setSaving(false);
    }
  };

  const onText = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never);

  return (
    <div className="page-shell lx">
      <PageHero
        kind="tool"
        eyebrow="Student stories"
        title={editing ? "Edit the story" : "Write up a story"}
        description="What a student built through a program and what came of it. It appears on the stories page and on its program's page as soon as it's published."
        backLink={{ label: "Stories", to: "/stories" }}
      />
      <div className="form-shell fm" data-accent="violet">
        <form onSubmit={submit}>
          <Section title="The story" hint="The program it came from and the one-line version.">
            <Field id="programId" label="Program *">
              <select id="programId" className="lx-select" value={form.programId} onChange={onText("programId")} required>
                <option value="">Choose a program</option>
                {startupPrograms.map((p) => <option key={p.id} value={p.id}>{p.title}{p.edition ? ` #${p.edition}` : ""}</option>)}
              </select>
            </Field>
            <Field id="season" label="Season or batch *"><Input id="season" value={form.season} onChange={onText("season")} placeholder="e.g. Season 2, Batch 1" /></Field>
            <Field id="title" label="Title *"><Input id="title" value={form.title} onChange={onText("title")} placeholder="e.g. From ₹1,000 to ₹12,000: Dance Coaching" /></Field>
            <Field id="subtitle" label="One line"><Input id="subtitle" value={form.subtitle} onChange={onText("subtitle")} placeholder="How it happened, in a sentence" /></Field>
            <Field id="date" label="When"><Input id="date" type="month" value={form.date} onChange={onText("date")} /></Field>
            <Field id="overview" label="The story"><Textarea id="overview" rows={5} value={form.overview} onChange={onText("overview")} placeholder="What they noticed, what they did, what came of it." /></Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Feature it (listed first)
            </label>
          </Section>

          <Section title="Students *" hint="Everyone who built it.">
            {form.people.map((p, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field id={`pn${i}`} label="Name *"><Input id={`pn${i}`} value={p.name} onChange={(e) => setRow("people", i, { name: e.target.value })} /></Field>
                  <Field id={`pb${i}`} label="Branch"><Input id={`pb${i}`} value={p.branch} onChange={(e) => setRow("people", i, { branch: e.target.value })} placeholder="e.g. CSE" /></Field>
                  <Field id={`py${i}`} label="Year"><Input id={`py${i}`} value={p.year} onChange={(e) => setRow("people", i, { year: e.target.value })} placeholder="e.g. 2nd" /></Field>
                  <Field id={`pr${i}`} label="Role in the team"><Input id={`pr${i}`} value={p.role} onChange={(e) => setRow("people", i, { role: e.target.value })} /></Field>
                  <Field id={`pl${i}`} label="LinkedIn"><Input id={`pl${i}`} value={p.linkedin} onChange={(e) => setRow("people", i, { linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" /></Field>
                  <Field id={`pi${i}`} label="Instagram"><Input id={`pi${i}`} value={p.instagram} onChange={(e) => setRow("people", i, { instagram: e.target.value })} placeholder="https://instagram.com/…" /></Field>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover" />}
                  <label className="lx-textbtn cursor-pointer">
                    {p.imageUrl ? "Change photo" : "Add a photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files, (url) => setRow("people", i, { imageUrl: url }))} />
                  </label>
                  {form.people.length > 1 && <button type="button" className="lx-textbtn" onClick={() => removeRow("people", i)}><Trash2 size={14} className="inline" /> Remove</button>}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addRow("people", person())}><Plus size={16} /> Add a student</Button>
          </Section>

          <Section title="How it went" hint="The stretches of the program, in order. Each can end in what it achieved.">
            {form.journey.map((j, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <Field id={`jp${i}`} label="Stretch"><Input id={`jp${i}`} value={j.phase} onChange={(e) => setRow("journey", i, { phase: e.target.value })} placeholder="e.g. Day 1-2: Spotting the need" /></Field>
                <Field id={`jd${i}`} label="What they did"><Textarea id={`jd${i}`} rows={2} value={j.description} onChange={(e) => setRow("journey", i, { description: e.target.value })} /></Field>
                <Field id={`ja${i}`} label="What it achieved"><Input id={`ja${i}`} value={j.achievement} onChange={(e) => setRow("journey", i, { achievement: e.target.value })} /></Field>
                {form.journey.length > 1 && <button type="button" className="lx-textbtn" onClick={() => removeRow("journey", i)}>Remove</button>}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addRow("journey", step())}><Plus size={16} /> Add a stretch</Button>
          </Section>

          <Section title="What came of it" hint="Results, each with its number if there is one.">
            {form.outcomes.map((o, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field id={`om${i}`} label="The number"><Input id={`om${i}`} value={o.metrics} onChange={(e) => setRow("outcomes", i, { metrics: e.target.value })} placeholder="e.g. ₹12,000 in 15 days" /></Field>
                  <Field id={`ot${i}`} label="Result"><Input id={`ot${i}`} value={o.title} onChange={(e) => setRow("outcomes", i, { title: e.target.value })} placeholder="e.g. Financial success" /></Field>
                </div>
                <Field id={`od${i}`} label="Details"><Textarea id={`od${i}`} rows={2} value={o.description} onChange={(e) => setRow("outcomes", i, { description: e.target.value })} /></Field>
                {form.outcomes.length > 1 && <button type="button" className="lx-textbtn" onClick={() => removeRow("outcomes", i)}>Remove</button>}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addRow("outcomes", outcome())}><Plus size={16} /> Add a result</Button>
          </Section>

          <Section title="In their words" hint="A quote from the student or the team.">
            {form.quotes.map((q, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <Field id={`qt${i}`} label="Quote"><Textarea id={`qt${i}`} rows={3} value={q.text} onChange={(e) => setRow("quotes", i, { text: e.target.value })} /></Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field id={`qa${i}`} label="Who said it"><Input id={`qa${i}`} value={q.author} onChange={(e) => setRow("quotes", i, { author: e.target.value })} /></Field>
                  <Field id={`qd${i}`} label="Who they are"><Input id={`qd${i}`} value={q.designation} onChange={(e) => setRow("quotes", i, { designation: e.target.value })} placeholder="e.g. Dance instructor and founder" /></Field>
                </div>
                {form.quotes.length > 1 && <button type="button" className="lx-textbtn" onClick={() => removeRow("quotes", i)}>Remove</button>}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addRow("quotes", quote())}><Plus size={16} /> Add a quote</Button>
          </Section>

          <Section title="Photos and video" hint="Real photos from the program. The first one is the story's cover.">
            <div className="grid gap-3 sm:grid-cols-2">
              {form.photos.map((p, i) => (
                <div key={p.url} className="space-y-2 rounded-2xl border border-white/10 p-3">
                  <img src={p.url} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                  <Input value={p.caption} onChange={(e) => setRow("photos", i, { caption: e.target.value })} placeholder="Caption" aria-label="Caption" />
                  <button type="button" className="lx-textbtn" onClick={() => removeRow("photos", i)}>Remove</button>
                </div>
              ))}
            </div>
            <label className="lx-textbtn cursor-pointer">
              {uploading ? `Uploading ${uploading}…` : "Add photos"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, (url) => setForm((f) => ({ ...f, photos: [...f.photos, { url, caption: "" }] })))} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="videoUrl" label="Video link"><Input id="videoUrl" value={form.videoUrl} onChange={onText("videoUrl")} placeholder="https://youtu.be/…" /></Field>
              <Field id="videoCaption" label="Video caption"><Input id="videoCaption" value={form.videoCaption} onChange={onText("videoCaption")} /></Field>
            </div>
          </Section>

          <Section title="Highlights" hint="Shown beside the story.">
            <Field id="achievements" label="Key achievements (one per line)"><Textarea id="achievements" rows={4} value={form.achievements} onChange={onText("achievements")} /></Field>
            <Field id="tags" label="Tags (comma separated)"><Input id="tags" value={form.tags} onChange={onText("tags")} placeholder="e.g. teaching, community" /></Field>
          </Section>

          <div>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={saving || uploading > 0}>{saving ? "Saving…" : editing ? "Save changes" : "Publish the story"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;
