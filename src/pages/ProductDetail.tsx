
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { ProductViewer3D } from "@/components/product/ProductViewer3D";
import { Product, products } from "@/data/products";

// Remove the local interface that conflicts with the imported Product type

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    // Fetch product data
    const fetchedProduct = products.find(p => p.id === id);
    
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      console.error(`Product with ID ${id} not found`);
    }
  }, [id]);

  if (!product) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductViewer3D productId={product.id} productName={product.name} />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              <p className="text-xl text-forever-navy font-semibold">
                ₹{product.discountPercentage > 0 
                  ? (product.price * (1 - product.discountPercentage / 100)).toFixed(0) 
                  : product.price.toFixed(0)}
              </p>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-gray-500 line-through ml-2">
                    ₹{product.price.toFixed(0)}
                  </span>
                  <span className="ml-2 bg-forever-orange text-white text-xs px-2 py-1 rounded">
                    {product.discountPercentage}% OFF
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
                className="w-full bg-forever-navy text-white py-3 rounded-md hover:bg-opacity-90"
                onClick={() => {
                  if (selectedSize) {
                    alert(`Added ${product.name} in size ${selectedSize} to cart!`);
                  } else {
                    alert("Please select a size first!");
                  }
                }}
              >
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
