import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuccessStory {
  id: string;
  title: string;
  story: string;
  category: string | null;
  is_published: boolean;
  submitted_at: string;
}

interface SuccessStorySubmissionProps {
  userId: string;
}

const SuccessStorySubmission = ({ userId }: SuccessStorySubmissionProps) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, [userId]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error: any) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !story.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and story",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('success_stories')
        .insert({
          user_id: userId,
          title,
          story,
          category: category || null,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your story has been submitted for review",
      });

      setTitle("");
      setStory("");
      setCategory("");
      fetchStories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Submit Success Story
          </CardTitle>
          <CardDescription>
            Share your achievements and inspire current students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Launched My First Startup"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career Achievement</SelectItem>
                <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                <SelectItem value="community">Community Impact</SelectItem>
                <SelectItem value="innovation">Innovation & Research</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Your Story</Label>
            <Textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share your journey, challenges overcome, and lessons learned..."
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {story.length}/2000 characters
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Story"}
          </Button>
        </CardContent>
      </Card>

      {stories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>Track your submitted stories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stories.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  {item.is_published ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Under Review
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.story}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuccessStorySubmission;
