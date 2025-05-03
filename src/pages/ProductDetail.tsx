
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { ProductViewer3D } from "@/components/product/ProductViewer3D";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, View, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount_percentage: number;
  category: string;
  subcategory: string;
  description: string;
  sizes: string[];
  stock: number;
  rating: number;
  status: string;
  model3d?: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          return;
        }

        if (data) {
          setProduct(data);
        }
      } catch (error) {
        console.error(`Failed to fetch product with ID ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-forever-navy" />
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!product) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-12">
            <p className="text-gray-500">Product not found or has been removed.</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const discountedPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const toggleViewMode = () => {
    setViewMode(viewMode === "2d" ? "3d" : "2d");
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.model3d ? (
              <div className="relative">
                {viewMode === "3d" ? (
                  <ProductViewer3D productId={product.id} productName={product.name} model3dUrl={product.model3d} />
                ) : (
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                )}
                <Button 
                  onClick={toggleViewMode}
                  className="absolute bottom-4 right-4 bg-white text-forever-navy hover:bg-forever-navy hover:text-white"
                  size="sm"
                >
                  <ViewIcon className="mr-2 h-4 w-4" />
                  {viewMode === "2d" ? "View in 3D" : "View Image"}
                </Button>
              </div>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              <p className="text-xl text-forever-navy font-semibold">
                ₹{discountedPrice.toFixed(0)}
              </p>
              {product.discount_percentage > 0 && (
                <>
                  <span className="text-gray-500 line-through ml-2">
                    ₹{product.price.toFixed(0)}
                  </span>
                  <span className="ml-2 bg-forever-orange text-white text-xs px-2 py-1 rounded">
                    {product.discount_percentage}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              {product.description || "This is a placeholder product description. Detailed product information will be displayed here."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md hover:bg-gray-50 ${
                        selectedSize === size ? "border-forever-navy bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className={`w-full py-3 rounded-md ${
                  product.stock > 0 
                    ? "bg-forever-navy text-white hover:bg-opacity-90" 
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={product.stock === 0}
                onClick={() => {
                  if (selectedSize) {
                    alert(`Added ${product.name} in size ${selectedSize} to cart!`);
                  } else {
                    alert("Please select a size first!");
                  }
                }}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              
              {product.model3d && (
                <div className="mt-4 p-4 bg-forever-navy bg-opacity-10 rounded-lg">
                  <p className="text-sm text-forever-navy">
                    <span className="font-semibold">✨ AI-Enhanced:</span> This product features a 3D model generated by our AI technology, allowing you to view it from all angles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProductDetail;
