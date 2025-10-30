import Navigation from "@/components/Navigation";
import PortalCard from "@/components/PortalCard";
import { GraduationCap, Users, Building2, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Campus Management Information System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and grow with our comprehensive portal system designed for students, alumni, and partners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <PortalCard
            title="Student Portal"
            description="Access course materials, assignments, grades, and academic resources."
            icon={GraduationCap}
            link="/student"
          />
          <PortalCard
            title="Alumni Portal"
            description="Stay connected with your network and access exclusive opportunities."
            icon={Users}
            link="/alumni"
          />
          <PortalCard
            title="Sponsor Portal"
            description="Partner with us to invest in future talent and innovation."
            icon={Building2}
            link="/sponsor"
          />
          <PortalCard
            title="Analytics Dashboard"
            description="Monitor engagement, track metrics, and gain insights across all portals."
            icon={BarChart3}
            link="/dashboard"
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Demo Version • For authorized personnel only
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
