
"use client";

import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeSoilReport, type AnalyzeSoilReportInput, type AnalyzeSoilReportOutput } from "@/ai/flows/analyze-soil-report-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, CheckCircle2, AlertCircle, FlaskConical, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

const soilAnalysisFormSchema = z.object({
  additionalNotes: z.string().optional(),
  reportFile: z.any().refine(files => files?.length > 0, "Soil report file is required."),
});

type SoilAnalysisFormValues = z.infer<typeof soilAnalysisFormSchema>;

export function SoilAnalysisForm() {
  const [reportFileName, setReportFileName] = useState<string | null>(null);
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSoilReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<SoilAnalysisFormValues>({
    resolver: zodResolver(soilAnalysisFormSchema),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for reports
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        setReportFileName(null);
        setReportDataUri(null);
        setValue("reportFile", null); // Clear RHF value
        event.target.value = ""; 
        return;
      }
      if (!['application/pdf', 'text/plain'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        });
        setReportFileName(null);
        setReportDataUri(null);
        setValue("reportFile", null);
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = loadEvent.target?.result as string;
        setReportFileName(file.name);
        setReportDataUri(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setReportFileName(null);
      setReportDataUri(null);
    }
  };

  const onSubmit: SubmitHandler<SoilAnalysisFormValues> = async (data) => {
    if (!reportDataUri) {
      toast({
        title: "File Required",
        description: "Please upload your soil test report.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const input: AnalyzeSoilReportInput = {
        reportDataUri: reportDataUri,
        additionalNotes: data.additionalNotes,
      };
      const result = await analyzeSoilReport(input);
      setAnalysisResult(result);
      toast({
        title: "Soil Analysis Complete",
        description: "View the results below.",
        variant: "default",
      });
    } catch (err) {
      console.error("Soil analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setReportFileName(null);
    setReportDataUri(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    const fileInput = document.getElementById('reportFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            AI Soil Report Analysis
          </CardTitle>
          <CardDescription>
            Upload your soil test report (PDF or TXT) and add any notes to get AI-powered insights and recommendations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reportFile" className="text-base">Soil Test Report File</Label>
              <Input
                id="reportFile"
                type="file"
                accept=".pdf,.txt"
                {...register("reportFile")}
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={isLoading}
              />
              {reportFileName && <p className="text-sm text-muted-foreground mt-2">Uploaded: {reportFileName}</p>}
              {errors.reportFile && <p className="text-sm text-destructive">{errors.reportFile.message?.toString()}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-base">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                {...register("additionalNotes")}
                placeholder="e.g., Interested in organic options, specific crops you're considering, or particular soil issues you've noticed."
                rows={4}
                className="resize-none"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isLoading || !reportDataUri} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                <>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Analyze Soil Report
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
              <p className="text-muted-foreground">Analyzing your soil report... This may take a moment.</p>
              <Progress value={undefined} className="w-full h-2 [&>div]:bg-primary" />
            </div>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && !isLoading && (
        <Card className="shadow-xl bg-gradient-to-br from-card to-background">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
              Soil Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Soil Report Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{analysisResult.soilAnalysisSummary || "No summary provided."}</p>
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recommended Crop (Current Soil)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Crop Name</Label>
                  <p className="text-lg font-semibold text-primary">{analysisResult.currentSoilSuitedCrop.cropName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Reasoning</Label>
                  <p className="text-foreground whitespace-pre-wrap">{analysisResult.currentSoilSuitedCrop.reasoning}</p>
                </div>
                {analysisResult.currentSoilSuitedCrop.potentialYieldEstimate && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Potential Yield Estimate</Label>
                    <p className="text-foreground">{analysisResult.currentSoilSuitedCrop.potentialYieldEstimate}</p>
                  </div>
                )}
                {analysisResult.currentSoilSuitedCrop.requiredAmendments && analysisResult.currentSoilSuitedCrop.requiredAmendments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Required Amendments</Label>
                    <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                      {analysisResult.currentSoilSuitedCrop.requiredAmendments.map((amendment, index) => (
                        <li key={index} className="text-foreground">{amendment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">High-Value Crop Option</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Crop Name</Label>
                  <p className="text-lg font-semibold text-primary">{analysisResult.highValueCropOption.cropName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Market Analysis</Label>
                  <p className="text-foreground whitespace-pre-wrap">{analysisResult.highValueCropOption.marketAnalysis}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Soil Preparation Plan</Label>
                  <p className="text-foreground whitespace-pre-wrap">{analysisResult.highValueCropOption.soilPreparationPlan}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fertilizer Recommendations</Label>
                  <p className="text-foreground whitespace-pre-wrap">{analysisResult.highValueCropOption.fertilizerRecommendations}</p>
                </div>
                {analysisResult.highValueCropOption.estimatedProfitabilityNotes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Estimated Profitability Notes</Label>
                    <p className="text-foreground whitespace-pre-wrap">{analysisResult.highValueCropOption.estimatedProfitabilityNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Disclaimer: This AI analysis is for informational purposes only and should not replace professional advice. Always consult with an agricultural expert for critical decisions.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
