import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const LandingEventsList = () => {
  const { data: events } = useQuery({
    queryKey: ["landing_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "upcoming")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events?.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg space-y-2">
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/student">Student Sign Up</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/sponsor">Sponsor/Mentor Join</Link>
              </Button>
            </div>
          </div>
        ))}
        {!events?.length && (
          <p className="text-center text-muted-foreground py-4">No upcoming events</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LandingEventsList;