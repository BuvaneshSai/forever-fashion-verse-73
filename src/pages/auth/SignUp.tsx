
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, verifyOtp } = useAuth();
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState("");
  
  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    setError("");
    return true;
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const success = await signUp(email, name, password);
      if (success) {
        setShowOtpInput(true);
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during sign up. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await verifyOtp(email, otp);
      if (success) {
        toast({
          title: "Account created successfully",
          description: "Welcome to Forever Fashion!",
        });
        navigate("/");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during verification. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <UserLayout>
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-forever-navy mb-6">
            {showOtpInput ? "Verify Your Email" : "Create an Account"}
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {!showOtpInput ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-forever-navy hover:bg-forever-orange"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-forever-navy hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-center text-gray-600 mb-4">
                We've sent a verification code to <strong>{email}</strong>.
                Please enter it below to verify your account.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-forever-navy hover:bg-forever-orange"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Complete Sign Up"}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-forever-navy hover:underline font-medium"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default SignUp;
