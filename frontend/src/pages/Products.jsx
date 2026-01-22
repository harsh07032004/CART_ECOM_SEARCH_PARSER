import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterPanel } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";

// Import product images
import headphonesImage from "@/assets/headphones.jpg";
import tshirtImage from "@/assets/tshirt.jpg";
import securityCameraImage from "@/assets/security-camera.jpg";
import coffeeImage from "@/assets/coffee.jpg";
import yogaMatImage from "@/assets/yoga-mat.jpg";
import faceCreamImage from "@/assets/face-cream.jpg";
import phoneCaseImage from "@/assets/phone-case.jpg";
import bookImage from "@/assets/book.jpg";
import gamingmouseImage from "@/assets/gamingmouseImage.jpeg";
import denimjacketImage from "@/assets/denimjacketImage.jpeg";

const Products = () => {
  const { products, rateProduct, searchProducts, fetchProducts, loading } = useProducts();
  const { addToCart, getCartCount } = useCart();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      handleSearch(searchParam);
    }
  }, [searchParams]);

  const applyFilters = (query, filters, productList) => {
    let filtered = productList;

    // Category filter (case-insensitive)
    if (filters.categories && filters.categories.length > 0) {
      const lowerCategories = filters.categories.map(c => c.toLowerCase());
      filtered = filtered.filter(product =>
        lowerCategories.includes((product.category || '').toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    // Rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(product => {
        const ratings = product.userRatings || [];
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length 
          : 0;
        return averageRating >= filters.rating;
      });
    }

    return filtered;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchProducts(query); 
    // filteredProducts will update via useEffect when products changes
  };

  const handleFilterChange = (filters) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = applyFilters(searchQuery, filters, products);
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 200);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={getCartCount()} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                {isFilterVisible ? "Hide" : "Show"} Filters
              </Button>
            </div>
            
            <div className={`${isFilterVisible ? "block" : "hidden"} lg:block`}>
              <FilterPanel
                onFilterChange={handleFilterChange}
                isVisible={true}
                onToggle={() => setIsFilterVisible(false)}
              />
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
            </div>

            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onRate={(productId, rating) => {
                rateProduct(productId, rating);
                toast({
                  title: "Rating submitted",
                  description: "Thank you for rating this product!",
                });
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products; 