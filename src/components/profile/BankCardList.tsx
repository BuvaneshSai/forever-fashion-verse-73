
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Trash2 } from "lucide-react";

interface BankCard {
  id: string;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
}

export const BankCardList = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<BankCard[]>([]);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("bank_cards")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast({
        title: "Error",
        description: "Failed to load cards",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("bank_cards")
        .delete()
        .eq("id", cardId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
      
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {cards.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No cards added yet.
        </div>
      ) : (
        cards.map((card) => (
          <div 
            key={card.id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <CreditCard className="text-gray-500" />
              <div>
                <p className="font-medium">
                  •••• {card.card_number.slice(-4)}
                </p>
                <p className="text-sm text-gray-500">
                  {card.card_holder_name} | Expires: {card.expiry_date}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(card.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
