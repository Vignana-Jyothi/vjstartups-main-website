import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/design-system/PageHero";
import { PROGRAM_CATEGORIES, PROGRAM_STATUS } from "@/data/startupPrograms";
import {
  canEditContent,
  fetchManagedContent,
  reorderContent,
  saveContent,
  setContentPublished,
  slugify,
  uploadContentImage,
  type ContentKind,
  type ManagedContent,
} from "@/data/siteContent";
import { useUser } from "./UserContext";
import { toast } from "@/components/ui/use-toast";
import "@/components/design-system/listing.css";
import "@/components/design-system/forms.css";
import "./manage.css";

// /manage: admins and wing masters edit the site's content (programs, funded ventures, wings,
// the home page's Signals, the club's text and numbers). The backend checks the role again and
// cleans every field; changes reach the public pages within a minute.

type Item = Record<string, any>;
type ListKey = "programs" | "ventures" | "wings" | "signals";

type Tab = {
  key: ListKey | "club";
  kind: ContentKind;
  label: string;
  one: string;
  titleOf: (i: Item) => string;
  metaOf: (i: Item) => string;
  blank: () => Item;
};

const TABS: Tab[] = [
  {
    key: "programs", kind: "program", label: "Programs", one: "program",
    titleOf: (p) => p.title, metaOf: (p) => [PROGRAM_STATUS[p.status as keyof typeof PROGRAM_STATUS], p.duration, p.onHomePage && "On the home page"].filter(Boolean).join(" · "),
    blank: () => ({ title: "", subtitle: "", duration: "", status: "active", category: "challenge", shortDescription: "", overview: "", contact: {} }),
  },
  {
    key: "ventures", kind: "venture", label: "Funded ventures", one: "venture",
    titleOf: (v) => v.name, metaOf: (v) => v.sector,
    blank: () => ({ name: "", sector: "", description: "" }),
  },
  {
    key: "wings", kind: "wing", label: "Wings", one: "wing",
    titleOf: (w) => w.name, metaOf: (w) => (w.subWings?.length ? `${w.subWings.length} programs` : ""),
    blank: () => ({ name: "", description: "", purpose: "" }),
  },
  {
    key: "signals", kind: "signal", label: "Signals", one: "signal",
    titleOf: (s) => `${s.value} · ${s.title}`, metaOf: (s) => s.note ?? "",
    blank: () => ({ value: "", title: "", note: "" }),
  },
  {
    key: "club", kind: "club", label: "The club", one: "club",
    titleOf: (c) => c.name, metaOf: () => "",
    blank: () => ({ name: "", tagline: "", description: "", mission: "", vision: "", stats: [] }),
  },
];

// Rows inside a form (mentors, sub-wings, numbers) carry a local key so their fields keep their
// own state when a row above them is removed. The backend drops it.
let keySeq = 0;
const withKey = <T extends object>(row: T) => ({ ...row, _k: ++keySeq });
const keyed = (rows?: Item[]) => (rows ?? []).map(withKey);

function prepare(tab: Tab, item: Item): Item {
  const copy = structuredClone(item);
  if (tab.kind === "program") Object.assign(copy, { mentors: keyed(copy.mentors), resources: keyed(copy.resources), contact: copy.contact ?? {} });
  if (tab.kind === "wing") copy.subWings = keyed(copy.subWings);
  if (tab.kind === "club") copy.stats = keyed(copy.stats);
  return copy;
}

// ---- Fields ----------------------------------------------------------------------------------

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
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

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

type TextProps = { id: string; label: string; value?: string | number; onChange: (v: string) => void; rows?: number; placeholder?: string; type?: string };

