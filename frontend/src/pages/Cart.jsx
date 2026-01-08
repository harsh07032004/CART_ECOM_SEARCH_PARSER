import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRating } from "@/components/UserRating";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart, getCartCount } = useCart();
  const { rateProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleQuantityChange = (productId, change) => {
    if (change > 0) {
      const item = cartItems.find(item => item.id === productId);
      if (item) addToCart(item);
    } else {
      decreaseQuantity(productId);
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Order Placed! 🎉",
      description: `Your order of ₹${(totalAmount * 1.1).toFixed(2)} has been confirmed. Thank you for shopping!`,
    });
    clearCart();
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={getCartCount()} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                              <p className="text-sm text-muted-foreground">{item.company}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                            </div>
                          </div>

                          {/* Rating Component - Only shown for cart items */}
                          <div className="pt-2 border-t">
                            <UserRating
                              productId={item.id}
                              userRatings={item.userRatings}
                              onRate={rateProduct}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <CardContent className="p-0 space-y-4">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>₹{(totalAmount * 1.1).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 pt-4">
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 