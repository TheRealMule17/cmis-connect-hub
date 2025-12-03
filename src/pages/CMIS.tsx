import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const advisoryBoard = {
  exabyte: [
    {
      company: "ConocoPhillips",
      logo: "/logos/conocophillips.png",
      memberSince: 1990,
      foundingMember: true,
      representative: "Sayra Torres, IT Business Analyst",
      url: "http://careers.conocophillips.com/"
    },
    {
      company: "Exabeam",
      logo: "/logos/exabeam.png",
      memberSince: 2022,
      representative: "Luke Voigt",
      url: "https://www.exabeam.com/"
    },
    {
      company: "Valero",
      logo: "/logos/valero.png",
      memberSince: 2019,
      representative: "Paul Mazeika, Application Development & Integration Services",
      url: "https://www.valero.com/en-us/Careers/UniversityRecruiting"
    }
  ],
  petabyte: [
    {
      company: "Phillips 66",
      logo: "/logos/phillips66.png",
      memberSince: 2024,
      representative: "Board Representative",
      url: "https://www.phillips66.com/careers"
    }
  ],
  terabyte: [
    {
      company: "Booz Allen Hamilton",
      logo: "/logos/booz-allen-hamilton.png",
      memberSince: 2024,
      representative: "Mark McAllister",
      url: "https://careers.boozallen.com/"
    },
    {
      company: "Chevron",
      logo: "/logos/chevron.png",
      memberSince: 2012,
      representative: "Kevin Jensen",
      url: "https://careers.chevron.com/"
    },
    {
      company: "GM",
      logo: "/logos/gm.png",
      memberSince: 2009,
      representative: "Gabe Wilson",
      url: "https://search-careers.gm.com/en/jobs/"
    },
    {
      company: "Grant Thornton",
      logo: "/logos/grant-thornton.png",
      memberSince: 2024,
      representative: "Juan Manuel Ortiz",
      url: "https://www.grantthornton.com/careers"
    },
    {
      company: "HBK Capital Management",
      logo: "/logos/hbk-capital.png",
      memberSince: 2023,
      representative: "Abby Vanikiotis",
      url: "https://www.hbk.com/careers"
    },
    {
      company: "Palo Alto Networks",
      logo: "/logos/palo-alto.webp",
      memberSince: 2024,
      representative: "Rick Linnabery",
      url: "https://jobs.paloaltonetworks.com/en/"
    },
    {
      company: "PepsiCo",
      logo: "/logos/pepsico.svg",
      memberSince: 2012,
      representative: "David Plasek",
      url: "https://www.pepsicojobs.com/main/"
    },
    {
      company: "ShoWorks",
      logo: "/logos/showorks.png",
      memberSince: 2023,
      representative: "Michael Hnatt",
      url: "http://www.fairsoftware.com/"
    },
    {
      company: "Umbrage",
      logo: "/logos/umbrage.png",
      memberSince: 2024,
      representative: "Sohum Dogra",
      url: "https://umbrage.com/home"
    }
  ]
};

const facultyAdvisors = [
  "Dr. Aaron Becker",
  "Dr. David Gomillion",
  "Dr. Greg Heim",
  "Dr. Michael Scialdone",
  "Dr. Dwayne Whitten"
];

const studentAdvisors = [
  "Colleen Anderson", "Garrison Hoyt", "Jermyle Jones", "Lauren Kriendler",
  "Shashwat Varshney", "Anbankris Prakasam", "Priyanka Verma", "Varshitha Ravikumar",
  "Ramaraju Muppalla", "Andrew Jiang", "Ana Spratte", "Lindsey Moore",
  "Grant Saleme", "Zach Walsh", "Kim Mensinger", "Sam Franklin",
  "Blake Dolenski", "Joanie O'Donnell", "Timothy Lee", "Josh Bittlestone",
  "Star Wei", "James Londrigan", "Aaron Grow", "Mikylie Wing",
  "Caden Reichmuth", "Anjali Batlanki"
];

const events = [
  "CMIS Summer Workshop",
  "Speed Networking and MIS Mixer",
  "Case Competitions",
  "MIS Career Fair",
  "Career Night",
  "Scholarships"
];

