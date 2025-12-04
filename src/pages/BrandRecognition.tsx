import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Eye, Megaphone, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrandRecognition = () => {
  const navigate = useNavigate();

  const visibilityOptions = [
    {
      title: "Website & Digital Presence",
      description: "Logo placement on department website, social media recognition, and digital communications.",
      icon: Eye,
    },
    {
      title: "Event Branding",
      description: "Prominent logo display at career fairs, workshops, guest lectures, and networking events.",
      icon: Megaphone,
    },
    {
      title: "Student Communications",
      description: "Featured in newsletters, email campaigns, and student-facing materials.",
      icon: Star,
    },
    {
      title: "Physical Campus Presence",
      description: "Recognition in department facilities, classrooms, and student gathering spaces.",
      icon: Award,
    },
  ];

  const tiers = [
    {
      name: "Exabyte",
      color: "text-yellow-600",
      benefits: [
        "Premier logo placement on all materials",
        "Named scholarship or program",
        "Exclusive recruiting events",
        "Advisory board seat",
        "Annual recognition dinner",
      ],
    },
    {
      name: "Petabyte",
      color: "text-gray-500",
      benefits: [
        "Featured logo placement",
        "Priority event sponsorship",
        "Dedicated career fair booth",
        "Guest speaker opportunities",
        "Quarterly recognition",
      ],
    },
    {
      name: "Terabyte",
      color: "text-amber-700",
      benefits: [
        "Logo on sponsor recognition page",
        "Shared career fair presence",
        "Job board featured listings",
        "Newsletter mentions",
        "Annual recognition",
      ],
    },
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
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Brand Recognition</h1>
              <p className="text-lg text-muted-foreground">Showcase your commitment to education</p>
            </div>
          </div>
        </div>

        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl">Elevate Your Employer Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Position your company as an employer of choice among our talented students. 
              Through strategic brand visibility across our programs, events, and communications, 
              you'll build recognition and affinity with the next generation of MIS professionals.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Reach 2,000+ students annually</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Build employer brand awareness</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Demonstrate community commitment</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Differentiate from competitors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Visibility Opportunities</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {visibilityOptions.map((option) => (
            <Card key={option.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription className="mt-1">{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Recognition by Sponsorship Tier</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <Card key={tier.name}>
              <CardHeader>
                <CardTitle className={tier.color}>{tier.name} Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enhance Your Brand Visibility</CardTitle>
            <CardDescription>Learn more about sponsorship opportunities and brand recognition benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate("/contact")}>Contact Us</Button>
              <Button size="lg" variant="outline">View Current Sponsors</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BrandRecognition;
