import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRating } from "@/components/UserRating";
import { useCart } from "@/contexts/CartContext";

export function ProductCard({ product, onAddToCart, onRate }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="group h-full overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant bg-card/50 backdrop-blur-sm animate-fade-in">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-success text-success-foreground">New</Badge>
          )}
          {product.isSale && discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity ${
            isInWishlist(product.id) ? 'text-red-500' : ''
          }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick Add Button */}
        <Button
          onClick={handleAddToCart}
          className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="text-xs text-muted-foreground font-medium">{product.company}</p>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.gender && (
            <p className="text-xs text-muted-foreground">For {product.gender}</p>
          )}
          
          {/* User Rating Component */}
          <UserRating 
            productId={product.id}
            userRatings={product.userRatings}
            onRate={onRate || (() => {})}
          />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            size="sm"
            className="md:hidden"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 