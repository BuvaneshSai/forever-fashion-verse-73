
import React from "react";
import UserLayout from "@/components/layout/UserLayout";

const Shop = () => {
  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-forever-navy mb-2">
            Shop Forever Fashion
          </h1>
          <p className="text-gray-600">
            Explore our curated collection of quality fashion items
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Product listings will go here */}
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Coming soon</p>
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Coming soon</p>
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Coming soon</p>
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Coming soon</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Shop;
