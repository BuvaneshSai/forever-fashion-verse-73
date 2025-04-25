
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    discountPercentage: 20,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discountPercentage: 15,
    category: "mens",
    subcategory: "bottomwear",
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discountPercentage: 25,
    category: "womens",
    subcategory: "summerwear",
  },
  {
    id: "prod4",
    name: "Sports Running Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    price: 2200,
    discountPercentage: 10,
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
    discountPercentage: 0,
    category: "mens",
    subcategory: "winterwear",
  },
  {
    id: "prod6",
    name: "Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
    price: 800,
    discountPercentage: 0,
    category: "mens",
    subcategory: "topwear",
  },
  {
    id: "prod7",
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1546462703-201935303da4",
    price: 2500,
    discountPercentage: 5,
    category: "womens",
    subcategory: "accessories",
  },
  {
    id: "prod8",
    name: "Summer Hat",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
    price: 600,
    discountPercentage: 0,
    category: "womens",
    subcategory: "accessories",
  },
];

const ProductCard = ({ product }: { product: any }) => {
  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100) 
    : product.price;
  
  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-forever-navy font-semibold">
              ₹{discountedPrice.toFixed(0)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-gray-500 line-through ml-2">
                  ₹{product.price.toFixed(0)}
                </span>
                <span className="ml-2 bg-forever-orange text-white text-xs px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UserLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="hero-slider h-[70vh]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="container mx-auto h-full flex items-center">
                <div className="max-w-lg px-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-white mb-8 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.link}>
                    <Button className="bg-forever-orange hover:bg-forever-navy text-white">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-forever-orange" : "bg-white bg-opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Banners */}
      <section className="py-8 bg-forever-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center p-4 text-center">
              <div>
                <div className="rounded-full bg-forever-orange bg-opacity-10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forever-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
                <p className="text-gray-600">Premium materials and expert craftsmanship</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 text-center">
              <div>
                <div className="rounded-full bg-forever-orange bg-opacity-10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forever-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable shipping nationwide</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 text-center">
              <div>
                <div className="rounded-full bg-forever-orange bg-opacity-10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forever-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">Multiple secure payment options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Bestsellers</h2>
            <Link to="/shop?category=bestsellers" className="flex items-center text-forever-navy hover:text-forever-orange">
              <span className="mr-2">View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Banner */}
      <section className="py-12 bg-forever-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Discover Your Style</h2>
              <p className="text-lg mb-6">
                Not sure what suits you best? Try our AI-powered tools to find the perfect fit for your unique style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat-stylist">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forever-navy">
                    Chat with AI Stylist
                  </Button>
                </Link>
                <Link to="/style-quiz">
                  <Button className="bg-forever-orange hover:bg-white hover:text-forever-navy">
                    Take Style Quiz
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -left-4 -top-4 bg-forever-orange rounded-full w-32 h-32 opacity-20"></div>
                <div className="absolute -right-4 -bottom-4 bg-forever-orange rounded-full w-24 h-24 opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"
                  alt="Stylish outfits"
                  className="rounded-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Collections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Collections</h2>
            <Link to="/shop?category=new" className="flex items-center text-forever-navy hover:text-forever-orange">
              <span className="mr-2">View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Links */}
      <section className="py-12 bg-forever-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="/shop?category=mens" className="group relative h-44 md:h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-semibold">Men</span>
              </div>
            </Link>
            <Link to="/shop?category=womens" className="group relative h-44 md:h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-semibold">Women</span>
              </div>
            </Link>
            <Link to="/shop?category=kids" className="group relative h-44 md:h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4"
                alt="Kids Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-semibold">Kids</span>
              </div>
            </Link>
            <Link to="/shop?category=shoes" className="group relative h-44 md:h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1562183241-b937e95585b6"
                alt="Shoes Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-semibold">Shoes</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-forever-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Be the first to know about new collections and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-forever-navy"
              />
              <Button className="bg-forever-navy hover:bg-forever-orange text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default Home;
