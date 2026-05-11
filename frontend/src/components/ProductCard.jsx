import { Heart, ShoppingCart, Star, Eye, Tag, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CAT_ACCENT = {
  shoes:    { from: "from-violet-500", to: "to-purple-600", badge: "text-violet-600 bg-violet-50 border-violet-200" },
  phone:    { from: "from-sky-500",    to: "to-blue-600",   badge: "text-sky-600 bg-sky-50 border-sky-200" },
  earphone: { from: "from-teal-500",   to: "to-emerald-500",badge: "text-teal-600 bg-teal-50 border-teal-200" },
  shirts:   { from: "from-rose-500",   to: "to-pink-600",   badge: "text-rose-600 bg-rose-50 border-rose-200" },
  watches:  { from: "from-amber-500",  to: "to-orange-500", badge: "text-amber-600 bg-amber-50 border-amber-200" },
  laptop:   { from: "from-indigo-500", to: "to-blue-600",   badge: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  jeans:    { from: "from-blue-500",   to: "to-indigo-600", badge: "text-blue-600 bg-blue-50 border-blue-200" },
  bags:     { from: "from-fuchsia-500",to: "to-purple-600", badge: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200" },
  jackets:  { from: "from-orange-500", to: "to-red-500",    badge: "text-orange-600 bg-orange-50 border-orange-200" },
};

export function ProductCard({ product, onAddToCart, onRate }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const discountPct = product.discount > 0
    ? product.discount
    : product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const ratings = product.userRatings || [];
  const avgRating = ratings.length > 0
    ? ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length
    : product.rating || 0;
  const starCount = Math.round(avgRating);

  const cat = product.category?.toLowerCase();
  const accent = CAT_ACCENT[cat] || CAT_ACCENT.shoes;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    else addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleCardClick = () => navigate(`/product/${product.id}`);

  return (
    <motion.article
      onClick={handleCardClick}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group product-card"
    >
      {/* ── Top accent line ── */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-[4/3] bg-secondary/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-xl hover:bg-white transition-colors shadow-md"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge-blue badge text-[10px]">
              <Sparkles className="h-2.5 w-2.5" /> New
            </span>
          )}
          {discountPct > 0 && (
            <span className="badge-red badge text-[10px]">
              <Tag className="h-2.5 w-2.5" /> -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          onClick={handleWishlistToggle}
          whileTap={{ scale: 0.84 }}
          className={`absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-xl shadow-md backdrop-blur-sm border transition-all duration-200
            ${inWishlist
              ? "bg-rose-500 border-rose-400 text-white opacity-100"
              : "bg-background/80 border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300 opacity-0 group-hover:opacity-100"
            }`}
        >
          <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-current" : ""}`} />
        </motion.button>
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Brand + gender */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            {product.company}
          </span>
          {product.gender && product.gender !== "unisex" && (
            <span className="text-[10px] text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-md border border-border">
              {product.gender}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground mb-2">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < starCount ? "star-filled" : "star-empty"}`}
            />
          ))}
          {ratings.length > 0 && (
            <span className="text-[10px] text-muted-foreground ml-1">({ratings.length})</span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-base text-foreground">
              ₹{product.price?.toLocaleString()}
            </span>
            {discountPct > 0 && product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.88 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
              bg-blue-600 hover:bg-blue-700 text-white
              opacity-0 group-hover:opacity-100 transition-all duration-200
              shadow-md hover:shadow-blue-400/30"
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Mobile always-visible add button */}
      <div className="sm:hidden px-4 pb-4">
        <button onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
    </motion.article>
  );
}