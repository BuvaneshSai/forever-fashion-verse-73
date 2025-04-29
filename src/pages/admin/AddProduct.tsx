import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { addProduct } from "@/data/products";

const categories = [
  { value: "mens", label: "Men's" },
  { value: "womens", label: "Women's" },
  { value: "kids", label: "Kids" },
  { value: "mens-shoes", label: "Men's Shoes" },
  { value: "womens-shoes", label: "Women's Shoes" },
  { value: "kids-shoes", label: "Kids Shoes" },
];

const subcategories = {
  mens: ["Topwear", "Bottomwear", "Winterwear", "Summerwear"],
  womens: ["Topwear", "Bottomwear", "Winterwear", "Summerwear"],
  kids: ["Topwear", "Bottomwear", "Winterwear", "Summerwear"],
  "mens-shoes": ["Formal Shoes", "Casual Shoes", "Sports Shoes"],
  "womens-shoes": ["Formal Shoes", "Casual Shoes", "Sports Shoes"],
  "kids-shoes": ["Formal Shoes", "Casual Shoes", "Sports Shoes"],
};

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const shoeSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discountPercentage: "",
    sizes: [] as string[],
    imageFiles: [] as File[],
    imageURLs: [] as string[],
  });
  
  const calculatedPrice = productData.price && productData.discountPercentage
    ? Number(productData.price) * (1 - Number(productData.discountPercentage) / 100)
    : null;
  
  const isShoeCategory = productData.category.includes("shoes");
  const availableSizes = isShoeCategory ? shoeSizes : clothingSizes;
  const availableSubcategories = productData.category 
    ? subcategories[productData.category as keyof typeof subcategories] || []
    : [];
  
  const handleCategoryChange = (value: string) => {
    setProductData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
      sizes: [],
    }));
  };
  
  const handleSizeToggle = (size: string) => {
    setProductData((prev) => {
      const sizes = [...prev.sizes];
      
      if (sizes.includes(size)) {
        return { ...prev, sizes: sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...sizes, size] };
      }
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      if (productData.imageFiles.length + newFiles.length > 6) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 6 images per product",
          variant: "destructive",
        });
        return;
      }
      
      const newURLs = newFiles.map((file) => URL.createObjectURL(file));
      
      setProductData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...newFiles],
        imageURLs: [...prev.imageURLs, ...newURLs],
      }));
    }
  };
  
  const removeImage = (index: number) => {
    setProductData((prev) => {
      const newImageFiles = [...prev.imageFiles];
      const newImageURLs = [...prev.imageURLs];
      
      URL.revokeObjectURL(newImageURLs[index]);
      
      newImageFiles.splice(index, 1);
      newImageURLs.splice(index, 1);
      
      return {
        ...prev,
        imageFiles: newImageFiles,
        imageURLs: newImageURLs,
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.title.trim()) {
      toast({ title: "Error", description: "Product title is required", variant: "destructive" });
      return;
    }
    
    if (!productData.description.trim()) {
      toast({ title: "Error", description: "Product description is required", variant: "destructive" });
      return;
    }
    
    if (!productData.category) {
      toast({ title: "Error", description: "Product category is required", variant: "destructive" });
      return;
    }
    
    if (!productData.subcategory) {
      toast({ title: "Error", description: "Product subcategory is required", variant: "destructive" });
      return;
    }
    
    if (!productData.price || isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      toast({ title: "Error", description: "Valid product price is required", variant: "destructive" });
      return;
    }
    
    if (productData.discountPercentage && 
        (isNaN(Number(productData.discountPercentage)) || 
         Number(productData.discountPercentage) < 0 || 
         Number(productData.discountPercentage) > 100)) {
      toast({ title: "Error", description: "Discount percentage must be between 0 and 100", variant: "destructive" });
      return;
    }
    
    if (productData.sizes.length === 0) {
      toast({ title: "Error", description: "At least one size is required", variant: "destructive" });
      return;
    }
    
    if (productData.imageFiles.length === 0) {
      toast({ title: "Error", description: "At least one product image is required", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Add the product to our products array
      const newProduct = {
        id: `prod${Date.now()}`, // Generate a unique ID based on timestamp
        name: productData.title,
        description: productData.description,
        image: productData.imageURLs[0] || "https://placehold.co/600x400?text=Product+Image",
        price: Number(productData.price),
        discountPercentage: Number(productData.discountPercentage || 0),
        category: categories.find(c => c.value === productData.category)?.label || productData.category,
        subcategory: productData.subcategory,
        sizes: productData.sizes,
        stock: 100, // Default stock amount
        status: "Active"
      };
      
      addProduct(newProduct);
      
      toast({
        title: "Product added",
        description: "The product has been successfully added to the catalog",
      });
      
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AdminLayout pageTitle="Add New Product">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={productData.title}
                    onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed product description"
                    rows={5}
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={productData.subcategory}
                      onValueChange={(value) => setProductData({ ...productData, subcategory: value })}
                      disabled={!productData.category}
                    >
                      <SelectTrigger id="subcategory">
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcat) => (
                          <SelectItem key={subcat} value={subcat.toLowerCase().replace(/\s+/g, '-')}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Enter price"
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Percentage (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Enter discount"
                      value={productData.discountPercentage}
                      onChange={(e) => setProductData({ ...productData, discountPercentage: e.target.value })}
                    />
                  </div>
                </div>
                
                {calculatedPrice !== null && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-700 font-medium">
                      Final Price: ₹{calculatedPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      {productData.discountPercentage}% discount applied
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={productData.sizes.includes(size) ? "default" : "outline"}
                      className="w-12 h-12"
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Select all available sizes for this product
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {productData.imageURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  {productData.imageURLs.length < 6 && (
                    <label className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="text-center">
                        <span className="block text-2xl text-gray-400">+</span>
                        <span className="block text-sm text-gray-500">Add Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Upload up to 6 product images. The first image will be used as the main product image.
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-end border-t pt-6 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding Product..." : "Add Product"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
