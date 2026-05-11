import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Zap, Target, Sparkles, Filter, ArrowRight, Search, Shield, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCarousel } from "@/components/ProductCarousel";
import { FilterPanel } from "@/components/FilterPanel";
import { SmartSearchBar } from "@/components/SmartSearchBar";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

function Counter({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const t = setInterval(() => { s += to / 60; if (s >= to) { setN(to); clearInterval(t); } else setN(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

const CATS = [
  { emoji: "👟", label: "Shoes" }, { emoji: "📱", label: "Phones" },
  { emoji: "🎧", label: "Earphones" }, { emoji: "👕", label: "Shirts" },
  { emoji: "⌚", label: "Watches" }, { emoji: "💻", label: "Laptops" },
  { emoji: "👖", label: "Jeans" }, { emoji: "👜", label: "Bags" },
  { emoji: "🧥", label: "Jackets" }, { emoji: "🕶️", label: "Accessories" },
];

const QUERIES = [
  { title: "Price Range",      icon: "💰", items: ["red Nike shoes under ₹3000", "earphones below ₹800", "laptops 40k–70k"] },
  { title: "Brand + Category", icon: "🏷️", items: ["Levis jeans for women", "Samsung phones", "Apple MacBook"] },
  { title: "Color & Style",    icon: "🎨", items: ["blue shirts for men", "black Puma shoes", "navy jackets"] },
  { title: "Hot Deals",        icon: "🔖", items: ["50% off jackets", "most discounted bags", "cheapest Adidas"] },
  { title: "Typo Tolerance",   icon: "🔤", items: ["nkie shoes", "samusng phone", "phon under 15000"] },
  { title: "Smart Sort",       icon: "↕️", items: ["best rated Samsung", "latest earphones", "cheapest laptop"] },
];

const HOW = [
  { n: "01", icon: Brain,  title: "NLP Parsing",   color: "#1D6BF0", desc: "spaCy extracts brand, color, gender, price and typo corrections from plain text.", tag: "spaCy · NER" },
  { n: "02", icon: Target, title: "Smart Ranking",  color: "#0047CC", desc: "Elasticsearch boosts exact attribute matches — 'blue shirts for men' ranks perfectly.", tag: "Elasticsearch · Boosting" },
  { n: "03", icon: Zap,    title: "Fallback Engine",color: "#0066FF", desc: "Zero results? Engine relaxes constraints level-by-level so you always find something.", tag: "Progressive Fallback" },
];

export default function Index() {
  const ctx = useProducts();
  const { products, rateProduct } = ctx;
  const { addToCart, getCartCount } = useCart();
  const [filtered, setFiltered] = useState(products);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();

  useEffect(() => setFiltered(products), [products]);

  const bestSellers = products.filter(p => (p.userRatings?.length || 0) > 3).sort((a, b) => b.userRatings.length - a.userRatings.length).slice(0, 16);
  const deals = products.filter(p => (p.discount || 0) >= 30).sort((a, b) => b.discount - a.discount).slice(0, 16);

  const onSearch = async (q) => { setQuery(q); await ctx.searchProducts(q); };
  const onFilter = (f) => {
    let r = products;
    if (f.categories.length) r = r.filter(p => f.categories.includes(p.category));
    r = r.filter(p => p.price >= f.priceRange[0] && p.price <= f.priceRange[1]);
    if (f.rating > 0) r = r.filter(p => { const rt = p.userRatings || []; return rt.length ? rt.reduce((s, v) => s + v.rating, 0) / rt.length >= f.rating : false; });
    setFiltered(r);
  };
  const addCart = (p) => { addToCart(p); toast({ title: "Added to cart", description: p.name }); };
  const go = (q) => { nav(`/products?search=${encodeURIComponent(q)}`); ctx.searchProducts(q); };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(160deg,#F8FAFF 0%,#FFFFFF 50%,#F5F7FF 100%)" }}>
      <Header onSearch={onSearch} cartCount={getCartCount()} />

      {/* ══ HERO ══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 35%, #e0e7ff 65%, #dbeafe 100%)" }}>
        {/* Vivid blobs — needed so glass blur has colour to refract */}
        <div className="blob w-[560px] h-[560px] top-[-100px] left-[-80px]" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(139,92,246,0.18) 40%, transparent 70%)" }} />
        <div className="blob w-[480px] h-[480px] bottom-[-60px] right-[-60px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.16) 40%, transparent 70%)" }} />
        <div className="blob w-[320px] h-[320px] top-[35%] right-[28%]" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)" }} />
        <div className="blob w-[200px] h-[200px] top-[10%] right-[10%]" style={{ background: "radial-gradient(circle, rgba(196,181,253,0.35) 0%, transparent 70%)" }} />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(rgba(99,102,241,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 section-inner pt-48 pb-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — text + search */}
          <div>
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8 mt-[5px]"
              style={{ background: "rgba(99,102,241,0.10)", color: "#4F46E5", border: "1px solid rgba(99,102,241,0.20)", backdropFilter: "blur(12px)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-soft" />
              NLP-Powered Search Engine
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-[64px] font-bold text-gray-900 mb-5" style={{ letterSpacing: "-0.03em", lineHeight: "1.08" }}>
              Find what <br />
              <span className="text-gradient-blue">feels right.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
              Lightning fast search. Exceptionally relevant results.<br />
              <span className="text-sm font-mono text-gray-400 mt-1 block">3,666 products · 10 categories · &lt;7ms</span>
            </motion.p>

            {/* Glass search box */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-4 mb-6">
              <SmartSearchBar />
            </motion.div>

            {/* Feature pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3">
              {[["🧠", "Smart Search", "Understands you"], ["⚡", "Instant Results", "In &lt; 7ms"], ["🎯", "Always Relevant", "Just for you"]].map(([icon, label, sub]) => (
                <div key={label} className="glass-pill rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-none">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating product imagery */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center relative h-[500px]">
            {/* Centre circle glow */}
            <div className="absolute w-[360px] h-[360px] rounded-full" style={{ background: "radial-gradient(circle, rgba(29,107,240,0.08) 0%, rgba(100,130,255,0.05) 50%, transparent 70%)" }} />

            {/* Main Center Image - Headphones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute z-20 animate-float" style={{ top: "15%", left: "25%" }}>
              <div className="glass-card p-3 rounded-2xl shadow-xl border border-white/40 bg-white/60 backdrop-blur-md">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" alt="Headphones" className="w-56 h-56 object-cover rounded-xl shadow-inner" />
                <div className="mt-3 px-1 pb-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sony WH-1000XM5</p>
                    <span className="flex items-center text-[10px] font-bold text-amber-500"><Star className="h-3 w-3 fill-amber-500 mr-0.5"/> 4.9</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Noise Cancelling Wireless</p>
                  <p className="text-sm font-black text-blue-600 mt-2">₹29,990</p>
                </div>
              </div>
            </motion.div>

            {/* Top Right Small Card - Watch */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              className="absolute z-10 animate-float-alt" style={{ top: "5%", right: "5%", rotate: "8deg" }}>
              <div className="glass-card p-2 rounded-2xl shadow-lg border border-white/50 bg-white/40 backdrop-blur-lg">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" alt="Watch" className="w-32 h-32 object-cover rounded-xl shadow-inner" />
                <div className="mt-2 px-1">
                  <p className="text-[10px] font-bold text-gray-800">Smart Watch Pro</p>
                  <p className="text-[11px] font-black text-blue-600 mt-0.5">₹12,499</p>
                </div>
              </div>
            </motion.div>

            {/* Bottom Left Small Card - Sneakers */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: -20 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
              className="absolute z-30 animate-float" style={{ bottom: "5%", left: "8%", rotate: "-6deg" }}>
              <div className="glass-card p-2 rounded-2xl shadow-lg border border-white/50 bg-white/50 backdrop-blur-md">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" alt="Sneakers" className="w-36 h-36 object-cover rounded-xl shadow-inner" />
                <div className="mt-2 px-1">
                  <p className="text-[10px] font-bold text-gray-800">Nike Air Max</p>
                  <p className="text-[11px] font-black text-blue-600 mt-0.5">₹14,995</p>
                </div>
              </div>
            </motion.div>

            {/* Badge overlay */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
              className="absolute bottom-[20%] right-[5%] bg-white rounded-2xl px-5 py-4 z-40 shadow-xl border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-semibold">Top match</p>
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>96% relevant</p>
                <div className="w-24 h-1.5 rounded-full mt-1 overflow-hidden bg-gray-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: "96%" }} transition={{ delay: 0.9, duration: 0.8 }}
                    className="h-full rounded-full bg-blue-500" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS TICKER ══ */}
      <div className="ticker-wrap border-y border-gray-100 py-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="animate-ticker flex whitespace-nowrap" style={{ width: "max-content" }}>
          {[...Array(3)].flatMap(() =>
            [{ v: 3666, s: "+", l: "Products" }, { v: 10, s: "", l: "Categories" }, { v: 100, s: "%", l: "NLP Coverage" }, { v: 7, s: "ms", l: "Avg Response" }].map(({ v, s, l }, i) => (
              <span key={`${l}-${i}`} className="inline-flex items-center gap-2 mx-10 flex-shrink-0 text-gray-700">
                <span className="font-black text-lg"><Counter to={v} suffix={s} /></span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{l}</span>
                <span className="text-gray-200 ml-6">·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ CATEGORIES ══ */}
      <section className="py-16 px-4">
        <div className="section-inner">
          <Reveal className="text-center mb-10">
            <p className="eyebrow justify-center">Browse by Category</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}>Shop by <span className="text-gradient-blue">category</span></h2>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {CATS.map((c, i) => (
                <motion.button key={c.label} onClick={() => go(c.label.toLowerCase())}
                  initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}
                  className="cat-chip">
                  <span className="text-xl">{c.emoji}</span><span>{c.label}</span>
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(180deg,#F8FAFF 0%,white 100%)" }}>
        <div className="section-inner">
          <Reveal className="text-center mb-14">
            <p className="eyebrow justify-center"><Brain className="h-3 w-3" /> Under the Hood</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}>How CART <span className="text-gradient-blue">thinks</span></h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">A 3-stage AI pipeline. Free text in, ranked results out — in milliseconds.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW.map(({ n, icon: Icon, title, color, desc, tag }, i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="glass-card p-7 h-full">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}12` }}>
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                    <span className="text-5xl font-black select-none leading-none" style={{ color: `${color}15` }}>{n}</span>
                  </div>
                  <h3 className="text-xl font-black mb-2 text-gray-900">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
                  <span className="badge badge-blue font-mono text-[11px]">{tag}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUERY SHOWCASE ══ */}
      <section className="py-20 px-4">
        <div className="section-inner">
          <Reveal className="text-center mb-14">
            <p className="eyebrow justify-center"><Sparkles className="h-3 w-3" /> Interactive Demo</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Try these <span className="text-gradient-blue">queries</span></h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">Click any query to run it live against the NLP engine.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUERIES.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.07}>
                <div className="glass-card overflow-hidden h-full">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
                    <span className="text-xl">{g.icon}</span>
                    <span className="font-semibold text-sm text-gray-800">{g.title}</span>
                  </div>
                  <div className="p-3 space-y-1">
                    {g.items.map((q) => (
                      <motion.button key={q} onClick={() => go(q)} whileHover={{ x: 4 }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all group">
                        <Search className="h-3.5 w-3.5 text-blue-400 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                        <span className="flex-1 truncate">{q}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOT DEALS ══ */}
      {deals.length > 0 && (
        <section className="py-12 px-4" style={{ background: "linear-gradient(180deg,white 0%,#F8FAFF 100%)" }}>
          <div className="section-inner">
            <Reveal><ProductCarousel products={deals} title="🔥 Hot Deals — 30%+ Off" onAddToCart={addCart} /></Reveal>
          </div>
        </section>
      )}

      {/* ══ BEST SELLERS ══ */}
      {bestSellers.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="section-inner">
            <Reveal><ProductCarousel products={bestSellers} title="⭐ Best Sellers" onAddToCart={addCart} /></Reveal>
          </div>
        </section>
      )}

      {/* ══ ALL PRODUCTS ══ */}
      <section className="section-inner px-4 py-16 pb-24">
        <Reveal>
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {query ? <><span className="text-gray-400 font-normal text-lg">Results for </span>"{query}"</> : "All Products"}
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-mono">{filtered.length} products{query ? " · AI-ranked" : ""}</p>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-glass gap-2">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </Reveal>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
            <FilterPanel onFilterChange={onFilter} isVisible={true} onToggle={() => setShowFilters(false)} />
          </div>
          <div className="flex-1 min-w-0">
            <ProductGrid products={filtered} onAddToCart={addCart}
              onRate={(id, r) => { rateProduct(id, r); toast({ title: "Rating submitted!" }); }} isLoading={false} />
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <section className="py-14 px-4 border-t border-gray-100 bg-white">
        <div className="section-inner grid md:grid-cols-3 gap-6">
          {[{ icon: Shield, l: "Secure Payments", d: "SSL encrypted checkout" }, { icon: Zap, l: "Fast Delivery", d: "Within 24–48 hours" }, { icon: Star, l: "Top Rated", d: "4.8★ customer satisfaction" }]
            .map(({ icon: Icon, l, d }) => (
              <div key={l} className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(29,107,240,0.08)" }}>
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div><p className="font-semibold text-sm text-gray-900">{l}</p><p className="text-gray-400 text-xs mt-0.5">{d}</p></div>
              </div>
            ))}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="section-inner py-14">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="font-black text-xl text-gray-900">CART</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">An NLP-powered e-commerce search engine. Search naturally — brand, color, price, intent, or even with typos.</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400 font-mono">All systems operational</span>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-xs uppercase tracking-widest">Tech Stack</h4>
              <ul className="space-y-2">
                {["🐍 FastAPI + spaCy", "🔍 Elasticsearch 7", "🍃 MongoDB", "⚛️ React + Vite + Framer Motion"].map(t => (
                  <li key={t} className="text-xs text-gray-400 font-mono">{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-xs uppercase tracking-widest">Capabilities</h4>
              <ul className="space-y-2">
                {["Named-entity extraction", "Fuzzy typo tolerance", "Color/gender boosting", "Progressive fallback", "Sort intent recognition"].map(t => (
                  <li key={t} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <p>© 2025 CART · Portfolio Project</p>
            <p>Built by <span className="font-bold text-blue-600">Harsh Kumar</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}