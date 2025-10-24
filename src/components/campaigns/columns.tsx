"use client";

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Campaign } from '@/lib/types';
import Link from 'next/link';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

function CampaignActions({ campaign }: { campaign: Campaign }) {
  const { toast } = useToast();
  const firestore = getFirestore();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to delete a campaign.' });
        return;
    }
    if (window.confirm(`Are you sure you want to delete the campaign "${campaign.name}"?`)) {
      try {
        await deleteDoc(doc(firestore, 'campaigns', campaign.id));
        toast({ title: 'Campaign Deleted', description: `"${campaign.name}" has been deleted.` });
      } catch (error) {
        console.error("Error deleting campaign:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete campaign.' });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/campaigns/${campaign.id}`}>View details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Edit Campaign</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete Campaign</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Campaign Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/campaigns/${row.original.id}`} className="hover:underline font-medium">
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'platform',
    header: 'Platform',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'Active'
          ? 'default'
          : status === 'Paused'
          ? 'secondary'
          : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'budget',
    header: () => <div className="text-right">Budget</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('budget'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    accessorKey: 'revenue',
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('revenue'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'roi',
    header: () => <div className="text-right">ROI %</div>,
    cell: ({ row }) => {
        const budget = row.original.budget;
        const revenue = row.original.revenue;
        const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
        const isPositive = roi >= 0;
        return <div className={`text-right font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{roi.toFixed(2)}%</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CampaignActions campaign={row.original} />,
  },
];
