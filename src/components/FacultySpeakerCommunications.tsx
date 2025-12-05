import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Calendar, RefreshCw, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmailReview from "./EmailReview";

const N8N_THANK_YOU_WORKFLOW_URL = "https://mule17.app.n8n.cloud/webhook/93302a7a-7929-4ab4-84bf-1f536e8bb856";

const FacultySpeakerCommunications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    message_type: "thank_you",
    subject: "",
    message: "",
    target_tier: "individual",
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");


  // Fetch recent/upcoming events
  const { data: events } = useQuery({
    queryKey: ["events_for_communications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date, location")
        .gte("event_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Past 30 days and future
        .order("event_date", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: formData.target_tier === "event_attendees",
  });

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ["students_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, user_id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: selectedCategory === "students",
  });

  // Fetch sponsors
  const { data: sponsors } = useQuery({
    queryKey: ["sponsors_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_profiles")
        .select("id, user_id, company_name, contact_email")
        .order("company_name");
      if (error) throw error;
      return data;
    },
    enabled: selectedCategory === "sponsors",
  });

  // Fetch alumni - always fetch for thank you workflow
  const { data: alumni } = useQuery({
    queryKey: ["alumni_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alumni_profiles")
        .select("id, user_id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false);

  const triggerN8nThankYouWorkflow = async (alumniId: string[], eventId: string | null) => {
    try {
      await fetch(N8N_THANK_YOU_WORKFLOW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumni_id: alumniId,
          event_id: eventId,
        }),
      });
      return true;
    } catch (error) {
      console.error("Error triggering n8n workflow:", error);
      return false;
    }
  };

  const triggerN8nBatchOutreach = async () => {
    try {
      console.log("Triggering batch outreach via Edge Function...");
      const { data, error } = await supabase.functions.invoke('trigger-n8n-outreach');
      
      if (error) {
        console.error("Edge function error:", error);
        return false;
      }
      
      console.log("Batch outreach response:", data);
      return data?.success === true;
    } catch (error) {
      console.error("Error triggering batch outreach workflow:", error);
      return false;
    }
  };

  const createCommunication = useMutation({
    mutationFn: async (newComm: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get recipient name based on selection
      let recipientName: string | null = null;
      let recipientId: string | null = null;
      let eventId: string | null = null;
      let eventName: string | null = null;

      if (newComm.target_tier === "individual" && selectedRecipient) {
        recipientId = selectedRecipient;
        const recipient = recipientsList.find(r => r.id === selectedRecipient);
        recipientName = recipient?.label || null;
      } else if (newComm.target_tier === "event_attendees" && selectedEvent) {
        eventId = selectedEvent;
        const event = events?.find(e => e.id === selectedEvent);
        eventName = event?.title || null;
      } else if (newComm.target_tier === "batch_emails" && selectedCategory === "all_alumni") {
        recipientName = "All Alumni (Batch)";
      }

      const { error } = await supabase.from("faculty_communications").insert({
        ...newComm,
        created_by: user.id,
        recipient_id: recipientId,
        recipient_name: recipientName,
        event_id: eventId,
        event_name: eventName,
      });
      if (error) throw error;

      // If this is a batch email with event invitation, trigger the batch outreach workflow
      if (newComm.target_tier === "batch_emails" && newComm.message_type === "event_invitation") {
        setIsTriggeringWorkflow(true);
        await triggerN8nBatchOutreach();
        setIsTriggeringWorkflow(false);
      }
      // If this is a thank you note, also trigger the n8n workflow
      else if (newComm.message_type === "thank_you") {
        setIsTriggeringWorkflow(true);
        
        // Collect alumni IDs based on target tier
        let alumniId: string[] = [];
        if (newComm.target_tier === "event_attendees" && eventId) {
          // Get attendees for the specific event
          const { data: registrations } = await supabase
            .from("event_registrations")
            .select("user_id")
            .eq("event_id", eventId);
          alumniId = registrations?.map(r => r.user_id) || [];
        } else {
          // Send all alumni IDs
          alumniId = alumni?.map(a => a.id) || [];
        }
        
        await triggerN8nThankYouWorkflow(alumniId, eventId);
        setIsTriggeringWorkflow(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty_communications"] });
      toast({ 
        title: "Message sent successfully",
        description: formData.message_type === "thank_you" 
          ? "Thank you workflow has also been triggered." 
          : formData.target_tier === "batch_emails" && formData.message_type === "event_invitation"
          ? "Batch outreach workflow has been triggered."
          : undefined
      });
      setIsCreating(false);
      setFormData({ message_type: "thank_you", subject: "", message: "", target_tier: "individual" });
      setSelectedCategory("");
      setSelectedRecipient("");
      setSelectedEvent("");
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedRecipient("");
  };

  const getRecipientsList = () => {
    switch (selectedCategory) {
      case "students":
        return students?.map((s) => ({
          id: s.user_id,
          label: s.name || s.email || "Unknown Student",
          sublabel: s.email,
        })) || [];
      case "sponsors":
        return sponsors?.map((s) => ({
          id: s.user_id,
          label: s.company_name,
          sublabel: s.contact_email,
        })) || [];
      case "alumni":
        return alumni?.map((a) => ({
          id: a.user_id,
          label: a.name || a.email || "Unknown Alumni",
          sublabel: a.email,
        })) || [];
      default:
        return [];
    }
  };

  const recipientsList = getRecipientsList();

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isPast = date < now;
    return {
      formatted: date.toLocaleDateString(),
      isPast,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Speaker & Sponsor Communications</h2>
          <p className="text-muted-foreground">Send messages to sponsors and track communications</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Cancel" : "New Message"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createCommunication.mutate(formData); }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="message_type">Message Type</Label>
                  <Select value={formData.message_type} onValueChange={(val) => setFormData({ ...formData, message_type: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="thank_you">Thank You Note</SelectItem>
                      <SelectItem value="sponsor_request">Sponsor Request</SelectItem>
                      <SelectItem value="event_invitation">Event Invitation</SelectItem>
                      <SelectItem value="update">General Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target_tier">Recipient</Label>
                  <Select 
                    value={formData.target_tier} 
                    onValueChange={(val) => {
                      setFormData({ ...formData, target_tier: val });
                      if (val !== "individual") {
                        setSelectedCategory("");
                        setSelectedRecipient("");
                      }
                      if (val !== "event_attendees") {
                        setSelectedEvent("");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="individual">Individual Message</SelectItem>
                      <SelectItem value="event_attendees">Event Attendees</SelectItem>
                      <SelectItem value="batch_emails">Batch Emails</SelectItem>
                      <SelectItem value="all">All Sponsors</SelectItem>
                      <SelectItem value="exabyte">Exabyte Tier Only</SelectItem>
                      <SelectItem value="petabyte">Petabyte Tier Only</SelectItem>
                      <SelectItem value="terabyte">Terabyte Tier Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Event Attendees selection */}
              {formData.target_tier === "event_attendees" && (
                <div>
                  <Label htmlFor="event">Select Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background max-h-60">
                      {events && events.length > 0 ? (
                        events.map((event) => {
                          const { formatted, isPast } = formatEventDate(event.event_date);
                          return (
                            <SelectItem key={event.id} value={event.id}>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <span>{event.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatted} {isPast ? "(Past)" : "(Upcoming)"} • {event.location || "TBD"}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No events found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Batch Emails selection */}
              {formData.target_tier === "batch_emails" && (
                <div>
                  <Label htmlFor="batch_target">Batch Target</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose batch target..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all_alumni">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          All Alumni
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Individual recipient selection */}
              {formData.target_tier === "individual" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Select Category</Label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="students">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Students
                          </div>
                        </SelectItem>
                        <SelectItem value="sponsors">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Sponsors
                          </div>
                        </SelectItem>
                        <SelectItem value="alumni">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Alumni
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedCategory && (
                    <div>
                      <Label htmlFor="recipient">Select Recipient</Label>
                      <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a recipient..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background max-h-60">
                          {recipientsList.length > 0 ? (
                            recipientsList.map((recipient) => (
                              <SelectItem key={recipient.id} value={recipient.id}>
                                <div className="flex flex-col">
                                  <span>{recipient.label}</span>
                                  {recipient.sublabel && (
                                    <span className="text-xs text-muted-foreground">{recipient.sublabel}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              No {selectedCategory} found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" disabled={createCommunication.isPending || isTriggeringWorkflow}>
                {createCommunication.isPending || isTriggeringWorkflow ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isTriggeringWorkflow ? "Triggering Workflow..." : "Generating..."}
                  </>
                ) : (
                  "Generate Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Email Review Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Review Queue
          </CardTitle>
          <CardDescription>Review and approve emails before sending</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailReview />
        </CardContent>
      </Card>

    </div>
  );
};

export default FacultySpeakerCommunications;
