
export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercentage: number;
  category: string;
  subcategory: string;
  description?: string;
  sizes?: string[];
  stock?: number;
  rating?: number;
  status?: string;
}

export const products: Product[] = [
  {
    id: "prod1",
    name: "Classic White Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: 1200,
    discountPercentage: 20,
    category: "Men's",
    subcategory: "Topwear",
    description: "A timeless classic white shirt that goes with everything. Made from premium cotton for comfort and durability.",
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    rating: 4.5,
    status: "Active",
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discountPercentage: 15,
    category: "Men's",
    subcategory: "Bottomwear",
    description: "Premium blue denim jeans with a perfect fit. Versatile and comfortable for everyday wear.",
    sizes: ["30", "32", "34", "36"],
    stock: 32,
    rating: 4.3,
    status: "Active",
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discountPercentage: 25,
    category: "Women's",
    subcategory: "Summerwear",
    description: "Beautiful floral dress perfect for summer days. Lightweight fabric keeps you cool and comfortable.",
    sizes: ["XS", "S", "M", "L"],
    stock: 28,
    rating: 4.7,
    status: "Active",
  },
  {
    id: "prod4",
    name: "Sports Running Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    price: 2200,
    discountPercentage: 10,
    category: "Men's Shoes",
    subcategory: "Sports Shoes",
    description: "High-performance running shoes with superior cushioning and support for your daily runs.",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 18,
    rating: 4.6,
    status: "Active",
  },
  {
    id: "prod5",
    name: "Winter Jacket",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
    price: 3500,
    discountPercentage: 0,
    category: "Men's",
    subcategory: "Winterwear",
    description: "Warm and stylish winter jacket that protects from the cold while keeping you looking great.",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 15,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "prod6",
    name: "Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
    price: 800,
    discountPercentage: 0,
    category: "Men's",
    subcategory: "Topwear",
    description: "Comfortable casual t-shirt for everyday wear. Made from soft cotton fabric.",
    sizes: ["S", "M", "L", "XL"],
    stock: 0,
    rating: 4.2,
    status: "Out of Stock",
  },
];

// Function to add a new product to the products array
export const addProduct = (product: Product) => {
  products.push(product);
};
