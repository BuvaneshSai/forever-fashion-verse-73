
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  Users, 
  BarChart2, 
  Settings, 
  ChevronRight 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: ShoppingBag, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: BarChart2, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" }
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside 
      className={`bg-forever-navy text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        {!collapsed && (
          <Link to="/admin/dashboard" className="text-xl font-bold">
            FOREVER
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-blue-800"
        >
          <ChevronRight 
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`} 
            size={20} 
          />
        </Button>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  isActive(item.path)
                    ? "bg-blue-800 text-white"
                    : "text-gray-300 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Button 
          variant="outline" 
          className="w-full text-white border-white hover:bg-blue-800"
          onClick={logout}
        >
          {collapsed ? "Logout" : "Sign Out"}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
