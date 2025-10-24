'use server';

/**
 * @fileOverview An AI agent to generate suggestions for campaign reports.
 *
 * - generateReportSuggestions - A function that generates suggestions based on campaign performance.
 * - GenerateReportSuggestionsInput - The input type for the function.
 * - GenerateReportSuggestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Campaign } from '@/lib/types';

// We can pass the whole Campaign object shape to the AI
const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  budget: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  revenue: z.number(),
  status: z.string(),
});

export const GenerateReportSuggestionsInputSchema = z.object({
  campaigns: z.array(CampaignSchema).describe("List of all campaigns to analyze."),
});
export type GenerateReportSuggestionsInput = z.infer<typeof GenerateReportSuggestionsInputSchema>;

export const GenerateReportSuggestionsOutputSchema = z.object({
  suggestion: z.string().describe('A concise suggestion on which campaigns to prioritize, pause, or remove based on performance data like ROI, revenue, and conversions.'),
});
export type GenerateReportSuggestionsOutput = z.infer<typeof GenerateReportSuggestionsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateReportSuggestionsPrompt',
  input: { schema: GenerateReportSuggestionsInputSchema },
  output: { schema: GenerateReportSuggestionsOutputSchema },
  prompt: `You are a marketing analyst expert. Based on the following campaign data, provide a concise, actionable suggestion.
  Your suggestion should identify which campaigns are performing well and should be prioritized, and which are underperforming and should be considered for pausing or removal.
  Base your analysis on key metrics like ROI (calculated as (Revenue - Budget) / Budget), revenue, and conversion rates.

  Campaigns:
  {{#each campaigns}}
  - Name: {{{name}}}, Status: {{{status}}}, Budget: {{{budget}}}, Revenue: {{{revenue}}}, Conversions: {{{conversions}}}, Clicks: {{{clicks}}}, Impressions: {{{impressions}}}
  {{/each}}

  Generate a single paragraph summarizing your key recommendation.`,
});

const generateReportSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateReportSuggestionsFlow',
    inputSchema: GenerateReportSuggestionsInputSchema,
    outputSchema: GenerateReportSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateReportSuggestions(input: GenerateReportSuggestionsInput): Promise<GenerateReportSuggestionsOutput> {
  return generateReportSuggestionsFlow(input);
}
