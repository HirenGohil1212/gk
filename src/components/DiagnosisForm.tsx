
"use client";

import { useState, type FormEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { diagnoseCropIssue, type DiagnoseCropIssueInput, type DiagnoseCropIssueOutput } from "@/ai/flows/diagnose-crop-issue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const diagnosisFormSchema = z.object({
  description: z.string().min(10, { message: "Please provide a detailed description (at least 10 characters)." }),
  photo: z.any().optional(), // File handling is tricky with Zod straight from form, handle separately
});

type DiagnosisFormValues = z.infer<typeof diagnosisFormSchema>;

export function DiagnosisForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseCropIssueOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisFormSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        setPhotoPreview(null);
        setPhotoDataUri(null);
        event.target.value = ""; // Clear the input
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = loadEvent.target?.result as string;
        setPhotoPreview(base64String);
        setPhotoDataUri(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setPhotoDataUri(null);
    }
  };

  const onSubmit: SubmitHandler<DiagnosisFormValues> = async (data) => {
    if (!photoDataUri) {
      toast({
        title: "Image Required",
        description: "Please upload a photo of the crop.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    try {
      const input: DiagnoseCropIssueInput = {
        photoDataUri: photoDataUri,
        description: data.description,
      };
      const result = await diagnoseCropIssue(input);
      setDiagnosisResult(result);
      toast({
        title: "Diagnosis Complete",
        description: "View the results below.",
        variant: "default",
      });
    } catch (err) {
      console.error("Diagnosis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during diagnosis.";
      setError(errorMessage);
      toast({
        title: "Diagnosis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setPhotoPreview(null);
    setPhotoDataUri(null);
    setDiagnosisResult(null);
    setError(null);
    setIsLoading(false);
    // Clear file input visually
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Crop Diagnosis
          </CardTitle>
          <CardDescription>
            Upload a photo and describe the issue to get an AI-powered diagnosis and treatment suggestions.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-base">Crop Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={isLoading}
              />
              {photoPreview && (
                <div className="mt-4 relative w-full max-w-md h-64 rounded-lg overflow-hidden border border-dashed border-muted-foreground/50 flex items-center justify-center">
                  <Image src={photoPreview} alt="Crop preview" layout="fill" objectFit="contain" data-ai-hint="crop plant"/>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Issue Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="e.g., Yellow spots on leaves, wilting stems, presence of small insects..."
                rows={5}
                className="resize-none"
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Diagnosis
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Analyzing your crop... Please wait.</p>
              <Progress value={undefined} className="w-full h-2 [&>div]:bg-primary" /> {/* Indeterminate progress */}
            </div>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diagnosis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {diagnosisResult && !isLoading && (
        <Card className="shadow-xl bg-gradient-to-br from-card to-background">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
              Diagnosis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Identified Issue</Label>
              <p className="text-lg font-semibold text-primary">{diagnosisResult.diagnosis.issueIdentified}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Confidence Level</Label>
              <div className="flex items-center gap-2">
                <Progress value={diagnosisResult.diagnosis.confidenceLevel * 100} className="w-full h-3 [&>div]:bg-green-500" />
                <span className="text-sm font-medium text-green-600">
                  {(diagnosisResult.diagnosis.confidenceLevel * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Suggested Treatments</Label>
              {diagnosisResult.diagnosis.suggestedTreatments.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                  {diagnosisResult.diagnosis.suggestedTreatments.map((treatment, index) => (
                    <li key={index} className="text-foreground">{treatment}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No specific treatments suggested by the AI.</p>
              )}
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Disclaimer: This AI diagnosis is for informational purposes only and should not replace professional advice. Always consult with an agricultural expert for critical decisions.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
