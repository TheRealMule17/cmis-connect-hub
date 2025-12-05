import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Edit2, Save, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ResearchCollaboration {
  id: string;
  title: string;
  description: string | null;
  research_area: string | null;
  collaboration_type: string | null;
  seeking_roles: string[] | null;
  requirements: string | null;
  status: string | null;
}

interface ResearchDetailDialogProps {
  collaboration: ResearchCollaboration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResearchDetailDialog = ({ collaboration, open, onOpenChange }: ResearchDetailDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    research_area: "",
    collaboration_type: "",
    seeking_roles: "",
    requirements: "",
    status: "",
  });

  const updateCollaboration = useMutation({
    mutationFn: async () => {
      if (!collaboration?.id) return;
      const { error } = await supabase
        .from("research_collaborations")
        .update({
          title: editData.title,
          description: editData.description || null,
          research_area: editData.research_area || null,
          collaboration_type: editData.collaboration_type || null,
          seeking_roles: editData.seeking_roles ? editData.seeking_roles.split(",").map(s => s.trim()) : null,
          requirements: editData.requirements || null,
          status: editData.status || "open",
        })
        .eq("id", collaboration.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research_collaborations"] });
      toast({ title: "Research opportunity updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update research opportunity", variant: "destructive" });
    },
  });

  const deleteCollaboration = useMutation({
    mutationFn: async () => {
      if (!collaboration?.id) return;
      const { error } = await supabase
        .from("research_collaborations")
        .delete()
        .eq("id", collaboration.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research_collaborations"] });
      toast({ title: "Research opportunity deleted successfully" });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to delete research opportunity", variant: "destructive" });
    },
  });

  const startEditing = () => {
    if (!collaboration) return;
    setEditData({
      title: collaboration.title || "",
      description: collaboration.description || "",
      research_area: collaboration.research_area || "",
      collaboration_type: collaboration.collaboration_type || "",
      seeking_roles: collaboration.seeking_roles?.join(", ") || "",
      requirements: collaboration.requirements || "",
      status: collaboration.status || "open",
    });
    setIsEditing(true);
  };

  if (!collaboration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                {collaboration.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant={collaboration.status === "open" ? "default" : "secondary"}>
                  {collaboration.status}
                </Badge>
                {collaboration.collaboration_type && (
                  <Badge variant="outline">{collaboration.collaboration_type}</Badge>
                )}
              </DialogDescription>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Research Opportunity</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{collaboration.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCollaboration.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">Project Title</Label>
              <Input
                id="edit_title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Project Description</Label>
              <Textarea
                id="edit_description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_area">Research Area</Label>
                <Input
                  id="edit_area"
                  value={editData.research_area}
                  onChange={(e) => setEditData({ ...editData, research_area: e.target.value })}
                  placeholder="e.g., Machine Learning, Finance"
                />
              </div>
              <div>
                <Label htmlFor="edit_type">Collaboration Type</Label>
                <Input
                  id="edit_type"
                  value={editData.collaboration_type}
                  onChange={(e) => setEditData({ ...editData, collaboration_type: e.target.value })}
                  placeholder="e.g., Joint Research, Data Analysis"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_roles">Seeking Roles (comma-separated)</Label>
              <Input
                id="edit_roles"
                value={editData.seeking_roles}
                onChange={(e) => setEditData({ ...editData, seeking_roles: e.target.value })}
                placeholder="Data Analyst, Research Assistant, Co-Investigator"
              />
            </div>
            <div>
              <Label htmlFor="edit_requirements">Requirements</Label>
              <Textarea
                id="edit_requirements"
                value={editData.requirements}
                onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                placeholder="Required skills, qualifications, or experience"
              />
            </div>
            <div>
              <Label htmlFor="edit_status">Status</Label>
              <Input
                id="edit_status"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                placeholder="open, closed, in_progress"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateCollaboration.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {collaboration.description && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                <p className="text-foreground">{collaboration.description}</p>
              </div>
            )}
            
            {collaboration.research_area && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Research Area</h4>
                <p className="text-foreground">{collaboration.research_area}</p>
              </div>
            )}
            
            {collaboration.collaboration_type && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Collaboration Type</h4>
                <p className="text-foreground">{collaboration.collaboration_type}</p>
              </div>
            )}
            
            {collaboration.seeking_roles && collaboration.seeking_roles.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Seeking Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {collaboration.seeking_roles.map((role, idx) => (
                    <Badge key={idx} variant="outline">{role}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {collaboration.requirements && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Requirements</h4>
                <p className="text-foreground">{collaboration.requirements}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResearchDetailDialog;
