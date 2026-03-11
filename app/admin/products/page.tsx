'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, Trash2, Edit2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProductsAdmin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    fetchUserAndProducts();
  }, [router]);

  const fetchUserAndProducts = async () => {
    try {
      // Check if user is authenticated and is admin
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      // Check if user is admin
      if (userData.user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      // Fetch products
      const productsRes = await fetch('/api/products?limit=100');
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.price || !formData.description) {
      toast.error('Title, price, and description are required');
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = editingId
        ? `/api/products/${editingId}/update`
        : '/api/products';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to save product');
        return;
      }

      const data = await response.json();
      
      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? data.product : p));
        toast.success('Product updated successfully');
      } else {
        setProducts([...products, data.product]);
        toast.success('Product created successfully');
      }

      setFormData({ title: '', description: '', price: '', category: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete product');
        return;
      }

      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', description: '', price: '', category: '' }); }} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="rounded-lg border border-border bg-card p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <Input
                  placeholder="Product title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                <Textarea
                  placeholder="Product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price (USD) *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Booking">Booking</option>
                    <option value="CRM">CRM</option>
                    <option value="Blog">Blog</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Admin Panel">Admin Panel</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ title: '', description: '', price: '', category: '' }); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                  {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">{product.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">${product.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex items-center gap-1">
                          <Edit2 className="h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)} className="flex items-center gap-1 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No products found. Create your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
