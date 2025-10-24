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
        const roi = parseFloat(row.getValue('roi'));
        const isPositive = roi >= 0;
        return <div className={`text-right font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{roi}%</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const campaign = row.original;

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
            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
