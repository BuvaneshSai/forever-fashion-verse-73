
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, View } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/data/products";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

const ProductSection = ({ title, products, viewAllLink }: ProductSectionProps) => {
  // Filter out inactive or deleted products
  const activeProducts = products.filter(product => product.status === "Active");
  
  // Count products with 3D models
  const productsWithModels = activeProducts.filter(p => p.model3d).length;
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {productsWithModels > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <View className="inline-block mr-1" size={16} />
                {productsWithModels} product{productsWithModels !== 1 ? 's' : ''} with 3D preview
              </p>
            )}
          </div>
          <Link to={viewAllLink} className="flex items-center text-forever-navy hover:text-forever-orange">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {activeProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
