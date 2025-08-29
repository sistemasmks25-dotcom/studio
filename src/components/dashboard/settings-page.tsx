"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition, useState, useEffect } from "react";
import type { User } from "@/lib/data";
import { getUserByEmail, updateUserProfile, changeUserPassword } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "../ui/skeleton";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
});


export function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    },
  });

  useEffect(() => {
    // In a real app, you'd get the current user's session.
    // For this demo, we'll fetch the hardcoded admin user.
    getUserByEmail("admin@fortress.com").then(userData => {
      if (userData) {
        setUser(userData);
        profileForm.reset({ name: userData.name });
      }
    });
  }, [profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    startProfileTransition(async () => {
      const result = await updateUserProfile(user.id, values.name);
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        // Optionally re-fetch user data
        const updatedUser = await getUserByEmail(user.email);
        if (updatedUser) setUser(updatedUser);
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.error,
        });
      }
    });
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user) return;
    startPasswordTransition(async () => {
      const result = await changeUserPassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
        passwordForm.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Change Failed",
          description: result.error,
        });
      }
    });
  }


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} disabled />
                </div>
                <Button type="submit" disabled={isProfilePending}>{isProfilePending ? 'Updating...' : 'Update Profile'}</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your master password.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField control={passwordForm.control} name="currentPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="newPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="confirmPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isPasswordPending}>
                        {isPasswordPending ? 'Changing...' : 'Change Password'}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Password Expiry</p>
                    <p className="text-sm text-muted-foreground">Get notified when passwords are about to expire.</p>
                </div>
                <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for suspicious account activity.</p>
                </div>
                <Switch defaultChecked />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
