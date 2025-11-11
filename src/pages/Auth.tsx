import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, login } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Local admin auth for UI development. Use env VITE_ADMIN_PASSWORD if set, otherwise default to 'admin'.
      const adminPw = import.meta.env.VITE_ADMIN_PASSWORD || "admin";
      if (password === adminPw) {
        const sessionToken = `local-${Date.now()}`;
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(); // 8 hours
        login(sessionToken, expiresAt);
        toast({
          title: "Welcome!",
          description: "You have successfully logged in as admin.",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-2xl mx-auto mb-4">
              AC
            </div>
            <CardTitle className="text-3xl">Admin Login</CardTitle>
            <CardDescription>Athleland Conditioning Club</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
