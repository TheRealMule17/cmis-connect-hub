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
    },
    {
      id: "13",
      company_name: "Phillips 66",
      tier: "petabyte",
      logo_url: "/logos/phillips66.png",
      description: "Petabyte Sponsor"
    },
    {
      id: "4",
      company_name: "Booz Allen Hamilton",
      tier: "terabyte",
      logo_url: "/logos/booz-allen-hamilton.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "5",
      company_name: "Chevron",
      tier: "terabyte",
      logo_url: "/logos/chevron.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "6",
      company_name: "General Motors",
      tier: "terabyte",
      logo_url: "/logos/gm.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "7",
      company_name: "Grant Thornton",
      tier: "terabyte",
      logo_url: "/logos/grant-thornton.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "8",
      company_name: "HBK Capital Management",
      tier: "terabyte",
      logo_url: "/logos/hbk-capital.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "9",
      company_name: "Palo Alto Networks",
      tier: "terabyte",
      logo_url: "/logos/palo-alto.webp",
      description: "Terabyte Sponsor"
    },
    {
      id: "10",
      company_name: "PepsiCo",
      tier: "terabyte",
      logo_url: "/logos/pepsico.svg",
      description: "Terabyte Sponsor"
    },
    {
      id: "11",
      company_name: "ShoWorks",
      tier: "terabyte",
      logo_url: "/logos/showorks.png",
      description: "Terabyte Sponsor"
    },
    {
      id: "12",
      company_name: "Umbrage",
      tier: "terabyte",
      logo_url: "/logos/umbrage.png",
      description: "Terabyte Sponsor"
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
  const exabyteSponsors = allSponsors.filter(s => s.tier === "exabyte" || s.tier === "gold");
  const petabyteSponsors = allSponsors.filter(s => s.tier === "petabyte" || s.tier === "silver");
  const terabyteSponsors = allSponsors.filter(s => s.tier === "terabyte" || s.tier === "bronze");

  const renderSponsorGrid = (sponsors: typeof allSponsors, tierName: string) => {
    if (sponsors.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No {tierName} sponsors yet
        </p>
      );
    }

    return (
      <div className={`grid gap-4 md:gap-6 ${
        tierName === "Exabyte" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : 
        tierName === "Petabyte" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : 
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      }`}>
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.id} 
            className="p-4 md:p-6 border border-border rounded-lg bg-card hover:shadow-lg transition-shadow duration-300 text-center space-y-2 md:space-y-3"
          >
            {sponsor.logo_url ? (
              <div className="flex items-center justify-center h-16 md:h-24">
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.company_name} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 md:h-24">
                <Building2 className="h-8 md:h-12 w-8 md:w-12 text-muted-foreground" />
              </div>
            )}
            <h4 className="font-semibold text-sm md:text-base text-foreground">{sponsor.company_name}</h4>
            {sponsor.description && (
              <p className="text-xs md:text-sm text-muted-foreground">{sponsor.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Exabyte Tier - Gold */}
      <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-background dark:from-yellow-950/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-yellow-600 dark:text-yellow-500" />
              Exabyte Sponsors
            </CardTitle>
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs md:text-sm">
              Premier Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(exabyteSponsors, "Exabyte")}
        </CardContent>
      </Card>

      {/* Petabyte Tier - Silver */}
      <Card className="border-2 border-gray-400/20 bg-gradient-to-br from-gray-50/50 to-background dark:from-gray-900/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              Petabyte Sponsors
            </CardTitle>
            <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs md:text-sm">
              Supporting Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(petabyteSponsors, "Petabyte")}
        </CardContent>
      </Card>

      {/* Terabyte Tier - Bronze */}
      <Card className="border-2 border-orange-700/20 bg-gradient-to-br from-orange-50/50 to-background dark:from-orange-950/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-orange-700 dark:text-orange-600" />
              Terabyte Sponsors
            </CardTitle>
            <Badge className="bg-orange-700 hover:bg-orange-800 text-white text-xs md:text-sm">
              Contributing Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {renderSponsorGrid(terabyteSponsors, "Terabyte")}
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorShowcase;
