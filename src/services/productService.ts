
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";
import { toast } from "@/components/ui/use-toast";

// Function to fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

// Function to add a new product to Supabase
export const addProductToSupabase = async (product: Omit<Product, "id">): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Product added",
      description: "The product has been successfully added to the catalog",
    });
    
    return data;
  } catch (error) {
    console.error("Failed to add product:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while adding the product",
      variant: "destructive",
    });
    return null;
  }
};

// Function to toggle product stock status
export const toggleProductStatus = async (productId: string, currentStatus: string): Promise<boolean> => {
  const newStatus = currentStatus === "Active" ? "Out of Stock" : "Active";
  const newStock = newStatus === "Active" ? 10 : 0;
  
  try {
    const { error } = await supabase
      .from("products")
      .update({ 
        status: newStatus,
        stock: newStock 
      })
      .eq("id", productId);
    
    if (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: `Failed to update product status: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to update product status:", error);
    return false;
  }
};

// Function to delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    
    if (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed from the catalog",
    });
    
    return true;
  } catch (error) {
    console.error("Failed to delete product:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while deleting the product",
      variant: "destructive",
    });
    return false;
  }
};

// Function to upload a product image to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file);
    
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return null;
  }
};
