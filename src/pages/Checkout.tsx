
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate delivery date (3 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: 1999.00, // Replace with actual cart total
          shipping_amount: 99.00,
          payment_method: formData.paymentMethod,
          delivery_date: deliveryDate.toISOString(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Show success notification with order details
      toast.success("Order placed successfully!", {
        description: (
          <div className="mt-2 space-y-2 text-sm">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> {order.payment_method.toUpperCase()}</p>
            <p><strong>Subtotal:</strong> ₹{order.total_amount - order.shipping_amount}</p>
            <p><strong>Shipping:</strong> ₹{order.shipping_amount}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>
          </div>
        ),
      });

      // Redirect to order confirmation
      navigate("/orders");

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="First Name" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                      id="pincode" 
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup 
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="razorpay" id="razorpay" disabled />
                    <Label htmlFor="razorpay">Razorpay (Coming Soon)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripe" id="stripe" disabled />
                    <Label htmlFor="stripe">Stripe (Coming Soon)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-500 text-center">No items in cart</p>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹1,999.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹99.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹2,098.00</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/cart" 
                  className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Checkout;
