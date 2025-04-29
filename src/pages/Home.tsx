
import UserLayout from "@/components/layout/UserLayout";
import HeroSlider from "@/components/home/HeroSlider";
import FeatureBanners from "@/components/home/FeatureBanners";
import ProductSection from "@/components/home/ProductSection";
import AiFeaturesBanner from "@/components/home/AiFeaturesBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import Newsletter from "@/components/home/Newsletter";

// Demo data
const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    link: "/shop?category=summer",
  },
  {
    id: 2,
    title: "Exclusive Designs",
    subtitle: "Quality fashion at affordable prices",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    link: "/shop?category=new",
  },
];

const bestSellers = [
  {
    id: "prod1",
    name: "Classic White Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: 1200,
    discount_percentage: 20,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discount_percentage: 15,
    category: "mens",
    subcategory: "bottomwear",
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discount_percentage: 25,
    category: "womens",
    subcategory: "summerwear",
  },
  {
    id: "prod4",
    name: "Sports Running Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    price: 2200,
    discount_percentage: 10,
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
    discount_percentage: 0,
    category: "mens",
    subcategory: "winterwear",
  },
  {
    id: "prod6",
    name: "Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
    price: 800,
    discount_percentage: 0,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod7",
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1546462703-201935303da4",
    price: 2500,
    discount_percentage: 5,
    category: "womens",
    subcategory: "accessories",
  },
  {
    id: "prod8",
    name: "Summer Hat",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
    price: 600,
    discount_percentage: 0,
    category: "womens",
    subcategory: "accessories",
  },
];

const categories = [
  {
    name: "Men",
    path: "/shop?category=mens",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc"
  },
  {
    name: "Women",
    path: "/shop?category=womens",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b"
  },
  {
    name: "Kids",
    path: "/shop?category=kids",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4"
  },
  {
    name: "Shoes",
    path: "/shop?category=shoes",
    image: "https://images.unsplash.com/photo-1562183241-b937e95585b6"
  },
];

const Home = () => {
  return (
    <UserLayout>
      <HeroSlider slides={heroSlides} />
      <FeatureBanners />
      <ProductSection 
        title="Bestsellers" 
        products={bestSellers} 
        viewAllLink="/shop?category=bestsellers" 
      />
      <AiFeaturesBanner />
      <ProductSection 
        title="Latest Collections" 
        products={newArrivals} 
        viewAllLink="/shop?category=new" 
      />
      <CategoryGrid categories={categories} />
      <Newsletter />
    </UserLayout>
  );
};

export default Home;
