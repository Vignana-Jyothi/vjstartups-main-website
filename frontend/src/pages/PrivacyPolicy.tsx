import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
          >
            <Button variant="ghost" className="text-gray-700 dark:text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="p-6 md:p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium">VJ Startups</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: March 6, 2026</p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This policy explains how VJ Startups collects, uses, and protects information when you use
            the platform to submit problems, ideas, startup updates, and stage progress.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Account details from Google sign-in (name, email, profile image).</li>
              <li>Content you submit, including problems, ideas, startups, and comments.</li>
              <li>Journey activity such as unlocked stages, progress status, and leaderboard participation.</li>
              <li>Technical usage data like logs and local storage state used for app functionality.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. How We Use Data</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Authenticate accounts and personalize your learning journey.</li>
              <li>Display community progress feeds, idea changes, and leaderboard rankings.</li>
              <li>Operate, secure, and improve platform features and moderation workflows.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Visibility of Your Contributions</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Some profile details and submitted content may be visible to other users in community pages,
              recent changes, and idea detail views. Share only what you are comfortable making visible.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Data Sharing</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>We do not sell your personal data.</li>
              <li>
                Data may be processed by trusted providers needed for sign-in, hosting, storage, and analytics.
              </li>
              <li>We may disclose information when required by law or to protect platform safety.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Retention & Your Choices</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We keep data for as long as needed to run the platform and maintain operational records. You can
              request profile or content updates/removal through the VJ Startups coordinators listed on the Club page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Security</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use reasonable safeguards to protect information, but no online system can guarantee absolute security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Policy Updates</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This policy may be updated as the platform evolves. Material updates will be reflected with a revised
              "Last updated" date on this page.
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            For platform rules and participation responsibilities, see the <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
