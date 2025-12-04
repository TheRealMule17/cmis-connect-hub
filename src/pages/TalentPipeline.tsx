import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Briefcase, GraduationCap, Target, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TalentPipeline = () => {
  const navigate = useNavigate();

  const programs = [
    {
      title: "Internship Program",
      description: "Place your company's internship opportunities directly in front of our top-performing students.",
      features: ["Priority job board placement", "Resume database access", "On-campus recruiting events"],
    },
    {
      title: "Co-op Partnerships",
      description: "Establish long-term cooperative education partnerships with structured rotation programs.",
      features: ["Multi-semester placements", "Academic credit integration", "Dedicated coordinator support"],
    },
    {
      title: "Graduate Recruitment",
      description: "Connect with graduating seniors and graduate students ready to launch their careers.",
      features: ["Career fair participation", "Info session hosting", "Direct interview scheduling"],
    },
  ];

  const stats = [
    { value: "500+", label: "Students placed annually" },
    { value: "95%", label: "Placement satisfaction rate" },
    { value: "60+", label: "Partner companies" },
    { value: "85%", label: "Full-time conversion rate" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <Button variant="ghost" onClick={() => navigate("/sponsor")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sponsor Portal
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Talent Pipeline</h1>
              <p className="text-lg text-muted-foreground">Connect with top students and graduates</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl">Why Partner With Us?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our MIS program produces highly skilled graduates proficient in data analytics, 
              cybersecurity, business intelligence, and enterprise systems. By partnering with us, 
              you gain exclusive access to a pipeline of talent trained in the latest technologies 
              and business practices.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Early access to top-performing students</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Customized recruitment partnerships</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Resume and portfolio database access</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>On-campus interviewing facilities</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Recruitment Programs</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {programs.map((program) => (
            <Card key={program.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Build Your Talent Pipeline?</CardTitle>
            <CardDescription>Contact our corporate relations team to discuss partnership opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate("/contact")}>Contact Us</Button>
              <Button size="lg" variant="outline">Download Program Guide</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default TalentPipeline;
