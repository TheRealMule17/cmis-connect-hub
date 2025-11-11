import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            About CMIS
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Council of Management Information Systems (CMIS) is dedicated to connecting students, alumni, faculty, and industry partners in the field of management information systems.
              </p>
              <p>
                We provide a comprehensive platform for networking, mentorship, professional development, and collaboration opportunities that bridge academic learning with real-world industry experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Students</h3>
                <p>Access to events, networking opportunities, mentorship programs, job tracking, and skill development resources.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Alumni</h3>
                <p>Mentorship opportunities, career networking, giving back programs, and staying connected with the community.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Faculty</h3>
                <p>Event management tools, analytics dashboards, research collaboration, and student engagement tracking.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Industry Sponsors</h3>
                <p>Recruitment opportunities, event sponsorship, speaking engagements, and talent pipeline development.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
