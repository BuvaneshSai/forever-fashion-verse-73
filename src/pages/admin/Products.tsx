
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  MoreHorizontal, 
  Search as SearchIcon, 
  Edit, 
  Trash, 
  Archive, 
  CheckSquare 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock product data
const products = [
  {
    id: "prod1",
    name: "Classic White Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: 1200,
    discountedPrice: 960,
    discountPercentage: 20,
    category: "Men's",
    subcategory: "Topwear",
    stock: 45,
    rating: 4.5,
    status: "Active",
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discountedPrice: 1530,
    discountPercentage: 15,
    category: "Men's",
    subcategory: "Bottomwear",
    stock: 32,
    rating: 4.3,
    status: "Active",
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discountedPrice: 1125,
    discountPercentage: 25,
    category: "Women's",
    subcategory: "Summerwear",
    stock: 28,
    rating: 4.7,
    status: "Active",
  },
  {
    id: "prod4",
    name: "Sports Running Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    price: 2200,
    discountedPrice: 1980,
    discountPercentage: 10,
    category: "Men's Shoes",
    subcategory: "Sports Shoes",
    stock: 18,
    rating: 4.6,
    status: "Active",
  },
  {
    id: "prod5",
    name: "Winter Jacket",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
    price: 3500,
    discountedPrice: 3500,
    discountPercentage: 0,
    category: "Men's",
    subcategory: "Winterwear",
    stock: 15,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "prod6",
    name: "Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
    price: 800,
    discountedPrice: 800,
    discountPercentage: 0,
    category: "Men's",
    subcategory: "Topwear",
    stock: 0,
    rating: 4.2,
    status: "Out of Stock",
  },
];

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [productsList, setProductsList] = useState(products);
  
  // Filter products based on search and filters
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "all-categories" || product.category === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === "all-status" || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get unique categories for the filter dropdown
  const categories = Array.from(new Set(products.map((product) => product.category)));
  
  const toggleStockStatus = (productId: string) => {
    setProductsList(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          const newStatus = product.status === "Active" ? "Out of Stock" : "Active";
          const newStock = newStatus === "Active" ? 10 : 0;
          
          toast({
            title: `Product ${newStatus === "Active" ? "in stock" : "out of stock"}`,
            description: `"${product.name}" is now ${newStatus.toLowerCase()}.`,
          });
          
          return {
            ...product,
            status: newStatus,
            stock: newStock
          };
        }
        return product;
      })
    );
  };
  
  return (
    <AdminLayout pageTitle="Products">
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Active">In Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              
              <Button asChild className="w-full md:w-auto">
                <Link to="/admin/products/add">
                  <Plus size={16} className="mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>
              Showing {filteredProducts.length} of {productsList.length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Stock</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden mr-3 shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="truncate max-w-[180px]">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p>{product.category}</p>
                          <p className="text-gray-500 text-xs">{product.subcategory}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">₹{product.discountedPrice}</p>
                          {product.discountPercentage > 0 && (
                            <div className="flex items-center text-xs">
                              <span className="line-through text-gray-500 mr-1">
                                ₹{product.price}
                              </span>
                              <span className="text-green-600">
                                -{product.discountPercentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {product.stock} units
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "Active" ? "In Stock" : product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit size={14} className="mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStockStatus(product.id)}>
                              {product.status === "Active" ? (
                                <>
                                  <Archive size={14} className="mr-2" />
                                  Mark as Out of Stock
                                </>
                              ) : (
                                <>
                                  <CheckSquare size={14} className="mr-2" />
                                  Mark as In Stock
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash size={14} className="mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
