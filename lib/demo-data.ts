export const DEMO_CREDENTIALS = {
  email: 'demo@demo.com',
  password: 'demo123',
  name: 'Demo User',
};

export const DEMO_PRODUCTS = [
  {
    id: 'demo-ecommerce-1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'Full-featured e-commerce solution with product catalog, shopping cart, checkout, and order management.',
    category: 'E-Commerce',
    price: 199,
    demoUrlFrontend: 'https://demo-ecommerce.example.com',
    demoUrlAdmin: '#admin-dashboard',
    features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Order History', 'User Profiles'],
    images: ['/placeholder.png'],
  },
  {
    id: 'demo-dashboard-1',
    title: 'Business Dashboard',
    slug: 'business-dashboard',
    description: 'Comprehensive analytics dashboard with real-time charts, reports, and business metrics.',
    category: 'Dashboard',
    price: 149,
    demoUrlFrontend: 'https://demo-dashboard.example.com',
    demoUrlAdmin: '#admin-dashboard',
    features: ['Real-time Analytics', 'Custom Reports', 'Data Export', 'User Management'],
    images: ['/placeholder.png'],
  },
];

export const DEMO_ORDERS = [
  {
    id: 'order-001',
    userId: 'demo-user-1',
    productId: 'demo-ecommerce-1',
    type: 'READY_SCRIPT',
    amount: 199,
    paymentStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    product: DEMO_PRODUCTS[0],
  },
  {
    id: 'order-002',
    userId: 'demo-user-1',
    productId: 'demo-dashboard-1',
    type: 'READY_SCRIPT',
    amount: 149,
    paymentStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    product: DEMO_PRODUCTS[1],
  },
  {
    id: 'order-003',
    userId: 'demo-user-1',
    productId: 'demo-ecommerce-1',
    type: 'READY_SCRIPT',
    amount: 199,
    paymentStatus: 'PENDING',
    deliveryStatus: 'PENDING',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    product: DEMO_PRODUCTS[0],
  },
];

export const DEMO_USERS = [
  {
    id: 'demo-user-1',
    email: 'demo@demo.com',
    name: 'Demo User',
    role: 'CUSTOMER',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'ADMIN',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20'),
  },
];

export const DEMO_STATS = {
  totalRevenue: 12450,
  totalOrders: 47,
  totalProducts: 12,
  totalCustomers: 34,
  revenueGrowth: 23.5,
  ordersGrowth: 18.2,
  productGrowth: 5.0,
  customerGrowth: 12.3,
};

export function getDemoDataBySlug(slug: string) {
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return null;
  }

  return {
    product,
    orders: DEMO_ORDERS,
    users: DEMO_USERS,
    stats: DEMO_STATS,
    credentials: DEMO_CREDENTIALS,
  };
}

export function isDemoMode(pathname: string): boolean {
  return pathname.startsWith('/demo/');
}

export const DEMO_RESET_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
