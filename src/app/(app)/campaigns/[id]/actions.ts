'use server';

import {
  generateCampaignInsights,
  type GenerateCampaignInsightsInput,
} from '@/ai/flows/generate-campaign-insights';

export async function getCampaignInsightsAction(
  input: GenerateCampaignInsightsInput
) {
  try {
    const insights = await generateCampaignInsights(input);
    return { success: true, data: insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate insights.' };
  }
}
