import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, Presentation, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CampusEvents = () => {
  const navigate = useNavigate();

  const { data: upcomingEvents } = useQuery({
    queryKey: ["upcoming_sponsor_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const eventTypes = [
    {
      title: "Career Fairs",
      description: "Biannual career fairs connecting sponsors with hundreds of students seeking internships and full-time positions.",
      icon: Users,
      frequency: "Fall & Spring semesters",
    },
    {
      title: "Information Sessions",
      description: "Host exclusive company presentations to showcase your culture, opportunities, and technology stack.",
      icon: Presentation,
      frequency: "Throughout the year",
    },
    {
      title: "Technical Workshops",
      description: "Lead hands-on workshops teaching students about your technologies and industry practices.",
      icon: Building2,
      frequency: "Monthly opportunities",
    },
    {
      title: "Networking Events",
      description: "Sponsor casual networking events, mixers, and social gatherings with students and faculty.",
      icon: Calendar,
      frequency: "Quarterly",
    },
  ];

  const eventBenefits = [
    "Direct access to engaged, career-focused students",
    "Brand visibility through event marketing",
    "Opportunity to assess potential candidates",
    "Build relationships with faculty and staff",
    "Showcase company culture and values",
    "Exclusive recruiting time slots",
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
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Campus Events</h1>
                <p className="text-lg text-muted-foreground">Host recruiting and networking events</p>
              </div>
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.1}>
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">Engage With Students On Campus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Our campus events program provides sponsors with meaningful opportunities to connect 
                with students in person. From career fairs to technical workshops, you'll have direct 
                access to our talented student body and the chance to build lasting relationships.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {eventBenefits.map((benefit) => (
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
          <h2 className="text-2xl font-bold mb-4">Event Types</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {eventTypes.map((event) => (
              <Card key={event.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <event.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="mt-1">{event.description}</CardDescription>
                      <p className="text-xs text-primary mt-2 font-medium">{event.frequency}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollFadeIn>

        {upcomingEvents && upcomingEvents.length > 0 && (
          <ScrollFadeIn delay={0.3}>
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollFadeIn>
        )}

        <ScrollFadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Host or Sponsor an Event</CardTitle>
              <CardDescription>Contact our events team to discuss hosting opportunities and sponsorship packages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => navigate("/contact")}>Contact Events Team</Button>
            </CardContent>
          </Card>
        </ScrollFadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default CampusEvents;
