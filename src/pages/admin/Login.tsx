
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password, "admin");
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forever-lightgray">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-forever-navy">FOREVER</h1>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@forever.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-forever-navy hover:bg-forever-orange"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In to Admin Portal"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>For admin access only. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
