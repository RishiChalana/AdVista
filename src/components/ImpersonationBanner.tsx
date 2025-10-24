'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User, getAuth, signInWithCustomToken } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { AlertTriangle, LogOut } from 'lucide-react';

export function ImpersonationBanner() {
  const { user } = useUser();
  const auth = getAuth();
  const { toast } = useToast();
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAdminUser = sessionStorage.getItem('admin_impersonation_user');
      if (storedAdminUser) {
        setImpersonatedUser(user);
      } else {
        setImpersonatedUser(null);
      }
    }
  }, [user]);

  const handleExitImpersonation = async () => {
    const storedAdminUserJson = sessionStorage.getItem('admin_impersonation_user');
    if (!storedAdminUserJson) {
      toast({ variant: 'destructive', title: 'Error', description: 'No admin session found to restore.' });
      return;
    }
    
    try {
      // For this simple example, we assume we can re-sign in the admin.
      // In a real app, you'd use the admin's refresh token to get a new ID token.
      // Since we don't have that, we'll clear the impersonation and force a reload,
      // which will require the admin to log in again if their session expired.
      // A more robust solution would involve a backend function to securely swap back.
      
      const adminUser = JSON.parse(storedAdminUserJson)
      sessionStorage.removeItem('admin_impersonation_user');

      toast({ title: 'Exiting Impersonation', description: 'Restoring your admin session...' });

      // This is a simplified re-login. A full implementation would need to securely
      // re-authenticate the admin, possibly by having them re-enter their password
      // or by using a long-lived admin session token stored securely.
      // For now, we just redirect and clear state.
      
      window.location.href = '/login'; // Force re-authentication for security
      
    } catch (error: any) {
      console.error("Failed to exit impersonation:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not exit impersonation mode.' });
    }
  };

  if (!impersonatedUser) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-yellow-900 p-3 flex items-center justify-center gap-4 text-sm font-medium">
      <AlertTriangle className="h-5 w-5" />
      <span>
        You are impersonating <strong>{impersonatedUser.displayName || impersonatedUser.email}</strong>.
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-yellow-400"
        onClick={handleExitImpersonation}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Exit Impersonation
      </Button>
    </div>
  );
}
