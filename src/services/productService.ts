
import { supabase } from '../integrations/supabase/client';
import { Product } from '@/data/products';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  // Transform the data to match our Product interface
  return data.map(item => ({
    ...item,
    discount_percentage: item.discount_percentage,
    sizes: item.sizes || [],
  })) as Product[];
};

// Add a new product
export const addProductToSupabase = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  // Create a properly typed object for Supabase insertion
  const supabaseProduct = {
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    discount_percentage: product.discount_percentage,
    category: product.category,
    subcategory: product.subcategory,
    sizes: product.sizes || [],
    stock: product.stock || 100,
    status: product.status || 'Active',
    rating: product.rating || 0,
    model3d: product.model3d || null
  };

  const { data, error } = await supabase
    .from('products')
    .insert([supabaseProduct])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw new Error(error.message);
  }

  return data as Product;
};

// Upload a product image
export const uploadProductImage = async (file: File): Promise<string | null> => {
  const filePath = `products/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(error.message);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

// Toggle product status (active/out of stock)
export const toggleProductStatus = async (productId: string, currentStatus: string): Promise<boolean> => {
  const newStatus = currentStatus === 'Active' ? 'Out of Stock' : 'Active';
  const newStock = newStatus === 'Active' ? 10 : 0;

  const { error } = await supabase
    .from('products')
    .update({ status: newStatus, stock: newStock })
    .eq('id', productId);

  if (error) {
    console.error('Error updating product status:', error);
    return false;
  }

  return true;
};

// Delete a product (mark as deleted)
export const deleteProduct = async (productId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'Deleted' })
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
};
