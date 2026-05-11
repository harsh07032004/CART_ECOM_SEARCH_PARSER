import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart3, ShieldAlert } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminProductList } from "@/components/AdminProductList";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isAdmin } = useAuth();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={() => {}} cartCount={0} />
        <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <ShieldAlert className="h-20 w-20 text-destructive mb-6 opacity-80" />
          <h1 className="text-3xl font-bold mb-3">Access Restricted</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            You need admin privileges to view this page. Please log in with your
            admin account.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowForm(false);
    } catch {
      // addProduct already shows toast on error
    }
  };

  const handleUpdateProduct = async (productData) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
    } catch {
      // updateProduct already shows toast on error
    }
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!window.confirm(`Delete "${product?.name}"? This cannot be undone.`)) return;
    await deleteProduct(productId);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => {}} cartCount={0} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                {products.length} products in catalog
              </p>
            </div>

            {!showForm && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/analytics")}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            )}
          </div>
        </div>

        {showForm ? (
          <AdminProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          />
        ) : (
          <AdminProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;