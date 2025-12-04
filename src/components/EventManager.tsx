import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users, Plus, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EventDetailDialog from "./EventDetailDialog";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  building: string | null;
  room_number: string | null;
  capacity: number | null;
  event_type: string | null;
  status: string | null;
  event_registrations?: { count: number }[];
}

const EventManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    building: "",
    room_number: "",
    capacity: "",
    event_type: "",
  });

  const { data: events } = useQuery({
    queryKey: ["events_with_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_registrations (count)
        `)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (newEvent: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("events").insert({
        ...newEvent,
        capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
        organizer_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events_with_data"] });
      toast({ title: "Event created successfully" });
      setIsCreating(false);
      setFormData({ title: "", description: "", event_date: "", location: "", building: "", room_number: "", capacity: "", event_type: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Manager</h2>
          <p className="text-muted-foreground">Organize and manage campus events</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "Create Event"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createEvent.mutate(formData); }} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Date & Time</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="General location or campus"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                      placeholder="Building name or number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                      placeholder="Room number"
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event_type">Event Type</Label>
                  <Input
                    id="event_type"
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    placeholder="Workshop, Seminar, Social, etc."
                  />
                </div>
              </div>
              <Button type="submit">Create Event</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {events?.map((event) => (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => setSelectedEvent(event)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.event_type}</CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleString()}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                  {event.building && ` - ${event.building}`}
                  {event.room_number && ` Room ${event.room_number}`}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {event.event_registrations?.[0]?.count || 0} registered
                {event.capacity && ` / ${event.capacity} capacity`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventDetailDialog 
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>
  );
};

export default EventManager;