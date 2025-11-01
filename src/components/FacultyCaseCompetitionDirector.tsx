import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FacultyCaseCompetitionDirector = () => {
  const { data: competitions } = useQuery({
    queryKey: ["competitions_director"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_competitions")
        .select(`
          *,
          case_competition_scores (
            room_number,
            judge_id,
            team_name
          )
        `)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getRoomAssignments = (scores: any[]) => {
    const rooms: Record<string, { judges: Set<string>, teams: Set<string> }> = {};
    
    scores?.forEach((score) => {
      const room = score.room_number || "Unassigned";
      if (!rooms[room]) {
        rooms[room] = { judges: new Set(), teams: new Set() };
      }
      rooms[room].judges.add(score.judge_id);
      rooms[room].teams.add(score.team_name);
    });

    return Object.entries(rooms).map(([room, data]) => ({
      room,
      judgeCount: data.judges.size,
      teamCount: data.teams.size,
      teams: Array.from(data.teams),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Case Competition Director View</h2>
          <p className="text-muted-foreground">Manage rooms, judges, and team assignments</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {competitions?.map((comp) => {
          const roomAssignments = getRoomAssignments(comp.case_competition_scores);
          
          return (
            <Card key={comp.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  {comp.title}
                </CardTitle>
                <CardDescription>
                  <Badge variant={comp.status === "upcoming" ? "default" : "secondary"}>
                    {comp.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <p><strong>Date:</strong> {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}</p>
                  {comp.max_team_size && <p><strong>Max Team Size:</strong> {comp.max_team_size}</p>}
                  {comp.prize_pool && <p><strong>Prize Pool:</strong> {comp.prize_pool}</p>}
                  {comp.sponsor && <p><strong>Sponsor:</strong> {comp.sponsor}</p>}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Room Assignments
                  </h4>
                  {roomAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {roomAssignments.map((assignment) => (
                        <div key={assignment.room} className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{assignment.room}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline">{assignment.judgeCount} Judge{assignment.judgeCount !== 1 ? 's' : ''}</Badge>
                              <Badge variant="outline">{assignment.teamCount} Team{assignment.teamCount !== 1 ? 's' : ''}</Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Teams:</strong> {assignment.teams.join(", ") || "None assigned"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No room assignments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyCaseCompetitionDirector;