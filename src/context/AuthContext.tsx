
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define user types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signUp: (email: string, name: string, password: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendVerificationOtp: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Admin credentials
const ADMIN_EMAIL = "buvaneshvc22259@gmail.com";
const ADMIN_PASSWORD = "Buvaneshsai163422259";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("foreverUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("foreverUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Special handling for admin login
      if (role === "admin") {
        // Check if the credentials match the admin credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser = {
            id: "admin-1",
            email: ADMIN_EMAIL,
            name: "Admin",
            role: "admin" as UserRole,
          };
          
          setUser(adminUser);
          localStorage.setItem("foreverUser", JSON.stringify(adminUser));
          
          toast({
            title: "Admin login successful",
            description: "Welcome to the admin dashboard!",
          });
          
          return true;
        } else {
          toast({
            title: "Admin login failed",
            description: "Invalid admin credentials.",
            variant: "destructive",
          });
          return false;
        }
      }
      
      // For regular users, implement Supabase authentication
      // For demo purposes, we'll keep the mock implementation
      if (email && password) {
        // Mock user for demo
        const mockUser = {
          id: `user-${Date.now()}`,
          email,
          name: email.split("@")[0],
          role,
        };
        
        setUser(mockUser);
        localStorage.setItem("foreverUser", JSON.stringify(mockUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a placeholder for actual signup logic
      // In a real implementation, you would call your API to register the user
      
      // Mock successful signup
      toast({
        title: "Verification required",
        description: "We've sent a verification code to your email.",
      });
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationOtp = async (email: string): Promise<boolean> => {
    // Mock OTP sending functionality
    console.log(`Sending OTP to ${email}`);
    toast({
      title: "Verification code sent",
      description: `We've sent a verification code to ${email}`,
    });
    return true;
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a placeholder for actual OTP verification
      // In a real implementation, you would call your API to verify the OTP
      
      // Mock successful verification for OTP "123456"
      if (otp === "123456") {
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name: email.split("@")[0],
          role: "user" as UserRole,
        };
        
        setUser(newUser);
        localStorage.setItem("foreverUser", JSON.stringify(newUser));
        
        toast({
          title: "Verification successful",
          description: "Your account is now active.",
        });
        return true;
      }
      
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification failed",
        description: "An error occurred during verification.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("foreverUser");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    signUp,
    verifyOtp,
    logout,
    sendVerificationOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
