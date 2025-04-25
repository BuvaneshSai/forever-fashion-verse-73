
import React from "react";
import { useParams } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">Product image placeholder</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Product {id}</h1>
            <p className="text-xl text-forever-navy font-semibold mb-2">₹1,999</p>
            <p className="text-gray-600 mb-6">
              This is a placeholder product description. Detailed product information will be displayed here.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-forever-navy text-white py-3 rounded-md hover:bg-opacity-90">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProductDetail;
