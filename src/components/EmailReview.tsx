import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Send, Edit2, Save, Calendar } from "lucide-react";
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
}

interface EmailReviewProps {
  batchId?: string;
}

const EmailReview = ({ batchId }: EmailReviewProps) => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState<Partial<Email>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [batchId]);

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
      setEmails(data || []);
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

  const sendApprovedEmails = async () => {
    const approvedEmails = emails.filter(e => e.status === "approved");
    
    if (approvedEmails.length === 0) {
      toast({
        title: "No Approved Emails",
        description: "Please approve at least one email before sending",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-emails", {
        body: { emailIds: approvedEmails.map(e => e.id) },
      });

      if (error) throw error;

      const successCount = data.results.filter((r: any) => r.success).length;
      
      toast({
        title: "Emails Sent",
        description: `Successfully sent ${successCount} of ${approvedEmails.length} emails`,
      });

      fetchEmails();
    } catch (error: any) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
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
            <Button
              onClick={sendApprovedEmails}
              disabled={isSending || !emails.some(e => e.status === "approved")}
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Approved ({emails.filter(e => e.status === "approved").length})
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {emails.map((email) => (
          <Card key={email.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{email.recipient_name}</CardTitle>
                  <CardDescription>{email.recipient_email}</CardDescription>
                </div>
                <Badge variant={
                  email.status === "sent" ? "default" :
                  email.status === "approved" ? "secondary" :
                  email.status === "rejected" ? "destructive" : "outline"
                }>
                  {email.status}
                </Badge>
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
                  {email.status !== "sent" && (
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

      {emails.length === 0 && (
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
