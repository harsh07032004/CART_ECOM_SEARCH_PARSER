import { useState } from "react";
import { Search, ShoppingCart, Menu, X, User, LayoutDashboard, Heart, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ onSearch, cartCount }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const navigationLinks = [
    { name: "Discover", path: "/" },
    { name: "Collection", path: "/products" },
    { name: "Mission", path: "/about" },
    { name: "Support", path: "/contact" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-3xl font-black tracking-tighter uppercase">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity drop-shadow-sm">
                CART
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:text-primary hover:tracking-wider ${
                  isActivePath(link.path) 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 max-w-md flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 h-10 w-full"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="hidden md:flex" title="Login">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <ThemeToggle />

            <Link to="/admin">
              <Button variant="ghost" size="icon" title="Admin Dashboard">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 h-10 w-full"
            />
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors ${
                    isActivePath(link.path) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="text-sm font-medium px-2 py-2 rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="pt-2 border-t">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => { setIsMenuOpen(false); navigate('/login'); }}>
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 