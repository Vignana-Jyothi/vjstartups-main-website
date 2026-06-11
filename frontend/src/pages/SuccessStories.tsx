import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, Trophy } from "lucide-react";
import { getSuccessStoriesByProgram, startupPrograms } from "@/data/startupPrograms";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { PageHero } from "@/components/design-system/PageHero";

const SuccessStories = () => {
  const { programId } = useParams();
  
  if (!programId) {
    return <div>Program not found</div>;
  }

  const program = startupPrograms.find(p => p.id === programId);
  const successStories = getSuccessStoriesByProgram(programId);

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Success Stories"
        title="Success Stories"
        description={`${program.title} - Celebrating our achievers`}
        stats={[
          { value: String(successStories.length), label: 'Stories' },
          { value: String(successStories.reduce((acc, s) => acc + s.participants.length, 0)), label: 'Participants' },
        ]}
      />

      <div className="page-section">
        <div className="section-container">
          {successStories.length === 0 ? (
            <Card className="text-center py-12 vj-card-minimal">
              <CardContent>
                <Trophy className="h-16 w-16 text-[hsl(var(--text-muted))] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Success Stories Coming Soon</h3>
                <p className="text-[hsl(var(--text-muted))]">
                  We're currently documenting the amazing achievements from this program. Check back soon to read inspiring stories from our participants!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {successStories.map((story) => (
                <SuccessStoryCard key={story.id} story={story} programId={programId} />
              ))}
            </div>
          )}

          <div className="mt-12">
            <Card className="vj-card-minimal">
              <CardContent className="text-center py-8">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Want to Create Your Own Success Story?</h3>
                <p className="text-[hsl(var(--text-muted))] mb-4">
                  Join our {program.title} program and become part of VNRVJIET's innovation ecosystem.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild className="btn-primary">
                    <Link to={`/programs/${programId}`}>Learn More About {program.title}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/programs">Explore All Programs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
