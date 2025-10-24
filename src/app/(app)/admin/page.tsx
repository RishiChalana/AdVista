'use client';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Server, Database } from 'lucide-react';
import { User, Campaign, AdminDashboard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function AdminStatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<User>(userDocRef);

  const isAdmin = userProfile?.role === 'Admin';

  const adminDashboardRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'admin_dashboard', 'data');
  }, [firestore]);
  const { data: adminData, isLoading: isLoadingAdminData } = useDoc<AdminDashboard>(adminDashboardRef);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'users');
  }, [firestore, isAdmin]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<User>(usersCollectionRef);

  const allCampaignsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'campaigns');
  }, [firestore, isAdmin]);
  const { data: allCampaigns, isLoading: isLoadingAllCampaigns } = useCollection<Campaign>(allCampaignsCollectionRef);

  const activeCampaigns = allCampaigns?.filter(c => c.status === 'Active');

  const isLoading = isUserLoading || isUserProfileLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
      notFound();
      return null;
  }

  const systemHealthStats = [
    { title: 'Database Health', value: adminData?.databaseHealth || 'Online', icon: Database, isLoading: isLoadingAdminData },
    { title: 'Server Health', value: adminData?.serverHealth || 'Online', icon: Server, isLoading: isLoadingAdminData },
    { title: 'Total Users', value: users?.length ?? 0, icon: Users, isLoading: isLoadingUsers },
    { title: 'Active Campaigns', value: activeCampaigns?.length ?? 0, icon: BarChart, isLoading: isLoadingAllCampaigns },
  ];
  
  const getUserName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and health status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemHealthStats.map(stat => (
          <AdminStatCard key={stat.title} {...stat} />
        ))}
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>A list of all campaigns across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAllCampaigns || isLoadingUsers ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                       <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                       <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                       <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                       <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                       <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                 ))
              ) : allCampaigns && allCampaigns.length > 0 ? (
                allCampaigns.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getUserName(campaign.userId)}</TableCell>
                    <TableCell><Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge></TableCell>
                    <TableCell>{format(new Date(campaign.createdAt), 'PPP')}</TableCell>
                    <TableCell className="text-right">${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No campaigns found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoadingAdminData ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : (
                <pre className="p-4 bg-muted rounded-md text-sm text-muted-foreground overflow-x-auto">
                    <code>
                        {adminData?.systemLogs?.join('\n') || 'No system logs available.'}
                    </code>
                </pre>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
