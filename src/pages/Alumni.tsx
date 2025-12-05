import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import MentorProgram from "@/components/MentorProgram";
import CareerHistory from "@/components/CareerHistory";
import SuccessStorySubmission from "@/components/SuccessStorySubmission";
import SocialConnections from "@/components/SocialConnections";
import GivingOpportunities from "@/components/GivingOpportunities";
import AlumniEventSignup from "@/components/AlumniEventSignup";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        
        <ScrollFadeIn>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Alumni Portal</h1>
              <p className="text-base md:text-lg text-muted-foreground">Welcome back, {userName}!</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="w-fit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </ScrollFadeIn>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ScrollFadeIn delay={0.1}>
              <AlumniEventSignup userId={userId} />
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.2}>
              <MentorProgram userId={userId} />
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.3}>
              <GivingOpportunities />
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.4}>
              <CareerHistory userId={userId} />
            </ScrollFadeIn>
          </div>
          
          <div className="space-y-6">
            <ScrollFadeIn direction="left" delay={0.1}>
              <SocialConnections userId={userId} />
            </ScrollFadeIn>
            <ScrollFadeIn direction="left" delay={0.2}>
              <SuccessStorySubmission userId={userId} />
            </ScrollFadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Alumni;
