import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const App = () => (
  <ThemeProvider defaultTheme="light">
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App; 