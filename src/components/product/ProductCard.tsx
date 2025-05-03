
import { Link } from "react-router-dom";
import { Cube3d } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount_percentage: number; // Updated field name
  category: string;
  subcategory: string;
  status?: string;
  model3d?: string | null;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100) 
    : product.price;
  
  // Don't display products that are marked as deleted
  if (product.status === "Deleted") {
    return null;
  }
  
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-64 relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          {product.model3d && (
            <div className="absolute top-2 right-2 bg-forever-navy text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Cube3d size={14} className="mr-1" />
              3D View
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-forever-navy font-semibold">
              ₹{discountedPrice.toFixed(0)}
            </span>
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
          
          {product.status === "Out of Stock" && (
            <span className="block mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