const CMIS = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                  <button
                    onClick={() => scrollToSection("mission")}
                    className="text-primary hover:text-primary/80 text-left font-medium"
                  >
                    Mission
                  </button>
                  <button
                    onClick={() => scrollToSection("team")}
                    className="text-primary hover:text-primary/80 text-left font-medium"
                  >
                    Meet Our Team
                  </button>
                  <button
                    onClick={() => scrollToSection("board")}
                    className="text-primary hover:text-primary/80 text-left font-medium"
                  >
                    Advisory Board
                  </button>
                  <button
                    onClick={() => scrollToSection("partners")}
                    className="text-primary hover:text-primary/80 text-left font-medium"
                  >
                    Faculty Partners
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="https://mays.tamu.edu/wp-content/uploads/2023/09/CouncilfortheManagementofInformationSystems-HeroImage-1.png"
                  alt="Student studying with laptop"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section id="mission" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src="https://mays.tamu.edu/wp-content/uploads/2023/09/Departments-MissionStatement.png"
                  alt="Hands in for collaboration"
                  className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                />
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
                    {events.map((event) => (
                      <li key={event} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-medium">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section id="team" className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Meet Our Team</h2>
                <p className="text-muted-foreground mb-6">
                  The Council for the Management of Information Systems is dedicated to the success of our students and partners. To connect with the council, visit our directory page.
                </p>
                <Button asChild>
                  <a href="mailto:cmis@mays.tamu.edu">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact CMIS
                  </a>
                </Button>
              </div>
              <div>
                <img
                  src="https://mays.tamu.edu/wp-content/uploads/2023/09/MaysBusinessSchool_04_Subsection.png"
                  alt="Two people shaking hands"
                  className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Advisory Board */}
        <section id="board" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Corporate Advisory Board</h2>

            {/* Exabyte Members */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full" />
                Exabyte Members — $16,000
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryBoard.exabyte.map((member) => (
                  <Card key={member.company} className="border-amber-200 dark:border-amber-800">
                    <CardContent className="p-6">
                      <a href={member.url} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="h-16 flex items-center justify-center mb-4">
                          <img
                            src={member.logo}
                            alt={member.company}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-lg text-primary hover:underline">{member.company}</h4>
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        Member Since: {member.memberSince}
                        {member.foundingMember && " (founding member)"}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Board Representative:</span><br />
                        {member.representative}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Petabyte Members */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full" />
                Petabyte Members — $12,000
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryBoard.petabyte.map((member) => (
                  <Card key={member.company} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <a href={member.url} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="h-16 flex items-center justify-center mb-4">
                          <img
                            src={member.logo}
                            alt={member.company}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-lg text-primary hover:underline">{member.company}</h4>
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        Member Since: {member.memberSince}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Board Representative:</span><br />
                        {member.representative}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Terabyte Members */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full" />
                Terabyte Members — $8,000
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryBoard.terabyte.map((member) => (
                  <Card key={member.company} className="border-orange-200 dark:border-orange-800">
                    <CardContent className="p-6">
                      <a href={member.url} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="h-16 flex items-center justify-center mb-4">
                          <img
                            src={member.logo}
                            alt={member.company}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-lg text-primary hover:underline">{member.company}</h4>
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        Member Since: {member.memberSince}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Board Representative:</span><br />
                        {member.representative}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <a href="mailto:cmis@mays.tamu.edu">
                  <Mail className="mr-2 h-4 w-4" />
                  Learn More About Membership
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Faculty and Student Partners */}
        <section id="partners" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Faculty and Student Partners</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Faculty Advisory Board */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Faculty Advisory Board</h3>
                  <div className="space-y-2">
                    {facultyAdvisors.map((faculty) => (
                      <p key={faculty} className="text-muted-foreground">{faculty}</p>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4" asChild>
                    <a href="mailto:cmis@mays.tamu.edu">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Faculty
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Student Advisory Board */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Student Advisory Board</h3>
                  <p className="text-muted-foreground text-sm">
                    {studentAdvisors.join(", ")}
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a href="mailto:cmis@mays.tamu.edu">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Students
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CMIS;
