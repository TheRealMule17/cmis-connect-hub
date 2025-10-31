import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventManager from "@/components/EventManager";
import CaseCompetitionManager from "@/components/CaseCompetitionManager";
import IndustrySpeakerManager from "@/components/IndustrySpeakerManager";
import MentorMarketplace from "@/components/MentorMarketplace";
import ResearchCollaborationHub from "@/components/ResearchCollaborationHub";
import AnalyticsCommunicationDashboard from "@/components/AnalyticsCommunicationDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Portal</h1>
          <p className="text-lg text-muted-foreground">Comprehensive management tools for all campus activities</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsCommunicationDashboard />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="competitions">
            <CaseCompetitionManager />
          </TabsContent>

          <TabsContent value="speakers">
            <IndustrySpeakerManager />
          </TabsContent>

          <TabsContent value="mentors">
            <MentorMarketplace />
          </TabsContent>

          <TabsContent value="research">
            <ResearchCollaborationHub />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
