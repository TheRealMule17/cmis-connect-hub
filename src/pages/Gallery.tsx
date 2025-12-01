import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Gallery = () => {
  const eventImages = [
    { id: 1, title: "Annual Tech Summit 2024", category: "Event" },
    { id: 2, title: "Career Fair Spring", category: "Event" },
    { id: 3, title: "Networking Mixer", category: "Event" },
    { id: 4, title: "Workshop Series", category: "Event" },
    { id: 5, title: "Industry Panel Discussion", category: "Event" },
    { id: 6, title: "Case Competition Finals", category: "Event" },
  ];

  const peopleImages = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Faculty Advisor" },
    { id: 2, name: "Michael Chen", role: "Student Leader" },
    { id: 3, name: "Emily Rodriguez", role: "Industry Mentor" },
    { id: 4, name: "James Williams", role: "Faculty Member" },
    { id: 5, name: "Aisha Patel", role: "Student Representative" },
    { id: 6, name: "David Lee", role: "Alumni Mentor" },
    { id: 7, name: "Prof. Robert Brown", role: "Faculty Director" },
    { id: 8, name: "Maria Garcia", role: "Student Officer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our community through events, mentors, faculty, and students
          </p>
        </div>

        {/* Events Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Our Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventImages.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src={`https://images.unsplash.com/photo-${1540575467063 + event.id}-4bd08ddc8630?w=600&h=400&fit=crop`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* People Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-foreground">Our Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {peopleImages.map((person) => (
              <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={`https://images.unsplash.com/photo-${1438761681033 + person.id * 1000}-6b808e8b0ccc?w=400&h=400&fit=crop&face`}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
