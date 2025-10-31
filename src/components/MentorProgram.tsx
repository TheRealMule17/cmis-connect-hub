import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MentorProgramProps {
  userId: string;
}

const MentorProgram = ({ userId }: MentorProgramProps) => {
  const [isMentor, setIsMentor] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [newExpertise, setNewExpertise] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMentorStatus();
  }, [userId]);

  const fetchMentorStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('is_mentor, mentor_expertise, mentor_availability')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setIsMentor(data.is_mentor || false);
        setExpertise(data.mentor_expertise || []);
        setAvailability(data.mentor_availability || "");
      }
    } catch (error: any) {
      console.error('Error fetching mentor status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProgram = async () => {
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ is_mentor: true })
        .eq('user_id', userId);

      if (error) throw error;

      setIsMentor(true);
      toast({
        title: "Welcome to the Mentor Program!",
        description: "Thank you for volunteering to give back to students",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveProgram = async () => {
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ 
          is_mentor: false,
          mentor_expertise: [],
          mentor_availability: ""
        })
        .eq('user_id', userId);

      if (error) throw error;

      setIsMentor(false);
      setExpertise([]);
      setAvailability("");
      toast({
        title: "Left Mentor Program",
        description: "You can rejoin anytime",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExpertise = async () => {
    if (!newExpertise.trim() || expertise.includes(newExpertise.trim())) return;

    const updated = [...expertise, newExpertise.trim()];
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ mentor_expertise: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setExpertise(updated);
      setNewExpertise("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveExpertise = async (item: string) => {
    const updated = expertise.filter(e => e !== item);
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ mentor_expertise: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setExpertise(updated);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ mentor_availability: availability })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability updated",
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
          <CardTitle>Mentor Program</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Mentor Program
        </CardTitle>
        <CardDescription>
          {isMentor 
            ? "Thank you for being a mentor!" 
            : "Share your experience and help current students"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isMentor ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">
              Join our mentor program to connect with current students, share your career insights, 
              and make a meaningful impact on their future.
            </p>
            <Button onClick={handleJoinProgram}>Join Mentor Program</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Areas of Expertise</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Software Engineering, Marketing"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                />
                <Button onClick={handleAddExpertise}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveExpertise(item)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                placeholder="e.g., Available for virtual meetings on weekends, 1-2 hours per month"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
              <Button onClick={handleUpdateAvailability} variant="outline" size="sm">
                Update Availability
              </Button>
            </div>

            <Button variant="destructive" onClick={handleLeaveProgram}>
              Leave Program
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentorProgram;
