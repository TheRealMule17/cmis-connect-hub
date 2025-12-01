import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import LandingEventsList from "@/components/LandingEventsList";
import TopSponsors from "@/components/TopSponsors";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Council of Management Information Systems
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and grow with our comprehensive portal system designed for students, alumni, and partners.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <LandingEventsList />
          <TopSponsors />
        </div>


        <div className="text-center space-y-4">
          <Button asChild size="lg">
            <Link to="/auth">Get Started</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Demo Version • For authorized personnel only
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
