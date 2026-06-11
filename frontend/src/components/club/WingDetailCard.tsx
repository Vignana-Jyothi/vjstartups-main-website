import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Award,
  Building,
  CheckCircle,
  Mail,
  Rocket,
  Star,
  TrendingUp,
} from "lucide-react";
import { Wing } from "@/data/clubInfo";
import { cn } from "@/lib/utils";

interface WingDetailCardProps {
  wing: Wing;
  index: number;
  className?: string;
}

export function WingDetailCard({ wing, index, className }: WingDetailCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-vj-large border border-vj-border bg-vj-surface shadow-[var(--vj-shadow-subtle)] transition-shadow duration-300 hover:shadow-[var(--vj-shadow-card)] animate-fade-in-up",
        className
      )}
    >
      <header className="border-b border-vj-border bg-gradient-to-r from-vj-neutral to-vj-surface p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-vj-primary md:text-2xl">{wing.name}</h2>
            <p className="mt-2 text-base text-vj-muted md:text-lg">{wing.description}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 self-start">
            Wing {index + 1}
          </Badge>
        </div>
      </header>

      <div className="space-y-8 p-6 md:p-8">
        <div>
          <h3 className="mb-2 font-semibold text-vj-primary">Purpose</h3>
          <p className="leading-relaxed text-vj-muted">{wing.purpose}</p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-vj-primary">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {wing.focusAreas.map((area, areaIndex) => (
              <span
                key={areaIndex}
                className="inline-flex items-center gap-1.5 rounded-full border border-vj-border bg-vj-neutral px-3 py-1.5 text-sm text-vj-muted"
              >
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" aria-hidden="true" />
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {wing.achievements && (
            <div className="rounded-vj-large border border-vj-border bg-vj-neutral/50 p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-vj-primary">
                <Award className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                Key Achievements
              </h3>
              <ul className="space-y-2">
                {wing.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-2 text-sm text-vj-muted">
                    <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" aria-hidden="true" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {wing.currentProjects && (
            <div className="rounded-vj-large border border-vj-border bg-vj-neutral/50 p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-vj-primary">
                <Rocket className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Current Projects
              </h3>
              <ul className="space-y-2">
                {wing.currentProjects.map((project, projIndex) => (
                  <li key={projIndex} className="flex items-start gap-2 text-sm text-vj-muted">
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" aria-hidden="true" />
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-vj-large border border-vj-accent/20 bg-vj-accent-light/50 p-5">
          <h3 className="mb-2 font-semibold text-vj-primary">Contact This Wing</h3>
          <a
            href={`mailto:${wing.contactEmail}`}
            className="inline-flex min-h-[44px] items-center gap-2 break-all text-sm text-vj-accent transition-colors hover:text-vj-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vj-accent focus-visible:ring-offset-2"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            {wing.contactEmail}
          </a>
        </div>

        {wing.subWings && wing.subWings.length > 0 && (
          <div>
            <Separator className="mb-6" />
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="sub-wings" className="border-none">
                <AccordionTrigger className="rounded-vj-button px-4 py-3 hover:bg-vj-neutral hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    <span className="font-semibold text-vj-primary">
                      Program Sub-Wings ({wing.subWings.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="mt-2 grid gap-4">
                    {wing.subWings.map((subWing) => (
                      <div
                        key={subWing.id}
                        className="rounded-vj-large border border-vj-border bg-vj-neutral/40 p-5"
                      >
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h4 className="font-medium text-vj-primary">{subWing.name}</h4>
                            <p className="mt-1 text-sm text-vj-muted">{subWing.description}</p>
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <Badge variant={subWing.status === "active" ? "default" : "secondary"} className="text-xs">
                              {subWing.status}
                            </Badge>
                            {subWing.edition && (
                              <Badge variant="outline" className="text-xs">
                                Season {subWing.edition}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-4 text-sm md:grid-cols-2">
                          <div>
                            <span className="font-medium text-vj-primary">Team Lead:</span>
                            <div className="mt-1 text-vj-muted">
                              {subWing.teamLead.name} - {subWing.teamLead.role}
                              <br />
                              <span className="text-xs">
                                {subWing.teamLead.branch}, {subWing.teamLead.year}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-vj-primary">Team Size:</span>
                            <div className="mt-1 text-vj-muted">{subWing.team.length + 1} members</div>

                            {subWing.currentActivity && (
                              <div className="mt-2">
                                <span className="font-medium text-vj-primary">Current Activity:</span>
                                <div className="mt-1 text-xs text-vj-muted">{subWing.currentActivity}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {subWing.achievements && subWing.achievements.length > 0 && (
                          <div className="mt-4 border-t border-vj-border pt-4">
                            <span className="text-xs font-medium text-vj-primary">Key Achievements:</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {subWing.achievements.slice(0, 2).map((achievement, achIdx) => (
                                <span
                                  key={achIdx}
                                  className="rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                >
                                  {achievement}
                                </span>
                              ))}
                              {subWing.achievements.length > 2 && (
                                <span className="text-xs text-vj-muted">
                                  +{subWing.achievements.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 border-t border-vj-border pt-4">
                          <a
                            href={`mailto:${subWing.contactEmail}`}
                            className="inline-flex min-h-[44px] items-center gap-2 break-all text-xs text-vj-muted transition-colors hover:text-vj-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vj-accent"
                          >
                            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {subWing.contactEmail}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </article>
  );
}
