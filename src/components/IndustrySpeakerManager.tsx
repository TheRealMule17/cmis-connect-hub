import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Phone, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const IndustrySpeakerManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    bio: "",
    expertise: "",
    speaking_topics: "",
    availability: "",
  });

  const { data: speakers } = useQuery({
    queryKey: ["industry_speakers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industry_speakers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createSpeaker = useMutation({
    mutationFn: async (newSpeaker: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("industry_speakers").insert({
        ...newSpeaker,
        expertise: newSpeaker.expertise ? newSpeaker.expertise.split(",").map(s => s.trim()) : null,
        speaking_topics: newSpeaker.speaking_topics ? newSpeaker.speaking_topics.split(",").map(s => s.trim()) : null,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industry_speakers"] });
      toast({ title: "Speaker added successfully" });
      setIsCreating(false);
      setFormData({ name: "", title: "", company: "", email: "", phone: "", bio: "", expertise: "", speaking_topics: "", availability: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Industry Speaker Manager</h2>
          <p className="text-muted-foreground">Manage industry experts and guest speakers</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "Add Speaker"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Speaker</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createSpeaker.mutate(formData); }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="Finance, Technology, Marketing"
                />
              </div>
              <div>
                <Label htmlFor="speaking_topics">Speaking Topics (comma-separated)</Label>
                <Input
                  id="speaking_topics"
                  value={formData.speaking_topics}
                  onChange={(e) => setFormData({ ...formData, speaking_topics: e.target.value })}
                  placeholder="Leadership, Innovation, Career Development"
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="Available on weekdays"
                />
              </div>
              <Button type="submit">Add Speaker</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {speakers?.map((speaker) => (
          <Card key={speaker.id}>
            <CardHeader>
              <CardTitle>{speaker.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {speaker.title} at {speaker.company}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {speaker.bio && <p className="text-sm text-muted-foreground">{speaker.bio}</p>}
              {speaker.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  {speaker.email}
                </div>
              )}
              {speaker.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {speaker.phone}
                </div>
              )}
              {speaker.expertise && speaker.expertise.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Expertise: </span>
                  {speaker.expertise.join(", ")}
                </div>
              )}
              {speaker.speaking_topics && speaker.speaking_topics.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Topics: </span>
                  {speaker.speaking_topics.join(", ")}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndustrySpeakerManager;