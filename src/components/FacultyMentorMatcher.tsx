import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FacultyMentorMatcher = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mentors } = useQuery({
    queryKey: ["mentors_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alumni_profiles")
        .select("*")
        .eq("is_mentor", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: students } = useQuery({
    queryKey: ["students_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: matches } = useQuery({
    queryKey: ["mentor_matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_matches")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const autoMatch = useMutation({
    mutationFn: async () => {
      // Simple matching algorithm based on interests
      const newMatches: any[] = [];
      const matchedStudents = new Set(matches?.map(m => m.student_id) || []);

      students?.forEach((student) => {
        if (matchedStudents.has(student.user_id)) return;

        let bestMatch = null;
        let bestScore = 0;

        mentors?.forEach((mentor) => {
          const mentorMatches = matches?.filter(m => m.mentor_id === mentor.user_id).length || 0;
          if (mentorMatches >= 5) return; // Limit mentors to 5 students

          let score = 0;
          const studentInterests = student.interests || [];
          const mentorExpertise = mentor.mentor_expertise || [];

          studentInterests.forEach((interest: string) => {
            if (mentorExpertise.some((exp: string) => 
              exp.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(exp.toLowerCase())
            )) {
              score += 10;
            }
          });

          if (score > bestScore) {
            bestScore = score;
            bestMatch = mentor;
          }
        });

        if (bestMatch && bestScore > 0) {
          newMatches.push({
            mentor_id: bestMatch.user_id,
            student_id: student.user_id,
            match_score: bestScore,
            status: "matched",
          });
        }
      });

      if (newMatches.length > 0) {
        const { error } = await supabase.from("mentor_matches").insert(newMatches);
        if (error) throw error;
      }

      // Trigger n8n workflow
      try {
        await fetch("https://mitchpeif.app.n8n.cloud/webhook-test/cf748cb3-bba2-4714-84be-25c078cb6104", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            matchesCreated: newMatches.length,
            mentorCount: mentors?.length || 0,
            studentCount: students?.length || 0,
          }),
        });
      } catch (webhookError) {
        console.error("n8n webhook error:", webhookError);
      }

      return newMatches.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["mentor_matches"] });
      toast({ 
        title: `Auto-matching complete!`,
        description: `Created ${count} new mentor-student matches`
      });
    },
  });

  const unmatchedStudents = students?.filter(
    s => !matches?.some(m => m.student_id === s.user_id)
  ).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mentor Matcher</h2>
          <p className="text-muted-foreground">Match mentors and students based on interests and goals</p>
        </div>
        <Button onClick={() => autoMatch.mutate()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Auto-Match All
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{mentors?.length || 0}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Active Mentors
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{students?.length || 0}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{unmatchedStudents}</CardTitle>
            <CardDescription>Unmatched Students</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Matches</CardTitle>
          <CardDescription>Overview of mentor-student pairings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mentors?.map((mentor) => {
              const mentorMatches = matches?.filter(m => m.mentor_id === mentor.user_id) || [];
              
              return (
                <div key={mentor.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {mentor.current_position} at {mentor.current_company}
                      </p>
                    </div>
                    <Badge>{mentorMatches.length} Student{mentorMatches.length !== 1 ? 's' : ''}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.mentor_expertise?.map((exp: string, idx: number) => (
                      <Badge key={idx} variant="outline">{exp}</Badge>
                    ))}
                  </div>
                </div>
              );
            })}
            {!mentors?.length && (
              <p className="text-center text-muted-foreground py-8">No mentors enrolled yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyMentorMatcher;