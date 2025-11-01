import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  event_type: string;
  status: string;
}

interface StudentEventRegistrationProps {
  userId: string;
}

const StudentEventRegistration = ({ userId }: StudentEventRegistrationProps) => {
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
      .eq("status", "upcoming")
      .gte("event_date", new Date().toISOString())
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

  const handleRegister = async (eventId: string) => {
    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: userId });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRegistrations([...registrations, eventId]);
      toast({
        title: "Registered successfully",
        description: "You'll receive a confirmation email shortly",
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
        title: "Unregistration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRegistrations(registrations.filter((id) => id !== eventId));
      toast({
        title: "Unregistered successfully",
      });
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => {
          const isRegistered = registrations.includes(event.id);
          return (
            <div key={event.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <Badge>{event.event_type}</Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
                {event.capacity && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Capacity: {event.capacity}
                  </span>
                )}
              </div>
              <Button
                onClick={() => isRegistered ? handleUnregister(event.id) : handleRegister(event.id)}
                variant={isRegistered ? "outline" : "default"}
                className="w-full"
              >
                {isRegistered ? "Unregister" : "Register"}
              </Button>
            </div>
          );
        })}
        {!events.length && (
          <p className="text-center text-muted-foreground py-8">No upcoming events available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentEventRegistration;