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
      tier: "exabyte",
      logo_url: "/logos/conocophillips.png",
      description: "Founding Member"
    },
    {
      id: "2",
      company_name: "Exabeam",
      tier: "exabyte",
      logo_url: "/logos/exabeam.png",
      description: "Exabyte Sponsor"
    },
    {
      id: "3",
      company_name: "Valero",
      tier: "exabyte",
      logo_url: "/logos/valero.png",
      description: "Exabyte Sponsor"
    }
  ];

  const { data: dbSponsors } = useQuery({
    queryKey: ["top_sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_profiles")
        .select("*")
        .in("tier", ["exabyte", "petabyte", "gold", "silver"])
        .order("tier", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  // Combine static sponsors with database sponsors
  const sponsors = [...staticSponsors, ...(dbSponsors || [])];

  const getTierDisplay = (tier: string | null) => {
    if (tier === "exabyte" || tier === "gold") return "EXABYTE";
    if (tier === "petabyte" || tier === "silver") return "PETABYTE";
    if (tier === "terabyte" || tier === "bronze") return "TERABYTE";
    return tier?.toUpperCase() || "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Our Top Sponsors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {sponsors?.map((sponsor) => (
            <div 
              key={sponsor.id} 
              className="p-10 border-2 border-yellow-500/30 rounded-lg text-center space-y-6 bg-gradient-to-br from-yellow-50/50 to-amber-50/30 dark:from-yellow-950/20 dark:to-amber-950/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-500/50 flex flex-col justify-center min-h-[280px]"
            >
              {sponsor.logo_url && (
                <div className="flex items-center justify-center h-40 flex-1">
                  <img src={sponsor.logo_url} alt={sponsor.company_name} className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <h4 className="font-semibold text-xl">{sponsor.company_name}</h4>
              <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-1.5">
                {sponsor.company_name === "ConocoPhillips" ? "FOUNDING MEMBER" : getTierDisplay(sponsor.tier)}
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
