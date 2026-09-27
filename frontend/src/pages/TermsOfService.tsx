import { Link } from "react-router-dom";
import { PageHero } from "@/components/design-system/PageHero";
import "@/components/design-system/legal.css";

const TermsOfService = () => {
  return (
    <div className="page-shell legal">
      <PageHero
        kind="tool"
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated March 6, 2026. The terms for using VJ Startups for collaboration, startup ideation and progress tracking."
        backLink={{ label: "Home", to: "/" }}
        accent="violet"
      />
      <div className="legal-body">
        <article className="legal-doc">

          <p>
            These terms govern your use of the VJ Startups platform for collaboration, startup ideation,
            and progress tracking.
          </p>

          <section>
            <h2><span>01</span>Using the Platform</h2>
            <ul>
              <li>Use your account responsibly and keep your login access secure.</li>
              <li>Provide accurate information in submissions and profile details.</li>
              <li>Follow campus, community, and applicable legal standards while participating.</li>
            </ul>
          </section>

          <section>
            <h2><span>02</span>Your Content</h2>
            <p>
              You retain ownership of your submitted ideas and materials. By posting content, you grant VJ Startups
              a non-exclusive right to host, display, and process that content for platform operations, community
              collaboration, and program communication.
            </p>
          </section>

          <section>
            <h2><span>03</span>Acceptable Conduct</h2>
            <ul>
              <li>No abusive, hateful, illegal, or misleading submissions.</li>
              <li>No impersonation, spam, or attempts to disrupt platform operations.</li>
              <li>No unauthorized scraping or misuse of other users' data/content.</li>
            </ul>
          </section>

          <section>
            <h2><span>04</span>Programs, Rankings, and Outcomes</h2>
            <p>
              Journey scores, stage unlocks, and leaderboard positions are for learning and engagement. They do not
              guarantee funding, incubation, selection, employment, or specific business outcomes.
            </p>
          </section>

          <section>
            <h2><span>05</span>Moderation and Access</h2>
            <p>
              To protect the community, VJ Startups may review content, remove policy-violating submissions,
              or limit account access when misuse is detected.
            </p>
          </section>

          <section>
            <h2><span>06</span>Service Availability</h2>
            <p>
              The platform is provided on an "as available" basis. Features may change, pause, or be improved over time.
            </p>
          </section>

          <section>
            <h2><span>07</span>Changes to These Terms</h2>
            <p>
              We may update these terms as programs and product features evolve. Continued use after updates
              means you accept the revised terms.
            </p>
          </section>

          <p className="legal-foot">
            For information on data handling, see the <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
