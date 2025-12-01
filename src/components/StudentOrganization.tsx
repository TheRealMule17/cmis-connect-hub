import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Calendar } from "lucide-react";

const StudentOrganization = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MISSA</CardTitle>
        <CardDescription>MIS Student Association</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The MIS Student Association connects students interested in Management Information Systems,
          fostering professional development and networking opportunities.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Join Our Community</h4>
              <p className="text-sm text-muted-foreground">
                Connect with fellow MIS students and industry professionals
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Upcoming Events</h4>
              <p className="text-sm text-muted-foreground">
                Check the events section for workshops, networking sessions, and more
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Get Involved</h4>
              <p className="text-sm text-muted-foreground">
                Reach out to learn about leadership opportunities and initiatives
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentOrganization;
