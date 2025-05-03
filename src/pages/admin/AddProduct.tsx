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
import { addProductToSupabase, uploadProductImage } from "@/services/productService";
import { convertImageTo3D } from "@/services/aiService";
import { Loader2 } from "lucide-react";

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
  const [is3DProcessing, setIs3DProcessing] = useState(false);
  
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discount_percentage: "", // Changed from discountPercentage to discount_percentage
    sizes: [] as string[],
    imageFiles: [] as File[],
    imageURLs: [] as string[],
    model3DURL: "",
  });
  
  const calculatedPrice = productData.price && productData.discount_percentage
    ? Number(productData.price) * (1 - Number(productData.discount_percentage) / 100)
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

  const generate3DModel = async () => {
    if (productData.imageURLs.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image to generate a 3D model",
        variant: "destructive",
      });
      return;
    }

    setIs3DProcessing(true);
    try {
      // Use the first image to generate a 3D model
      const model3DURL = await convertImageTo3D(productData.imageURLs[0]);
      if (model3DURL) {
        setProductData(prev => ({
          ...prev,
          model3DURL
        }));
      }
    } finally {
      setIs3DProcessing(false);
    }
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
    
    if (productData.discount_percentage && 
        (isNaN(Number(productData.discount_percentage)) || 
         Number(productData.discount_percentage) < 0 || 
         Number(productData.discount_percentage) > 100)) {
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
      // Upload the first image to Supabase Storage
      console.log("Starting image upload to Supabase storage...");
      const imageUrl = await uploadProductImage(productData.imageFiles[0]);
      console.log("Image upload result:", imageUrl);
      
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Failed to upload product image. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // If a 3D model hasn't been generated yet, try to generate one
      let model3DURL = productData.model3DURL;
      if (!model3DURL) {
        try {
          setIs3DProcessing(true);
          model3DURL = await convertImageTo3D(imageUrl) || "";
        } catch (error) {
          console.error("Error generating 3D model:", error);
          // Continue without 3D model if it fails
        } finally {
          setIs3DProcessing(false);
        }
      }
      
      // Prepare product data for Supabase - using snake_case for database fields
      const newProduct = {
        name: productData.title,
        description: productData.description,
        image: imageUrl,
        model3d: model3DURL || null,
        price: Number(productData.price),
        discount_percentage: Number(productData.discount_percentage || 0), // Using the correct field name
        category: categories.find(c => c.value === productData.category)?.label || productData.category,
        subcategory: productData.subcategory,
        sizes: productData.sizes,
        stock: 100, // Default stock amount
        status: "Active",
        rating: 0, // Default rating for new products
      };
      
      console.log("Adding product to Supabase:", newProduct);
      // Add product to Supabase
      const addedProduct = await addProductToSupabase(newProduct);
      console.log("Add product result:", addedProduct);
      
      if (addedProduct) {
        toast({
          title: "Success",
          description: "Product added successfully",
        });
        navigate("/admin/products");
      }
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
                      value={productData.discount_percentage}
                      onChange={(e) => setProductData({ ...productData, discount_percentage: e.target.value })}
                    />
                  </div>
                </div>
                
                {calculatedPrice !== null && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-700 font-medium">
                      Final Price: ₹{calculatedPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      {productData.discount_percentage}% discount applied
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
                <CardTitle>Product Images & 3D Model</CardTitle>
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
                
                <p className="text-sm text-gray-500 mb-4">
                  Upload up to 6 product images. The first image will be used as the main product image.
                </p>

                <div className="mt-6 p-4 border border-dashed rounded-md bg-gray-50">
                  <h4 className="font-medium mb-2">AI-Generated 3D Model</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate a 3D model from your product image using AI. This will help customers visualize the product better.
                  </p>
                  
                  <Button 
                    type="button" 
                    onClick={generate3DModel}
                    disabled={productData.imageURLs.length === 0 || is3DProcessing}
                    className="w-full"
                    variant="outline"
                  >
                    {is3DProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating 3D Model...
                      </>
                    ) : (
                      'Generate 3D Model'
                    )}
                  </Button>
                  
                  {productData.model3DURL && (
                    <div className="mt-3 p-2 bg-green-50 text-green-700 rounded text-sm">
                      3D model successfully generated!
                    </div>
                  )}
                </div>
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
                <Button 
                  type="submit" 
                  disabled={isLoading || is3DProcessing}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
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
