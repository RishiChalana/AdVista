import { campaigns } from '@/lib/data';
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

export default function CampaignsPage() {
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
          <Button size="sm" variant="outline" className="h-10 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-10 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Campaign
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <DataTable columns={columns} data={campaigns} />
      </TabsContent>
      <TabsContent value="active">
        <DataTable columns={columns} data={campaigns.filter(c => c.status === 'Active')} />
      </TabsContent>
       <TabsContent value="paused">
        <DataTable columns={columns} data={campaigns.filter(c => c.status === 'Paused')} />
      </TabsContent>
       <TabsContent value="ended">
        <DataTable columns={columns} data={campaigns.filter(c => c.status === 'Ended')} />
      </TabsContent>
    </Tabs>
  );
}
