
'use server';
/**
 * @fileOverview An AI agent for analyzing soil test reports.
 *
 * - analyzeSoilReport - A function that handles the soil report analysis process.
 * - AnalyzeSoilReportInput - The input type for the analyzeSoilReport function.
 * - AnalyzeSoilReportOutput - The return type for the analyzeSoilReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "The soil test report file (PDF or TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. If PDF, text should be extractable."
    ),
  additionalNotes: z.string().optional().describe('Any additional notes or preferences from the user, e.g., specific crop interests or farming practices like organic.'),
});
export type AnalyzeSoilReportInput = z.infer<typeof AnalyzeSoilReportInputSchema>;

const SuggestedCropSchema = z.object({
  cropName: z.string().describe("Name of a crop suited for the current soil conditions."),
  reasoning: z.string().describe("Explanation why this crop is suitable based on the soil report."),
  potentialYieldEstimate: z.string().optional().describe("Estimated potential yield for this crop in suitable units (e.g., tons/hectare, kg/acre)."),
  requiredAmendments: z.array(z.string()).optional().describe("List of minimal soil amendments, if any, required for this crop (e.g., 'lime application', 'add compost')."),
});

const HighValueCropOptionSchema = z.object({
  cropName: z.string().describe("Name of a suggested high-value crop that could be grown with appropriate soil management."),
  marketAnalysis: z.string().describe("Brief analysis of the market potential and demand for this high-value crop."),
  soilPreparationPlan: z.string().describe("Detailed plan to prepare the soil for this high-value crop, including necessary amendments and tilling practices."),
  fertilizerRecommendations: z.string().describe("Specific fertilizer types, amounts, and application timings for this high-value crop."),
  estimatedProfitabilityNotes: z.string().optional().describe("Notes on estimated profitability or economic benefits, considering inputs and market value."),
});

const AnalyzeSoilReportOutputSchema = z.object({
  soilAnalysisSummary: z.string().describe("A brief summary of the key findings from the soil report, including pH, N, P, K levels, and organic matter if available."),
  suggestedCrops: z.array(SuggestedCropSchema).describe("An exhaustive list of all crops suitable for the current soil conditions based on the report. This list should include various options if multiple crops are viable with minimal intervention. Be as comprehensive as possible."),
  highValueCropOptions: z.array(HighValueCropOptionSchema).describe("An exhaustive list of all high-value crop options that could be grown with appropriate soil management, along with their respective strategies. If multiple high-value crops are suitable, list them all. Be as comprehensive as possible."),
});
export type AnalyzeSoilReportOutput = z.infer<typeof AnalyzeSoilReportOutputSchema>;

export async function analyzeSoilReport(input: AnalyzeSoilReportInput): Promise<AnalyzeSoilReportOutput> {
  return analyzeSoilReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilReportPrompt',
  input: {schema: AnalyzeSoilReportInputSchema},
  output: {schema: AnalyzeSoilReportOutputSchema},
  prompt: `You are an expert agronomist AI specializing in soil health and crop recommendations.
The user has provided a soil test report and may include additional notes.
Your task is to analyze this information and provide comprehensive recommendations.

Soil Test Report Data:
{{media url=reportDataUri}}

User's Additional Notes:
{{{additionalNotes}}}

Based on the provided soil test report and any user notes, please provide the following:
1.  **Soil Analysis Summary**: Briefly summarize the key findings from the soil report. Focus on pH, macronutrients (N, P, K), and organic matter content if discernible from the report.
2.  **Suggested Crops**:
    *   Provide an exhaustive list of ALL crops that are well-suited to the *current* soil conditions with minimal amendments. Consider a wide variety of common and niche crops. If many crops are suitable, list as many as reasonably possible based on the report's detail.
    *   For each crop, explain your reasoning.
    *   For each crop, provide an estimated potential yield.
    *   For each crop, list any minimal soil amendments needed.
3.  **High-Value Crop Options**:
    *   Provide an exhaustive list of ALL suggested high-value crops that could be profitably grown on this land *after* appropriate soil preparation and management. If multiple high-value crops are viable, detail each one. Consider diverse options that could maximize profitability.
    *   For each high-value crop:
        *   Include a brief market analysis.
        *   Outline a detailed soil preparation plan (amendments, tilling, etc.).
        *   Provide specific fertilizer recommendations (type, amount, timing).
        *   Offer notes on its estimated profitability.

Ensure your response strictly adheres to the JSON output format described by the output schema.
If the soil report is unclear or lacks critical information for a specific field, state that the information was not available in the report for that field.
Be as comprehensive as possible when listing suggested crops and high-value crop options.
`,
});

const analyzeSoilReportFlow = ai.defineFlow(
  {
    name: 'analyzeSoilReportFlow',
    inputSchema: AnalyzeSoilReportInputSchema,
    outputSchema: AnalyzeSoilReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output.");
    }
    return output;
  }
);

