import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, MessageSquare, Calendar, Trophy } from "lucide-react";

const AnalyticsCommunicationDashboard = () => {
  const stats = [
    { icon: Users, title: "Total Students", value: "12,458", change: "+5.2%", trend: "up" },
    { icon: TrendingUp, title: "Engagement Rate", value: "87%", change: "+2.1%", trend: "up" },
    { icon: Calendar, title: "Active Events", value: "24", change: "+8", trend: "up" },
    { icon: Trophy, title: "Competitions", value: "6", change: "+2", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics & Communication Dashboard</h2>
        <p className="text-muted-foreground">Monitor engagement and communicate with stakeholders</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest portal interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">124 students accessed course materials</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">35 alumni registered for homecoming</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New case competition submissions: 12</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portal Distribution</CardTitle>
            <CardDescription>User engagement by portal type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Student Portal</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Alumni Portal</span>
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sponsor Portal</span>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary/60 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Center
            </CardTitle>
            <CardDescription>Send announcements and messages to portal users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Communication features coming soon. This will allow you to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Send announcements to all portals</li>
                <li>Schedule automated reminders</li>
                <li>Track message engagement</li>
                <li>Manage notification preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsCommunicationDashboard;