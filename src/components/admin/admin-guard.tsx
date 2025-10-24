'use client';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function AdminGuardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ))}
      </div>
      
       <div className="p-4 border rounded-lg">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const { user: authUser, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<User>(userDocRef);

  const isLoading = isUserLoading || isUserProfileLoading;

  if (isLoading) {
    return <AdminGuardSkeleton />;
  }

  // After loading, check if user exists and is an admin
  if (!userProfile || userProfile.role !== 'Admin') {
    notFound();
    return null; // Render nothing while Next.js handles the 404
  }

  // If the user is a confirmed admin, render the children
  return <>{children}</>;
}
