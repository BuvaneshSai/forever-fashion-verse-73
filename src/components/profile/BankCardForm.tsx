
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const BankCardForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    card_number: "",
    card_holder_name: "",
    expiry_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("bank_cards")
        .insert({
          ...formData,
          user_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Card added successfully",
      });
      
      setFormData({
        card_number: "",
        card_holder_name: "",
        expiry_date: "",
      });
    } catch (error) {
      console.error("Error adding card:", error);
      toast({
        title: "Error",
        description: "Failed to add card",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card_number">Card Number</Label>
        <Input
          id="card_number"
          value={formData.card_number}
          onChange={(e) => setFormData(prev => ({ ...prev, card_number: e.target.value }))}
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card_holder_name">Card Holder Name</Label>
        <Input
          id="card_holder_name"
          value={formData.card_holder_name}
          onChange={(e) => setFormData(prev => ({ ...prev, card_holder_name: e.target.value }))}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry_date">Expiry Date</Label>
        <Input
          id="expiry_date"
          value={formData.expiry_date}
          onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
          placeholder="MM/YY"
          required
        />
      </div>

      <Button type="submit">Add Card</Button>
    </form>
  );
};
