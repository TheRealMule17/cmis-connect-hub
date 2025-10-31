import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Linkedin, Twitter, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialConnectionsProps {
  userId: string;
}

const SocialConnections = ({ userId }: SocialConnectionsProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSocialLinks();
  }, [userId]);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('linkedin_url, twitter_url, website_url')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setLinkedinUrl(data.linkedin_url || "");
        setTwitterUrl(data.twitter_url || "");
        setWebsiteUrl(data.website_url || "");
      }
    } catch (error: any) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('alumni_profiles')
        .update({
          linkedin_url: linkedinUrl || null,
          twitter_url: twitterUrl || null,
          website_url: websiteUrl || null,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social connections updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Connections</CardTitle>
        <CardDescription>
          Connect your professional and social media profiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </Label>
          <Input
            id="twitter"
            type="url"
            placeholder="https://twitter.com/yourhandle"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Personal Website
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Connections"}
        </Button>

        {(linkedinUrl || twitterUrl || websiteUrl) && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Your Links:</p>
            <div className="flex flex-wrap gap-2">
              {linkedinUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {twitterUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </Button>
              )}
              {websiteUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialConnections;
