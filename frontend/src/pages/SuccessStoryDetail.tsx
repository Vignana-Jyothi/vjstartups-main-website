import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, ExternalLink, Calendar, Users, Trophy, Quote, Play, Instagram } from "lucide-react";
import { getSuccessStoryById } from "@/data/successStories";
import { startupPrograms } from "@/data/startupPrograms";

const SuccessStoryDetail = () => {
  const { programId, storyId } = useParams();
  
  if (!programId || !storyId) {
    return <div>Story not found</div>;
  }

  const story = getSuccessStoryById(storyId);
  const program = startupPrograms.find(p => p.id === programId);

  if (!story || !program) {
    return <div>Story not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/programs/${programId}/success-stories`} 
            className="inline-flex items-center gap-2 text-problem-primary hover:text-problem-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Success Stories
          </Link>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-sm">
                  {program.title} • {story.season}
                </Badge>
                {story.featured && (
                  <Badge variant="default" className="text-sm bg-yellow-500 text-yellow-50">
                    Featured Story
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-vj-primary mb-2">{story.title}</h1>
              <p className="text-xl text-vj-muted mb-4">{story.subtitle}</p>
              
              <div className="flex items-center gap-6 text-sm text-vj-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(story.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {story.participants.length} Team Members
                </span>
              </div>
            </div>
            
            {story.pdfUrl && (
              <Button variant="outline" asChild className="ml-4">
                <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {story.overview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Story Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-vj-muted leading-relaxed text-lg">{story.overview}</p>
                </CardContent>
              </Card>
            )}

            {/* Journey Timeline */}
            {story.journey && story.journey.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Journey Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {story.journey.map((phase, index) => (
                      <div key={index} className="relative">
                        {index < story.journey!.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-16 bg-problem-primary/20"></div>
                        )}
                        
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-problem-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-vj-primary mb-1">{phase.phase}</h4>
                            <p className="text-vj-muted mb-2">{phase.description}</p>
                            {phase.achievement && (
                              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                                  ✅ {phase.achievement}
                                </p>
                              </div>
                            )}
                            {phase.imageUrl && (
                              <img 
                                src={phase.imageUrl} 
                                alt={phase.phase}
                                className="mt-3 rounded-lg w-full max-w-md"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Outcomes */}
            {story.outcomes && story.outcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Outcomes & Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {story.outcomes.map((outcome, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-vj-primary mb-2">{outcome.title}</h4>
                        <p className="text-vj-muted text-sm mb-2">{outcome.description}</p>
                        {outcome.metrics && (
                          <div className="text-problem-primary font-bold text-lg">
                            {outcome.metrics}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quotes */}
            {story.quotes && story.quotes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5" />
                    What the Team Says
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {story.quotes.map((quote, index) => (
                      <div key={index} className="border-l-4 border-problem-primary pl-4">
                        <blockquote className="text-vj-muted italic text-lg mb-3">
                          "{quote.text}"
                        </blockquote>
                        <div className="text-sm">
                          <div className="font-semibold text-vj-primary">{quote.author}</div>
                          <div className="text-vj-muted">{quote.designation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {story.gallery && story.gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {story.gallery.map((media, index) => (
                      <div key={index} className="group">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt={media.caption || `Gallery image ${index + 1}`}
                            className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <a 
                            href={media.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block relative bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center group cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="text-center">
                              <Play className="h-12 w-12 text-problem-primary mx-auto mb-2" />
                              <p className="text-sm text-vj-primary font-medium">Click to watch video</p>
                            </div>
                            <div className="absolute inset-0 bg-black/5 rounded-lg group-hover:bg-black/10 transition-colors"></div>
                          </a>
                        )}
                        {media.caption && (
                          <p className="text-sm text-vj-muted mt-2">{media.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {story.participants.map((participant, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {participant.imageUrl ? (
                        <img 
                          src={participant.imageUrl} 
                          alt={participant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-problem-primary/10 flex items-center justify-center">
                          <span className="text-problem-primary font-semibold text-lg">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="font-semibold text-vj-primary">{participant.name}</div>
                        <div className="text-sm text-vj-muted">{participant.branch} • {participant.year}</div>
                        {participant.role && (
                          <div className="text-xs text-problem-primary font-medium">{participant.role}</div>
                        )}
                        
                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {participant.linkedinUrl && (
                            <a 
                              href={participant.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              LinkedIn
                            </a>
                          )}
                          {participant.instagramUrl && (
                            <a 
                              href={participant.instagramUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-pink-600 hover:text-pink-800 flex items-center gap-1"
                            >
                              <Instagram className="h-3 w-3" />
                              Instagram
                            </a>
                          )}
                          {participant.socialLinks && participant.socialLinks.map((link, linkIndex) => (
                            <a 
                              key={linkIndex}
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {link.displayName || link.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {story.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-vj-muted">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Actions */}
            <Card className="bg-gradient-to-br from-problem-primary/5 to-idea-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-vj-primary mb-3">Get Inspired?</h3>
                <p className="text-sm text-vj-muted mb-4">
                  Join the {program.title} program and create your own success story.
                </p>
                <div className="space-y-2">
                  <Button asChild size="sm" className="w-full bg-problem-primary hover:bg-problem-primary/90">
                    <Link to={`/programs/${programId}`}>
                      Join {program.title}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/programs/${programId}/success-stories`}>
                      More Success Stories
                    </Link>
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

export default SuccessStoryDetail;
