import { Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminProductList({ products, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products ({products.length})</h2>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.category} • ID: {product.id}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm">
                            {product.userRatings.length > 0 
                              ? (product.userRatings.reduce((sum, r) => sum + r.rating, 0) / product.userRatings.length).toFixed(1)
                              : '0.0'
                            }
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({product.userRatings.length})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {product.isNew && (
                          <Badge className="bg-success text-success-foreground">New</Badge>
                        )}
                        {product.isSale && (
                          <Badge className="bg-destructive text-destructive-foreground">Sale</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 