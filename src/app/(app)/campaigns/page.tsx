'use client';

import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { DataTable } from '@/components/campaigns/data-table';
import { columns } from '@/components/campaigns/columns';
import { Button } from '@/components/ui/button';
import { File, PlusCircle } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Campaign } from '@/lib/types';
import { AddCampaignDialog } from '@/components/campaigns/add-campaign-dialog';
import Papa from 'papaparse';

export default function CampaignsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  const campaignsQuery = useMemoFirebase(
    () => {
        if (!firestore || !user) return null;
        // Query campaigns collection where userId matches the current user's ID
        return query(collection(firestore, 'campaigns'), where('userId', '==', user.uid));
    },
    [firestore, user]
  );
  const { data: campaigns, isLoading } = useCollection<Campaign>(campaignsQuery);

  if (isLoading) {
    return <div>Loading campaigns...</div>
  }

  const handleExport = () => {
    if (campaigns && campaigns.length > 0) {
      // We don't want to include the raw user ID in the export
      const exportData = campaigns.map(({ userId, ...rest }) => rest);
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.href) {
        URL.revokeObjectURL(link.href);
      }
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'campaigns.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const activeCampaigns = campaigns?.filter(c => c.status === 'Active') || [];
  const pausedCampaigns = campaigns?.filter(c => c.status === 'Paused') || [];
  const endedCampaigns = campaigns?.filter(c => c.status === 'Ended') || [];


  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="ended" className="hidden sm:flex">
            Ended
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-10 gap-1" onClick={handleExport} disabled={!campaigns || campaigns.length === 0}>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <AddCampaignDialog />
        </div>
      </div>
      <TabsContent value="all">
        <DataTable columns={columns} data={campaigns || []} />
      </TabsContent>
      <TabsContent value="active">
        <DataTable columns={columns} data={activeCampaigns} />
      </TabsContent>
       <TabsContent value="paused">
        <DataTable columns={columns} data={pausedCampaigns} />
      </TabsContent>
       <TabsContent value="ended">
        <DataTable columns={columns} data={endedCampaigns} />
      </TabsContent>
    </Tabs>
  );
}
