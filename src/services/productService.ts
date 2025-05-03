
import { supabase } from '../integrations/supabase/client';
import { Product } from '@/data/products';
import { toast } from '@/components/ui/use-toast';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.message);
    }

    console.log(`Successfully fetched ${data.length} products`);
    // Transform the data to match our Product interface
    return data.map(item => ({
      ...item,
      discount_percentage: item.discount_percentage || 0,
      sizes: item.sizes || [],
      model3d: item.model3d || null,
    })) as Product[];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

// Add a new product
export const addProductToSupabase = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  console.log('Submitting product to Supabase:', product);
  
  // Create a properly typed object for Supabase insertion
  const supabaseProduct = {
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    discount_percentage: product.discount_percentage || 0,
    category: product.category,
    subcategory: product.subcategory,
    sizes: product.sizes || [],
    stock: product.stock || 100,
    status: product.status || 'Active',
    rating: product.rating || 0,
    model3d: product.model3d || null // Make sure model3d is included
  };

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([supabaseProduct])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: `Failed to add product: ${error.message}`,
        variant: 'destructive'
      });
      throw new Error(error.message);
    }

    console.log('Product added successfully:', data);
    return data as Product;
  } catch (error) {
    console.error('Exception adding product:', error);
    throw error;
  }
};

// Upload a product image
export const uploadProductImage = async (file: File): Promise<string | null> => {
  console.log('Uploading file to Supabase storage:', file.name);
  
  try {
    const filePath = `products/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Check if the error is due to missing bucket
      if (error.message?.includes('bucket') || error.statusCode === 404) {
        toast({
          title: 'Storage Error',
          description: 'Products storage bucket not found. Please contact an administrator.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: `Image upload failed: ${error.message}`,
          variant: 'destructive'
        });
      }
      throw new Error(`Image upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(data.path);

    console.log('Upload successful, public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception uploading image:', error);
    throw error;
  }
};

// Toggle product status (active/out of stock)
export const toggleProductStatus = async (productId: string, currentStatus: string): Promise<boolean> => {
  try {
    const newStatus = currentStatus === 'Active' ? 'Out of Stock' : 'Active';
    const newStock = newStatus === 'Active' ? 10 : 0;

    const { error } = await supabase
      .from('products')
      .update({ status: newStatus, stock: newStock })
      .eq('id', productId);

    if (error) {
      console.error('Error updating product status:', error);
      toast({
        title: 'Status Update Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating product status:', error);
    return false;
  }
};

// Delete a product (mark as deleted)
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ status: 'Deleted' })
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting product:', error);
    return false;
  }
};
