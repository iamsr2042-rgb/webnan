import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Play, Zap, Lock, Users, ShoppingCart, BarChart3 } from 'lucide-react';

export default function DemoPage() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Browse Products',
      description: 'Explore our marketplace with 15+ pre-loaded demo products across different categories.',
    },
    {
      icon: Zap,
      title: 'Test Checkout',
      description: 'Complete a test checkout experience with mock payment processing (no real charges).',
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      description: 'See how your dashboard analytics and reports work with sample data.',
    },
    {
      icon: Lock,
      title: 'Secure & Safe',
      description: 'All transactions are completely safe in demo mode. No real payment processing occurs.',
    },
    {
      icon: Users,
      title: 'Sample Data',
      description: 'Pre-populated orders, customers, and products to demonstrate full functionality.',
    },
    {
      icon: Play,
      title: 'Interactive Tour',
      description: 'Follow guided walkthroughs of key features and workflows.',
    },
  ];

  const demoCredentials = [
    {
      role: 'Admin',
      email: 'admin@demo.scriptmarket.com',
      password: 'demo123456',
      link: '/login',
      description: 'Access the full admin dashboard with all management features',
    },
    {
      role: 'Customer',
      email: 'customer@demo.scriptmarket.com',
      password: 'demo123456',
      link: '/login',
      description: 'Experience the platform as a customer with test purchases',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm font-semibold flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              DEMO MODE - Safe to Explore
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Welcome to Script Market Demo
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the full power of our marketplace platform with pre-loaded demo data. Explore products,
            test the checkout process, and see how everything works together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-12">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Demo Products
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button size="lg" variant="outline" className="h-12">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What Can You Do?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow border-border">
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Demo Credentials</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoCredentials.map((cred, idx) => (
              <Card key={idx} className="p-8 border-border bg-card hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{cred.role}</h3>
                  <p className="text-muted-foreground">{cred.description}</p>
                </div>

                <div className="space-y-4 mb-6 p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email:</p>
                    <code className="text-foreground font-mono text-sm break-all">{cred.email}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Password:</p>
                    <code className="text-foreground font-mono text-sm">{cred.password}</code>
                  </div>
                </div>

                <Link href={cred.link}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Login as {cred.role}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Try These Workflows</h2>

          <div className="space-y-6">
            {[
              {
                title: 'Browse & Search Products',
                description: 'Visit the products page to search, filter, and sort through demo products by category and price.',
                link: '/products',
                buttonText: 'Browse Products',
              },
              {
                title: 'Test Checkout Process',
                description: 'Add a product to cart and complete the checkout flow with mock payment processing.',
                link: '/products',
                buttonText: 'Start Shopping',
              },
              {
                title: 'View Your Orders',
                description: 'Log in as a customer to see your order history and download links (all mock data).',
                link: '/dashboard',
                buttonText: 'View Dashboard',
              },
              {
                title: 'Manage Products (Admin)',
                description: 'Log in as admin to add, edit, and manage products in the marketplace.',
                link: '/admin/products',
                buttonText: 'Admin Products',
              },
              {
                title: 'View Orders (Admin)',
                description: 'Monitor order status, process payments, and manage fulfillment as an administrator.',
                link: '/admin/orders',
                buttonText: 'Admin Orders',
              },
              {
                title: 'User Management (Admin)',
                description: 'View, edit, and manage user accounts and permissions in the system.',
                link: '/admin/users',
                buttonText: 'Admin Users',
              },
            ].map((workflow, idx) => (
              <Card key={idx} className="p-6 border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{workflow.title}</h3>
                    <p className="text-muted-foreground">{workflow.description}</p>
                  </div>
                  <Link href={workflow.link} className="flex-shrink-0">
                    <Button variant="outline">
                      {workflow.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <Card className="p-8 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Important Notes</h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>This is a demo environment. All data is sample data and will reset periodically.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>No real payments are processed. Payment information is mock-tested only.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Feel free to create accounts, make purchases, and explore all features.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>If you find any issues or have questions, please contact our support team.</span>
            </li>
          </ul>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
