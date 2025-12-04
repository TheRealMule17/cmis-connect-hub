import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import SponsorShowcase from "@/components/SponsorShowcase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import davidGomillionPhoto from "@/assets/faculty/david-gomillion.jpg";
import aaronBeckerPhoto from "@/assets/faculty/aaron-becker.jpg";
import gregHeimPhoto from "@/assets/faculty/greg-heim.jpg";
import michaelScialdonePhoto from "@/assets/faculty/michael-scialdone.jpg";
import dwayneWhittenPhoto from "@/assets/faculty/dwayne-whitten.jpg";
const events = ["CMIS Summer Workshop", "Speed Networking and MIS Mixer", "Case Competitions", "MIS Career Fair", "Career Night", "Scholarships"];
const CMIS = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <BreadcrumbNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-secondary/20 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Council for the Management of Information Systems
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  The Council for the Management of Information Systems (CMIS) brings students, faculty, and industry members together in active partnerships focused on the use of information technologies in businesses and organizations. The benefits of these partnerships include unique educational opportunities for students, research opportunities for faculty and access to top talent for industry members.
                </p>
                <div className="flex flex-col gap-2 border-l-4 border-primary pl-4">
                  <button onClick={() => scrollToSection("mission")} className="text-primary hover:text-primary/80 text-left font-medium">
                    Mission
                  </button>
                  <button onClick={() => scrollToSection("team")} className="text-primary hover:text-primary/80 text-left font-medium">
                    Meet Our Team
                  </button>
                  <button onClick={() => scrollToSection("board")} className="text-primary hover:text-primary/80 text-left font-medium">
                    Corporate Advisory Board
                  </button>
                  <button onClick={() => scrollToSection("faculty-partners")} className="text-primary hover:text-primary/80 text-left font-medium">
                    Faculty Partners
                  </button>
                  <button onClick={() => scrollToSection("student-leaders")} className="text-primary hover:text-primary/80 text-left font-medium">
                    Student Leaders
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img src="https://mays.tamu.edu/wp-content/uploads/2023/09/CouncilfortheManagementofInformationSystems-HeroImage-1.png" alt="Student studying with laptop" className="rounded-lg shadow-lg w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section id="mission" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img src="https://mays.tamu.edu/wp-content/uploads/2023/09/Departments-MissionStatement.png" alt="Hands in for collaboration" className="rounded-lg shadow-lg w-full max-w-md mx-auto" />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Mission Statement</h2>
                <p className="text-muted-foreground mb-4">
                  Texas A&M University's Council for the Management of Information Systems (CMIS) provides a competitive advantage to our students, faculty and industry members by facilitating an active partnership (aligning needs and resources) to provide robust, relevant educational opportunities, research support and corporate access.
                </p>
                <p className="text-muted-foreground mb-6">
                  To achieve our mission, CMIS engages highly active and innovative corporate members who facilitate our efforts through coordination, participation and sponsorship. CMIS seeks to provide member organizations with a competitive advantage through their participation in our activities.
                </p>
                <div>
                  <p className="font-semibold mb-3">To accomplish our mission, CMIS coordinates the following events:</p>
                  <ul className="space-y-2">
                    {events.map(event => <li key={event} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-medium">{event}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section id="team" className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Meet Our Team</h2>
                <p className="text-muted-foreground mb-6">The Council for the Management of Information Systems is dedicated to the success of our students and partners. To connect with the advisory board members below, please visit our Contact Us page.</p>
                <Button asChild>
                  
                </Button>
              </div>
              <div>
                <img src="https://mays.tamu.edu/wp-content/uploads/2023/09/MaysBusinessSchool_04_Subsection.png" alt="Two people shaking hands" className="rounded-lg shadow-lg w-full max-w-md mx-auto" />
              </div>
            </div>

            {/* Faculty Advisory Board */}
            <div id="faculty-partners" className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Faculty Partners</h3>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our dedicated faculty advisors who provide guidance, mentorship, and leadership to the CMIS community.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[{
                id: 1,
                name: "Dr. Aaron Becker",
                role: "Faculty Advisory Board",
                image: aaronBeckerPhoto
              }, {
                id: 2,
                name: "Dr. David Gomillion",
                role: "Co-Director of CMIS",
                image: davidGomillionPhoto
              }, {
                id: 3,
                name: "Dr. Greg Heim",
                role: "Faculty Advisory Board",
                image: gregHeimPhoto
              }, {
                id: 4,
                name: "Dr. Michael Scialdone",
                role: "Faculty Advisory Board",
                image: michaelScialdonePhoto
              }, {
                id: 5,
                name: "Dr. Dwayne Whitten",
                role: "Co-Director of CMIS",
                image: dwayneWhittenPhoto
              }].map(person => <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 text-center">
                        <h4 className="font-semibold text-base mb-1">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.role}</p>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>

            {/* Student Advisory Board */}
            <div id="student-leaders">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Student Leaders</h3>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our dedicated student leaders who help shape the future of CMIS and bridge the gap between students and faculty.
              </p>
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Mitchell Peiffer", "Poorav Desai", "Khushi Gupta", "Josh Bittlestone", "Benjamin McCaulley", "Lazzia Ellankil", "Emioritse Abraham", "Michael Hudgins", "Sanketh Marampally", "Taj Singh", "Anoushka Pai", "Raahim Shahzad", "Shragvi Pendyam", "Traci Lu"].map((name, index) => <Badge key={index} variant="secondary" className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                        {name}
                      </Badge>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Corporate Advisory Board */}
        <section id="board" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Corporate Advisory Board</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              We are grateful for the support of our sponsors who make our programs and initiatives possible.
            </p>
            <SponsorShowcase />
            
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default CMIS;