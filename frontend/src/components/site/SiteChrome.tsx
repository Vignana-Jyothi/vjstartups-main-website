import { LogoMark } from "./LogoMark";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/pages/UserContext";
import { useSiteConfig } from "@/data/siteConfig";
import { useSiteContent } from "@/data/siteContent";
import "./site.css";

export const PLATFORM_LINKS = [
  ["Problems", "/problems"],
  ["Ideas", "/ideas"],
  ["Startups", "/startups"],
  ["Programs", "/programs"],
  ["Club", "/club"],
] as const;

export function Arrow() {
  return <span className="arrow">↗</span>;
}

export function Magnetic({ href, children, variant, className = "" }: { href: string; children: ReactNode; variant?: "ghost"; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handlers = {
    onMouseMove: (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || !ref.current) return;
      ref.current.style.setProperty("--tx", `${((e.clientX - r.left) / r.width - 0.5) * 11}px`);
      ref.current.style.setProperty("--ty", `${((e.clientY - r.top) / r.height - 0.5) * 11}px`);
    },
    onMouseLeave: () => {
      ref.current?.style.setProperty("--tx", "0px");
      ref.current?.style.setProperty("--ty", "0px");
    },
  };
  const cls = ["magnetic", variant, className].filter(Boolean).join(" ");
  if (href.startsWith("/")) return <Link ref={ref} to={href} className={cls} {...handlers}>{children}</Link>;
  return <a ref={ref} href={href} className={cls} {...handlers}>{children}</a>;
}

export function BrandMark({ href = "/" }: { href?: string }) {
  const content = <><LogoMark className="sc-logo" /><span className="sc-wordmark">Startups</span></>;
  if (href.startsWith("#")) return <a className="sc-brand" href={href} aria-label="VJ Startups">{content}</a>;
  return <Link className="sc-brand" to={href} aria-label="VJ Startups home">{content}</Link>;
}

function useAccount() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  // VJOS's admin page; set by PLANE_ADMIN_URL on the backend, no link when it isn't.
  const adminUrl = useSiteConfig()?.planeAdminUrl;
  const logout = () => {
    setUser(null);
    navigate("/login");
  };
  const roleLinks = <>
    {/* Site content, announcements and stories are all reached from /manage. */}
    {(user?.role === "wing_master" || user?.role === "admin") && <NavLink to="/manage">Manage</NavLink>}
    {user?.role === "admin" && adminUrl && <a href={adminUrl} target="_blank" rel="noopener noreferrer">Admin panel</a>}
  </>;
  return { user, logout, roleLinks };
}

const firstName = (name?: string) => (name || "").trim().split(/\s+/)[0] || "You";

export function SiteNav({ overlay = false, brandHref = "/" }: { overlay?: boolean; brandHref?: string }) {
  const { user, logout, roleLinks } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!overlay) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 90) setHidden(false);
      else if (y - lastY > 7) setHidden(true);
      else if (lastY - y > 7) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const cta = user ? "/journey" : "/login";
  const cls = ["sc-nav", overlay && "is-overlay", atTop && "is-top", hidden && !menuOpen && "is-hidden"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <nav className="sc-nav-inner" aria-label="Primary">
          <BrandMark href={brandHref} />
          <div className="sc-links">
            {PLATFORM_LINKS.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
            {roleLinks}
          </div>
          <div className="sc-right">
            <span className="sc-place">HYDERABAD / IN</span>
            {user ? (
              <>
                <span className="sc-user" title={user.email}>
                  {user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}
                  <span>{firstName(user.name)}</span>
                </span>
                <button className="sc-text" onClick={logout}>LOGOUT</button>
              </>
            ) : (
              <Link className="sc-text" to="/login">LOGIN</Link>
            )}
            <Magnetic href={cta} className="sc-pill"><span>Start building</span><Arrow /></Magnetic>
          </div>
          <button className="sc-menu" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}><span /><span /></button>
        </nav>
      </header>
      {menuOpen && (
        <div className="sc-sheet" onClick={(e) => { if ((e.target as HTMLElement).closest("a,button")) setMenuOpen(false); }}>
          <nav aria-label="Mobile">
            {PLATFORM_LINKS.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
            <NavLink to="/journey">Journey</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            {roleLinks}
          </nav>
          <div className="sc-sheet-foot">
            {user ? <button onClick={logout}>LOGOUT {firstName(user.name).toUpperCase()}</button> : <Link to="/login">LOGIN</Link>}
            <span>HYDERABAD / IN</span>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter({ tone, topHref }: { tone?: string; topHref?: string }) {
  // The program that lists faculty mentors (programs are edited at /manage).
  const mentors = useSiteContent().programs.find((p) => p.mentors?.length);
  return (
    <footer className="sc-footer" data-tone={tone}>
      <div className="sc-footer-word" aria-hidden="true"><span>VJ</span><i>STARTUPS</i></div>
      <div className="sc-footer-orbits" aria-hidden="true"><span /><span /><span /></div>
      <div className="sc-footer-grid">
        <div className="sc-footer-brand">
          <BrandMark />
          <p>Empowering college entrepreneurs to build the future.</p>
        </div>
        <div>
          <b>EXPLORE</b>
          {PLATFORM_LINKS.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
        </div>
        <div>
          <b>COMMUNITY</b>
          <Link to="/journey">Startup journey</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          {mentors && <Link to={`/programs/${mentors.id}?tab=mentors#faculty-mentor-panel`}>Mentor network</Link>}
          <Link to="/changes">What&apos;s new</Link>
        </div>
        <div>
          <b>CONNECT</b>
          <a href="https://www.instagram.com/vj.startups" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/company/vj-startups/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:head.iie@vnrvjiet.in">head.iie@vnrvjiet.in</a>
          <a href="mailto:kp@vjstartup.com?subject=Meeting%20Request">Schedule a meeting</a>
          <span>Hyderabad, IN 500090</span>
        </div>
      </div>
      <div className="sc-footer-bottom">
        <span>© {new Date().getFullYear()} VJ Startups</span>
        <span className="sc-footer-legal"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></span>
        {topHref
          ? <a href={topHref}>BACK TO TOP ↑</a>
          : <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO TOP ↑</a>}
      </div>
    </footer>
  );
}
