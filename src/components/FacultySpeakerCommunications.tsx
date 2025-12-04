import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FacultySpeakerCommunications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    message_type: "thank_you",
    subject: "",
    message: "",
    target_tier: "individual",
  });

  const { data: communications } = useQuery({
    queryKey: ["faculty_communications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faculty_communications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createCommunication = useMutation({
    mutationFn: async (newComm: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("faculty_communications").insert({
        ...newComm,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty_communications"] });
      toast({ title: "Message posted successfully" });
      setIsCreating(false);
      setFormData({ message_type: "thank_you", subject: "", message: "", target_tier: "all" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Speaker & Sponsor Communications</h2>
          <p className="text-muted-foreground">Send messages to sponsors and track communications</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "New Message"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createCommunication.mutate(formData); }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="message_type">Message Type</Label>
                  <Select value={formData.message_type} onValueChange={(val) => setFormData({ ...formData, message_type: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thank_you">Thank You Note</SelectItem>
                      <SelectItem value="sponsor_request">Sponsor Request</SelectItem>
                      <SelectItem value="event_invitation">Event Invitation</SelectItem>
                      <SelectItem value="update">General Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target_tier">Recipient</Label>
                  <Select value={formData.target_tier} onValueChange={(val) => setFormData({ ...formData, target_tier: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all">All Sponsors</SelectItem>
                      <SelectItem value="individual">Individual Message</SelectItem>
                      <SelectItem value="event_attendees">Event Attendees</SelectItem>
                      <SelectItem value="exabyte">Exabyte Tier Only</SelectItem>
                      <SelectItem value="petabyte">Petabyte Tier Only</SelectItem>
                      <SelectItem value="terabyte">Terabyte Tier Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit">Post Message</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication History
          </CardTitle>
          <CardDescription>Repository of past communications with sponsors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communications?.map((comm) => (
              <div key={comm.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{comm.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comm.created_at).toLocaleDateString()} at {new Date(comm.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{comm.message_type?.replace("_", " ")}</Badge>
                    <Badge variant="secondary">{comm.target_tier}</Badge>
                  </div>
                </div>
                <p className="text-sm">{comm.message}</p>
              </div>
            ))}
            {!communications?.length && (
              <p className="text-center text-muted-foreground py-8">No communications yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultySpeakerCommunications;