import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Bell, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MENTORSHIP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeOzuu2rq1BWK-jNATc8Jfz9NhlWemAYLuYsO7B8MpOY6YgrA/viewform?usp=header";

const isMentorshipEvent = (event: { title: string }) => {
  return event.title?.toLowerCase().includes("mentorship");
};

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

// Event types that are notifications only (not registerable)
const NOTIFICATION_TYPES = ["announcement", "notification", "deadline", "break", "holiday"];

// Map certain event types to display names
const getDisplayEventType = (eventType: string) => {
  const typeMap: Record<string, string> = {
    "mentor matching": "networking",
    "mentorship": "networking",
    "mentor": "networking",
  };
  return typeMap[eventType?.toLowerCase()] || eventType;
};

const isNotificationEvent = (event: Event) => {
  const type = event.event_type?.toLowerCase() || "";
  const title = event.title?.toLowerCase() || "";
  
  // Check if it's a notification type
  if (NOTIFICATION_TYPES.some(t => type.includes(t))) return true;
  
  // Check for semester breaks/transitions in title
  if (title.includes("fall end") || title.includes("spring begin") || 
      title.includes("semester") || title.includes("break")) return true;
  
  return false;
};

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
    return <div className="text-sm text-muted-foreground">Loading events...</div>;
  }

  const notifications = events.filter(isNotificationEvent);
  const registerableEvents = events.filter(e => !isNotificationEvent(e));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notifications - compact inline display */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md text-sm">
                <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{event.title}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Registerable Events - compact cards */}
        {registerableEvents.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {registerableEvents.map((event) => {
              const isRegistered = registrations.includes(event.id);
              const displayType = getDisplayEventType(event.event_type);
              
              return (
                <div key={event.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {displayType}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {isMentorshipEvent(event) ? (
                    <Button
                      onClick={() => window.open(MENTORSHIP_FORM_URL, '_blank')}
                      size="sm"
                      className="w-full h-7 text-xs"
                    >
                      Register <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => isRegistered ? handleUnregister(event.id) : handleRegister(event.id)}
                      variant={isRegistered ? "outline" : "default"}
                      size="sm"
                      className="w-full h-7 text-xs"
                    >
                      {isRegistered ? "Unregister" : "Register"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!events.length && (
          <p className="text-center text-muted-foreground py-4 text-sm">No upcoming events</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentEventRegistration;
