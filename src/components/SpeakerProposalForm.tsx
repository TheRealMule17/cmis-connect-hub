import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface SpeakerProposalFormProps {
  sponsorId: string;
}

const SpeakerProposalForm = ({ sponsorId }: SpeakerProposalFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    speaker_name: "",
    speaker_title: "",
    topic: "",
    description: "",
    preferred_date: "",
  });

  const { data: proposals } = useQuery({
    queryKey: ["speaker_proposals", sponsorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speaker_proposals")
        .select("*")
        .eq("sponsor_id", sponsorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const submitProposal = useMutation({
    mutationFn: async (proposal: typeof formData) => {
      const { error } = await supabase.from("speaker_proposals").insert({
        ...proposal,
        sponsor_id: sponsorId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speaker_proposals"] });
      toast({ title: "Proposal submitted successfully" });
      setFormData({
        speaker_name: "",
        speaker_title: "",
        topic: "",
        description: "",
        preferred_date: "",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Submit Speaker Proposal
          </CardTitle>
          <CardDescription>Propose an industry speaker for campus events</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitProposal.mutate(formData);
            }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="speaker_name">Speaker Name</Label>
                <Input
                  id="speaker_name"
                  value={formData.speaker_name}
                  onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="speaker_title">Title/Position</Label>
                <Input
                  id="speaker_title"
                  value={formData.speaker_title}
                  onChange={(e) => setFormData({ ...formData, speaker_title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="topic">Topic/Title</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
              />
            </div>
            <Button type="submit">Submit Proposal</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals?.map((proposal) => (
              <div key={proposal.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{proposal.topic}</h4>
                    <p className="text-sm text-muted-foreground">
                      {proposal.speaker_name} - {proposal.speaker_title}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                    proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                {proposal.description && <p className="text-sm">{proposal.description}</p>}
                {proposal.preferred_date && (
                  <p className="text-sm text-muted-foreground">
                    Preferred: {new Date(proposal.preferred_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {!proposals?.length && (
              <p className="text-center text-muted-foreground py-8">No proposals submitted yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakerProposalForm;