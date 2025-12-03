import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Terabyte",
    price: "$8,000",
    benefits: [
      "Logo on website",
      "2 event sponsorships per year",
      "Quarterly newsletter feature",
      "Access to resume book",
    ],
  },
  {
    name: "Petabyte",
    price: "$12,000",
    benefits: [
      "All Terabyte benefits",
      "4 event sponsorships per year",
      "Exclusive networking events",
      "Early access to talent",
      "Featured speaker slot",
    ],
  },
  {
    name: "Exabyte",
    price: "$16,000",
    benefits: [
      "All Petabyte benefits",
      "Unlimited event sponsorships",
      "Research collaboration opportunities",
      "Dedicated account manager",
      "Board advisory seat",
      "Custom recruitment programs",
    ],
  },
];

const SponsorTierBenefits = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Sponsorship Tiers
        </CardTitle>
        <CardDescription>Choose the partnership level that fits your goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div key={tier.name} className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-3xl font-bold text-primary mt-2">{tier.price}</p>
                <p className="text-sm text-muted-foreground">per year</p>
              </div>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Select {tier.name}</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorTierBenefits;
