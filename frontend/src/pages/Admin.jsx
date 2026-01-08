import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminProductList } from "@/components/AdminProductList";
import { useProducts } from "@/contexts/ProductsContext";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddProduct = (productData) => {
    addProduct(productData);
    setShowForm(false);
    
    toast({
      title: "Product Added",
      description: `${productData.name} has been added successfully.`,
    });
  };

  const handleUpdateProduct = (productData) => {
    if (!editingProduct) return;
    
    updateProduct(editingProduct.id, productData);
    setEditingProduct(null);
    setShowForm(false);
    
    toast({
      title: "Product Updated",
      description: `${productData.name} has been updated successfully.`,
    });
  };

  const handleDeleteProduct = (productId) => {
    const productToDelete = products.find(p => p.id === productId);
    deleteProduct(productId);
    
    toast({
      title: "Product Deleted",
      description: `${productToDelete?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => {}} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            
            {!showForm && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/analytics')} className="gap-2">
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
            onCancel={handleCancelForm}
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