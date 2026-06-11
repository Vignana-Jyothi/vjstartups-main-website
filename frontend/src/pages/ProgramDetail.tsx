import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/design-system/PageHero";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  Mail,
  User,
  Clock,
  Target,
  Lightbulb,
  Award,
  BookOpen,
  MessageSquare,
  Trophy,
  ExternalLink,
  FileText,
  Phone
} from "lucide-react";
import { startupPrograms } from "@/data/startupPrograms";
import { getSuccessStoriesByProgram } from "@/data/successStories";

const ProgramDetail = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const program = startupPrograms.find(p => p.id === id);
  const successStories = program ? getSuccessStoriesByProgram(program.id) : [];

  useEffect(() => {
    if (!program) {
      return;
    }

    const queryTab = new URLSearchParams(location.search).get("tab");
    const hash = location.hash.replace("#", "").toLowerCase();
    const shouldOpenMentors =
      Boolean(program.mentors) &&
      (queryTab === "mentors" || hash === "mentors" || hash === "faculty-mentor-panel");

    if (shouldOpenMentors) {
      setActiveTab("mentors");
    }
  }, [location.search, location.hash, program]);

  useEffect(() => {
    if (activeTab !== "mentors") {
      return;
    }

    const hash = location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const element = document.getElementById(hash);
    if (!element) {
      return;
    }

    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeTab, location.hash]);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Program Not Found
          </h1>
          <Link to="/programs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'planned':
        return <Circle className="h-5 w-5 text-orange-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Currently Active';
      case 'completed':
        return 'Program Completed';
      case 'planned':
        return 'Coming Soon';
      default:
        return 'Status Unknown';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'challenge':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'internship':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'learning':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'networking':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'event':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'initiative':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Program detail"
        title={program.title}
        description={program.subtitle}
        backLink={{ label: "Programs", to: "/programs" }}
        stats={[
          { value: program.duration, label: "Duration", icon: Calendar },
          { value: program.category, label: "Category", icon: Users },
          { value: getStatusText(program.status), label: "Status", icon: PlayCircle },
        ]}
        primaryAction={{
          label: "Apply Now",
          variant: "default",
          onClick: () => program.mentors && setActiveTab("mentors"),
        }}
        backgroundClassName="bg-[hsl(var(--background-secondary))] relative min-h-[360px] md:min-h-[460px]"
      >
        {program.edition && (
          <div className="section-panel w-fit px-4 py-2 text-sm text-vj-muted">
            Edition #{program.edition}
          </div>
        )}
      </PageHero>

      {/* Content */}
      <div className="page-section">
        <div className="section-container px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participate">How to Join</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            {program.mentors && <TabsTrigger value="mentors">Mentors</TabsTrigger>}
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            {program.timeline && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
            <TabsTrigger value="success-stories" className="relative">
              Success Stories
              {successStories.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {successStories.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {program.overview}
                </p>
              </CardContent>
            </Card>

            {program.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="participate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How to Participate
                </CardTitle>
                <CardDescription>
                  Follow these steps to join the {program.title} program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {program.howToParticipate.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  What Support You'll Get
                </CardTitle>
                <CardDescription>
                  Comprehensive support system designed for your success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.support.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Program Benefits
                </CardTitle>
                <CardDescription>
                  What you'll gain from participating in this program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {program.timeline && (
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Program Timeline
                  </CardTitle>
                  <CardDescription>
                    Detailed schedule and milestones for the program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {program.timeline.map((phase, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-4">
                          <p className="text-gray-700 dark:text-gray-300">{phase}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {program.mentors && (
            <TabsContent value="mentors" className="space-y-6">
              <Card id="faculty-mentor-panel" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Faculty Mentor Panel
                  </CardTitle>
                  <CardDescription>
                    Connect with our experienced faculty mentors for personalized guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {program.mentors.map((mentor, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                              {mentor.name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {mentor.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {mentor.designation}
                              </p>
                              {mentor.department && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {mentor.department}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              {mentor.email && (
                                <div className="flex items-start gap-2">
                                  <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Email:
                                    </p>
                                    <a href={`mailto:${mentor.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                      {mentor.email}
                                    </a>
                                  </div>
                                </div>
                              )}
                              {mentor.expertise && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Expertise:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {mentor.expertise.map((skill, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {mentor.availability && (
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Availability:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {mentor.availability}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {mentor.location && (
                                <div className="flex items-start gap-2">
                                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Location:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {mentor.location}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {mentor.contact && (
                                <div className="flex items-start gap-2">
                                  <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      Phone:
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        {mentor.contact}
                                      </p>
                                      {mentor.whatsappNumber && (
                                        <a
                                          href={`https://wa.me/${mentor.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                          title="Send a message via WhatsApp"
                                        >
                                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.855 1.246l-.36-.187C4.88 6.039 3 5.142 3 3.238 3 1.535 4.582 0 6.5 0 8.418 0 10 1.535 10 3.238c0 .895-.37 1.73-.96 2.32l.147.358a9.872 9.872 0 011.568.333c.404.215.748.5 1.022.83.274.33.452.712.502 1.104m5.471 0h-.005a9.87 9.87 0 00-4.855 1.246l-.36-.187C13.109 6.039 11.231 5.142 11.231 3.238 11.231 1.535 12.813 0 14.731 0c1.917 0 3.5 1.535 3.5 3.238 0 .895-.37 1.73-.96 2.32l.147.358a9.872 9.872 0 011.568.333c.404.215.748.5 1.022.83.274.33.452.712.502 1.104"/>
                                          </svg>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {mentor.note && (
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
                                  <div className="flex items-start gap-3">
                                    <div className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                      ⚡
                                    </div>
                                    <div>
                                      <p className="font-semibold text-sm text-amber-900 dark:text-amber-200 mb-1">
                                        Important
                                      </p>
                                      <p className="text-sm text-amber-800 dark:text-amber-300">
                                        {mentor.note}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {mentor.resumeLink && (
                                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                                  <a 
                                    href={mentor.resumeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    <FileText className="h-4 w-4" />
                                    View Resume
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                          How to Schedule a Mentorship Session:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          <li>Choose a mentor based on your needs and their expertise</li>
                          <li>Contact them via WhatsApp/phone at least one day prior</li>
                          <li>Briefly explain your project and what guidance you need</li>
                          <li>Schedule an appointment during their available time slots</li>
                          <li>Prepare specific questions and materials for your session</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="success-stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Success Stories
                </CardTitle>
                <CardDescription>
                  Inspiring journeys and achievements from our program participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {successStories.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-vj-primary mb-2">Success Stories Coming Soon</h3>
                    <p className="text-vj-muted mb-4">
                      We're currently documenting the amazing achievements from this program.
                    </p>
                    <p className="text-sm text-vj-muted">
                      Be the first to create a success story by joining this program!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-vj-muted">
                        {successStories.length} success {successStories.length === 1 ? 'story' : 'stories'} from this program
                      </p>
                      <Button variant="outline" asChild size="sm">
                        <Link to={`/programs/${program.id}/success-stories`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View All Stories
                        </Link>
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {successStories.slice(0, 4).map((story) => (
                        <Card key={story.id} className="group hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {story.season}
                              </Badge>
                              {story.featured && (
                                <Badge variant="default" className="text-xs bg-yellow-500 text-yellow-50">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-base group-hover:text-problem-primary transition-colors">
                              {story.title}
                            </CardTitle>
                            <p className="text-sm text-vj-muted">{story.subtitle}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-xs text-vj-muted">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {story.participants.length} members
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(story.date).getFullYear()}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h5 className="text-xs font-semibold text-vj-primary">Key Achievements:</h5>
                                {story.achievements.slice(0, 2).map((achievement, index) => (
                                  <div key={index} className="text-xs text-vj-muted flex items-center gap-1">
                                    <Trophy className="h-3 w-3 text-yellow-500" />
                                    {achievement}
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between items-center pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {story.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button variant="ghost" size="sm" asChild className="h-7 px-2">
                                  <Link to={`/programs/${program.id}/success-stories/${story.id}`}>
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {successStories.length > 4 && (
                      <div className="text-center pt-4">
                        <Button asChild className="bg-problem-primary hover:bg-problem-primary/90">
                          <Link to={`/programs/${program.id}/success-stories`}>
                            View All {successStories.length} Success Stories
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Contact information for program coordination and queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email</p>
                        <p className="text-gray-600 dark:text-gray-300">{program.contact.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Coordinator</p>
                        <p className="text-gray-600 dark:text-gray-300">{program.contact.coordinator}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
