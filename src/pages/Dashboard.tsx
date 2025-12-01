import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EventManager from "@/components/EventManager";
import FacultyCaseCompetitionDirector from "@/components/FacultyCaseCompetitionDirector";
import FacultySpeakerCommunications from "@/components/FacultySpeakerCommunications";
import FacultyMentorMatcher from "@/components/FacultyMentorMatcher";
import ResearchCollaborationHub from "@/components/ResearchCollaborationHub";
import AnalyticsCommunicationDashboard from "@/components/AnalyticsCommunicationDashboard";
import EmailGenerator from "@/components/EmailGenerator";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Portal</h1>
          <p className="text-lg text-muted-foreground">Comprehensive management tools for all campus activities</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="speakers">Communications</TabsTrigger>
            <TabsTrigger value="mentors">Mentor Matcher</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="email">Email Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsCommunicationDashboard />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="competitions">
            <FacultyCaseCompetitionDirector />
          </TabsContent>

          <TabsContent value="speakers">
            <FacultySpeakerCommunications />
          </TabsContent>

          <TabsContent value="mentors">
            <FacultyMentorMatcher />
          </TabsContent>

          <TabsContent value="research">
            <ResearchCollaborationHub />
          </TabsContent>

          <TabsContent value="email">
            <EmailGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
