import { campaigns } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart, DollarSign, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignInsights from '@/components/campaigns/campaign-insights';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = campaigns.find((c) => c.id === parseInt(params.id));

  if (!campaign) {
    notFound();
  }
  
  const kpis = [
    { label: 'Impressions', value: campaign.impressions.toLocaleString(), icon: Eye },
    { label: 'Clicks', value: campaign.clicks.toLocaleString(), icon: Target },
    { label: 'Conversions', value: campaign.conversions.toLocaleString(), icon: BarChart },
    { label: 'Revenue', value: `$${campaign.revenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to campaigns</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{campaign.name}</h1>
          <p className="text-muted-foreground">Details and performance for your campaign.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <CampaignInsights campaign={campaign} />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Jot down key learnings and insights here.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
