'use client';
import { CtrChart } from '@/components/dashboard/ctr-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Campaign } from '@/lib/types';
import { useMemo } from 'react';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const campaignsCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'campaigns')
  }, [firestore, user]);
  const { data: campaigns, isLoading } = useCollection<Campaign>(campaignsCollection);

  const chartData = useMemo(() => {
    if (!campaigns) return { revenueData: [], ctrData: [] };
    
    // Simple aggregation for chart data from all campaigns.
    // A more sophisticated implementation could group by date.
    const revenueData = campaigns.map(c => ({ date: c.name.slice(0,3), revenue: c.revenue }));
    const ctrData = campaigns.map(c => ({
        date: c.name.slice(0,3),
        ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0
    }));

    return { revenueData, ctrData };
  }, [campaigns]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Here&apos;s a quick overview of your campaign performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="last-30-days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="all-time">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
        </div>
      </div>

      <StatsCards campaigns={campaigns || []} isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart data={chartData.revenueData} />
        </div>
        <div className="lg:col-span-3">
          <CtrChart data={chartData.ctrData} />
        </div>
      </div>
    </div>
  );
}
