import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin credentials (for demo)
const ADMIN_EMAIL = "admin@cartella.com";
const ADMIN_PASSWORD = "admin123";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cartella_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAdmin(userData.isAdmin || false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check for admin login
        const adminLogin = email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        
        const userData = { 
          uid: `user-${Date.now()}`, 
          email,
          isAdmin: adminLogin
        };
        
        setUser(userData);
        setIsAdmin(adminLogin);
        localStorage.setItem('cartella_user', JSON.stringify(userData));
        
        setLoading(false);
        toast({
          title: adminLogin ? "Admin Login" : "Success",
          description: adminLogin 
            ? "Welcome back, Admin!" 
            : "You have been logged in successfully!",
        });
        resolve(userData);
      }, 500);
    });
  };

  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('cartella_user');
    toast({
      title: "Success",
      description: "You have been logged out successfully!",
    });
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};