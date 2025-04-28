
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercentage: number;
  category: string;
  subcategory: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100) 
    : product.price;
  
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-forever-navy font-semibold">
              ₹{discountedPrice.toFixed(0)}
            </span>
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
        </div>
      </div>
    </Link>
  );
};
