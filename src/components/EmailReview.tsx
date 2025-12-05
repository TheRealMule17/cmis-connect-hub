import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Send, Edit2, Save, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Email {
  id: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: string;
  scheduled_at: string | null;
  batch_id: string;
  source?: "database" | "n8n";
  airtable_id?: string; // Airtable record ID for n8n emails
}

interface N8nEmail {
  id?: string;
  "Email ID"?: string;
  Recipient?: string;
  Subject?: string;
  "Email Body"?: string;
  Status?: string;
  "Generated Date"?: string;
  createdTime?: string;
}

interface EmailReviewProps {
  batchId?: string;
}

const N8N_WEBHOOK_URL = "https://mule17.app.n8n.cloud/webhook/c083eafb-18e4-4931-aa30-1b1323f08655";
const N8N_STATUS_UPDATE_URL = "https://mule17.app.n8n.cloud/webhook/5cf035b6-8865-479c-a26a-4e8faf6daf8b";
const N8N_COMM_HISTORY_URL = "https://mule17.app.n8n.cloud/webhook/c8c2e929-0880-4937-8fa9-a86c15a88782";

const EmailReview = ({ batchId }: EmailReviewProps) => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [n8nEmails, setN8nEmails] = useState<Email[]>([]);
  const [originalN8nStatuses, setOriginalN8nStatuses] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState<Partial<Email>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingN8n, setIsLoadingN8n] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchEmails();
    fetchN8nEmails();
  }, [batchId]);

  const fetchN8nEmails = async () => {
    setIsLoadingN8n(true);
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle both array and single object responses
      const emailsArray = Array.isArray(data) ? data : [data];
      
      const mappedEmails: Email[] = emailsArray.map((item: any, index: number) => ({
        id: item.id || `n8n-${index}-${Date.now()}`,
        airtable_id: item["Email ID"], // Store the Email ID (e.g., OUTREACH_20251204_233047_zb1qxyhd)
        recipient_name: item.Recipient?.split('@')[0] || "Unknown",
        recipient_email: item.Recipient || "",
        subject: item.Subject || "No Subject",
        body: item["Email Body"] || "",
        status: item.Status?.trim().toLowerCase() || "pending",
        scheduled_at: null,
        batch_id: "",
        source: "n8n" as const,
      }));

      setN8nEmails(mappedEmails);
      // Store original statuses to track changes
      const statuses: Record<string, string> = {};
      mappedEmails.forEach(e => { statuses[e.id] = e.status; });
      setOriginalN8nStatuses(statuses);
    } catch (error: any) {
      console.error("Error fetching n8n emails:", error);
      // Don't show error toast for n8n - just silently fail if no data
    } finally {
      setIsLoadingN8n(false);
    }
  };

  const fetchEmails = async () => {
    try {
      let query = supabase
        .from("generated_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (batchId) {
        query = query.eq("batch_id", batchId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmails((data || []).map(e => ({ ...e, source: "database" as const })));
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (email: Email) => {
    setEditingId(email.id);
    setEditedEmail({
      subject: email.subject,
      body: email.body,
      recipient_name: email.recipient_name,
      recipient_email: email.recipient_email,
    });
  };

  const saveEdit = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from("generated_emails")
        .update(editedEmail)
        .eq("id", emailId);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Email updated successfully",
      });

      setEditingId(null);
      fetchEmails();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (emailId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("generated_emails")
        .update({ status })
        .eq("id", emailId);

      if (error) throw error;

      toast({
        title: "Updated",
        description: `Email ${status}`,
      });

      fetchEmails();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const scheduleEmail = async (emailId: string, scheduledAt: string) => {
    try {
      const { error } = await supabase
        .from("generated_emails")
        .update({ scheduled_at: scheduledAt, status: "scheduled" })
        .eq("id", emailId);

      if (error) throw error;

      toast({
        title: "Scheduled",
        description: "Email scheduled for sending",
      });

      fetchEmails();
    } catch (error: any) {
      console.error("Error scheduling:", error);
      toast({
        title: "Error",
        description: "Failed to schedule email",
        variant: "destructive",
      });
    }
  };

  const updateN8nEmailStatusLocal = (email: Email, newStatus: string) => {
    // Only update local state - don't send to n8n yet
    setN8nEmails(prev => 
      prev.map(e => e.id === email.id ? { ...e, status: newStatus } : e)
    );
  };

  // Get emails with changed statuses
  const getChangedN8nEmails = () => {
    return n8nEmails.filter(e => e.status !== originalN8nStatuses[e.id]);
  };

  const hasUnsavedChanges = getChangedN8nEmails().length > 0;

  const updateAllStatuses = async () => {
    const changedEmails = getChangedN8nEmails();
    
    if (changedEmails.length === 0) {
      toast({
        title: "No Changes",
        description: "No status changes to update",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Send status updates for all changed n8n emails
      for (const email of changedEmails) {
        try {
          const now = new Date().toISOString();
          
          // Update status in Airtable
          const response = await fetch(N8N_STATUS_UPDATE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailId: email.airtable_id || email.id,
              recipientEmail: email.recipient_email,
              subject: email.subject,
              newStatus: email.status.charAt(0).toUpperCase() + email.status.slice(1),
            }),
          });

          if (response.ok) {
            successCount++;
            
            // Send to communication history n8n workflow
            await fetch(N8N_COMM_HISTORY_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                recipientName: email.recipient_name,
                recipientEmail: email.recipient_email,
                subject: email.subject,
                body: email.body,
                status: email.status.charAt(0).toUpperCase() + email.status.slice(1),
                timestamp: now,
              }),
            });
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("Error updating email:", email.id, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Statuses Updated",
          description: `Successfully updated ${successCount} email${successCount > 1 ? 's' : ''}${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
        // Update original statuses to reflect saved state
        const newOriginal = { ...originalN8nStatuses };
        changedEmails.forEach(e => { newOriginal[e.id] = e.status; });
        setOriginalN8nStatuses(newOriginal);
      } else {
        toast({
          title: "Error",
          description: "Failed to update statuses",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating statuses:", error);
      toast({
        title: "Error",
        description: "Failed to update statuses",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const allEmails = [...n8nEmails, ...emails];

  if (isLoading && isLoadingN8n) {
    return <div>Loading emails...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Review & Approval</CardTitle>
              <CardDescription>
                Review, edit, and approve emails before sending
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchN8nEmails}
                disabled={isLoadingN8n}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingN8n ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={updateAllStatuses}
                disabled={isSending || !hasUnsavedChanges}
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Update Status ({getChangedN8nEmails().length})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {allEmails.map((email) => (
          <Card key={email.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{email.recipient_name}</CardTitle>
                  <CardDescription>{email.recipient_email}</CardDescription>
                </div>
                {email.source === "n8n" ? (
                  <Select
                    value={email.status}
                    onValueChange={(value) => updateN8nEmailStatusLocal(email, value)}
                  >
                    <SelectTrigger className={`w-32 ${
                      email.status === "approved" ? "bg-green-100 text-green-800 border-green-300" :
                      email.status === "rejected" ? "bg-red-100 text-red-800 border-red-300" :
                      "bg-muted"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={
                    email.status === "sent" ? "default" :
                    email.status === "approved" ? "secondary" :
                    email.status === "rejected" ? "destructive" : "outline"
                  }>
                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === email.id ? (
                <>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={editedEmail.subject || ""}
                      onChange={(e) => setEditedEmail({ ...editedEmail, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea
                      value={editedEmail.body || ""}
                      onChange={(e) => setEditedEmail({ ...editedEmail, body: e.target.value })}
                      rows={8}
                    />
                  </div>
                  <Button onClick={() => saveEdit(email.id)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-semibold">Subject:</Label>
                    <p className="mt-1">{email.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Body:</Label>
                    <pre className="mt-1 whitespace-pre-wrap font-sans text-sm">{email.body}</pre>
                  </div>
                  {email.status !== "sent" && email.source === "database" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(email)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateStatus(email.id, "approved")}
                        disabled={email.status === "approved"}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus(email.id, "rejected")}
                        disabled={email.status === "rejected"}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {allEmails.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No emails to review. Generate a batch to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailReview;
