import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MentorMarketplace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expertise_areas: "",
    availability: "",
    max_mentees: "",
  });

  const { data: listings } = useQuery({
    queryKey: ["mentor_listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createListing = useMutation({
    mutationFn: async (newListing: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("mentor_listings").insert({
        ...newListing,
        expertise_areas: newListing.expertise_areas ? newListing.expertise_areas.split(",").map(s => s.trim()) : null,
        max_mentees: newListing.max_mentees ? parseInt(newListing.max_mentees) : null,
        mentor_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor_listings"] });
      toast({ title: "Mentor listing created successfully" });
      setIsCreating(false);
      setFormData({ title: "", description: "", expertise_areas: "", availability: "", max_mentees: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mentor Marketplace</h2>
          <p className="text-muted-foreground">Connect mentors with mentees</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "Create Listing"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Mentor Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createListing.mutate(formData); }} className="space-y-4">
              <div>
                <Label htmlFor="title">Listing Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Career Development Mentorship"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What kind of mentorship are you offering?"
                />
              </div>
              <div>
                <Label htmlFor="expertise_areas">Expertise Areas (comma-separated)</Label>
                <Input
                  id="expertise_areas"
                  value={formData.expertise_areas}
                  onChange={(e) => setFormData({ ...formData, expertise_areas: e.target.value })}
                  placeholder="Business Strategy, Finance, Marketing"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="Weekdays, 2 hours/week"
                  />
                </div>
                <div>
                  <Label htmlFor="max_mentees">Max Mentees</Label>
                  <Input
                    id="max_mentees"
                    type="number"
                    value={formData.max_mentees}
                    onChange={(e) => setFormData({ ...formData, max_mentees: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit">Create Listing</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {listings?.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription>
                <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                  {listing.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{listing.description}</p>
              {listing.expertise_areas && listing.expertise_areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {listing.expertise_areas.map((area, idx) => (
                    <Badge key={idx} variant="outline">{area}</Badge>
                  ))}
                </div>
              )}
              {listing.availability && (
                <p className="text-sm">
                  <span className="font-medium">Availability: </span>
                  {listing.availability}
                </p>
              )}
              {listing.max_mentees && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Max mentees: {listing.max_mentees}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentorMarketplace;