import { useState, useEffect } from "react";
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
  CheckSquare, 
  Loader2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/data/products";
import { fetchProducts, toggleProductStatus, deleteProduct } from "@/services/productService";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Fetch products from Supabase on component mount
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        setProductsList(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);
  
  // Filter products based on search and filters
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "all-categories" || product.category === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === "all-status" || product.status === statusFilter;
    
    // Don't show deleted products
    return matchesSearch && matchesCategory && matchesStatus && product.status !== "Deleted";
  });
  
  // Get unique categories for the filter dropdown
  const categories = Array.from(new Set(productsList.map((product) => product.category)));
  
  const handleToggleStockStatus = async (productId: string, currentStatus: string) => {
    const success = await toggleProductStatus(productId, currentStatus);
    
    if (success) {
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
    }
  };
  
  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    const success = await deleteProduct(productToDelete);
    
    if (success) {
      setProductsList(prevProducts => 
        prevProducts.map(product => {
          if (product.id === productToDelete) {
            return {
              ...product,
              status: "Deleted"
            };
          }
          return product;
        })
      );
    }
    
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  
  const getDeletedProductName = () => {
    const product = productsList.find(p => p.id === productToDelete);
    return product ? product.name : "this product";
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
              Showing {filteredProducts.length} of {productsList.filter(p => p.status !== "Deleted").length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-forever-navy" />
              </div>
            ) : (
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
                            <p className="font-medium">
                              ₹{(product.price * (1 - product.discount_percentage / 100)).toFixed(0)}
                            </p>
                            {product.discount_percentage > 0 && (
                              <div className="flex items-center text-xs">
                                <span className="line-through text-gray-500 mr-1">
                                  ₹{product.price}
                                </span>
                                <span className="text-green-600">
                                  -{product.discount_percentage}%
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
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/products/edit/${product.id}`}>
                                  <Edit size={14} className="mr-2" />
                                  Edit Product
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStockStatus(product.id, product.status || "")}>
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
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(product.id)}
                                className="text-red-600"
                              >
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
            )}
            
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {getDeletedProductName()} from the catalog.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminProducts;
