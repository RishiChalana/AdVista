'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Report } from '@/lib/types';
import { format } from 'date-fns';

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'id',
    header: 'Report ID',
    cell: ({ row }) => <div className="truncate font-mono text-sm">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'generatedAt',
    header: 'Date Generated',
    cell: ({ row }) => format(new Date(row.getValue('generatedAt')), 'PPP p'),
  },
    {
    accessorKey: 'campaignIds',
    header: 'Campaigns',
    cell: ({ row }) => {
        const campaignIds = row.getValue('campaignIds') as string[];
        return <span>{campaignIds.length}</span>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled>View Report</DropdownMenuItem>
                <DropdownMenuItem disabled>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
