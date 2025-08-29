"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function SettingsPage() {
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
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@fortress.com" disabled />
            </div>
            <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your master password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
            </div>
            <Button>Change Password</Button>
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
