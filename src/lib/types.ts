import { z } from 'zod';

export type Campaign = {
  id: string;
  userId: string;
  name: string;
  platform: 'Google Ads' | 'Meta' | 'Twitter' | 'LinkedIn';
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: 'Active' | 'Paused' | 'Ended';
  createdAt: string;
  roi?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  is_active: boolean;
  avatar?: string;
  organizationName?: string;
  createdAt: string;
};

export type Report = {
  id: string;
  userId: string;
  generatedAt: string;
  campaignIds: string[];
};

export type AdminDashboard = {
    id: string;
    databaseHealth: string;
    serverHealth: string;
    totalUsers: number;
    activeCampaigns: number;
    systemLogs: string[];
};

// Schema for the AI suggestion generator
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

    
