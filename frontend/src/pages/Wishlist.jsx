import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRating } from "@/components/UserRating";
import { Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlistItems, removeFromWishlist, addToCart, getCartCount } = useCart();
  const { rateProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={getCartCount()} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">Your wishlist is empty</p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{item.company}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                   {/* Rating Component - Show average rating only */}
                    <UserRating
                      productId={item.id}
                      userRatings={item.userRatings}
                      onRate={rateProduct}
                      showRatingInterface={false}
                    />
                    
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 