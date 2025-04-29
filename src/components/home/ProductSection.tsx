
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercentage: number;
  category: string;
  subcategory: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

const ProductSection = ({ title, products, viewAllLink }: ProductSectionProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link to={viewAllLink} className="flex items-center text-forever-navy hover:text-forever-orange">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
