import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import SponsorShowcase from "@/components/SponsorShowcase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import davidGomillionPhoto from "@/assets/faculty/david-gomillion.jpg";
import aaronBeckerPhoto from "@/assets/faculty/aaron-becker.jpg";
import gregHeimPhoto from "@/assets/faculty/greg-heim.jpg";
import michaelScialdonePhoto from "@/assets/faculty/michael-scialdone.jpg";
import dwayneWhittenPhoto from "@/assets/faculty/dwayne-whitten.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-8 md:py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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

          {/* Faculty Advisory Board Section */}
          <section className="mt-8 md:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Faculty Advisory Board
            </h2>
            <p className="text-sm sm:text-base text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Our dedicated faculty advisors who provide guidance, mentorship, and leadership to the CMIS community.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { id: 1, name: "Dr. Aaron Becker", role: "Faculty Advisory Board", image: aaronBeckerPhoto, gridClass: "" },
                { id: 2, name: "Dr. David Gomillion", role: "Faculty Advisory Board", image: davidGomillionPhoto, gridClass: "" },
                { id: 3, name: "Dr. Greg Heim", role: "Faculty Advisory Board", image: gregHeimPhoto, gridClass: "" },
                { id: 4, name: "Dr. Michael Scialdone", role: "Faculty Advisory Board", image: michaelScialdonePhoto, gridClass: "" },
                { id: 5, name: "Dr. Dwayne Whitten", role: "Faculty Advisory Board", image: dwayneWhittenPhoto, gridClass: "" },
              ].map((person) => (
                <Card 
                  key={person.id} 
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale ${person.gridClass}`}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-base mb-1">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Student Advisory Board Section */}
          <section className="mt-8 md:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Student Advisory Board
            </h2>
            <p className="text-sm sm:text-base text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Our dedicated student leaders who help shape the future of CMIS and bridge the gap between students and faculty.
            </p>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Colleen Anderson", "Garrison Hoyt", "Jermyle Jones", "Lauren Kriendler", 
                    "Shashwat Varshney", "Anbankris Prakasam", "Priyanka Verma", "Varshitha Ravikumar", 
                    "Ramaraju Muppalla", "Andrew Jiang", "Ana Spratte", "Lindsey Moore", 
                    "Grant Saleme", "Zach Walsh", "Kim Mensinger", "Sam Franklin", 
                    "Blake Dolenski", "Joanie O'Donnell", "Timothy Lee", "Josh Bittlestone", 
                    "Star Wei", "James Londrigan", "Aaron Grow", "Mikylie Wing", 
                    "Caden Reichmuth", "Mitchell Peiffer", "Anjali Batlanki"
                  ].map((name, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sponsors Section */}
          <div className="mt-8 md:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Sponsors
            </h2>
            <p className="text-sm sm:text-base text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              We are grateful for the support of our sponsors who make our programs and initiatives possible.
            </p>
            <SponsorShowcase />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
