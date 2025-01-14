import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      const response = await api.login(email, password);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Success",
        description: "Login successful! Welcome back.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 relative flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')] 
        bg-cover bg-center bg-no-repeat opacity-50"
      />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <KeyRound className="h-16 w-16 text-white mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80 text-center">Sign in to continue your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 text-white placeholder-white/60 border-white/20 h-12"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/20 text-white placeholder-white/60 border-white/20 h-12"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-105"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center space-y-4">
          <Link 
            to="/forgot-password" 
            className="text-white/80 hover:text-white transition-colors block"
          >
            Forgot password?
          </Link>
          <p className="text-white/80">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-white hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;