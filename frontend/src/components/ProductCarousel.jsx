import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCarousel({ products, title, onAddToCart }) {
  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.isNew && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          New
                        </Badge>
                      )}
                      {product.isSale && (
                        <Badge variant="destructive">
                          Sale
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">
                          {product.userRatings.length > 0 
                            ? (product.userRatings.reduce((sum, r) => sum + r.rating, 0) / product.userRatings.length).toFixed(1)
                            : '0.0'
                          }
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.userRatings.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
} 