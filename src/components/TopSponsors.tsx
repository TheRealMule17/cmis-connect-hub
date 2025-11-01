import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TopSponsors = () => {
  const { data: sponsors } = useQuery({
    queryKey: ["top_sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_profiles")
        .select("*")
        .in("tier", ["gold", "silver"])
        .order("tier", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Our Top Sponsors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {sponsors?.map((sponsor) => (
            <div key={sponsor.id} className="p-4 border rounded-lg text-center space-y-2">
              {sponsor.logo_url && (
                <img src={sponsor.logo_url} alt={sponsor.company_name} className="h-12 mx-auto object-contain" />
              )}
              <h4 className="font-semibold">{sponsor.company_name}</h4>
              <Badge variant={sponsor.tier === "gold" ? "default" : "secondary"}>
                {sponsor.tier?.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
        {!sponsors?.length && (
          <p className="text-center text-muted-foreground py-4">No sponsors yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSponsors;