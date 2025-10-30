import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Heart, Briefcase } from "lucide-react";

const Alumni = () => {
  const features = [
    { icon: Users, title: "Alumni Network", description: "Connect with fellow graduates" },
    { icon: Calendar, title: "Events", description: "Upcoming reunions and gatherings" },
    { icon: Heart, title: "Give Back", description: "Support current students" },
    { icon: Briefcase, title: "Career Services", description: "Exclusive job opportunities" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Alumni Portal</h1>
          <p className="text-lg text-muted-foreground">Stay connected with your alma mater and fellow graduates.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Upcoming Alumni Event</CardTitle>
            <CardDescription className="text-primary-foreground/80">Annual Homecoming Weekend</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Join us for a weekend of celebration, networking, and memories. November 15-17, 2024.</p>
            <Button variant="secondary" size="lg">Register Now</Button>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>Celebrating our accomplished alumni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-accent pl-4 py-2">
                <h3 className="font-semibold">Sarah Chen '18 - Tech Innovation Award</h3>
                <p className="text-sm text-muted-foreground">Recognized for groundbreaking work in AI ethics.</p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2">
                <h3 className="font-semibold">Marcus Johnson '15 - Community Leadership</h3>
                <p className="text-sm text-muted-foreground">Founded non-profit serving underserved communities.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Alumni;
