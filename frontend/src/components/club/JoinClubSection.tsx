import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, Mail } from "lucide-react";

interface JoinClubSectionProps {
  onApplyNow: () => void;
}

const benefits = [
  "Access to industry mentors and experts",
  "Funding opportunities and investor connects",
  "Practical entrepreneurship experience",
  "Strong alumni and industry network",
  "Leadership and teamwork skills development",
];

const steps = [
  {
    title: "Fill Registration Form",
    description: "Complete our online registration with your interests",
  },
  {
    title: "Attend Orientation",
    description: "Join our monthly orientation session",
  },
  {
    title: "Choose Your Wing",
    description: "Select the wing that matches your interests",
  },
  {
    title: "Start Your Journey",
    description: "Begin participating in programs and events",
  },
];

export function JoinClubSection({ onApplyNow }: JoinClubSectionProps) {
  return (
    <article className="overflow-hidden rounded-vj-large border border-vj-border bg-vj-surface shadow-[var(--vj-shadow-subtle)] animate-fade-in-up">
      <header className="border-b border-vj-border bg-gradient-to-r from-vj-neutral to-vj-surface p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-vj-primary">Join VJ Startups Club</h2>
        <p className="mt-2 text-vj-muted">
          Be part of VNRVJIET's most dynamic entrepreneurship community
        </p>
      </header>

      <div className="p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-5 font-semibold text-vj-primary">Why Join Us?</h3>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 rounded-vj-button p-2 transition-colors hover:bg-vj-neutral/60">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-vj-primary">How to Join</h3>
            <div className="relative space-y-5">
              <div className="absolute left-3 top-3 bottom-3 w-px bg-vj-border" aria-hidden="true" />
              {steps.map((step, index) => (
                <div key={step.title} className="relative flex items-start gap-4 pl-1">
                  <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vj-accent text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-vj-primary">{step.title}</p>
                    <p className="mt-0.5 text-xs text-vj-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="text-center">
          <h3 className="mb-5 font-semibold text-vj-primary">
            Ready to Start Your Entrepreneurial Journey?
          </h3>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="min-h-[44px] rounded-vj-button px-8"
              onClick={onApplyNow}
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Apply Now
            </Button>
            <Button variant="outline" size="lg" className="min-h-[44px] rounded-vj-button px-8">
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Attend Next Meetup
            </Button>
          </div>

          <p className="mt-6 text-sm text-vj-muted">
            Have questions? Contact us at{" "}
            <a
              href="mailto:head.iie+questions@vnrvjiet.in"
              className="text-vj-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vj-accent"
            >
              head.iie+questions@vnrvjiet.in
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
