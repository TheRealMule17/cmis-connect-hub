import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  accentColor?: string;
}

const PortalCard = ({ title, description, icon: Icon, link }: PortalCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" size="lg">
          <Link to={link}>Access Portal</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PortalCard;
