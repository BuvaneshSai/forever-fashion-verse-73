
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    }, 1000);
  };
  
  const handleSaveNotificationSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <AdminLayout pageTitle="Settings">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the general settings for your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="FOREVER" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-email">Store Email</Label>
                  <Input id="store-email" defaultValue="contact@forever.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Store Phone</Label>
                  <Input id="store-phone" defaultValue="+91 1234567890" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input id="store-address" defaultValue="123 Fashion Street, New Delhi" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="real-time-updates"
                    checked={realTimeUpdates}
                    onCheckedChange={setRealTimeUpdates}
                  />
                  <Label htmlFor="real-time-updates">Enable real-time data updates</Label>
                </div>
                
                <Button onClick={handleSaveGeneralSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Configure how the dashboard displays data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Input id="currency" defaultValue="₹" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input id="date-format" defaultValue="DD/MM/YYYY" />
                </div>
                
                <Button onClick={handleSaveGeneralSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in the dashboard</p>
                  </div>
                  <Switch
                    checked={systemNotifications}
                    onCheckedChange={setSystemNotifications}
                  />
                </div>
                
                <Button onClick={handleSaveNotificationSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Credentials</CardTitle>
                <CardDescription>
                  View the admin login credentials (read-only).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" value="buvaneshvc22259@gmail.com" readOnly className="bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">This is the authorized admin email.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input id="admin-password" value="••••••••••••••" type="password" readOnly className="bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">Password is hidden for security reasons.</p>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-amber-600">
                    Note: For security reasons, admin credentials can only be changed through the database.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Settings</CardTitle>
                <CardDescription>
                  Configure session timeout settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                
                <Button onClick={handleSaveGeneralSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
