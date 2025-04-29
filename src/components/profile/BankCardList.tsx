
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

// Helper function to mask card number
const maskCardNumber = (cardNumber: string): string => {
  // Remove spaces and get last 4 digits
  const cleaned = cardNumber.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `XXXX XXXX XXXX ${lastFour}`;
};

// Determine card type for icon/display
const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) {
    return "Visa";
  } else if (/^5[1-5]/.test(cleaned)) {
    return "Mastercard";
  } else if (/^6[0-9]{15}$/.test(cleaned) || /^8[1-5][0-9]{14}$/.test(cleaned)) {
    return "RuPay";
  }
  
  return "Credit Card";
};

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
      <h3 className="text-lg font-medium">Your Saved Cards</h3>
      
      {cards.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No cards added yet.
        </div>
      ) : (
        cards.map((card) => (
          <div 
            key={card.id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <CreditCard className="text-gray-500" />
              <div>
                <p className="font-medium">
                  {maskCardNumber(card.card_number)}
                </p>
                <div className="flex space-x-2 text-sm text-gray-500">
                  <p>{card.card_holder_name}</p>
                  <span>•</span>
                  <p>Expires: {card.expiry_date}</p>
                  <span>•</span>
                  <p className="text-blue-600 font-medium">{getCardType(card.card_number)}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(card.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
