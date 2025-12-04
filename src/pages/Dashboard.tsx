import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import EventManager from "@/components/EventManager";
import FacultyCaseCompetitionDirector from "@/components/FacultyCaseCompetitionDirector";
import FacultySpeakerCommunications from "@/components/FacultySpeakerCommunications";
import FacultyMentorMatcher from "@/components/FacultyMentorMatcher";
import ResearchCollaborationHub from "@/components/ResearchCollaborationHub";
import AnalyticsCommunicationDashboard from "@/components/AnalyticsCommunicationDashboard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const defaultTab = searchParams.get("tab") || "analytics";
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/faculty-auth");
        return;
      }

      // Check if user has faculty role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "faculty")
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Access denied",
          description: "You need faculty privileges to access this page.",
          variant: "destructive",
        });
        navigate("/faculty-auth");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/faculty-auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/faculty-auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Portal</h1>
          <p className="text-lg text-muted-foreground">Comprehensive management tools for all campus activities</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="speakers">Communications</TabsTrigger>
            <TabsTrigger value="mentors">Mentor Matcher</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsCommunicationDashboard />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="competitions">
            <FacultyCaseCompetitionDirector />
          </TabsContent>

          <TabsContent value="speakers">
            <FacultySpeakerCommunications />
          </TabsContent>

          <TabsContent value="mentors">
            <FacultyMentorMatcher />
          </TabsContent>

          <TabsContent value="research">
            <ResearchCollaborationHub />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
