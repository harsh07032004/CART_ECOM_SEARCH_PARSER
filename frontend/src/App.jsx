import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useKeepAlive } from "@/hooks/useKeepAlive";
import { useProducts } from "@/contexts/ProductsContext";

// Eagerly load the two most common pages
import Index from "./pages/Index";
import Products from "./pages/Products";

// Lazy-load heavy/rarely visited pages — reduces initial JS bundle ~40%
const About         = lazy(() => import("./pages/About"));
const Contact       = lazy(() => import("./pages/Contact"));
const Admin         = lazy(() => import("./pages/Admin"));
const Cart          = lazy(() => import("./pages/Cart"));
const Wishlist      = lazy(() => import("./pages/Wishlist"));
const Analytics     = lazy(() => import("./pages/Analytics"));
const NotFound      = lazy(() => import("./pages/NotFound"));
const Login         = lazy(() => import("./pages/Login"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout      = lazy(() => import("./pages/Checkout"));

/** Minimal skeleton shown while a lazy page chunk is loading */
const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  </div>
);

/** Inner component that uses ProductsContext (must be inside provider) */
const AppRoutes = () => {
  const { fetchProducts } = useProducts();
  // Keep backend alive — shows "Waking up server…" toast when Render spins down
  useKeepAlive(fetchProducts);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/"            element={<Index />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/admin"       element={<Admin />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/checkout"    element={<Checkout />} />
          <Route path="/wishlist"    element={<Wishlist />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/analytics"   element={<Analytics />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <ProductsProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner richColors closeButton />
          <AppRoutes />
        </TooltipProvider>
      </CartProvider>
    </ProductsProvider>
  </AuthProvider>
);

export default App;