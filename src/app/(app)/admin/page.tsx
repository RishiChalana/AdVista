'use client';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);

  const adminDashboardRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'admin_dashboard', 'data');
  }, [firestore]);

  const { data: adminData, isLoading: isLoadingAdminData } = useDoc<AdminDashboard>(adminDashboardRef);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (user && firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const { data: userProfile } = await new Promise<any>((resolve) => {
            const {data} = useDoc<User>(userDocRef);
            resolve({data})
        });

        if (userProfile?.role === 'Admin') {
          setIsAdmin(true);
          // Fetch total users
          const usersCollection = collection(firestore, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          setTotalUsers(usersSnapshot.size);

          // Fetch active campaigns
          const campaignsCollection = collection(firestore, 'campaigns');
          const activeCampaignsQuery = query(campaignsCollection, where('status', '==', 'Active'));
          const activeCampaignsSnapshot = await getDocs(activeCampaignsQuery);
          setActiveCampaigns(activeCampaignsSnapshot.size);
        } else {
          setIsAdmin(false);
        }
      }
    };
    checkAdminAndFetchData();
  }, [user, firestore]);
  
  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
      notFound();
  }

  const systemHealthStats = [
    { title: 'Database Health', value: adminData?.databaseHealth || 'Checking...', icon: Database, isLoading: isLoadingAdminData },
    { title: 'Server Health', value: adminData?.serverHealth || 'Checking...', icon: Server, isLoading: isLoadingAdminData },
    { title: 'Total Users', value: totalUsers, icon: Users, isLoading: isLoadingAdminData },
    { title: 'Active Campaigns', value: activeCampaigns, icon: BarChart, isLoading: isLoadingAdminData },
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
                        {adminData?.systemLogs?.join('\n')}
                    </code>
                </pre>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
