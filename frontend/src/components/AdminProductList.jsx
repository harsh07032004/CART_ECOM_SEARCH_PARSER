import { useState } from "react";
import { Edit, Trash2, Star, Package, Tag, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminProductList({ products, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (product) => {
    setDeletingId(product.id);
    try {
      await onDelete(product.id);
    } finally {
      setDeletingId(null);
    }
  };

  const getAvgRating = (product) => {
    const ratings = product.userRatings || [];
    if (ratings.length > 0) {
      return (ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length).toFixed(1);
    }
    return (product.rating || 0).toFixed(1);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
        <p className="text-muted-foreground">Click "Add Product" to add your first product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold">
          Products{" "}
          <span className="text-muted-foreground text-lg font-normal">
            ({products.length})
          </span>
        </h2>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <img
                  src={product.image || "https://placehold.co/80x80?text=No+Img"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-muted"
                  onError={(e) => { e.target.src = "https://placehold.co/80x80?text=No+Img"; }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{product.name}</h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {product.category}
                        </span>
                        <span>{product.company}</span>
                        {product.color && (
                          <span className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            {product.color}
                          </span>
                        )}
                        {product.gender && product.gender !== "unisex" && (
                          <span className="capitalize">{product.gender}</span>
                        )}
                      </div>

                      {/* Price + Rating row */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-base">₹{product.price?.toLocaleString()}</span>
                          {product.discount > 0 && (
                            <Badge variant="secondary" className="text-xs text-green-600">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{getAvgRating(product)}</span>
                          <span className="text-muted-foreground">
                            ({(product.userRatings || []).length})
                          </span>
                        </div>
                        {product.stock !== undefined && (
                          <span className={`text-xs ${product.stock < 10 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                            Stock: {product.stock}
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mt-1.5">
                        {product.isNew && <Badge className="text-xs bg-emerald-500 text-white">New</Badge>}
                        {product.isSale && <Badge variant="destructive" className="text-xs">Sale</Badge>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Edit product"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete product"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {deletingId === product.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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