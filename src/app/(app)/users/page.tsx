'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LogIn, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminGuard } from '@/components/admin/admin-guard';
import { useToast } from '@/hooks/use-toast';
import { createImpersonationToken } from '@/lib/firebase/adminFunctions';
import { useAuth } from '@/firebase/provider';
import { signInWithCustomToken } from 'firebase/auth';

function UsersPageContent() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<User>(usersCollectionRef);

  const handleImpersonate = async (targetUser: User) => {
    if (!auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Admin user not found.' });
      return;
    }
    if (window.confirm(`Are you sure you want to impersonate ${targetUser.name}?`)) {
      try {
        // Store current admin session before impersonating
        const adminUser = auth.currentUser;
        sessionStorage.setItem('admin_impersonation_user', JSON.stringify(adminUser));

        const result = await createImpersonationToken({ targetUid: targetUser.id });
        if (result.token) {
          await signInWithCustomToken(auth, result.token);
          toast({ title: 'Impersonation Started', description: `You are now impersonating ${targetUser.name}.` });
          // Force a full reload to re-initialize the app state as the new user
          window.location.href = '/dashboard';
        } else {
          throw new Error(result.error || 'Failed to get impersonation token.');
        }
      } catch (error: any) {
        console.error("Impersonation failed:", error);
        toast({ variant: 'destructive', title: 'Impersonation Failed', description: error.message });
        sessionStorage.removeItem('admin_impersonation_user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users and their roles.</p>
        </div>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>List of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                    </TableRow>
                ))
              ) : users && users.length > 0 ? (
                users.map(user => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                              <LogIn className="mr-2 h-4 w-4" />
                              Impersonate User
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>Edit Role</DropdownMenuItem>
                            <DropdownMenuItem disabled>Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        No users found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsersPage() {
    return (
        <AdminGuard>
            <UsersPageContent />
        </AdminGuard>
    )
}
