
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for analytics
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const trafficData = [
  { name: "Jan", organic: 4000, paid: 2400, direct: 1200 },
  { name: "Feb", organic: 3000, paid: 1398, direct: 900 },
  { name: "Mar", organic: 2000, paid: 9800, direct: 1200 },
  { name: "Apr", organic: 2780, paid: 3908, direct: 1500 },
  { name: "May", organic: 1890, paid: 4800, direct: 1700 },
  { name: "Jun", organic: 2390, paid: 3800, direct: 2100 },
];

// AI suggestions
const aiSuggestions = [
  "Consider creating a bundle of 'Classic White Shirt' with 'Blue Denim Jeans' and offer a 10% discount to boost overall sales.",
  "Based on purchasing patterns, customers who buy 'Floral Summer Dress' often look for matching accessories. Consider cross-selling opportunities.",
  "The 'Sports Running Shoes' have high views but lower conversion. Consider adding more detailed product information and better images.",
  "Your 'Winter Jacket' has a high margin. Consider running a limited-time promotion to increase sales volume without deeply discounting.",
  "Data shows increased traffic from mobile devices. Ensure your mobile checkout process is optimized for conversions."
];

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [categoryTimeRange, setCategoryTimeRange] = useState("all-time");
  
  const getAiRecommendation = () => {
    // Display a random AI suggestion
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    
    toast({
      title: "AI Recommendation",
      description: suggestion,
      duration: 8000,
    });
  };
  
  return (
    <AdminLayout pageTitle="Analytics">
      {/* Top Stats */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Performance Overview</h2>
        <Button variant="outline" onClick={getAiRecommendation} className="flex items-center gap-2">
          <MessageSquare size={16} />
          Get AI Recommendations
        </Button>
      </div>
      
      {/* Main Charts */}
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="sales" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales by product category</CardDescription>
            </div>
            <Select
              value={categoryTimeRange}
              onValueChange={setCategoryTimeRange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Traffic Sources */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Website traffic by source over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="organic" stroke="#0284c7" name="Organic" />
                <Line type="monotone" dataKey="paid" stroke="#22c55e" name="Paid" />
                <Line type="monotone" dataKey="direct" stroke="#f59e0b" name="Direct" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-2xl">3.24%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">
              ↑ 0.8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle className="text-2xl">₹1,245</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">
              ↑ ₹125 from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cart Abandonment</CardDescription>
            <CardTitle className="text-2xl">68.7%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-red-600">
              ↑ 2.3% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customer Retention</CardDescription>
            <CardTitle className="text-2xl">43.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">
              ↑ 1.7% from last month
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
