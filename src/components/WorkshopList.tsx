import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

interface WorkshopListProps {
  userId: string;
}

const WorkshopList = ({ userId }: WorkshopListProps) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkshops();
    fetchRegistrations();
  }, [userId]);

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      setWorkshops(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load workshops",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select('workshop_id')
        .eq('user_id', userId);

      if (error) throw error;
      setRegistrations(new Set(data?.map(r => r.workshop_id) || []));
    } catch (error: any) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (workshopId: string) => {
    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .insert({ workshop_id: workshopId, user_id: userId });

      if (error) throw error;

      setRegistrations(prev => new Set([...prev, workshopId]));
      toast({
        title: "Success",
        description: "Registered for workshop successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (workshopId: string) => {
    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('workshop_id', workshopId)
        .eq('user_id', userId);

      if (error) throw error;

      setRegistrations(prev => {
        const next = new Set(prev);
        next.delete(workshopId);
        return next;
      });
      
      toast({
        title: "Success",
        description: "Unregistered from workshop",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workshops</CardTitle>
          <CardDescription>Loading workshops...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Workshops
        </CardTitle>
        <CardDescription>Register for workshops to enhance your skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workshops.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming workshops at this time
          </p>
        ) : (
          workshops.map((workshop) => {
            const isRegistered = registrations.has(workshop.id);
            return (
              <div
                key={workshop.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{workshop.title}</h3>
                    <p className="text-sm text-muted-foreground">{workshop.description}</p>
                  </div>
                  {isRegistered && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(workshop.date), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {workshop.location}
                  </div>
                  {workshop.capacity && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {workshop.capacity}
                    </div>
                  )}
                </div>
                <Button
                  variant={isRegistered ? "outline" : "default"}
                  size="sm"
                  onClick={() => isRegistered ? handleUnregister(workshop.id) : handleRegister(workshop.id)}
                  className="w-full"
                >
                  {isRegistered ? "Unregister" : "Register"}
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default WorkshopList;
