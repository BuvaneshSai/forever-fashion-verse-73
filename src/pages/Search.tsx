
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

// Sample products data
const bestSellers = [
  {
    id: "prod1",
    name: "Classic White Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: 1200,
    discountPercentage: 20,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discountPercentage: 15,
    category: "mens",
    subcategory: "bottomwear",
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discountPercentage: 25,
    category: "womens",
    subcategory: "summerwear",
  },
  {
    id: "prod4",
    name: "Sports Running Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    price: 2200,
    discountPercentage: 10,
    category: "shoes",
    subcategory: "sports-shoes",
  },
];

const newArrivals = [
  {
    id: "prod5",
    name: "Winter Jacket",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
    price: 3500,
    discountPercentage: 0,
    category: "mens",
    subcategory: "winterwear",
  },
  {
    id: "prod6",
    name: "Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
    price: 800,
    discountPercentage: 0,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod7",
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1546462703-201935303da4",
    price: 2500,
    discountPercentage: 5,
    category: "womens",
    subcategory: "accessories",
  },
  {
    id: "prod8",
    name: "Summer Hat",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
    price: 600,
    discountPercentage: 0,
    category: "womens",
    subcategory: "accessories",
  },
];

// Combine all products for search
const allProducts = [
  ...bestSellers,
  ...newArrivals,
].map(product => ({
  ...product,
  searchTerms: `${product.name.toLowerCase()} ${product.category.toLowerCase()} ${product.subcategory.toLowerCase()}`
}));

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  
  const filteredProducts = allProducts.filter(product =>
    product.searchTerms.includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Search;
