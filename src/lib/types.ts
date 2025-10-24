export type Campaign = {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta' | 'Twitter' | 'LinkedIn';
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: 'Active' | 'Paused' | 'Ended';
  roi?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  avatar?: string;
  createdAt: string;
};

export type Report = {
  id: string;
  userId: string;
  generatedAt: string;
  campaignIds: string[];
};
