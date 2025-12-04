import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, isBefore } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  capacity: number | null;
  event_type: string | null;
}

interface AlumniEventSignupProps {
  userId: string;
}

const AlumniEventSignup = ({ userId }: AlumniEventSignupProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, [userId]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .eq("status", "upcoming")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching registrations:", error);
    } else {
      setRegistrations(data?.map((r) => r.event_id) || []);
    }
  };

  const getSignupDeadline = (eventDate: string) => {
    return subDays(new Date(eventDate), 7);
  };

  const isSignupOpen = (eventDate: string) => {
    const deadline = getSignupDeadline(eventDate);
    return isBefore(new Date(), deadline);
  };

  const handleRegister = async (eventId: string) => {
    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: userId });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    } else {
      setRegistrations([...registrations, eventId]);
      toast({
        title: "Registered!",
        description: "You have successfully registered for this event",
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to unregister from event",
        variant: "destructive",
      });
    } else {
      setRegistrations(registrations.filter((id) => id !== eventId));
      toast({
        title: "Unregistered",
        description: "You have been removed from this event",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading events...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sign Up for Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events available.</p>
        ) : (
          events.map((event) => {
            const isRegistered = registrations.includes(event.id);
            const signupOpen = isSignupOpen(event.event_date);
            const deadline = getSignupDeadline(event.event_date);

            return (
              <div
                key={event.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    {event.event_type && (
                      <Badge variant="secondary" className="mt-1">
                        {event.event_type}
                      </Badge>
                    )}
                  </div>
                  {isRegistered && (
                    <Badge className="bg-green-600">Registered</Badge>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.event_date), "PPP 'at' p")}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Capacity: {event.capacity}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={signupOpen ? "text-muted-foreground" : "text-destructive font-medium"}>
                    Signup deadline: {format(deadline, "PPP")}
                    {!signupOpen && " (Closed)"}
                  </span>
                </div>

                <div className="pt-2">
                  {isRegistered ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnregister(event.id)}
                      disabled={!signupOpen}
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleRegister(event.id)}
                      disabled={!signupOpen}
                    >
                      {signupOpen ? "Sign Up" : "Registration Closed"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AlumniEventSignup;
