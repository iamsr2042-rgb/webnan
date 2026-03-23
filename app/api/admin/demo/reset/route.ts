import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDemoMode } from '@/lib/demo';
import { verifyJWT } from '@/lib/auth';
import { jwtSecret } from '@/lib/env';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if demo mode is enabled
    if (!isDemoMode()) {
      return NextResponse.json(
        { success: false, message: 'Demo mode is not enabled' },
        { status: 400 }
      );
    }

    // Verify authentication
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(accessToken, jwtSecret);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - admin access required' },
        { status: 403 }
      );
    }

    console.log('[v0] Resetting demo data...');

    // Clear existing data
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // Recreate demo users
    const adminPassword = await bcrypt.hash('demo123456', 10);
    const customerPassword = await bcrypt.hash('demo123456', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@demo.scriptmarket.com',
        password: adminPassword,
        name: 'Demo Admin',
        role: 'ADMIN',
      },
    });

    const customer1 = await prisma.user.create({
      data: {
        email: 'customer@demo.scriptmarket.com',
        password: customerPassword,
        name: 'Demo Customer',
        role: 'CUSTOMER',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: customerPassword,
        name: 'John Doe',
        role: 'CUSTOMER',
      },
    });

    // Recreate demo products
    const demoProducts = [
      {
        title: 'E-Commerce Store Template',
        description: 'Complete e-commerce solution with cart, checkout, and payment integration.',
        price: 49,
        category: 'E-Commerce',
        features: JSON.stringify(['Shopping Cart', 'Payment Gateway', 'Order Management']),
        demoUrl: 'https://demo-ecommerce.example.com',
        installationService: true,
        fileUrl: '/files/ecommerce-template.zip',
      },
      {
        title: 'Admin Dashboard Pro',
        description: 'Professional admin dashboard with analytics, charts, and user management.',
        price: 59,
        category: 'Dashboard',
        features: JSON.stringify(['Analytics', 'Charts & Graphs', 'User Management']),
        demoUrl: 'https://demo-dashboard.example.com',
        installationService: true,
        fileUrl: '/files/admin-dashboard.zip',
      },
      {
        title: 'Booking System',
        description: 'Calendar-based booking system for services.',
        price: 79,
        category: 'Booking',
        features: JSON.stringify(['Calendar', 'Payment Integration', 'Email Notifications']),
        demoUrl: 'https://demo-booking.example.com',
        installationService: true,
        fileUrl: '/files/booking-system.zip',
      },
      {
        title: 'CRM Platform',
        description: 'Customer relationship management tool with contact tracking and deals.',
        price: 99,
        category: 'CRM',
        features: JSON.stringify(['Contact Management', 'Deal Tracking', 'Pipeline']),
        demoUrl: 'https://demo-crm.example.com',
        installationService: true,
        fileUrl: '/files/crm-platform.zip',
      },
      {
        title: 'Blog & Content Platform',
        description: 'Modern blogging platform with SEO optimization and content management.',
        price: 39,
        category: 'Blog',
        features: JSON.stringify(['SEO Optimization', 'Comments', 'Categories']),
        demoUrl: 'https://demo-blog.example.com',
        installationService: false,
        fileUrl: '/files/blog-platform.zip',
      },
      {
        title: 'Landing Page Builder',
        description: 'Drag-and-drop landing page builder with templates and conversion tracking.',
        price: 34,
        category: 'Landing Page',
        features: JSON.stringify(['Drag & Drop', 'Templates', 'Forms']),
        demoUrl: 'https://demo-landing.example.com',
        installationService: false,
        fileUrl: '/files/landing-builder.zip',
      },
      {
        title: 'Project Management Tool',
        description: 'Team collaboration tool with tasks, timelines, and progress tracking.',
        price: 99,
        category: 'Dashboard',
        features: JSON.stringify(['Tasks', 'Timelines', 'Team Collaboration']),
        demoUrl: 'https://demo-pm.example.com',
        installationService: true,
        fileUrl: '/files/project-management.zip',
      },
    ];

    const products = await Promise.all(
      demoProducts.map((product) =>
        prisma.product.create({
          data: product as any,
        })
      )
    );

    // Create sample orders
    const orders = [
      {
        userId: customer1.id,
        productId: products[0].id,
        amount: products[0].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'DELIVERED',
        downloadToken: 'demo_' + Date.now() + '_1',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer1.id,
        productId: products[1].id,
        amount: products[1].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'PENDING',
        downloadToken: 'demo_' + Date.now() + '_2',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer2.id,
        productId: products[2].id,
        amount: products[2].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'DELIVERED',
        downloadToken: 'demo_' + Date.now() + '_3',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];

    await Promise.all(
      orders.map((order) =>
        prisma.order.create({
          data: order as any,
        })
      )
    );

    console.log('[v0] Demo data reset successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Demo data has been reset successfully',
        data: {
          usersCreated: 3,
          productsCreated: products.length,
          ordersCreated: orders.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error resetting demo data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset demo data', error: String(error) },
      { status: 500 }
    );
  }
}
