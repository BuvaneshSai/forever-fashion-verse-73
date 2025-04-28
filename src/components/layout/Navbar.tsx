
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Menu, X, Search as SearchIcon } from "lucide-react";

const categories = [
  { name: "Men", path: "/shop?category=mens" },
  { name: "Women", path: "/shop?category=womens" },
  { name: "Kids", path: "/shop?category=kids" },
  { name: "Shoes", path: "/shop?category=shoes" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-forever-navy">FOREVER</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-gray-600 hover:text-forever-navy font-medium transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          {/* Search & User actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-forever-navy">
              <SearchIcon size={20} />
            </Link>
            
            <Link to="/chat-stylist" className="text-gray-600 hover:text-forever-navy">
              <Button variant="outline" size="sm">Chat Stylist</Button>
            </Link>
            
            <Link to="/cart" className="text-gray-600 hover:text-forever-navy relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-forever-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/style-quiz" className="w-full">Style Quiz</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-600 hover:text-forever-navy relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-forever-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t animate-fade-in">
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-gray-600 hover:text-forever-navy font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                to="/search" 
                className="text-gray-600 hover:text-forever-navy py-2 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <SearchIcon size={18} className="mr-2" /> Search
              </Link>
              <Link 
                to="/chat-stylist" 
                className="text-gray-600 hover:text-forever-navy py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chat Stylist
              </Link>
              <Link 
                to="/style-quiz" 
                className="text-gray-600 hover:text-forever-navy py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Style Quiz
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-forever-navy py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-600 hover:text-forever-navy py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    className="text-left text-gray-600 hover:text-forever-navy py-2"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/signin" 
                  className="bg-forever-navy text-white py-2 px-4 rounded text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
