import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { SheetTeamMember } from "@/types/sheetTeamMember";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  member: SheetTeamMember;
  variant?: "master" | "core";
}

function MemberAvatar({ member, size }: { member: SheetTeamMember; size: "lg" | "md" }) {
  const sizeClass = size === "lg" ? "h-24 w-24 text-2xl" : "h-16 w-16 text-base";

  if (member.imageUrl) {
    return (
      <div className={cn("shrink-0 rounded-full overflow-hidden", sizeClass)}>
        <img
          src={member.imageUrl}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 rounded-full ring-1 ring-[hsl(var(--vj-accent))/0.08]" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center rounded-full bg-[hsl(var(--vj-accent))] font-bold text-white"
      )}
      aria-hidden="true"
    >
      {member.name.charAt(0)}
    </div>
  );
}

function SocialLink({
  href,
  label,
  text,
  icon: Icon,
  className,
}: {
  href: string;
  label: string;
  text: string;
  icon: typeof Mail;
  className?: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-vj-button px-3 py-2 text-sm bg-transparent border border-vj-border text-[hsl(var(--foreground))] hover:bg-[hsl(var(--vj-accent))/0.06] hover:border-[hsl(var(--vj-accent))/0.12] transition-colors",
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-[hsl(var(--foreground))]" aria-hidden="true" />
      <span>{text}</span>
    </a>
  );
}

export function TeamMemberCard({ member, variant = "core" }: TeamMemberCardProps) {
  const isMaster = variant === "master";

  return (
    <article
      className={cn(
        "vj-card flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--vj-shadow-card)]",
        isMaster && "relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(217,92,59,0.06),transparent)] before:opacity-90"
      )}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <MemberAvatar member={member} size={isMaster ? "lg" : "md"} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-[hsl(var(--foreground))] text-lg">{member.name}</h3>
          <div className="mt-2 flex items-start gap-2">
            <Badge variant={isMaster ? "default" : "secondary"} className="whitespace-normal text-sm">
              {member.role}
            </Badge>
            {member.branch && member.year && (
              <p className="mt-0.5 text-sm text-[hsl(var(--text-muted))]">
                {member.branch} • {member.year}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
        {member.email && (
          <SocialLink
            href={`mailto:${member.email}`} 
            label={`Email ${member.name}`} 
            text="Email" 
            icon={Mail}
          />
        )}
        {member.phone && (
          <SocialLink
            href={`tel:${member.phone}`} 
            label={`Call ${member.name}`} 
            text="Call" 
            icon={Phone}
            className="text-green-500"
          />
        )}
        {member.linkedinUrl && (
          <SocialLink
            href={member.linkedinUrl}
            label={`LinkedIn profile of ${member.name}`}
            text="LinkedIn"
            icon={ExternalLink}
          />
        )}
      </div>
    </article>
  );
}
