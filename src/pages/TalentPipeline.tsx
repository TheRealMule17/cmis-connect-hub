import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, FileText, Mail, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TalentPipeline = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [resumeModal, setResumeModal] = useState<{
    open: boolean;
    url: string;
    name: string;
  }>({
    open: false,
    url: "",
    name: ""
  });

  const { data: students } = useQuery({
    queryKey: ["students_for_sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("student_profiles").select("id, name, email, skills, resume_url").order("name");
      if (error) throw error;
      return data;
    }
  });

  const allSkills = Array.from(new Set(students?.flatMap(s => s.skills || []).filter(Boolean) || [])).sort();

  const filteredStudents = students?.filter(student => {
    const matchesSearch = !searchQuery || student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || student.email?.toLowerCase().includes(searchQuery.toLowerCase()) || student.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.every(skill => student.skills?.includes(skill));
    return matchesSearch && matchesSkills;
  }) || [];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
  };

  const programs = [{
    title: "Internship Program",
    description: "Place your company's internship opportunities directly in front of our top-performing students.",
    features: ["Priority job board placement", "Resume database access", "On-campus recruiting events"]
  }, {
    title: "Co-op Partnerships",
    description: "Establish long-term cooperative education partnerships with structured rotation programs.",
    features: ["Multi-semester placements", "Academic credit integration", "Dedicated coordinator support"]
  }, {
    title: "Graduate Recruitment",
    description: "Connect with graduating seniors and graduate students ready to launch their careers.",
    features: ["Career fair participation", "Info session hosting", "Direct interview scheduling"]
  }];

  const stats = [{
    value: "500+",
    label: "Students placed annually"
  }, {
    value: "95%",
    label: "Placement satisfaction rate"
  }, {
    value: "60+",
    label: "Partner companies"
  }, {
    value: "85%",
    label: "Full-time conversion rate"
  }];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ScrollFadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Talent Pipeline</h1>
                <p className="text-lg text-muted-foreground">Connect with top students and graduates</p>
              </div>
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.1}>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.2}>
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">Why Partner With Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our MIS program produces highly skilled graduates proficient in data analytics, 
                cybersecurity, business intelligence, and enterprise systems. By partnering with us, 
                you gain exclusive access to a pipeline of talent trained in the latest technologies 
                and business practices.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Early access to top-performing students</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Customized recruitment partnerships</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Resume and portfolio database access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>On-campus interviewing facilities</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.3}>
          <h2 className="text-2xl font-bold mb-4">Recruitment Programs</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {programs.map(program => (
              <Card key={program.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.4}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Talent
              </CardTitle>
              <CardDescription>Search and filter students by name, email, or skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name, email, or skill..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                {(searchQuery || selectedSkills.length > 0) && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {allSkills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filter by Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map(skill => (
                      <Badge key={skill} variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer hover:bg-primary/80" onClick={() => toggleSkill(skill)}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(searchQuery || selectedSkills.length > 0) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                  </p>
                  
                  {filteredStudents.length > 0 ? (
                    <div className="space-y-3">
                      {filteredStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium">{student.name || "Unknown Student"}</p>
                            {student.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${student.email}`} className="hover:underline">
                                  {student.email}
                                </a>
                              </div>
                            )}
                            {student.skills && student.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {student.skills.map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {student.resume_url && (
                            <Button variant="outline" size="sm" onClick={() => setResumeModal({
                              open: true,
                              url: student.resume_url!,
                              name: student.name || "Student"
                            })}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Resume
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No students match your search criteria. Try adjusting your filters.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Ready to Build Your Talent Pipeline?</CardTitle>
              <CardDescription>Contact our corporate relations team to discuss partnership opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate("/contact")}>Contact Us</Button>
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>
      </main>

      <Footer />

      <Dialog open={resumeModal.open} onOpenChange={open => setResumeModal(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{resumeModal.name}'s Resume</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full min-h-0">
            <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(resumeModal.url)}&embedded=true`} className="w-full h-full min-h-[60vh] border rounded-lg" title={`${resumeModal.name}'s Resume`} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentPipeline;
