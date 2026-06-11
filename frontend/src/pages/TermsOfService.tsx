import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">VJ Startups</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: March 6, 2026</p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            These terms govern your use of the VJ Startups platform for collaboration, startup ideation,
            and progress tracking.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Using the Platform</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Use your account responsibly and keep your login access secure.</li>
              <li>Provide accurate information in submissions and profile details.</li>
              <li>Follow campus, community, and applicable legal standards while participating.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Your Content</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You retain ownership of your submitted ideas and materials. By posting content, you grant VJ Startups
              a non-exclusive right to host, display, and process that content for platform operations, community
              collaboration, and program communication.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Acceptable Conduct</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>No abusive, hateful, illegal, or misleading submissions.</li>
              <li>No impersonation, spam, or attempts to disrupt platform operations.</li>
              <li>No unauthorized scraping or misuse of other users' data/content.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Programs, Rankings, and Outcomes</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Journey scores, stage unlocks, and leaderboard positions are for learning and engagement. They do not
              guarantee funding, incubation, selection, employment, or specific business outcomes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Moderation and Access</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To protect the community, VJ Startups may review content, remove policy-violating submissions,
              or limit account access when misuse is detected.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Service Availability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The platform is provided on an "as available" basis. Features may change, pause, or be improved over time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Changes to These Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these terms as programs and product features evolve. Continued use after updates
              means you accept the revised terms.
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            For information on data handling, see the <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
