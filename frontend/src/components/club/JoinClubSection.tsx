interface JoinClubSectionProps {
  onMeetTeam: () => void;
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

const APPLY_HREF = `mailto:head.iie@vnrvjiet.in?subject=${encodeURIComponent("Joining VJ Startups Club")}`;
const COMMUNITY_HREF = "https://chat.whatsapp.com/IBfChZgpT8qJoHKbBWMvqA";

export function JoinClubSection({ onMeetTeam }: JoinClubSectionProps) {
  return (
    <>
      <section className="lx-block">
        <div className="lx-sec-head">
          <span>Be part of VNRVJIET's most dynamic entrepreneurship community</span>
          <h2>Join VJ Startups Club</h2>
        </div>

        <div className="lx-pair">
          <div className="lx-field">
            <h3>Why join us</h3>
            <ul className="lx-list">
              {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
          </div>

          <div className="lx-field">
            <h3>How to join</h3>
            <ol className="lx-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="lx-gate">
        <span>Your move</span>
        <h2>Ready to <em>start?</em></h2>
        <p>
          Write to the innovation cell to join, or say hello in the community chat first. Questions go to{" "}
          <a href="mailto:head.iie+questions@vnrvjiet.in">head.iie+questions@vnrvjiet.in</a>.
        </p>
        <div className="lx-gate-actions">
          <a href={APPLY_HREF} className="lx-cta">Apply to join ↗</a>
          <a href={COMMUNITY_HREF} target="_blank" rel="noopener noreferrer" className="lx-textbtn">
            Community chat ↗
          </a>
          <button type="button" className="lx-textbtn" onClick={onMeetTeam}>
            Meet the team ↗
          </button>
        </div>
      </div>
    </>
  );
}
