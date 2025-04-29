
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

// Credit card type detection
const getCardType = (cardNumber: string): string | null => {
  // Remove non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Visa
  if (/^4/.test(cleaned)) {
    return "visa";
  } 
  // Mastercard
  else if (/^5[1-5]/.test(cleaned)) {
    return "mastercard";
  }
  // Rupay
  else if (/^6[0-9]{15}$/.test(cleaned) || /^8[1-5][0-9]{14}$/.test(cleaned)) {
    return "rupay";
  }
  
  return null;
};

// Format card number with spaces
const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/(\d{1,4})/g);
  return groups ? groups.join(' ') : '';
};

// Validate expiry date
const validateExpiryDate = (expiryDate: string): boolean => {
  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }

  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000; // Convert to 4-digit year

  // Check if month is between 1-12
  if (month < 1 || month > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Check if the card is not expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

export const BankCardForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    card_number: "",
    card_holder_name: "",
    expiry_date: "",
  });
  const [validations, setValidations] = useState({
    cardNumberValid: true,
    expiryDateValid: true,
  });
  const [cardType, setCardType] = useState<string | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 19 characters (16 digits + 3 spaces)
    const value = e.target.value.slice(0, 19);
    const formattedValue = formatCardNumber(value);
    
    setFormData(prev => ({ ...prev, card_number: formattedValue }));
    
    const detectedType = getCardType(formattedValue);
    setCardType(detectedType);
    setValidations(prev => ({ 
      ...prev, 
      cardNumberValid: !formattedValue || detectedType !== null 
    }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Auto-format to MM/YY
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    setFormData(prev => ({ ...prev, expiry_date: value }));
    
    const isValid = !value || validateExpiryDate(value);
    setValidations(prev => ({ ...prev, expiryDateValid: isValid }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const isCardValid = cardType !== null;
    const isExpiryValid = validateExpiryDate(formData.expiry_date);
    
    setValidations({
      cardNumberValid: isCardValid,
      expiryDateValid: isExpiryValid
    });
    
    if (!isCardValid || !isExpiryValid) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    
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
      setCardType(null);
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
        <div className="relative">
          <Input
            id="card_number"
            value={formData.card_number}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            required
            className={!validations.cardNumberValid ? "border-red-500" : ""}
          />
          {cardType && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-green-600 uppercase">
              {cardType}
            </div>
          )}
        </div>
        {!validations.cardNumberValid && (
          <p className="text-red-500 text-sm mt-1">Invalid card number</p>
        )}
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
          onChange={handleExpiryDateChange}
          placeholder="MM/YY"
          required
          className={!validations.expiryDateValid ? "border-red-500" : ""}
          maxLength={5}
        />
        {!validations.expiryDateValid && (
          <p className="text-red-500 text-sm mt-1">Invalid expiry date</p>
        )}
      </div>

      <Button type="submit">Add Card</Button>
    </form>
  );
};
