import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CareerEntry {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface CareerHistoryProps {
  userId: string;
}

const CareerHistory = ({ userId }: CareerHistoryProps) => {
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCareerHistory();
  }, [userId]);

  const fetchCareerHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('career_history')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching career history:', error);
    }
  };

  const handleAddEntry = async () => {
    try {
      const { error } = await supabase
        .from('career_history')
        .insert({
          user_id: userId,
          company,
          position,
          start_date: startDate,
          end_date: isCurrent ? null : endDate,
          is_current: isCurrent,
          description,
        });

      if (error) throw error;

      // Update current position in alumni profile
      if (isCurrent) {
        await supabase
          .from('alumni_profiles')
          .update({
            current_company: company,
            current_position: position,
          })
          .eq('user_id', userId);
      }

      toast({
        title: "Success",
        description: "Career entry added",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchCareerHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('career_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Entry deleted",
      });

      fetchCareerHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Career History
            </CardTitle>
            <CardDescription>Track your professional journey</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Career Entry</DialogTitle>
                <DialogDescription>Log your professional experience</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={isCurrent}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={isCurrent}
                    onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
                  />
                  <Label htmlFor="current" className="cursor-pointer">
                    I currently work here
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your role"
                  />
                </div>
                <Button onClick={handleAddEntry} className="w-full">
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No career entries yet. Add your first one!
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border-l-4 border-primary pl-4 py-2 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0"
                onClick={() => handleDeleteEntry(entry.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <h3 className="font-semibold">{entry.position}</h3>
              <p className="text-sm text-muted-foreground">{entry.company}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(entry.start_date), 'MMM yyyy')} -{' '}
                {entry.is_current ? 'Present' : entry.end_date ? format(new Date(entry.end_date), 'MMM yyyy') : 'N/A'}
              </p>
              {entry.description && (
                <p className="text-sm mt-2">{entry.description}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CareerHistory;
