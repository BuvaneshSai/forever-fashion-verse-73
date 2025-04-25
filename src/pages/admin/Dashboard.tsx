
import { useState } from "react";
import { Bar, Pie, Line } from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, Users, ShoppingBag, CreditCard, TrendingUp } from "lucide-react";

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 8000 },
];

const categoryData = [
  { name: "Men's Wear", value: 35 },
  { name: "Women's Wear", value: 40 },
  { name: "Kids Wear", value: 15 },
  { name: "Shoes", value: 10 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2025-04-22",
    amount: "₹2,400",
    status: "Completed",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2025-04-21",
    amount: "₹1,200",
    status: "Processing",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2025-04-20",
    amount: "₹3,500",
    status: "Completed",
  },
  {
    id: "ORD-004",
    customer: "Lisa Brown",
    date: "2025-04-19",
    amount: "₹800",
    status: "Pending",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2025-04-18",
    amount: "₹1,800",
    status: "Completed",
  },
];

const topProducts = [
  {
    id: "PROD-001",
    name: "Classic White Shirt",
    sold: 142,
    revenue: "₹17,040",
  },
  {
    id: "PROD-002",
    name: "Blue Denim Jeans",
    sold: 98,
    revenue: "₹14,700",
  },
  {
    id: "PROD-003",
    name: "Floral Summer Dress",
    sold: 87,
    revenue: "₹9,570",
  },
  {
    id: "PROD-004",
    name: "Sports Running Shoes",
    sold: 76,
    revenue: "₹15,200",
  },
  {
    id: "PROD-005",
    name: "Winter Jacket",
    sold: 65,
    revenue: "₹22,750",
  },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  
  return (
    <AdminLayout pageTitle="Dashboard">
      {/* Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">₹24,780</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="flex items-center text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>12%</span>
                </div>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 bg-forever-navy bg-opacity-10 rounded-full">
              <CreditCard size={24} className="text-forever-navy" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">352</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="flex items-center text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>8%</span>
                </div>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 bg-forever-orange bg-opacity-10 rounded-full">
              <ShoppingBag size={24} className="text-forever-orange" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">1,840</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="flex items-center text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>15%</span>
                </div>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">3.24%</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="flex items-center text-red-500">
                  <ArrowDown size={14} className="mr-1" />
                  <span>2%</span>
                </div>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </div>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              {/* This is a placeholder - You'd use actual recharts components */}
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sales Chart (Bar Chart)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* This is a placeholder - You'd use actual recharts components */}
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Category Chart (Pie Chart)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tables Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-sm">{order.customer}</td>
                      <td className="px-4 py-3 text-sm">{order.date}</td>
                      <td className="px-4 py-3 text-sm">{order.amount}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Units Sold</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-sm">{product.sold}</td>
                      <td className="px-4 py-3 text-sm">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
