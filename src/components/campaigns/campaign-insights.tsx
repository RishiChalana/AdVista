"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { getCampaignInsightsAction } from './actions';
import type { Campaign } from '@/lib/types';
import type { GenerateCampaignInsightsOutput } from '@/ai/flows/generate-campaign-insights';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type CampaignInsightsProps = {
  campaign: Campaign;
};

export default function CampaignInsights({ campaign }: CampaignInsightsProps) {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<GenerateCampaignInsightsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateInsights = () => {
    startTransition(async () => {
      const result = await getCampaignInsightsAction(campaign);
      if (result.success && result.data) {
        setInsights(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
            Let our AI analyze your campaign for actionable insights.
            </CardDescription>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Generating insights...</p>
          </div>
        )}
        {!isPending && !insights && (
          <div className="text-center text-muted-foreground p-8">
            <Bot className="mx-auto h-12 w-12" />
            <p className="mt-4">Your campaign insights will appear here.</p>
          </div>
        )}
        {insights && (
          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle className="font-headline">Performance Summary</AlertTitle>
              <AlertDescription>{insights.summary}</AlertDescription>
            </Alert>
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertTitle className="font-headline">Recommendations</AlertTitle>
              <AlertDescription>{insights.insights}</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
