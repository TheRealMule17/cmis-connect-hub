import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TopSponsors = () => {
  // Static sponsor data for display
  const staticSponsors = [
    {
      id: "1",
      company_name: "ConocoPhillips",
      tier: "gold",
      logo_url: "/logos/conocophillips.png",
      description: "Founding Member"
    },
    {
      id: "2",
      company_name: "Exabeam",
      tier: "gold",
      logo_url: "/logos/exabeam.png",
      description: "Gold Sponsor"
    },
    {
      id: "3",
      company_name: "Valero",
      tier: "gold",
      logo_url: "/logos/valero.png",
      description: "Gold Sponsor"
    }
  ];

  const { data: dbSponsors } = useQuery({
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

  // Combine static sponsors with database sponsors
  const sponsors = [...staticSponsors, ...(dbSponsors || [])];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Our Top Sponsors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {sponsors?.map((sponsor) => (
            <div key={sponsor.id} className="p-6 border rounded-lg text-center space-y-3">
              {sponsor.logo_url && (
                <img src={sponsor.logo_url} alt={sponsor.company_name} className="h-20 mx-auto object-contain" />
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