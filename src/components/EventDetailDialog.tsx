import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Edit2, Save, X, GraduationCap, UserCheck, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailDialog = ({ event, open, onOpenChange }: EventDetailDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    building: "",
    room_number: "",
    capacity: "",
    event_type: "",
  });

  // Fetch registrations with user details
  const { data: registrations } = useQuery({
    queryKey: ["event_registrations_detail", event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("id, user_id, registered_at")
        .eq("event_id", event.id);
      if (error) throw error;
      return data;
    },
    enabled: !!event?.id && open,
  });

  // Fetch student profiles for registered users
  const { data: studentProfiles } = useQuery({
    queryKey: ["student_profiles_for_event", event?.id],
    queryFn: async () => {
      if (!registrations?.length) return [];
      const userIds = registrations.map(r => r.user_id);
      const { data, error } = await supabase
        .from("student_profiles")
        .select("user_id, name, email")
        .in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: !!registrations?.length,
  });

  // Fetch alumni profiles for registered users
  const { data: alumniProfiles } = useQuery({
    queryKey: ["alumni_profiles_for_event", event?.id],
    queryFn: async () => {
      if (!registrations?.length) return [];
      const userIds = registrations.map(r => r.user_id);
      const { data, error } = await supabase
        .from("alumni_profiles")
        .select("user_id, name, email, is_mentor")
        .in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: !!registrations?.length,
  });

  // Categorize registrations
  const studentRegistrations = registrations?.filter(r => 
    studentProfiles?.some(s => s.user_id === r.user_id)
  ).map(r => ({
    ...r,
    profile: studentProfiles?.find(s => s.user_id === r.user_id)
  })) || [];

  const alumniRegistrations = registrations?.filter(r => 
    alumniProfiles?.some(a => a.user_id === r.user_id)
  ).map(r => ({
    ...r,
    profile: alumniProfiles?.find(a => a.user_id === r.user_id)
  })) || [];

  const mentorRegistrations = alumniRegistrations.filter(r => r.profile?.is_mentor);

  const updateEvent = useMutation({
    mutationFn: async () => {
      if (!event?.id) return;
      // Convert local datetime to ISO string with timezone
      const localDate = new Date(editData.event_date);
      const isoDateString = localDate.toISOString();
      
      const { error } = await supabase
        .from("events")
        .update({
          title: editData.title,
          description: editData.description || null,
          event_date: isoDateString,
          location: editData.location || null,
          building: editData.building || null,
          room_number: editData.room_number || null,
          capacity: editData.capacity ? parseInt(editData.capacity) : null,
          event_type: editData.event_type || null,
        })
        .eq("id", event.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events_with_data"] });
      toast({ title: "Event updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update event", variant: "destructive" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async () => {
      if (!event?.id) return;
      // First delete all registrations for this event
      const { error: regError } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", event.id);
      if (regError) throw regError;
      
      // Then delete the event
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events_with_data"] });
      toast({ title: "Event deleted successfully" });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to delete event", variant: "destructive" });
    },
  });

  const startEditing = () => {
    if (!event) return;
    setEditData({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "",
      location: event.location || "",
      building: event.building || "",
      room_number: event.room_number || "",
      capacity: event.capacity?.toString() || "",
      event_type: event.event_type || "",
    });
    setIsEditing(true);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {event.event_type && <Badge variant="secondary">{event.event_type}</Badge>}
                {event.status && <Badge variant="outline">{event.status}</Badge>}
              </DialogDescription>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{event.title}"? This will also remove all registrations for this event. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteEvent.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">Event Title</Label>
              <Input
                id="edit_title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_date">Date & Time</Label>
                <Input
                  id="edit_date"
                  type="datetime-local"
                  value={editData.event_date}
                  onChange={(e) => setEditData({ ...editData, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_location">Location</Label>
                <Input
                  id="edit_location"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_building">Building</Label>
                <Input
                  id="edit_building"
                  value={editData.building}
                  onChange={(e) => setEditData({ ...editData, building: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_room">Room</Label>
                <Input
                  id="edit_room"
                  value={editData.room_number}
                  onChange={(e) => setEditData({ ...editData, room_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_capacity">Capacity</Label>
                <Input
                  id="edit_capacity"
                  type="number"
                  value={editData.capacity}
                  onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_type">Event Type</Label>
              <Input
                id="edit_type"
                value={editData.event_type}
                onChange={(e) => setEditData({ ...editData, event_type: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateEvent.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="students">
                Students ({studentRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="alumni">
                Alumni/Mentors ({alumniRegistrations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {event.description && (
                <p className="text-muted-foreground">{event.description}</p>
              )}
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Date & Time:</span>
                  {new Date(event.event_date).toLocaleString()}
                </div>
                {(event.location || event.building || event.room_number) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Location:</span>
                    {[event.location, event.building, event.room_number && `Room ${event.room_number}`]
                      .filter(Boolean)
                      .join(" - ")}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Registrations:</span>
                  {(studentRegistrations.length + alumniRegistrations.length)} registered
                  {event.capacity && ` / ${event.capacity} capacity`}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="mt-4">
              {studentRegistrations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No students registered yet
                </p>
              ) : (
                <div className="space-y-2">
                  {studentRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{reg.profile?.name || "Unknown Student"}</p>
                          <p className="text-sm text-muted-foreground">{reg.profile?.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="alumni" className="mt-4">
              {alumniRegistrations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No alumni registered yet
                </p>
              ) : (
                <div className="space-y-2">
                  {alumniRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {reg.profile?.is_mentor ? (
                          <UserCheck className="h-5 w-5 text-green-600" />
                        ) : (
                          <Users className="h-5 w-5 text-blue-600" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{reg.profile?.name || "Unknown Alumni"}</p>
                            {reg.profile?.is_mentor && (
                              <Badge variant="secondary" className="text-xs">Mentor</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{reg.profile?.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
