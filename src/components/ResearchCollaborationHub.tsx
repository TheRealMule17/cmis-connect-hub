import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FlaskConical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ResearchCollaborationHub = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    research_area: "",
    collaboration_type: "",
    seeking_roles: "",
    requirements: "",
  });

  const { data: collaborations } = useQuery({
    queryKey: ["research_collaborations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_collaborations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createCollaboration = useMutation({
    mutationFn: async (newCollab: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("research_collaborations").insert({
        ...newCollab,
        seeking_roles: newCollab.seeking_roles ? newCollab.seeking_roles.split(",").map(s => s.trim()) : null,
        lead_researcher_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research_collaborations"] });
      toast({ title: "Research collaboration posted successfully" });
      setIsCreating(false);
      setFormData({ title: "", description: "", research_area: "", collaboration_type: "", seeking_roles: "", requirements: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Research Collaboration Hub</h2>
          <p className="text-muted-foreground">Facilitate research partnerships and projects</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "Post Opportunity"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Post Research Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createCollaboration.mutate(formData); }} className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="research_area">Research Area</Label>
                  <Input
                    id="research_area"
                    value={formData.research_area}
                    onChange={(e) => setFormData({ ...formData, research_area: e.target.value })}
                    placeholder="e.g., Machine Learning, Finance"
                  />
                </div>
                <div>
                  <Label htmlFor="collaboration_type">Collaboration Type</Label>
                  <Input
                    id="collaboration_type"
                    value={formData.collaboration_type}
                    onChange={(e) => setFormData({ ...formData, collaboration_type: e.target.value })}
                    placeholder="e.g., Joint Research, Data Analysis"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="seeking_roles">Seeking Roles (comma-separated)</Label>
                <Input
                  id="seeking_roles"
                  value={formData.seeking_roles}
                  onChange={(e) => setFormData({ ...formData, seeking_roles: e.target.value })}
                  placeholder="Data Analyst, Research Assistant, Co-Investigator"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Required skills, qualifications, or experience"
                />
              </div>
              <Button type="submit">Post Opportunity</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {collaborations?.map((collab) => (
          <Card key={collab.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                {collab.title}
              </CardTitle>
              <CardDescription>
                <Badge variant={collab.status === "open" ? "default" : "secondary"}>
                  {collab.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{collab.description}</p>
              {collab.research_area && (
                <p className="text-sm">
                  <span className="font-medium">Research Area: </span>
                  {collab.research_area}
                </p>
              )}
              {collab.collaboration_type && (
                <p className="text-sm">
                  <span className="font-medium">Type: </span>
                  {collab.collaboration_type}
                </p>
              )}
              {collab.seeking_roles && collab.seeking_roles.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Seeking: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {collab.seeking_roles.map((role, idx) => (
                      <Badge key={idx} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {collab.requirements && (
                <p className="text-sm">
                  <span className="font-medium">Requirements: </span>
                  {collab.requirements}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResearchCollaborationHub;