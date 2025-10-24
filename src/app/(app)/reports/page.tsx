import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download campaign performance reports.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select filters to generate a custom report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                 <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 days</SelectItem>
                        <SelectItem value="all-time">All time</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Campaigns</SelectItem>
                        <SelectItem value="101">Summer Sale Meta Ads</SelectItem>
                        <SelectItem value="102">Q4 Google Search</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
            </Select>
            <Button className="w-full">
                <Download className="mr-2 h-4 w-4"/>
                Generate and Download
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
