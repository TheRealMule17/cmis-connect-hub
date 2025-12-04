import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResumeUpload from "@/components/ResumeUpload";
import WorkshopList from "@/components/WorkshopList";
import ProfileSettings from "@/components/ProfileSettings";
import StudentEventRegistration from "@/components/StudentEventRegistration";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Portal</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {userName}!</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Full-width Upcoming Events */}
        <div className="mb-6">
          <StudentEventRegistration userId={userId} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ResumeUpload 
              userId={userId} 
              currentResumeUrl={resumeUrl}
              onResumeUpdate={setResumeUrl}
            />
          </div>
          
          <div className="space-y-6">
            <ProfileSettings userId={userId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Student;
