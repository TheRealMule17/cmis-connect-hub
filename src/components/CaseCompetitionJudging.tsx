import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CaseCompetitionJudgingProps {
  userId: string;
}

const CaseCompetitionJudging = ({ userId }: CaseCompetitionJudgingProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [scoreData, setScoreData] = useState({
    team_name: "",
    room_number: "",
    presentation_score: "",
    analysis_score: "",
    creativity_score: "",
    feedback: "",
  });

  const { data: competitions } = useQuery({
    queryKey: ["case_competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_competitions")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: myScores } = useQuery({
    queryKey: ["my_scores", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_competition_scores")
        .select("*")
        .eq("judge_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const submitScore = useMutation({
    mutationFn: async () => {
      const overall = (
        (parseInt(scoreData.presentation_score) || 0) +
        (parseInt(scoreData.analysis_score) || 0) +
        (parseInt(scoreData.creativity_score) || 0)
      ) / 3;

      const { error } = await supabase.from("case_competition_scores").insert({
        competition_id: selectedCompetition,
        judge_id: userId,
        team_name: scoreData.team_name,
        room_number: scoreData.room_number,
        presentation_score: parseInt(scoreData.presentation_score),
        analysis_score: parseInt(scoreData.analysis_score),
        creativity_score: parseInt(scoreData.creativity_score),
        overall_score: Math.round(overall),
        feedback: scoreData.feedback,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_scores"] });
      toast({ title: "Score submitted successfully" });
      setScoreData({
        team_name: "",
        room_number: "",
        presentation_score: "",
        analysis_score: "",
        creativity_score: "",
        feedback: "",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Case Competition Judging
          </CardTitle>
          <CardDescription>Submit scores and feedback for teams</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); submitScore.mutate(); }} className="space-y-4">
            <div>
              <Label>Competition</Label>
              <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select competition" />
                </SelectTrigger>
                <SelectContent>
                  {competitions?.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>{comp.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="team_name">Team Name</Label>
                <Input
                  id="team_name"
                  value={scoreData.team_name}
                  onChange={(e) => setScoreData({ ...scoreData, team_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  value={scoreData.room_number}
                  onChange={(e) => setScoreData({ ...scoreData, room_number: e.target.value })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="presentation_score">Presentation (0-100)</Label>
                <Input
                  id="presentation_score"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreData.presentation_score}
                  onChange={(e) => setScoreData({ ...scoreData, presentation_score: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="analysis_score">Analysis (0-100)</Label>
                <Input
                  id="analysis_score"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreData.analysis_score}
                  onChange={(e) => setScoreData({ ...scoreData, analysis_score: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="creativity_score">Creativity (0-100)</Label>
                <Input
                  id="creativity_score"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreData.creativity_score}
                  onChange={(e) => setScoreData({ ...scoreData, creativity_score: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={scoreData.feedback}
                onChange={(e) => setScoreData({ ...scoreData, feedback: e.target.value })}
                rows={4}
              />
            </div>
            <Button type="submit" disabled={!selectedCompetition}>Submit Score</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Submitted Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myScores?.map((score) => (
              <div key={score.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{score.team_name}</h4>
                    {score.room_number && <p className="text-sm text-muted-foreground">Room: {score.room_number}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{score.overall_score}</div>
                    <div className="text-xs text-muted-foreground">Overall</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Presentation: {score.presentation_score}</div>
                  <div>Analysis: {score.analysis_score}</div>
                  <div>Creativity: {score.creativity_score}</div>
                </div>
                {score.feedback && <p className="text-sm mt-2 text-muted-foreground">{score.feedback}</p>}
              </div>
            ))}
            {!myScores?.length && (
              <p className="text-center text-muted-foreground py-8">No scores submitted yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseCompetitionJudging;