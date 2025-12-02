import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Building2, Image } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  building: string | null;
  room_number: string | null;
  event_type: string | null;
}

interface Sponsor {
  id: string;
  company_name: string;
  description: string | null;
  tier: string | null;
  logo_url: string | null;
  website_url: string | null;
}

interface GalleryItem {
  id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchData = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const searchTerm = `%${query.toLowerCase()}%`;

      // Search events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm}`)
        .order("event_date", { ascending: false });

      // Search sponsors
      const { data: sponsorsData } = await supabase
        .from("sponsor_profiles")
        .select("*")
        .or(`company_name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order("company_name");

      // Search gallery/event photos
      const { data: galleryData } = await supabase
        .from("event_photos")
        .select("*")
        .ilike("caption", searchTerm)
        .order("created_at", { ascending: false });

      setEvents(eventsData || []);
      setSponsors(sponsorsData || []);
      setGallery(galleryData || []);
      setLoading(false);
    };

    searchData();
  }, [query]);

  const totalResults = events.length + sponsors.length + gallery.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <Navigation />
      <BreadcrumbNav />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  Found <span className="font-semibold">{totalResults}</span> results for "{query}"
                </>
              )}
            </p>
          )}
          {!query && (
            <p className="text-muted-foreground">Enter a search query to find events, sponsors, or gallery items.</p>
          )}
        </div>

        {!loading && query && totalResults === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No results found. Try a different search term.</p>
            </CardContent>
          </Card>
        )}

        {!loading && totalResults > 0 && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors ({sponsors.length})</TabsTrigger>
              <TabsTrigger value="gallery">Gallery ({gallery.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {events.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Events</h2>
                  <div className="grid gap-4">
                    {events.map((event) => (
                      <Card key={event.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle>{event.title}</CardTitle>
                              <CardDescription className="mt-2">{event.description}</CardDescription>
                            </div>
                            {event.event_type && (
                              <Badge variant="secondary">{event.event_type}</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(event.event_date), "PPP")}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                            {event.building && (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {event.building} {event.room_number && `- ${event.room_number}`}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {sponsors.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Sponsors</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sponsors.map((sponsor) => (
                      <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            {sponsor.logo_url && (
                              <img
                                src={sponsor.logo_url}
                                alt={sponsor.company_name}
                                className="h-12 w-12 object-contain rounded"
                              />
                            )}
                            <div className="flex-1">
                              <CardTitle>{sponsor.company_name}</CardTitle>
                              {sponsor.tier && (
                                <Badge variant="outline" className="mt-2 capitalize">
                                  {sponsor.tier} Tier
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {sponsor.description && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                            {sponsor.website_url && (
                              <a
                                href={sponsor.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-2 inline-block"
                              >
                                Visit Website →
                              </a>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {gallery.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative bg-muted">
                          <img
                            src={item.photo_url}
                            alt={item.caption || "Gallery image"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {item.caption && (
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-2">
                              <Image className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                              <p className="text-sm">{item.caption}</p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="events">
              {events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription className="mt-2">{event.description}</CardDescription>
                          </div>
                          {event.event_type && (
                            <Badge variant="secondary">{event.event_type}</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(event.event_date), "PPP")}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          {event.building && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {event.building} {event.room_number && `- ${event.room_number}`}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No events found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sponsors">
              {sponsors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {sponsors.map((sponsor) => (
                    <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          {sponsor.logo_url && (
                            <img
                              src={sponsor.logo_url}
                              alt={sponsor.company_name}
                              className="h-12 w-12 object-contain rounded"
                            />
                          )}
                          <div className="flex-1">
                            <CardTitle>{sponsor.company_name}</CardTitle>
                            {sponsor.tier && (
                              <Badge variant="outline" className="mt-2 capitalize">
                                {sponsor.tier} Tier
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {sponsor.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                          {sponsor.website_url && (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              Visit Website →
                            </a>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No sponsors found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="gallery">
              {gallery.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-muted">
                        <img
                          src={item.photo_url}
                          alt={item.caption || "Gallery image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {item.caption && (
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-2">
                            <Image className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                            <p className="text-sm">{item.caption}</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No gallery items found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
