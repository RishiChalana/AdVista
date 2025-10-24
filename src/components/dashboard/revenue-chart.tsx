"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type RevenueChartProps = {
  data: { date: string; revenue: number }[];
};

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--accent))',
  },
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>Revenue generated over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
