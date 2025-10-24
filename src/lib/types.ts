export type Campaign = {
  id: string; // Changed to string for Firestore
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
  id: string; // Changed to string for Firestore
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  avatar?: string;
};
