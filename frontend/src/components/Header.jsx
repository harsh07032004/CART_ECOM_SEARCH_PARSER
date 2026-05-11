import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, User, LayoutDashboard, Heart, LogOut, Zap, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

export function Header({ onSearch, cartCount }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const debouncedQuery = useDebounce(searchQuery, 350);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      if (location.pathname !== "/products") {
        navigate(`/products?search=${encodeURIComponent(debouncedQuery.trim())}`);
      } else if (typeof onSearch === "function") {
        onSearch(debouncedQuery.trim());
      }
    }
  }, [debouncedQuery]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Floating Header ── */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-nav py-2.5" : "py-4 bg-transparent"
        }`}
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl px-6 transition-all duration-400">
          <div className="flex items-center justify-between h-12">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
              </div>
              <span
                className="text-lg font-black tracking-tight text-gray-900"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                CART
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ── */}
            <div className="hidden md:flex items-center gap-1.5">

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 h-9 rounded-full text-sm transition-all duration-200 border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-500 hover:text-gray-800"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search products…</span>
                <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded font-mono bg-gray-100 border border-gray-200">⌘K</kbd>
              </button>



              {isAdmin && (
                <Link to="/admin">
                  <button className={`btn-ghost h-9 w-9 p-0 rounded-full ${!isScrolled && "text-white/70 hover:text-white hover:bg-white/12"}`} title="Admin">
                    <LayoutDashboard className="h-4 w-4" />
                  </button>
                </Link>
              )}

              <Link to="/wishlist">
                <button className={`btn-ghost h-9 w-9 p-0 rounded-full ${!isScrolled && "text-white/70 hover:text-rose-400 hover:bg-white/12"}`} title="Wishlist">
                  <Heart className="h-4 w-4" />
                </button>
              </Link>

              <Link to="/cart">
                <button
                  className={`relative h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                    isScrolled
                      ? "bg-secondary text-foreground hover:bg-accent border border-border"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  }`}
                  title="Cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-md"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </Link>

              {user ? (
                <button
                  onClick={logout}
                  className={`btn-ghost h-9 w-9 p-0 rounded-full ${!isScrolled && "text-white/70 hover:text-white hover:bg-white/12"}`}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              ) : (
                <Link to="/login">
                  <button
                    className={`ml-1 btn-primary h-9 px-4 text-sm rounded-full ${!isScrolled && "bg-white text-slate-900 hover:bg-white/90"}`}
                  >
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* ── Mobile ── */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart">
                <button className={`relative h-9 w-9 flex items-center justify-center rounded-full ${!isScrolled ? "text-white" : ""}`}>
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`h-9 w-9 flex items-center justify-center rounded-full transition-colors ${
                  isScrolled ? "hover:bg-accent" : "text-white hover:bg-white/12"
                }`}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Global Search Modal ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl mx-auto px-4"
            >
              <div className="surface-1 overflow-hidden">
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); }}} className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products, brands, categories…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                  />
                  {searchQuery && <button type="button" onClick={() => setSearchQuery("")}><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>}
                  <button type="submit" className="btn-primary py-1.5 px-4 text-sm rounded-full">Search</button>
                </form>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Nike shoes", "iPhone 15", "Boat earphones", "Levis jeans", "Samsung watch"].map(s => (
                      <button key={s} onClick={() => { setSearchQuery(s); navigate(`/products?search=${encodeURIComponent(s)}`); setSearchOpen(false); }}
                        className="cat-chip text-sm py-1.5 px-3">{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 surface-1 p-5 shadow-2xl"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-10"
                />
              </form>

              <nav className="flex flex-col gap-1 mb-5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "bg-primary/10 text-primary border border-primary/15"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                    <button className="btn-ghost rounded-lg text-xs gap-1.5">
                      <Heart className="h-3.5 w-3.5" /> Wishlist
                    </button>
                  </Link>
                  {user ? (
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn-ghost rounded-lg text-xs gap-1.5">
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  ) : (
                    <button onClick={() => { setIsMenuOpen(false); navigate("/login"); }} className="btn-primary py-2 px-4 text-sm rounded-full">
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}