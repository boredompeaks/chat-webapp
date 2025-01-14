import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      if (!username || !email || !password || !confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password must be at least 6 characters long",
        });
        return;
      }

      // Here you would typically make an API call to register the user
      // For now, we'll simulate a successful registration
      
      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 relative flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')] 
        bg-cover bg-center bg-no-repeat"
        style={{ filter: 'brightness(0.6)' }}
      />
      
      <div className="relative z-10 w-full max-w-md p-6 backdrop-blur-md bg-white/20 rounded-xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <UserPlus className="h-12 w-12 text-white mb-2" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-white/80">Join our community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/20 text-white placeholder-white/60 border-white/20"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 text-white placeholder-white/60 border-white/20"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/20 text-white placeholder-white/60 border-white/20"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/20 text-white placeholder-white/60 border-white/20"
          />
          
          <Button type="submit" className="w-full" size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center text-white/80">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;