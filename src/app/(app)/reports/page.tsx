'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Campaign, Report } from '@/lib/types';
import { getReportSuggestionsAction, generateReportAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, FileText, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from './data-table';
import { columns } from './columns';

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isGeneratingReport, startGeneratingReport] = useTransition();
  const [isGeneratingSuggestion, startGeneratingSuggestion] = useTransition();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const campaignsCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'campaigns') : null),
    [firestore, user]
  );
  const { data: campaigns } = useCollection<Campaign>(campaignsCollection);

  const reportsCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'reports') : null),
    [firestore, user]
  );
  const { data: reports, isLoading: isLoadingReports } = useCollection<Report>(reportsCollection);

  const handleGenerateReport = () => {
    if (!campaigns || !user) return;
    startGeneratingReport(async () => {
      const result = await generateReportAction(user.uid, campaigns.map(c => c.id));
      if (result.success) {
        toast({ title: 'Report Generated', description: 'Your new campaign report is ready.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };
  
  const handleGetSuggestions = () => {
    if (!campaigns) return;
    startGeneratingSuggestion(async () => {
      const result = await getReportSuggestionsAction(campaigns);
       if (result.success && result.data) {
        setSuggestion(result.data.suggestion);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download campaign performance reports.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleGetSuggestions} disabled={isGeneratingSuggestion || !campaigns?.length}>
                {isGeneratingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Get AI Suggestions
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGeneratingReport || !campaigns?.length}>
            {isGeneratingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Generate New Report
          </Button>
        </div>
      </div>

        {suggestion && (
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertTitle className="font-headline">AI-Powered Suggestions</AlertTitle>
              <AlertDescription>{suggestion}</AlertDescription>
            </Alert>
        )}

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>View and download your previously generated reports.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={reports || []} isLoading={isLoadingReports} />
        </CardContent>
      </Card>
    </div>
  );
}
