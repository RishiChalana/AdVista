import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Megaphone,
  BarChartBig,
  Target,
  DollarSign,
  Activity,
} from 'lucide-react';
import type { Campaign } from '@/lib/types';

type StatsCardsProps = {
  campaigns: Campaign[];
};

function calculateStats(campaigns: Campaign[]) {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    (c) => c.status === 'Active'
  ).length;
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const overallCtr =
    totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return {
    totalCampaigns,
    activeCampaigns,
    totalImpressions,
    totalRevenue,
    overallCtr,
  };
}

export function StatsCards({ campaigns }: StatsCardsProps) {
  const stats = calculateStats(campaigns);

  const cardData = [
    {
      title: 'Total Campaigns',
      value: stats.totalCampaigns.toLocaleString(),
      icon: Megaphone,
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns.toLocaleString(),
      icon: Activity,
    },
    {
      title: 'Total Impressions',
      value: stats.totalImpressions.toLocaleString(),
      icon: BarChartBig,
    },
    {
      title: 'Overall CTR',
      value: `${stats.overallCtr.toFixed(2)}%`,
      icon: Target,
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cardData.map((card) => (
        <Card key={card.title} className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