function Text({ id, label, value, onChange, rows, placeholder, type }: TextProps) {
  return (
    <Field id={id} label={label}>
      {rows ? (
        <Textarea id={id} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

/** A list of short texts, one per line. Keeps its own text so blank lines can be typed. */
function Lines({ id, label, value, onChange, rows = 4 }: { id: string; label: string; value?: string[]; onChange: (v: string[]) => void; rows?: number }) {
  const [text, setText] = useState(() => (value ?? []).join("\n"));
  return (
    <Field id={id} label={`${label} (one per line)`}>
      <Textarea
        id={id}
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
        }}
      />
    </Field>
  );
}

function Select({ id, label, value, options, onChange }: { id: string; label: string; value?: string; options: Record<string, string>; onChange: (v: string) => void }) {
  return (
    <Field id={id} label={label}>
      <select id={id} className="lx-select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(options).map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
    </Field>
  );
}

function Rows({ items, blank, addLabel, onChange, render }: {
  items: Item[];
  blank: () => Item;
  addLabel: string;
  onChange: (rows: Item[]) => void;
  render: (row: Item, set: (patch: Item) => void, i: number) => ReactNode;
}) {
  return (
    <>
      {items.map((row, i) => (
        <div key={row._k} className="space-y-3 rounded-2xl border border-white/10 p-4">
          {render(row, (patch) => onChange(items.map((r, j) => (j === i ? { ...r, ...patch } : r))), i)}
          <button type="button" className="lx-textbtn" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, withKey(blank())])}><Plus size={16} /> {addLabel}</Button>
    </>
  );
}

const STATUS_OPTIONS = PROGRAM_STATUS as Record<string, string>;

// ---- One form per kind -----------------------------------------------------------------------

type EditorProps = { item: Item; set: (patch: Item) => void; token: string };

function ProgramFields({ item: p, set }: EditorProps) {
  return (
    <>
      <Section title="The program" hint="How it's listed on the programs page.">
        <Text id="title" label="Name *" value={p.title} onChange={(title) => set({ title })} />
        <Text id="subtitle" label="One line" value={p.subtitle} onChange={(subtitle) => set({ subtitle })} placeholder="e.g. Try a business idea with ₹1000" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select id="category" label="Kind" value={p.category} options={PROGRAM_CATEGORIES} onChange={(category) => set({ category })} />
          <Select id="status" label="Status" value={p.status} options={STATUS_OPTIONS} onChange={(status) => set({ status })} />
          <Text id="duration" label="How long" value={p.duration} onChange={(duration) => set({ duration })} placeholder="e.g. 10-15 days" />
          <Text id="edition" label="Times run so far" type="number" value={p.edition ?? ""} onChange={(edition) => set({ edition })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!p.onHomePage} onChange={(e) => set({ onHomePage: e.target.checked })} /> List it under "Support you can get" on the home page
        </label>
        <Text id="short" label="Short description" rows={2} value={p.shortDescription} onChange={(shortDescription) => set({ shortDescription })} />
        <Text id="overview" label="Overview" rows={5} value={p.overview} onChange={(overview) => set({ overview })} />
      </Section>
      <Section title="Taking part">
        <Lines id="how" label="How to take part" value={p.howToParticipate} onChange={(howToParticipate) => set({ howToParticipate })} />
        <Lines id="elig" label="Who can join" value={p.eligibility} onChange={(eligibility) => set({ eligibility })} />
        <Lines id="timeline" label="Timeline" value={p.timeline} onChange={(timeline) => set({ timeline })} />
      </Section>
      <Section title="What they get">
        <Lines id="support" label="Support" value={p.support} onChange={(support) => set({ support })} />
        <Lines id="benefits" label="Benefits" value={p.benefits} onChange={(benefits) => set({ benefits })} />
      </Section>
      <Section title="Mentors" hint="Shown on the program's page with their contact details, so students can book time.">
        <Rows
          items={p.mentors ?? []}
          blank={() => ({ name: "", designation: "" })}
          addLabel="Add a mentor"
          onChange={(mentors) => set({ mentors })}
          render={(m, setM, i) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Text id={`mn${i}`} label="Name *" value={m.name} onChange={(name) => setM({ name })} />
              <Text id={`md${i}`} label="Designation" value={m.designation} onChange={(designation) => setM({ designation })} />
              <Text id={`mdep${i}`} label="Department" value={m.department} onChange={(department) => setM({ department })} />
              <Text id={`me${i}`} label="Email" value={m.email} onChange={(email) => setM({ email })} />
              <Text id={`mc${i}`} label="Phone" value={m.contact} onChange={(contact) => setM({ contact })} />
              <Text id={`mw${i}`} label="WhatsApp number" value={m.whatsappNumber} onChange={(whatsappNumber) => setM({ whatsappNumber })} placeholder="+91…" />
              <Text id={`ma${i}`} label="When they're free" value={m.availability} onChange={(availability) => setM({ availability })} />
              <Text id={`ml${i}`} label="Where" value={m.location} onChange={(location) => setM({ location })} />
              <Text id={`mr${i}`} label="Profile or resume link" value={m.resumeLink} onChange={(resumeLink) => setM({ resumeLink })} />
              <Text id={`mnote${i}`} label="Note" value={m.note} onChange={(note) => setM({ note })} />
              <Lines id={`mx${i}`} label="Expertise" rows={3} value={m.expertise} onChange={(expertise) => setM({ expertise })} />
            </div>
          )}
        />
      </Section>
      <Section title="Resources">
        <Rows
          items={p.resources ?? []}
          blank={() => ({ title: "", description: "" })}
          addLabel="Add a resource"
          onChange={(resources) => set({ resources })}
          render={(r, setR, i) => (
            <>
              <Text id={`rt${i}`} label="Title *" value={r.title} onChange={(title) => setR({ title })} />
              <Text id={`rd${i}`} label="What it is" rows={2} value={r.description} onChange={(description) => setR({ description })} />
              <Text id={`rl${i}`} label="Link" value={r.link} onChange={(link) => setR({ link })} placeholder="https://…" />
            </>
          )}
        />
      </Section>
      <Section title="Contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <Text id="ce" label="Email" value={p.contact?.email} onChange={(email) => set({ contact: { ...p.contact, email } })} />
          <Text id="cc" label="Coordinator" value={p.contact?.coordinator} onChange={(coordinator) => set({ contact: { ...p.contact, coordinator } })} />
        </div>
      </Section>
    </>
  );
}

function VentureFields({ item: v, set, token }: EditorProps) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      set({ imageUrl: await uploadContentImage(token, file) });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  return (
    <Section title="The venture" hint="Shown on the home page and on the startups page.">
      <Text id="name" label="Name *" value={v.name} onChange={(name) => set({ name })} />
      <Text id="sector" label="Sector" value={v.sector} onChange={(sector) => set({ sector })} placeholder="e.g. HealthTech" />
      <Text id="desc" label="What it does" rows={3} value={v.description} onChange={(description) => set({ description })} />
      <Text id="web" label="Website" value={v.website} onChange={(website) => set({ website })} placeholder="https://…" />
      <div className="flex flex-wrap items-center gap-3">
        {v.imageUrl && <img src={v.imageUrl} alt="" className="h-16 w-24 rounded-xl object-cover" />}
        <label className="lx-textbtn cursor-pointer">
          {uploading ? "Uploading…" : v.imageUrl ? "Change the photo" : "Add a photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        {v.imageUrl && <button type="button" className="lx-textbtn" onClick={() => set({ imageUrl: "" })}>Remove the photo</button>}
      </div>
    </Section>
  );
}

function WingFields({ item: w, set }: EditorProps) {
  return (
    <>
      <Section title="The wing">
        <Text id="name" label="Name *" value={w.name} onChange={(name) => set({ name })} placeholder="e.g. Vision Wing" />
        <Text id="desc" label="What it does" rows={3} value={w.description} onChange={(description) => set({ description })} />
        <Text id="purpose" label="Purpose" rows={2} value={w.purpose} onChange={(purpose) => set({ purpose })} />
        <Lines id="focus" label="Focus areas" value={w.focusAreas} onChange={(focusAreas) => set({ focusAreas })} />
        <Lines id="ach" label="Achievements" value={w.achievements} onChange={(achievements) => set({ achievements })} />
        <Lines id="proj" label="Current projects" value={w.currentProjects} onChange={(currentProjects) => set({ currentProjects })} />
      </Section>
      <Section title="Its programs" hint="The sub-wings that run the wing's programs.">
        <Rows
          items={w.subWings ?? []}
          blank={() => ({ id: "", name: "", description: "", status: "active" })}
          addLabel="Add a program"
          onChange={(subWings) => set({ subWings: subWings.map((s) => ({ ...s, id: s.id || slugify(s.name || "") })) })}
          render={(s, setS, i) => (
            <>
              <Text id={`sn${i}`} label="Name *" value={s.name} onChange={(name) => setS({ name })} />
              <Text id={`sd${i}`} label="What it does" rows={2} value={s.description} onChange={(description) => setS({ description })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select id={`ss${i}`} label="Status" value={s.status} options={STATUS_OPTIONS} onChange={(status) => setS({ status })} />
                <Text id={`se${i}`} label="Season" type="number" value={s.edition ?? ""} onChange={(edition) => setS({ edition })} />
              </div>
              <Text id={`sa${i}`} label="Happening now" value={s.currentActivity} onChange={(currentActivity) => setS({ currentActivity })} />
              <Lines id={`sach${i}`} label="Achievements" rows={3} value={s.achievements} onChange={(achievements) => setS({ achievements })} />
            </>
          )}
        />
      </Section>
    </>
  );
}

function SignalFields({ item: s, set }: EditorProps) {
  return (
    <Section title="The signal" hint="An award or milestone on the home page. The funded-startup count is added on its own, from the ventures.">
      <Text id="value" label="The figure *" value={s.value} onChange={(value) => set({ value })} placeholder="e.g. 2024, ₹2.8Cr" />
      <Text id="title" label="What it is *" value={s.title} onChange={(title) => set({ title })} placeholder="e.g. Best Innovation Award" />
      <Text id="note" label="Detail" value={s.note} onChange={(note) => set({ note })} placeholder="e.g. National Startup Competition" />
    </Section>
  );
}

function ClubFields({ item: c, set }: EditorProps) {
  return (
    <>
      <Section title="The club" hint="The club page's heading and its About section.">
        <Text id="name" label="Name *" value={c.name} onChange={(name) => set({ name })} />
        <Text id="tagline" label="Tagline" value={c.tagline} onChange={(tagline) => set({ tagline })} />
        <Text id="desc" label="About" rows={4} value={c.description} onChange={(description) => set({ description })} />
        <Text id="mission" label="Mission" rows={3} value={c.mission} onChange={(mission) => set({ mission })} />
        <Text id="vision" label="Vision" rows={3} value={c.vision} onChange={(vision) => set({ vision })} />
      </Section>
      <Section title="Numbers" hint="Up to six, shown at the top of the club page.">
        <Rows
          items={c.stats ?? []}
          blank={() => ({ value: "", label: "" })}
          addLabel="Add a number"
          onChange={(stats) => set({ stats: stats.slice(0, 6) })}
          render={(s, setS, i) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Text id={`nv${i}`} label="Figure" value={s.value} onChange={(value) => setS({ value })} placeholder="e.g. 200+" />
              <Text id={`nl${i}`} label="Label" value={s.label} onChange={(label) => setS({ label })} placeholder="e.g. Active members" />
            </div>
          )}
        />
      </Section>
    </>
  );
}

const FIELDS: Record<ContentKind, (p: EditorProps) => JSX.Element> = {
  program: ProgramFields,
  venture: VentureFields,
  wing: WingFields,
  signal: SignalFields,
  club: ClubFields,
};

// ---- The page --------------------------------------------------------------------------------

type Editing = { tab: Tab; item: Item; isNew: boolean; id: string; idTouched: boolean };

const ManageContent = () => {
  const { user } = useUser();
  const token = user?.adminToken;
  const allowed = !!user && canEditContent(user.role) && !!token;
  const [content, setContent] = useState<ManagedContent | null>(null);
  const [failed, setFailed] = useState("");
  const [tabKey, setTabKey] = useState<Tab["key"]>("programs");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!token) return;
    try {
      setContent(await fetchManagedContent(token));
      setFailed("");
    } catch (err) {
      setFailed(err instanceof Error ? err.message : String(err));
    }
  }, [token]);

  useEffect(() => {
    if (allowed) reload();
  }, [allowed, reload]);

  if (!allowed) {
    return (
      <div className="page-shell lx">
        <PageHero kind="tool" eyebrow="Site content" title="Edit the site" description="Programs, ventures, wings and the club's own text are kept up to date by admins and wing masters." backLink={{ label: "Home", to: "/" }} />
        <section className="lx-section">
          <div className="lx-empty">
            <strong>Admins and wing masters only</strong>
            {user ? "Your account can't edit the site." : "Log in with an admin or wing master account."}
            <Link to={user ? "/" : "/login"} className="lx-cta">{user ? "Back home ↗" : "Log in ↗"}</Link>
          </div>
        </section>
      </div>
    );
  }

  const tab = TABS.find((t) => t.key === tabKey)!;
  const rows: Item[] = content ? (tab.key === "club" ? (content.club ? [content.club] : []) : content[tab.key]) : [];

  const run = async (work: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await work();
      toast({ title: done });
      await reload();
      return true;
    } catch (err) {
      toast({ title: "That didn't work", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const move = (i: number, by: number) => {
    const ids = rows.map((r) => r.id);
    [ids[i], ids[i + by]] = [ids[i + by], ids[i]];
    run(() => reorderContent(token!, tab.kind, ids), "Order saved");
  };

  const open = (t: Tab, item?: Item) => {
    setEditing({ tab: t, item: prepare(t, item ?? t.blank()), isNew: !item, id: item?.id ?? (t.kind === "club" ? "main" : ""), idTouched: false });
    window.scrollTo({ top: 0 });
  };
  const close = () => {
    setEditing(null);
    window.scrollTo({ top: 0 });
  };

  const save = async () => {
    if (!editing) return;
    const { tab: t, item, id } = editing;
    const required = t.kind === "program" || t.kind === "signal" ? "title" : "name";
    if (!String(item[required] ?? "").trim()) {
      toast({ title: "Almost there", description: `The ${t.one} needs ${required === "title" && t.kind === "signal" ? "a description" : "a name"}.`, variant: "destructive" });
      return;
    }
    if (!id) {
      toast({ title: "Almost there", description: "It needs an id (lowercase letters, digits and hyphens).", variant: "destructive" });
      return;
    }
    if (editing.isNew && rows.some((r) => r.id === id)) {
      toast({ title: "That id is taken", description: `Another ${t.one} already uses "${id}".`, variant: "destructive" });
      return;
    }
    const { id: _id, isPublished, sortOrder, updatedByName, updatedAt, ...body } = item;
    if (await run(() => saveContent(token!, t.kind, id, body), editing.isNew ? `Added: ${t.titleOf(item)}` : "Saved")) close();
  };

  if (editing) {
    const { tab: t, item } = editing;
    const Fields = FIELDS[t.kind];
    const set = (patch: Item) =>
      setEditing((e) => {
        if (!e) return e;
        const next = { ...e.item, ...patch };
        // A new item's id follows its name until someone edits the id itself.
        const id = e.isNew && !e.idTouched && t.kind !== "club" ? slugify(next.title || next.name || next.value || "") : e.id;
        return { ...e, item: next, id };
      });
    return (
      <div className="page-shell lx">
        <PageHero kind="tool" eyebrow={`Site content / ${t.label}`} title={editing.isNew ? `Add a ${t.one}` : `Edit: ${t.titleOf(item) || t.one}`} description={editing.isNew ? "It goes on the site as soon as it's added." : "Changes appear on the site within a minute of saving."} />
        <div className="form-shell fm">
          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <Fields item={item} set={set} token={token!} />
            {editing.isNew && t.kind !== "club" && (
              <Section title="Its id" hint={t.kind === "program" ? "Part of the program's address, /programs/<id>. It can't be changed later." : "Used in links. It can't be changed later."}>
                <Text id="slug" label="Id *" value={editing.id} onChange={(v) => setEditing((e) => e && { ...e, id: slugify(v), idTouched: true })} />
              </Section>
            )}
            <div>
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : editing.isNew ? `Add the ${t.one}` : "Save changes"}</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell lx mg">
      <PageHero
        kind="tool"
        eyebrow="Site content"
        title="Edit the site"
        description="Programs, funded ventures, wings, the home page's Signals and the club's own text. Changes appear on the site within a minute."
        backLink={{ label: "Home", to: "/" }}
      >
        <div className="lx-gate-actions">
          <Link to="/announcements/new" className="lx-cta">Post an announcement ↗</Link>
          <Link to="/stories/new" className="lx-textbtn">Write up a story ↗</Link>
        </div>
      </PageHero>
      <section className="lx-section">
        <div className="mg-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={t.key === tabKey} className={t.key === tabKey ? "is-on" : ""} onClick={() => setTabKey(t.key)}>
              {t.label}
              {content && t.key !== "club" && <small>{content[t.key].length}</small>}
            </button>
          ))}
        </div>

        {failed ? (
          <div className="lx-empty"><strong>Couldn't load the content</strong>{failed}<button type="button" className="lx-cta" onClick={reload}>Try again ↗</button></div>
        ) : !content ? (
          <div className="lx-loading">Loading the content</div>
        ) : (
          <>
            <ol className="mg-list">
              {rows.map((row, i) => (
                <li key={row.id} className={row.isPublished ? "" : "is-hidden"}>
                  <span className="mg-no">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mg-what">
                    <b>{tab.titleOf(row)}</b>
                    <small>{[tab.metaOf(row), !row.isPublished && "Hidden", row.updatedByName && `Last edited by ${row.updatedByName}`].filter(Boolean).join(" · ")}</small>
                  </div>
                  <div className="mg-actions">
                    {tab.key !== "club" && (
                      <>
                        <button type="button" aria-label="Move up" disabled={busy || i === 0} onClick={() => move(i, -1)}><ArrowUp size={15} /></button>
                        <button type="button" aria-label="Move down" disabled={busy || i === rows.length - 1} onClick={() => move(i, 1)}><ArrowDown size={15} /></button>
                        <button type="button" disabled={busy} onClick={() => run(() => setContentPublished(token!, tab.kind, row.id, !row.isPublished), row.isPublished ? "Hidden from the site" : "Back on the site")}>
                          {row.isPublished ? "Hide" : "Show"}
                        </button>
                      </>
                    )}
                    <button type="button" className="is-main" onClick={() => open(tab, row)}>Edit</button>
                  </div>
                </li>
              ))}
            </ol>
            {tab.key !== "club" ? (
              <Button type="button" variant="outline" onClick={() => open(tab)}><Plus size={16} /> Add a {tab.one}</Button>
            ) : !rows.length && (
              <Button type="button" variant="outline" onClick={() => open(tab)}><Plus size={16} /> Write the club's text</Button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ManageContent;
