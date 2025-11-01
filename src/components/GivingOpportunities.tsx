import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GivingOpportunities = () => {
  const { data: opportunities } = useQuery({
    queryKey: ["giving_opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("giving_opportunities")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Giving Opportunities
        </CardTitle>
        <CardDescription>Ways to give back to the CMIS community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities?.map((opp) => (
          <div key={opp.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold">{opp.title}</h4>
              {opp.category && <Badge variant="outline">{opp.category}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{opp.description}</p>
            {opp.contact_email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${opp.contact_email}`}>Contact for More Info</a>
              </Button>
            )}
          </div>
        ))}
        {!opportunities?.length && (
          <p className="text-center text-muted-foreground py-8">No opportunities available at this time</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GivingOpportunities;