
import React from "react";
import { Link } from "react-router-dom";

interface CategoryItem {
  name: string;
  path: string;
  image: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <section className="py-12 bg-forever-lightgray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.path} 
              className="group relative h-44 md:h-64 rounded-lg overflow-hidden"
            >
              <img
                src={category.image}
                alt={`${category.name}'s Collection`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-semibold">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
