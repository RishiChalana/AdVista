'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useUser } from "@/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
});

export default function SettingsPage() {
    const { user } = useUser();
    const auth = useAuth();
    const firestore = getFirestore();
    const { toast } = useToast();

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
        name: "",
        email: "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    useEffect(() => {
        if(user) {
            profileForm.reset({
                name: user.displayName || '',
                email: user.email || ''
            })
        }
    }, [user, profileForm])

    const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        try {
            await updateProfile(user, { displayName: values.name });
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, { name: values.name }, { merge: true });
            toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not update profile." });
        }
    };

    const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
        if (!user || !user.email) return;

        try {
            const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
            // Re-authenticate user before changing password
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, values.newPassword);
            passwordForm.reset();
            toast({ title: "Password Updated", description: "Your password has been successfully changed." });
        } catch (error) {
            console.error("Error updating password:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update password. Check your current password." });
        }
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" readOnly disabled {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>Save Changes</Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>Update Password</Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Theme</Label>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Notification settings will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
