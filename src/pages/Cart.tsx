
import React from "react";
import { Link } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";

const Cart = () => {
  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
            
            <div className="mt-4">
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-80">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹0.00</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full bg-forever-navy">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Cart;
