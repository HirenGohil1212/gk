// diagnose-crop-issue.ts
'use server';

/**
 * @fileOverview A crop issue diagnosis AI agent.
 *
 * - diagnoseCropIssue - A function that handles the crop diagnosis process.
 * - DiagnoseCropIssueInput - The input type for the diagnoseCropIssue function.
 * - DiagnoseCropIssueOutput - The return type for the diagnoseCropIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropIssueInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the crop and the issue.'),
});
export type DiagnoseCropIssueInput = z.infer<typeof DiagnoseCropIssueInputSchema>;

const DiagnoseCropIssueOutputSchema = z.object({
  diagnosis: z.object({
    issueIdentified: z.string().describe('The identified disease or pest.'),
    confidenceLevel: z
      .number()
      .describe('The confidence level of the diagnosis (0-1).'),
    suggestedTreatments:
      z.array(z.string()).describe('Suggested treatments for the issue.'),
  }),
});
export type DiagnoseCropIssueOutput = z.infer<typeof DiagnoseCropIssueOutputSchema>;

export async function diagnoseCropIssue(
  input: DiagnoseCropIssueInput
): Promise<DiagnoseCropIssueOutput> {
  return diagnoseCropIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropIssuePrompt',
  input: {schema: DiagnoseCropIssueInputSchema},
  output: {schema: DiagnoseCropIssueOutputSchema},
  prompt: `You are an expert in diagnosing crop diseases and pest infestations. A farmer will provide a photo and description of a crop issue, and you will provide a diagnosis, confidence level, and suggested treatments.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Respond in the following JSON format:
{
  "diagnosis": {
    "issueIdentified": "The identified disease or pest",
    "confidenceLevel": "The confidence level of the diagnosis (0-1)",
    "suggestedTreatments": ["Suggested treatment 1", "Suggested treatment 2"]
  }
}
`,
});

const diagnoseCropIssueFlow = ai.defineFlow(
  {
    name: 'diagnoseCropIssueFlow',
    inputSchema: DiagnoseCropIssueInputSchema,
    outputSchema: DiagnoseCropIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
