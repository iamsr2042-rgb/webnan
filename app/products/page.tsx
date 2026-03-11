'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  demoUrl?: string;
  images?: string[];
  features?: string[];
  installationService?: boolean;
  fileUrl?: string;
  createdAt?: string;
}

interface SearchResponse {
  products: Product[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
  };
}

const CATEGORIES = [
  'All',
  'E-Commerce',
  'Dashboard',
  'Booking',
  'CRM',
  'Blog',
  'Landing Page',
  'Admin Panel',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceMin, setPriceMin] = useState('0');
  const [priceMax, setPriceMax] = useState('9999');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
    currentPage: 1,
    totalPages: 1,
  });
  const [categories, setCategories] = useState(CATEGORIES);

  // Debounce search queries
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const offset = (page - 1) * pagination.limit;
        const category = selectedCategory === 'All' ? '' : selectedCategory;

        const params = new URLSearchParams({
          search: searchQuery,
          category,
          priceMin,
          priceMax,
          sort: sortBy,
          limit: pagination.limit.toString(),
          offset: offset.toString(),
        });

        const response = await fetch(`/api/products/search?${params.toString()}`);
        const data: SearchResponse = await response.json();

        if (response.ok) {
          setProducts(data.products);
          setPagination(data.pagination);
          setCurrentPage(page);
        } else {
          console.error('[v0] Search error:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchQuery, sortBy, priceMin, priceMax, pagination.limit]
  );

  // Handle search with debounce
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      // Search will be triggered by the effect
    }, 300);

    setSearchTimeout(timeout);
  };

  // Fetch products when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [selectedCategory, sortBy, priceMin, priceMax]);

  // Fetch products when search query changes (with debounce)
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 500);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Search Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Browse Templates
              </h1>
              <p className="text-muted-foreground">
                Discover thousands of premium website templates and scripts
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search templates by title or description..."
                className="pl-10 py-3 bg-background border border-input"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="rounded-lg border border-border bg-card p-4 sticky top-20 space-y-6">
              {/* Categories */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-bold text-foreground">Categories</h2>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-foreground mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Min: ${priceMin}</label>
                    <Input
                      type="number"
                      min="0"
                      max="9999"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min price"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Max: ${priceMax}</label>
                    <Input
                      type="number"
                      min="0"
                      max="9999"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max price"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Sort By</h3>
                <div className="space-y-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        sortBy === option.value
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'All' || searchQuery || priceMin !== '0' || priceMax !== '9999' || sortBy !== 'newest') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPriceMin('0');
                    setPriceMax('9999');
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 animate-pulse mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading templates...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} templates)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchProducts(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchProducts(currentPage + 1)}
                        disabled={!pagination.hasMore}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-xl font-semibold text-foreground mb-2">
                    No templates found
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setPriceMin('0');
                      setPriceMax('9999');
                      setSortBy('newest');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
