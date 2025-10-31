import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Tag, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  userId: string;
}

const ProfileSettings = ({ userId }: ProfileSettingsProps) => {
  const [workingStatus, setWorkingStatus] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('working_status, interests, skills')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setWorkingStatus(data.working_status || "");
        setInterests(data.interests || []);
        setSkills(data.skills || []);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      setSaving(true);
      setWorkingStatus(status);

      const { error } = await supabase
        .from('student_profiles')
        .update({ working_status: status })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Working status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim() || interests.includes(newInterest.trim())) return;

    const updated = [...interests, newInterest.trim()];
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ interests: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setInterests(updated);
      setNewInterest("");
      toast({
        title: "Success",
        description: "Interest added",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveInterest = async (interest: string) => {
    const updated = interests.filter(i => i !== interest);
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ interests: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setInterests(updated);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;

    const updated = [...skills, newSkill.trim()];
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ skills: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setSkills(updated);
      setNewSkill("");
      toast({
        title: "Success",
        description: "Skill added",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    const updated = skills.filter(s => s !== skill);
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ skills: updated })
        .eq('user_id', userId);

      if (error) throw error;

      setSkills(updated);
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
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Working Status
          </CardTitle>
          <CardDescription>Update your current job search status</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={workingStatus} onValueChange={handleStatusUpdate} disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="searching">Searching</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="accepted">Accepted Offer</SelectItem>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="not_searching">Not Searching</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Interests
          </CardTitle>
          <CardDescription>Add topics and fields you're interested in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add an interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
            />
            <Button onClick={handleAddInterest}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveInterest(interest)}
                />
              </Badge>
            ))}
            {interests.length === 0 && (
              <p className="text-sm text-muted-foreground">No interests added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Skills
          </CardTitle>
          <CardDescription>Add your technical and professional skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <Button onClick={handleAddSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
