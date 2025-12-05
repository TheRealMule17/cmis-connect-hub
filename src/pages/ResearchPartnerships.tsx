import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Lightbulb, FlaskConical, FileText, CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ResearchPartnerships = () => {
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(false);

  const { data: researchProjects } = useQuery({
    queryKey: ["research_collaborations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_collaborations")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const researchAreas = [
    {
      title: "Data Analytics & AI",
      description: "Collaborate on machine learning, predictive analytics, and AI-driven business solutions.",
      icon: Lightbulb,
    },
    {
      title: "Cybersecurity",
      description: "Partner on security research, threat detection, and risk management frameworks.",
      icon: FlaskConical,
    },
    {
      title: "Digital Transformation",
      description: "Explore enterprise systems, cloud computing, and digital strategy initiatives.",
      icon: TrendingUp,
    },
    {
      title: "Business Intelligence",
      description: "Develop visualization tools, reporting systems, and data-driven decision frameworks.",
      icon: FileText,
    },
  ];

  const benefits = [
    "Access to faculty expertise and graduate researchers",
    "State-of-the-art lab facilities and computing resources",
    "Joint publication and intellectual property opportunities",
    "Student project teams for applied research",
    "Grant co-funding and collaborative proposals",
    "Advisory board participation",
  ];

  const partnershipModels = [
    {
      title: "Sponsored Research",
      description: "Fund specific research projects aligned with your strategic interests",
      investment: "Starting at $25,000",
    },
    {
      title: "Research Consortium",
      description: "Join industry peers in multi-stakeholder research initiatives",
      investment: "Annual membership",
    },
    {
      title: "Graduate Fellowship",
      description: "Sponsor graduate students working on industry-relevant research",
      investment: "Starting at $15,000",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ScrollFadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Research Partnerships</h1>
                <p className="text-lg text-muted-foreground">Collaborate on cutting-edge projects</p>
              </div>
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.1}>
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">Driving Innovation Together</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Our research partnerships bridge academia and industry, creating practical solutions 
                to real-world challenges. Partner with our faculty and students to explore emerging 
                technologies, validate concepts, and develop competitive advantages.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.2}>
          <h2 className="text-2xl font-bold mb-4">Research Focus Areas</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {researchAreas.map((area) => (
              <Card key={area.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <area.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{area.title}</CardTitle>
                      <CardDescription className="mt-1">{area.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.3}>
          <h2 className="text-2xl font-bold mb-4">Partnership Models</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {partnershipModels.map((model) => (
              <Card key={model.title}>
                <CardHeader>
                  <CardTitle>{model.title}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">{model.investment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.4}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Start a Research Collaboration</CardTitle>
              <CardDescription>Connect with our research office to explore partnership opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate("/contact")}>Contact Research Office</Button>
                <Button 
                  size="lg" 
                  variant={showProjects ? "secondary" : "outline"}
                  onClick={() => setShowProjects(!showProjects)}
                >
                  {showProjects ? "Hide Projects" : "View Current Projects"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>

        {showProjects && (
          <ScrollFadeIn>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Current Research Opportunities</h2>
              {researchProjects && researchProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {researchProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            {project.research_area && (
                              <Badge variant="secondary" className="mt-2">{project.research_area}</Badge>
                            )}
                          </div>
                          {project.collaboration_type && (
                            <Badge variant="outline">{project.collaboration_type}</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {project.description && (
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        )}
                        {project.requirements && (
                          <div>
                            <p className="text-sm font-medium">Requirements:</p>
                            <p className="text-sm text-muted-foreground">{project.requirements}</p>
                          </div>
                        )}
                        {project.seeking_roles && project.seeking_roles.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Seeking:</span>
                            {project.seeking_roles.map((role: string) => (
                              <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No research opportunities currently available. Check back soon or contact us to discuss potential collaborations.
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollFadeIn>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResearchPartnerships;
