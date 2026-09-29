import { Link } from "react-router-dom";
import { PageHero } from "@/components/design-system/PageHero";
import "@/components/design-system/legal.css";

const PrivacyPolicy = () => {
  return (
    <div className="page-shell legal">
      <PageHero
        kind="tool"
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated March 6, 2026. How VJ Startups collects, uses and protects information when you use the platform."
        backLink={{ label: "Home", to: "/" }}
        accent="violet"
      />
      <div className="legal-body">
        <article className="legal-doc">

          <p>
            This policy explains how VJ Startups collects, uses, and protects information when you use
            the platform to submit problems, ideas, startup updates, and stage progress.
          </p>

          <section>
            <h2><span>01</span>Information We Collect</h2>
            <ul>
              <li>Account details from Google sign-in (name, email, profile image).</li>
              <li>Content you submit, including problems, ideas, startups, and comments.</li>
              <li>Journey activity such as unlocked stages, progress status, and leaderboard participation.</li>
              <li>Technical usage data like logs and local storage state used for app functionality.</li>
            </ul>
          </section>

          <section>
            <h2><span>02</span>How We Use Data</h2>
            <ul>
              <li>Authenticate accounts and personalize your learning journey.</li>
              <li>Display community progress feeds, idea changes, and leaderboard rankings.</li>
              <li>Operate, secure, and improve platform features and moderation workflows.</li>
            </ul>
          </section>

          <section>
            <h2><span>03</span>Visibility of Your Contributions</h2>
            <p>
              Some profile details and submitted content may be visible to other users in community pages,
              recent changes, and idea detail views. Share only what you are comfortable making visible.
            </p>
          </section>

          <section>
            <h2><span>04</span>Data Sharing</h2>
            <ul>
              <li>We do not sell your personal data.</li>
              <li>
                Data may be processed by trusted providers needed for sign-in, hosting, storage, and analytics.
              </li>
              <li>We may disclose information when required by law or to protect platform safety.</li>
            </ul>
          </section>

          <section>
            <h2><span>05</span>Retention & Your Choices</h2>
            <p>
              We keep data for as long as needed to run the platform and maintain operational records. You can
              request profile or content updates/removal through the VJ Startups coordinators listed on the Club page.
            </p>
          </section>

          <section>
            <h2><span>06</span>Security</h2>
            <p>
              We use reasonable safeguards to protect information, but no online system can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2><span>07</span>Policy Updates</h2>
            <p>
              This policy may be updated as the platform evolves. Material updates will be reflected with a revised
              "Last updated" date on this page.
            </p>
          </section>

          <p className="legal-foot">
            For platform rules and participation responsibilities, see the <Link to="/terms">Terms of Service</Link>.
          </p>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
