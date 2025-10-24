'use client';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Server, Database } from 'lucide-react';
import { User, Campaign, AdminDashboard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

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

  const adminDashboardRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'admin_dashboard', 'data');
  }, [firestore]);
  const { data: adminData, isLoading: isLoadingAdminData } = useDoc<AdminDashboard>(adminDashboardRef);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore || userProfile?.role !== 'Admin') return null;
    return collection(firestore, 'users');
  }, [firestore, userProfile]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<User>(usersCollectionRef);

  const activeCampaignsCollectionRef = useMemoFirebase(() => {
    if (!firestore || userProfile?.role !== 'Admin') return null;
    return query(collection(firestore, 'campaigns'), where('status', '==', 'Active'));
  }, [firestore, userProfile]);
  const { data: activeCampaigns, isLoading: isLoadingActiveCampaigns } = useCollection<Campaign>(activeCampaignsCollectionRef);

  const isLoading = isUserLoading || isUserProfileLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (userProfile?.role !== 'Admin') {
      notFound();
      return null;
  }

  const systemHealthStats = [
    { title: 'Database Health', value: adminData?.databaseHealth || 'Online', icon: Database, isLoading: isLoadingAdminData },
    { title: 'Server Health', value: adminData?.serverHealth || 'Online', icon: Server, isLoading: isLoadingAdminData },
    { title: 'Total Users', value: users?.length ?? 0, icon: Users, isLoading: isLoadingUsers },
    { title: 'Active Campaigns', value: activeCampaigns?.length ?? 0, icon: BarChart, isLoading: isLoadingActiveCampaigns },
  ];

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
