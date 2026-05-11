import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, ChevronRight, CreditCard, Truck,
  ShoppingBag, MapPin, Phone, User, Mail, Lock, Shield,
} from "lucide-react";

/* ── Step Indicator ── */
const StepIndicator = ({ steps, current }) => (
  <div className="flex items-center justify-center mb-10">
    {steps.map((step, i) => (
      <div key={step} className="flex items-center">
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{
              scale: i === current ? 1.1 : 1,
              boxShadow: i === current ? "0 0 0 4px hsl(258 88% 66% / 0.25)" : "none",
            }}
            className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-300 ${
              i < current
                ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg"
                : i === current
                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {i < current ? <CheckCircle2 className="h-4.5 w-4.5" /> : i + 1}
          </motion.div>
          <span className={`text-[10px] font-semibold hidden sm:block uppercase tracking-wider ${
            i === current ? "text-white" : i < current ? "text-teal-400" : "text-slate-500"
          }`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-px w-12 sm:w-20 mx-2 mb-4 transition-all duration-500 ${
            i < current
              ? "bg-gradient-to-r from-teal-500 to-emerald-500"
              : "bg-slate-200"
          }`} />
        )}
      </div>
    ))}
  </div>
);

/* ── Glass Input Field ── */
const Field = ({ icon: Icon, label, type = "text", value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-rose-400 ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full h-11 rounded-xl bg-white border border-slate-200
          text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
          transition-all duration-200 text-sm
          ${Icon ? "pl-10 pr-4" : "px-4"}`}
      />
    </div>
  </div>
);

/* ── Order Summary ── */
function OrderSummary({ cartItems, totalAmount, tax, grandTotal }) {
  return (
    <div className="glass-card p-5 sticky top-24 space-y-4">
      <h3 className="font-bold text-base text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Summary</h3>
      <div className="space-y-3 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-bold text-slate-900 flex-shrink-0">
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
        {[
          { label: "Subtotal", value: `₹${totalAmount.toFixed(0)}` },
          { label: "Shipping", value: "Free", cls: "text-teal-500 font-semibold" },
          { label: "Tax (10%)", value: `₹${tax.toFixed(0)}` },
        ].map(r => (
          <div key={r.label} className="flex justify-between">
            <span className="text-slate-500">{r.label}</span>
            <span className={r.cls || "text-slate-900 font-medium"}>{r.value}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2 mt-1">
          <span className="text-slate-900">Total</span>
          <span className="text-gradient-blue text-lg">₹{grandTotal.toFixed(0)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
        <Shield className="h-3 w-3 text-teal-400" />
        SSL-secured · 100% safe checkout
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartCount } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [payment, setPayment] = useState({ method: "card", card: "", expiry: "", cvv: "", upi: "" });
  const [orderId] = useState(() => "CART" + Math.random().toString(36).slice(2, 10).toUpperCase());

  const totalAmount = cartItems.reduce((t, item) => t + item.price * item.quantity, 0);
  const tax = totalAmount * 0.1;
  const grandTotal = totalAmount + tax;
  const steps = ["Shipping", "Payment", "Confirmation"];

  const shippingValid = shipping.name && shipping.email && shipping.phone && shipping.address && shipping.city && shipping.pincode;
  const paymentValid = payment.method === "card"
    ? payment.card.length >= 16 && payment.expiry && payment.cvv.length >= 3
    : payment.method === "upi" ? payment.upi.includes("@") : true;

  const handlePlaceOrder = () => {
    clearCart();
    setStep(2);
    toast({ title: "Order Placed! 🎉", description: `Order ${orderId} confirmed.` });
  };

  if (cartItems.length === 0 && step !== 2) {
    return (
      <div className="page-wrapper hero-bg">
        <Header cartCount={getCartCount()} />
        <div className="page-content container mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-3xl glass mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your cart is empty</h2>
          <button onClick={() => navigate("/products")} className="btn-primary px-6 py-3 rounded-xl font-semibold">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper hero-bg min-h-screen">
      <Header cartCount={getCartCount()} />
      <main className="page-content container mx-auto px-4 py-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="section-label mb-2">Secure Purchase</p>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}>Checkout</h1>
        </motion.div>

        <StepIndicator steps={steps} current={step} />

        <AnimatePresence mode="wait">
          {/* ── Step 0: Shipping ── */}
          {step === 0 && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="glass-card p-6 space-y-5">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-500" />
                      </div>
                      Shipping Details
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field icon={User} label="Full Name" value={shipping.name} onChange={v => setShipping(s => ({ ...s, name: v }))} placeholder="Harsh Kumar" required />
                      <Field icon={Phone} label="Phone" type="tel" value={shipping.phone} onChange={v => setShipping(s => ({ ...s, phone: v }))} placeholder="9876543210" required />
                    </div>
                    <Field icon={Mail} label="Email" type="email" value={shipping.email} onChange={v => setShipping(s => ({ ...s, email: v }))} placeholder="harsh@example.com" required />
                    <Field icon={MapPin} label="Address" value={shipping.address} onChange={v => setShipping(s => ({ ...s, address: v }))} placeholder="123, MG Road" required />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field label="City" value={shipping.city} onChange={v => setShipping(s => ({ ...s, city: v }))} placeholder="Mumbai" required />
                      <Field label="State" value={shipping.state} onChange={v => setShipping(s => ({ ...s, state: v }))} placeholder="Maharashtra" />
                      <Field label="Pincode" value={shipping.pincode} onChange={v => setShipping(s => ({ ...s, pincode: v }))} placeholder="400001" required />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    disabled={!shippingValid}
                    className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Continue to Payment <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <OrderSummary cartItems={cartItems} totalAmount={totalAmount} tax={tax} grandTotal={grandTotal} />
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Payment ── */}
          {step === 1 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="glass-card p-6 space-y-5">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                      </div>
                      Payment Method
                    </h2>

                    {/* Method tabs */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "card", label: "💳", sublabel: "Card" },
                        { id: "upi", label: "📱", sublabel: "UPI" },
                        { id: "cod", label: "💵", sublabel: "Cash on Delivery" },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setPayment(p => ({ ...p, method: m.id }))}
                          className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                            payment.method === m.id
                              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                              : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          <span className="text-xl">{m.label}</span>
                          <span className="text-xs">{m.sublabel}</span>
                        </button>
                      ))}
                    </div>

                    {payment.method === "card" && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <Field icon={CreditCard} label="Card Number" value={payment.card} onChange={v => setPayment(p => ({ ...p, card: v.replace(/\D/g, "").slice(0, 16) }))} placeholder="1234 5678 9012 3456" />
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Expiry (MM/YY)" value={payment.expiry} onChange={v => setPayment(p => ({ ...p, expiry: v }))} placeholder="12/27" />
                          <Field icon={Lock} label="CVV" type="password" value={payment.cvv} onChange={v => setPayment(p => ({ ...p, cvv: v.slice(0, 4) }))} placeholder="•••" />
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Lock className="h-3 w-3 text-blue-500" /> Demo only — never enter real card details
                        </p>
                      </motion.div>
                    )}

                    {payment.method === "upi" && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Field label="UPI ID" value={payment.upi} onChange={v => setPayment(p => ({ ...p, upi: v }))} placeholder="harsh@okaxis" />
                      </motion.div>
                    )}

                    {payment.method === "cod" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Truck className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-800 text-sm">Cash on Delivery</p>
                          <p className="text-xs text-amber-600">Pay ₹{grandTotal.toFixed(0)} when your order arrives.</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-sm">
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!paymentValid}
                      className="flex-1 btn-primary py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Place Order →
                    </button>
                  </div>
                </div>
                <OrderSummary cartItems={cartItems} totalAmount={totalAmount} tax={tax} grandTotal={grandTotal} />
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Success ── */}
          {step === 2 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div className="max-w-lg mx-auto text-center space-y-6 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-28 h-28 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="h-16 w-16 text-blue-500" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Placed! 🎉</h2>
                  <p className="text-slate-500">Thank you for shopping with CART!</p>
                </div>
                <div className="glass-card p-6 text-left space-y-3">
                  {[
                    { label: "Order ID", value: orderId, mono: true },
                    { label: "Total Paid", value: `₹${grandTotal.toFixed(0)}` },
                    { label: "Delivery", value: "3–5 Business Days", cls: "text-teal-400 font-semibold" },
                    { label: "Delivered To", value: shipping.name || "You" },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{r.label}</span>
                      <span className={`font-semibold text-slate-900 ${r.mono ? "font-mono" : ""} ${r.cls || ""}`}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate("/products")} className="flex-1 py-3.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm">
                    <ShoppingBag className="h-4 w-4" /> Keep Shopping
                  </button>
                  <button onClick={() => navigate("/")} className="flex-1 btn-primary py-3.5 rounded-xl font-semibold">
                    Go Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
