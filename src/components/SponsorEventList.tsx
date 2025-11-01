import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SponsorEventList = () => {
  const { data: events } = useQuery({
    queryKey: ["sponsor_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "upcoming")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Recruiting Events
        </CardTitle>
        <CardDescription>Connect with top talent at CMIS events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events?.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
              <Badge variant="secondary">{event.event_type}</Badge>
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
                  Up to {event.capacity} students
                </span>
              )}
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-1">Sponsorship Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Direct access to talented students</li>
                <li>• Brand visibility on campus</li>
                <li>• Networking opportunities</li>
              </ul>
            </div>
          </div>
        ))}
        {!events?.length && (
          <p className="text-center text-muted-foreground py-8">No upcoming events at this time</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorEventList;