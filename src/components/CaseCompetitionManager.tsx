import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trophy, Calendar, DollarSign, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CaseCompetitionManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    prize_pool: "",
    sponsor: "",
    max_team_size: "",
  });

  const { data: competitions } = useQuery({
    queryKey: ["case_competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_competitions")
        .select("*")
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createCompetition = useMutation({
    mutationFn: async (newComp: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("case_competitions").insert({
        ...newComp,
        max_team_size: newComp.max_team_size ? parseInt(newComp.max_team_size) : null,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case_competitions"] });
      toast({ title: "Competition created successfully" });
      setIsCreating(false);
      setFormData({ title: "", description: "", start_date: "", end_date: "", prize_pool: "", sponsor: "", max_team_size: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Case Competition Manager</h2>
          <p className="text-muted-foreground">Organize and track case competitions</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "Create Competition"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createCompetition.mutate(formData); }} className="space-y-4">
              <div>
                <Label htmlFor="title">Competition Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prize_pool">Prize Pool</Label>
                  <Input
                    id="prize_pool"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                    placeholder="$5,000"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor">Sponsor</Label>
                  <Input
                    id="sponsor"
                    value={formData.sponsor}
                    onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_team_size">Max Team Size</Label>
                  <Input
                    id="max_team_size"
                    type="number"
                    value={formData.max_team_size}
                    onChange={(e) => setFormData({ ...formData, max_team_size: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit">Create Competition</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {competitions?.map((comp) => (
          <Card key={comp.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {comp.title}
              </CardTitle>
              <CardDescription>{comp.sponsor && `Sponsored by ${comp.sponsor}`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{comp.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
              </div>
              {comp.prize_pool && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  Prize: {comp.prize_pool}
                </div>
              )}
              {comp.max_team_size && (
                <p className="text-sm">Max team size: {comp.max_team_size}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CaseCompetitionManager;