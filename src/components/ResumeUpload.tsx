import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  userId: string;
  currentResumeUrl?: string;
  onResumeUpdate: (url: string | null) => void;
}

const ResumeUpload = ({ userId, currentResumeUrl, onResumeUpdate }: ResumeUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5242880) {
        toast({
          title: "File too large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/resume.${fileExt}`;

      // Delete old resume if exists
      if (currentResumeUrl) {
        const oldPath = currentResumeUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('resumes').remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new resume
      const { error: uploadError, data } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({ resume_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      onResumeUpdate(publicUrl);
      
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUploading(true);
      
      if (currentResumeUrl) {
        const fileName = currentResumeUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('resumes').remove([`${userId}/${fileName}`]);
        }
      }

      const { error } = await supabase
        .from('student_profiles')
        .update({ resume_url: null })
        .eq('user_id', userId);

      if (error) throw error;

      onResumeUpdate(null);
      
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const isPdf = currentResumeUrl?.toLowerCase().includes('.pdf');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume
        </CardTitle>
        <CardDescription>Upload or update your resume (PDF or Word, max 5MB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentResumeUrl ? (
          <>
            {/* Live Preview */}
            {isPdf ? (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(currentResumeUrl)}&embedded=true`}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                  title="Resume Preview"
                />
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-secondary flex flex-col items-center justify-center gap-2 h-[300px] sm:h-[400px] md:h-[500px]">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Word document uploaded</span>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-2">
              <label htmlFor="resume-update" className="flex-1">
                <Button variant="outline" className="w-full" disabled={uploading} asChild>
                  <span>{uploading ? "Uploading..." : "Replace Resume"}</span>
                </Button>
                <input
                  id="resume-update"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <Button variant="destructive" onClick={handleDelete} disabled={uploading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 text-center h-[200px] sm:h-[300px] md:h-[400px] flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">No resume uploaded</p>
            <label htmlFor="resume-upload">
              <Button variant="outline" disabled={uploading} asChild>
                <span>{uploading ? "Uploading..." : "Upload Resume"}</span>
              </Button>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
