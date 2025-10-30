import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText, Award } from "lucide-react";

const Student = () => {
  const quickLinks = [
    { icon: BookOpen, title: "Course Materials", description: "Access your course content" },
    { icon: Calendar, title: "Academic Calendar", description: "View important dates" },
    { icon: FileText, title: "Assignments", description: "Submit and track assignments" },
    { icon: Award, title: "Grades", description: "Check your academic progress" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Portal</h1>
          <p className="text-lg text-muted-foreground">Welcome back! Access your academic resources.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {quickLinks.map((link) => (
            <Card key={link.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold">Registration for Spring 2024 Opens Soon</h3>
              <p className="text-sm text-muted-foreground">Registration begins December 1st. Check your advisor for course recommendations.</p>
            </div>
            <div className="border-l-4 border-accent pl-4 py-2">
              <h3 className="font-semibold">Final Exam Schedule Released</h3>
              <p className="text-sm text-muted-foreground">Review the exam schedule and plan your study time accordingly.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Student;
