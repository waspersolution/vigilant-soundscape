
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const checkAuth = async () => {
      try {
        // This would be replaced with actual Supabase auth
        const storedUser = localStorage.getItem("vigilpro-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for now - would be replaced with Supabase auth
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo user
      const demoUser: User = {
        id: "user-123",
        fullName: "John Doe",
        email: email,
        role: "community_manager",
        communityId: "comm-123",
        onlineStatus: true,
        lastLocation: {
          latitude: 37.7749,
          longitude: -122.4194,
          timestamp: new Date().toISOString()
        }
      };
      
      setUser(demoUser);
      localStorage.setItem("vigilpro-user", JSON.stringify(demoUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      // Mock registration - would be replaced with Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pretend registration is successful but user needs to be confirmed
      // In real app, this would send confirmation email via Supabase
      setUser(null);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    setUser(null);
    localStorage.removeItem("vigilpro-user");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
