
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, Controller, useWatch } from "react-hook-form"; // Added useWatch
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { translateText, type TranslateTextInput, type TranslateTextOutput } from "@/ai/flows/translate-text-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Languages, ArrowRightLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const translateFormSchema = z.object({
  textToTranslate: z.string().min(1, { message: "Please enter some text to translate." }),
  targetLanguage: z.string().min(1, { message: "Please select a target language." }),
});

type TranslateFormValues = z.infer<typeof translateFormSchema>;

const targetLanguages = [
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Hindi", label: "Hindi" },
  { value: "Japanese", label: "Japanese" },
  { value: "Chinese (Simplified)", label: "Chinese (Simplified)" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Arabic", label: "Arabic" },
  { value: "Italian", label: "Italian" },
  { value: "Korean", label: "Korean" },
];

export function TranslatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslateTextOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TranslateFormValues>({
    resolver: zodResolver(translateFormSchema),
    defaultValues: {
      targetLanguage: "Spanish", // Default language
    },
  });

  const watchedTargetLanguage = useWatch({ control, name: "targetLanguage" }); // Watch the targetLanguage field

  const onSubmit: SubmitHandler<TranslateFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setTranslationResult(null);

    try {
      const result = await translateText(data);
      setTranslationResult(result);
      toast({
        title: "Translation Successful",
        description: `Text translated to ${data.targetLanguage}.`,
      });
    } catch (err) {
      console.error("Translation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during translation.";
      setError(errorMessage);
      toast({
        title: "Translation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    reset({ textToTranslate: "", targetLanguage: "Spanish" });
    setTranslationResult(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Languages className="h-6 w-6 text-primary" />
            Text Translator
          </CardTitle>
          <CardDescription>
            Translate text into various languages using AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="textToTranslate" className="text-base">Text to Translate</Label>
              <Textarea
                id="textToTranslate"
                {...register("textToTranslate")}
                placeholder="Enter text here..."
                rows={5}
                className="resize-y"
                disabled={isLoading}
              />
              {errors.textToTranslate && <p className="text-sm text-destructive">{errors.textToTranslate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetLanguage" className="text-base">Translate to</Label>
              <Controller
                name="targetLanguage"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}> {/* Ensure value is passed to Select */}
                    <SelectTrigger id="targetLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetLanguages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetLanguage && <p className="text-sm text-destructive">{errors.targetLanguage.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                Reset
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Translate
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
         <Card className="shadow-md">
          <CardContent className="pt-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
            <p className="text-muted-foreground">Processing translation...</p>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Translation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {translationResult && !isLoading && (
        <Card className="shadow-xl bg-gradient-to-br from-card to-background">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Translated Text
            </CardTitle>
            <CardDescription>
              Original text translated to {watchedTargetLanguage}. {/* Use watched value here */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={translationResult.translatedText}
              readOnly
              rows={5}
              className="bg-muted/30 resize-y"
            />
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              AI translations can sometimes be imperfect. Always verify critical translations.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
