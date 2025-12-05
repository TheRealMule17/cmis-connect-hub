import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Sparkles, Loader2, Download, RefreshCw, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface N8nMatch {
  "Student Name": string;
  "Mentor Name": string;
}

const FacultyMentorMatcher = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [n8nMatches, setN8nMatches] = useState<N8nMatch[]>([]);
  const [n8nLoading, setN8nLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  // Synced data queries
  const { data: syncedStudents } = useQuery({
    queryKey: ["synced-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_form_responses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: syncedMentors } = useQuery({
    queryKey: ["synced-mentors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_form_responses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: syncedMatches } = useQuery({
    queryKey: ["synced-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_match_results")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

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

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        "https://mitchpeif.app.n8n.cloud/webhook/sync-google-sheet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "sync" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Handle array response (multiple records) or single object
        const records = Array.isArray(data) ? data : [data];
        const recordCount = records.length;
        
        // Check if it's the expected n8n format with Email ID, Recipient, etc.
        const hasEmailFormat = records.some(r => r["Email ID"] || r["Recipient"] || r["Email Body"]);
        
        toast({
          title: "Data synced successfully!",
          description: hasEmailFormat 
            ? `Synced ${recordCount} record${recordCount !== 1 ? 's' : ''} from n8n`
            : "Refreshing data from Google Sheets...",
        });
        
        // Invalidate queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["synced-students"] });
        queryClient.invalidateQueries({ queryKey: ["synced-mentors"] });
        queryClient.invalidateQueries({ queryKey: ["synced-matches"] });
      } else {
        toast({
          title: "Sync failed",
          description: "Could not sync data from Google Sheets",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: "Failed to connect to sync service",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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

  const runN8nWorkflow = async () => {
    setN8nLoading(true);
    setN8nMatches([]);
    
    try {
      console.log('Starting matching workflow...');
      const response = await fetch(
        "https://mitchpeif.app.n8n.cloud/webhook/cf748cb3-bba2-4714-84be-25c078cb6104",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to run matching workflow");
      }
      
      // Expect n8n to return matches directly in the response
      const data = await response.json();
      console.log('Workflow response:', data);
      
      // Handle different response formats
      let matches: N8nMatch[] = [];
      if (Array.isArray(data)) {
        matches = data;
      } else if (data.matches && Array.isArray(data.matches)) {
        matches = data.matches;
      } else if (data.message) {
        // Workflow started but no matches returned yet
        toast({
          title: "Workflow Started",
          description: data.message || "Check Google Sheets for results.",
        });
        setN8nLoading(false);
        return;
      }
      
      if (matches.length > 0) {
        setN8nMatches(matches);
        setLastRunTime(new Date().toLocaleString());
        toast({
          title: "Matching complete!",
          description: `${matches.length} students matched with mentors.`,
        });
      } else {
        toast({
          title: "No matches found",
          description: "No new student-mentor matches were created.",
        });
      }
    } catch (error) {
      console.error("n8n workflow error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast({
        title: "Matching failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setN8nLoading(false);
    }
  };

  const downloadCSV = () => {
    if (n8nMatches.length === 0) return;
    
    const csv = [
      "Student Name,Mentor Name",
      ...n8nMatches.map(m => `"${m["Student Name"]}","${m["Mentor Name"]}"`)
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentor-matches-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mentor Matcher</h2>
          <p className="text-muted-foreground">Match mentors and students based on interests and goals</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Sync Data
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sync Data from Google Sheets?</AlertDialogTitle>
              <AlertDialogDescription>
                This will refresh student, mentor, and match data from Google Sheets. 
                Existing data in the tables will be replaced.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={syncData}>Sync Data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Synced Data Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{syncedStudents?.length || 0}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Synced Students
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{syncedMentors?.length || 0}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Synced Mentors
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{syncedMatches?.length || 0}</CardTitle>
            <CardDescription>Synced Matches</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Current Matches - populated by n8n workflow */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Matches</CardTitle>
              <CardDescription>
                {lastRunTime 
                  ? `Last updated: ${lastRunTime}` 
                  : "Run the matching workflow to see student-mentor pairings"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {n8nMatches.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={downloadCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setN8nMatches([])}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={n8nLoading}>
                    {n8nLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Run Matching
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Run Matching Workflow?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will match students with mentors and send notification emails to all participants.
                      This action may take 10-30 seconds to complete.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={runN8nWorkflow}>
                      Run Workflow
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {n8nLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Running workflow... This may take up to 30 seconds.
              </p>
            </div>
          )}
          
          {!n8nLoading && n8nMatches.length > 0 && (
            <div className="space-y-4">
              <Badge variant="secondary">{n8nMatches.length} matches found</Badge>
              
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Mentor Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {n8nMatches.map((match, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{match["Student Name"]}</TableCell>
                        <TableCell>{match["Mentor Name"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
          
          {!n8nLoading && n8nMatches.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Click "Run Matching" to generate and view student-mentor matches
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyMentorMatcher;