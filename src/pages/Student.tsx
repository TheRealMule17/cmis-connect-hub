import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ResumeUpload from "@/components/ResumeUpload";
import WorkshopList from "@/components/WorkshopList";
import ProfileSettings from "@/components/ProfileSettings";
import StudentEventRegistration from "@/components/StudentEventRegistration";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Student = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
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

    // Fetch profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('name, resume_url')
      .eq('user_id', session.user.id)
      .single();

    if (profile) {
      setUserName(profile.name || "Student");
      setResumeUrl(profile.resume_url);
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Student Portal</h1>
              <p className="text-base md:text-lg text-muted-foreground">Welcome back, {userName}!</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="w-fit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </ScrollFadeIn>

        {/* Full-width Upcoming Events */}
        <ScrollFadeIn delay={0.1}>
          <div className="mb-6">
            <StudentEventRegistration userId={userId} />
          </div>
        </ScrollFadeIn>

        <div className="grid lg:grid-cols-2 gap-6">
          <ScrollFadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <ResumeUpload 
                userId={userId} 
                currentResumeUrl={resumeUrl}
                onResumeUpdate={setResumeUrl}
              />
            </div>
          </ScrollFadeIn>
          
          <ScrollFadeIn direction="left" delay={0.3}>
            <div className="space-y-6">
              <ProfileSettings userId={userId} />
            </div>
          </ScrollFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Student;
