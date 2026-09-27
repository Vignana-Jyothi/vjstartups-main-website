import { useState } from "react";
import { SheetTeamMember } from "@/types/sheetTeamMember";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  member: SheetTeamMember;
  variant?: "master" | "core";
}

const OPEN_ROLE = /^(tbd|to be hired|to be decided)$/i;

function initials(name: string) {
  const words = name
    .replace(/^(mr|ms|mrs|dr)\.?\s*/i, "")
    .split(/[\s.]+/)
    .filter(Boolean);
  return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("") || "?";
}

function MemberAvatar({ member, isOpen }: { member: SheetTeamMember; isOpen: boolean }) {
  const [failed, setFailed] = useState(false);

  if (member.imageUrl && !failed) {
    return (
      <div className="cl-avatar">
        <img src={member.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <div className="cl-avatar" aria-hidden="true">
      {isOpen ? "+" : initials(member.name)}
    </div>
  );
}

export function TeamMemberCard({ member, variant = "core" }: TeamMemberCardProps) {
  const isOpen = OPEN_ROLE.test(member.name.trim());
  const meta = [member.branch, member.year].filter(Boolean).join(" / ");
  const links = [
    member.email && { href: `mailto:${member.email}`, label: "Email", aria: `Email ${member.name}` },
    member.phone && { href: `tel:${member.phone}`, label: "Call", aria: `Call ${member.name}` },
    member.linkedinUrl && { href: member.linkedinUrl, label: "LinkedIn", aria: `LinkedIn profile of ${member.name}` },
  ].filter(Boolean) as { href: string; label: string; aria: string }[];

  return (
    <article className={cn("cl-member", variant === "master" && "is-master", isOpen && "is-open")}>
      <MemberAvatar member={member} isOpen={isOpen} />
      <div className="cl-member-body">
        <h3>{isOpen ? "Open role" : member.name}</h3>
        <p className="cl-member-role">{member.role}</p>
        {meta && !isOpen && <p className="cl-member-meta">{meta}</p>}
        {links.length > 0 && (
          <div className="cl-member-links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.aria}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
