import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Handshake, TrendingUp, Award } from "lucide-react";

const Sponsor = () => {
  const benefits = [
    { icon: Handshake, title: "Talent Pipeline", description: "Connect with top students and graduates" },
    { icon: TrendingUp, title: "Research Partnerships", description: "Collaborate on cutting-edge projects" },
    { icon: Award, title: "Brand Recognition", description: "Showcase your commitment to education" },
    { icon: Building2, title: "Campus Events", description: "Host recruiting and networking events" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Company Sponsor Portal</h1>
          <p className="text-lg text-muted-foreground">Partner with CMIS to shape the future workforce.</p>
        </div>

        <Card className="mb-8 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl">Partnership Opportunities</CardTitle>
            <CardDescription>Invest in tomorrow's leaders today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Join our network of industry partners and gain access to exceptional talent, 
              innovative research opportunities, and meaningful engagement with the CMIS community.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">Become a Sponsor</Button>
              <Button size="lg" variant="outline">Download Partnership Guide</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">50+</CardTitle>
              <CardDescription>Corporate Partners</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">2,000+</CardTitle>
              <CardDescription>Student Placements Annually</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">95%</CardTitle>
              <CardDescription>Graduate Employment Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Sponsor;
