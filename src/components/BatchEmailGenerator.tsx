import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, UserPlus, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Recipient {
  name: string;
  email: string;
}

const BatchEmailGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emailType, setEmailType] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([{ name: "", email: "" }]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addRecipient = () => {
    setRecipients([...recipients, { name: "", email: "" }]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const handleGenerate = async () => {
    if (!emailType || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in email type and purpose.",
        variant: "destructive",
      });
      return;
    }

    const validRecipients = recipients.filter(r => r.name && r.email);
    if (validRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient with name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate emails via AI
      const { data: aiData, error: aiError } = await supabase.functions.invoke("generate-email", {
        body: { 
          emailType, 
          purpose, 
          details,
          recipients: validRecipients,
          batchMode: true
        },
      });

      if (aiError) throw aiError;
      if (aiData.error) throw new Error(aiData.error);

      // Create batch ID
      const batchId = crypto.randomUUID();

      // Save all generated emails to database
      const emailsToInsert = aiData.emails.map((email: any) => ({
        created_by: user.id,
        email_type: emailType,
        recipient_name: email.recipient_name,
        recipient_email: email.recipient_email,
        subject: email.subject,
        body: email.body,
        status: 'draft',
        batch_id: batchId,
      }));

      const { error: insertError } = await supabase
        .from("generated_emails")
        .insert(emailsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Batch Generated",
        description: `${aiData.emails.length} emails generated successfully!`,
      });

      // Navigate to review page
      navigate(`/dashboard?tab=email-review&batch=${batchId}`);
    } catch (error: any) {
      console.error("Error generating batch:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Batch Email Generator
        </CardTitle>
        <CardDescription>
          Generate multiple personalized emails at once for review and scheduling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailType">Email Type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger id="emailType">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thank-you">Thank You Note</SelectItem>
                  <SelectItem value="event-invitation">Event Invitation</SelectItem>
                  <SelectItem value="networking">Networking/Outreach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g., Thank sponsors for attending event"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Add any specific points you want to include in all emails..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRecipient}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Recipient name"
                      value={recipient.name}
                      onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Recipient email"
                      value={recipient.email}
                      onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                    />
                  </div>
                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating {recipients.filter(r => r.name && r.email).length} Emails...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Batch
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchEmailGenerator;
