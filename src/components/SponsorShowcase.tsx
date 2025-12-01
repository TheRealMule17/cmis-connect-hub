import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SponsorShowcase = () => {
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
    queryKey: ["all_sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_profiles")
        .select("*")
        .order("tier", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Combine static sponsors with database sponsors
  const allSponsors = [...staticSponsors, ...(dbSponsors || [])];
  
  // Group sponsors by tier
  const goldSponsors = allSponsors.filter(s => s.tier === "gold");
  const silverSponsors = allSponsors.filter(s => s.tier === "silver");
  const bronzeSponsors = allSponsors.filter(s => s.tier === "bronze");

  const renderSponsorGrid = (sponsors: typeof allSponsors, tierName: string) => {
    if (sponsors.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No {tierName} sponsors yet
        </p>
      );
    }

    return (
      <div className={`grid gap-6 ${
        tierName === "Gold" ? "md:grid-cols-3" : 
        tierName === "Silver" ? "md:grid-cols-4" : 
        "md:grid-cols-5"
      }`}>
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.id} 
            className="p-6 border border-border rounded-lg bg-card hover:shadow-lg transition-shadow duration-300 text-center space-y-3"
          >
            {sponsor.logo_url ? (
              <div className="flex items-center justify-center h-24">
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.company_name} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <h4 className="font-semibold text-foreground">{sponsor.company_name}</h4>
            {sponsor.description && (
              <p className="text-sm text-muted-foreground">{sponsor.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Gold Tier */}
      <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-background dark:from-yellow-950/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              Gold Sponsors
            </CardTitle>
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Premier Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(goldSponsors, "Gold")}
        </CardContent>
      </Card>

      {/* Silver Tier */}
      <Card className="border-2 border-gray-400/20 bg-gradient-to-br from-gray-50/50 to-background dark:from-gray-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-gray-500" />
              Silver Sponsors
            </CardTitle>
            <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
              Supporting Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(silverSponsors, "Silver")}
        </CardContent>
      </Card>

      {/* Bronze Tier */}
      <Card className="border-2 border-orange-700/20 bg-gradient-to-br from-orange-50/50 to-background dark:from-orange-950/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-orange-700 dark:text-orange-600" />
              Bronze Sponsors
            </CardTitle>
            <Badge className="bg-orange-700 hover:bg-orange-800 text-white">
              Contributing Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(bronzeSponsors, "Bronze")}
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorShowcase;