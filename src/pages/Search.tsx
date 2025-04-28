
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

// Demo data (replace with actual data from your backend)
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
