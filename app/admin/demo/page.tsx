import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Settings, BarChart3, Users, Package, Zap, RefreshCw } from 'lucide-react';

export default function AdminDemoPage() {
  const adminFeatures = [
    {
      icon: Package,
      title: 'Product Management',
      description: 'Add, edit, and delete products. Upload files and manage product details across the marketplace.',
      link: '/admin/products',
    },
    {
      icon: BarChart3,
      title: 'Order Management',
      description: 'View all orders, track their status, and manage fulfillment and payment processing.',
      link: '/admin/orders',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts, assign roles, view activity, and handle customer relations.',
      link: '/admin/users',
    },
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Configure marketplace settings, payment gateways, and security options.',
      link: '/admin/settings',
    },
    {
      icon: Zap,
      title: 'Analytics Dashboard',
      description: 'View real-time analytics, sales trends, and performance metrics.',
      link: '/admin/analytics',
    },
    {
      icon: RefreshCw,
      title: 'Demo Reset',
      description: 'Reset demo data to initial state to showcase fresh workflows.',
      link: '#',
    },
  ];

  const workflows = [
    {
      title: 'How to Add a Product',
      steps: [
        'Navigate to Admin > Products',
        'Click "Add New Product" button',
        'Fill in product details (title, description, price)',
        'Select category and upload product file',
        'Set features and demo URL if available',
        'Click "Create Product" to publish',
      ],
    },
    {
      title: 'How to Process an Order',
      steps: [
        'Navigate to Admin > Orders',
        'Click on an order to view details',
        'Review customer information and product details',
        'Update payment status if needed',
        'Change delivery status as you process the order',
        'Download token is auto-generated upon completion',
      ],
    },
    {
      title: 'How to Manage Users',
      steps: [
        'Navigate to Admin > Users',
        'View all registered users with their information',
        'Edit user roles (Admin, Customer)',
        'View user activity and order history',
        'Delete users if necessary (won\'t delete yourself)',
        'Search and filter by email or name',
      ],
    },
  ];

  const demoData = [
    { label: 'Sample Products', value: '15+' },
    { label: 'Sample Orders', value: '10+' },
    { label: 'Sample Users', value: '3' },
    { label: 'Categories', value: '8' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-purple-100 border border-purple-400 text-purple-800 text-sm font-semibold">
              ADMIN DEMO WALKTHROUGH
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Admin Dashboard Demo</h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how to manage the Script Market platform. This guide walks you through all admin features with pre-loaded
            demo data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/admin/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-12">
                <Package className="h-5 w-5 mr-2" />
                Go to Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button size="lg" variant="outline" className="h-12">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Data Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {demoData.map((data, idx) => (
            <Card key={idx} className="p-6 text-center border-border">
              <p className="text-3xl font-bold text-primary mb-2">{data.value}</p>
              <p className="text-sm text-muted-foreground">{data.label}</p>
            </Card>
          ))}
        </div>

        {/* Admin Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Admin Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={idx} href={feature.link} className="group">
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border group-hover:border-primary/50">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all gap-1">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Workflows */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Step-by-Step Workflows</h2>

          <div className="space-y-6">
            {workflows.map((workflow, idx) => (
              <Card key={idx} className="p-8 border-border">
                <h3 className="text-2xl font-bold text-foreground mb-6">{workflow.title}</h3>

                <div className="space-y-4">
                  {workflow.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                        {stepIdx + 1}
                      </div>
                      <div className="pt-1">
                        <p className="text-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Key Concepts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Product Management',
                items: [
                  'Add new products with title, description, and pricing',
                  'Upload product files (ZIP, RAR, TAR.GZ)',
                  'Set categories and features for easy discovery',
                  'Enable installation service option for premium products',
                ],
              },
              {
                title: 'Order Processing',
                items: [
                  'Track orders from creation to delivery',
                  'Monitor payment status and handle refunds',
                  'Auto-generate download tokens for customers',
                  'Set token expiry dates (default: 30 days)',
                ],
              },
              {
                title: 'User Management',
                items: [
                  'Create and manage user accounts',
                  'Assign roles: Admin, Customer',
                  'View user activity and purchase history',
                  'Monitor user engagement metrics',
                ],
              },
              {
                title: 'Security & Compliance',
                items: [
                  'All sensitive data is encrypted',
                  'Audit logs track admin actions',
                  'Rate limiting prevents abuse',
                  'Demo mode prevents real transactions',
                ],
              },
            ].map((concept, idx) => (
              <Card key={idx} className="p-6 border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">{concept.title}</h4>
                <ul className="space-y-3">
                  {concept.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Login Info */}
        <Card className="p-8 border-green-200 bg-green-50 mb-20">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Admin Demo Credentials</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-green-800 mb-2">Email:</p>
              <code className="bg-white border border-green-200 rounded px-3 py-2 text-green-900 font-mono text-sm block w-full">
                admin@demo.scriptmarket.com
              </code>
            </div>
            <div>
              <p className="text-sm text-green-800 mb-2">Password:</p>
              <code className="bg-white border border-green-200 rounded px-3 py-2 text-green-900 font-mono text-sm block w-full">
                demo123456
              </code>
            </div>
            <Link href="/login" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Login to Admin Dashboard
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-8 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Tips & Tricks</h3>
          <ul className="space-y-3 text-blue-800 text-sm">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Use the search functionality to quickly find products or users</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Bulk operations available for managing multiple items at once</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Export reports to CSV for external analysis</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Dashboard shows real-time statistics and updates</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>All changes are logged for audit trail and compliance</span>
            </li>
          </ul>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
