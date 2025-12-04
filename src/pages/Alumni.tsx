import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MentorProgram from "@/components/MentorProgram";
import CareerHistory from "@/components/CareerHistory";
import SuccessStorySubmission from "@/components/SuccessStorySubmission";
import SocialConnections from "@/components/SocialConnections";
import GivingOpportunities from "@/components/GivingOpportunities";
import AlumniEventSignup from "@/components/AlumniEventSignup";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Alumni = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUserId(session.user.id);

    // Create alumni profile if it doesn't exist
    const { data: profile, error: fetchError } = await supabase
      .from('alumni_profiles')
      .select('name')
      .eq('user_id', session.user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      await supabase
        .from('alumni_profiles')
        .insert({
          user_id: session.user.id,
          name: session.user.user_metadata?.name || "Alumni",
          email: session.user.email,
        });
      setUserName(session.user.user_metadata?.name || "Alumni");
    } else if (profile) {
      setUserName(profile.name || "Alumni");
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Alumni Portal</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {userName}!</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AlumniEventSignup userId={userId} />
            <MentorProgram userId={userId} />
            <GivingOpportunities />
            <CareerHistory userId={userId} />
          </div>
          
          <div className="space-y-6">
            <SocialConnections userId={userId} />
            <SuccessStorySubmission userId={userId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Alumni;
