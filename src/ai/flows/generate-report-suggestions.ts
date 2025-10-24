'use server';

/**
 * @fileOverview An AI agent to generate suggestions for campaign reports.
 *
 * - generateReportSuggestions - A function that generates suggestions based on campaign performance.
 */

import { ai } from '@/ai/genkit';
import { 
  GenerateReportSuggestionsInputSchema, 
  GenerateReportSuggestionsOutputSchema,
  type GenerateReportSuggestionsInput
} from '@/lib/types';


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

export async function generateReportSuggestions(input: GenerateReportSuggestionsInput) {
  return generateReportSuggestionsFlow(input);
}
