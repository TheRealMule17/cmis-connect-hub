import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AnalyticsCommunicationDashboard = () => {
  const { data: events } = useQuery({
    queryKey: ["analytics_events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, capacity");
      return data;
    },
  });

  // Fetch all registrations with user roles
  const { data: registrations } = useQuery({
    queryKey: ["analytics_registrations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("event_registrations")
        .select("event_id, user_id");
      return data;
    },
  });

  // Fetch student user IDs
  const { data: studentUsers } = useQuery({
    queryKey: ["analytics_student_users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_profiles")
        .select("user_id");
      return data?.map(s => s.user_id) || [];
    },
  });

  // Fetch alumni user IDs
  const { data: alumniUsers } = useQuery({
    queryKey: ["analytics_alumni_users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("alumni_profiles")
        .select("user_id");
      return data?.map(a => a.user_id) || [];
    },
  });

  const { data: students } = useQuery({
    queryKey: ["analytics_students"],
    queryFn: async () => {
      const { count } = await supabase.from("student_profiles").select("*", { count: "exact", head: true });
      return count;
    },
  });

  const { data: alumni } = useQuery({
    queryKey: ["analytics_alumni"],
    queryFn: async () => {
      const { count } = await supabase.from("alumni_profiles").select("*", { count: "exact", head: true });
      return count;
    },
  });

  const { data: dbSponsors } = useQuery({
    queryKey: ["analytics_sponsors"],
    queryFn: async () => {
      const { data } = await supabase.from("sponsor_profiles").select("id");
      return data || [];
    },
  });

  // Static sponsors count (matching SponsorShowcase)
  const staticSponsorCount = 13; // 3 Exabyte + 1 Petabyte + 9 Terabyte
  const totalSponsors = staticSponsorCount + (dbSponsors?.length || 0);

  const eventChartData = events?.slice(0, 5).map(e => {
    const eventRegs = registrations?.filter(r => r.event_id === e.id) || [];
    const studentCount = eventRegs.filter(r => studentUsers?.includes(r.user_id)).length;
    const alumniCount = eventRegs.filter(r => alumniUsers?.includes(r.user_id)).length;
    
    return {
      name: e.title?.substring(0, 15) || "Event",
      students: studentCount,
      alumni: alumniCount,
      capacity: e.capacity || 0
    };
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analytics & Communication Dashboard</h2>
        <p className="text-muted-foreground">Real-time metrics and role-based insights</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events?.length || 0}</div>
            <Badge variant="secondary" className="mt-2">Live Data</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students || 0}</div>
            <Badge variant="secondary" className="mt-2">Live Data</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Alumni Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alumni || 0}</div>
            <Badge variant="secondary" className="mt-2">Live Data</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Active Sponsors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSponsors}</div>
            <Badge variant="secondary" className="mt-2">Live Data</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Registration Trends</CardTitle>
            <CardDescription>Student and alumni registrations by event</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="hsl(var(--primary))" name="Students" />
                <Bar dataKey="alumni" fill="hsl(var(--chart-2))" name="Alumni" />
                <Bar dataKey="capacity" fill="hsl(var(--muted))" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Repository</CardTitle>
            <CardDescription>Automated communications sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">Event Reminders</span>
                  <Badge variant="outline">Auto-sent</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Triggered for upcoming events</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">Registration Confirmations</span>
                  <Badge variant="outline">Auto-sent</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sent upon event registration</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">Sponsor Thank You</span>
                  <Badge variant="outline">Manual</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sent via Communications tab</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsCommunicationDashboard;