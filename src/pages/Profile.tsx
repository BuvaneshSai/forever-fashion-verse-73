
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankCardForm } from "@/components/profile/BankCardForm";
import { BankCardList } from "@/components/profile/BankCardList";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { CountrySelector } from "@/components/ui/country-selector";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    mobile_number: "",
    country_code: "+1",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      
      // Parse the mobile number to separate country code if it exists
      let countryCode = "+1";
      let mobileNumber = data.mobile_number || "";
      
      if (mobileNumber && mobileNumber.startsWith("+")) {
        // Try to extract the country code from the mobile number
        const match = mobileNumber.match(/^(\+\d+)\s*(.*)$/);
        if (match) {
          countryCode = match[1];
          mobileNumber = match[2];
        }
      }
      
      setFormData({
        username: data.username || "",
        mobile_number: mobileNumber,
        country_code: countryCode,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine country code and mobile number
      const fullMobileNumber = formData.mobile_number 
        ? `${formData.country_code} ${formData.mobile_number}`
        : "";
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          mobile_number: fullMobileNumber,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="cards">Bank Cards</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <CountrySelector 
                            value={formData.country_code}
                            onChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}
                          />
                          <Input
                            id="mobile"
                            value={formData.mobile_number}
                            onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                            className="flex-1"
                            placeholder="Phone number without country code"
                          />
                        </>
                      ) : (
                        <Input
                          id="mobile"
                          value={profile?.mobile_number || ""}
                          disabled
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Bank Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <BankCardList />
                <BankCardForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default Profile;
