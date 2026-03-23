import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDemoData() {
  console.log('Seeding demo data...');

  try {
    // Clear existing demo data
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // Create demo users
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

    console.log('Created demo users');

    // Create demo products
    const demoProducts = [
      {
        title: 'E-Commerce Store Template',
        description: 'Complete e-commerce solution with cart, checkout, and payment integration. Built with React and Node.js.',
        price: 49,
        category: 'E-Commerce',
        features: JSON.stringify(['Shopping Cart', 'Payment Gateway', 'Order Management', 'Product Reviews']),
        demoUrl: 'https://demo-ecommerce.example.com',
        installationService: true,
        fileUrl: '/files/ecommerce-template.zip',
      },
      {
        title: 'Admin Dashboard Pro',
        description: 'Professional admin dashboard with analytics, charts, and user management. Fully responsive design.',
        price: 59,
        category: 'Dashboard',
        features: JSON.stringify(['Analytics', 'Charts & Graphs', 'User Management', 'Real-time Data']),
        demoUrl: 'https://demo-dashboard.example.com',
        installationService: true,
        fileUrl: '/files/admin-dashboard.zip',
      },
      {
        title: 'Booking System',
        description: 'Calendar-based booking system for services. Includes payment processing and email notifications.',
        price: 79,
        category: 'Booking',
        features: JSON.stringify(['Calendar', 'Payment Integration', 'Email Notifications', 'User Profiles']),
        demoUrl: 'https://demo-booking.example.com',
        installationService: true,
        fileUrl: '/files/booking-system.zip',
      },
      {
        title: 'CRM Platform',
        description: 'Customer relationship management tool with contact tracking, deals, and pipeline management.',
        price: 99,
        category: 'CRM',
        features: JSON.stringify(['Contact Management', 'Deal Tracking', 'Pipeline', 'Activity Logs']),
        demoUrl: 'https://demo-crm.example.com',
        installationService: true,
        fileUrl: '/files/crm-platform.zip',
      },
      {
        title: 'Blog & Content Platform',
        description: 'Modern blogging platform with SEO optimization, comments, and content management.',
        price: 39,
        category: 'Blog',
        features: JSON.stringify(['SEO Optimization', 'Comments', 'Categories', 'Social Sharing']),
        demoUrl: 'https://demo-blog.example.com',
        installationService: false,
        fileUrl: '/files/blog-platform.zip',
      },
      {
        title: 'Landing Page Builder',
        description: 'Drag-and-drop landing page builder with templates, forms, and conversion tracking.',
        price: 34,
        category: 'Landing Page',
        features: JSON.stringify(['Drag & Drop', 'Templates', 'Forms', 'Conversion Tracking']),
        demoUrl: 'https://demo-landing.example.com',
        installationService: false,
        fileUrl: '/files/landing-builder.zip',
      },
      {
        title: 'Admin Panel Advanced',
        description: 'Advanced admin panel with role-based access, audit logs, and system settings.',
        price: 89,
        category: 'Admin Panel',
        features: JSON.stringify(['RBAC', 'Audit Logs', 'System Settings', 'Backups']),
        demoUrl: 'https://demo-admin-advanced.example.com',
        installationService: true,
        fileUrl: '/files/admin-panel-advanced.zip',
      },
      {
        title: 'SaaS Starter Kit',
        description: 'Complete SaaS application starter with authentication, subscriptions, and billing.',
        price: 149,
        category: 'Dashboard',
        features: JSON.stringify(['Authentication', 'Subscriptions', 'Billing', 'API']),
        demoUrl: 'https://demo-saas.example.com',
        installationService: true,
        fileUrl: '/files/saas-starter.zip',
      },
      {
        title: 'Real Estate Portal',
        description: 'Property listing and management system with search filters and agent tools.',
        price: 109,
        category: 'E-Commerce',
        features: JSON.stringify(['Property Listings', 'Search', 'Agent Tools', 'Analytics']),
        demoUrl: 'https://demo-realestate.example.com',
        installationService: true,
        fileUrl: '/files/real-estate-portal.zip',
      },
      {
        title: 'Education Platform',
        description: 'Online course platform with video hosting, quizzes, and student management.',
        price: 119,
        category: 'Dashboard',
        features: JSON.stringify(['Video Hosting', 'Quizzes', 'Certificates', 'Analytics']),
        demoUrl: 'https://demo-education.example.com',
        installationService: true,
        fileUrl: '/files/education-platform.zip',
      },
      {
        title: 'Social Network Starter',
        description: 'Social networking platform with user profiles, posts, and real-time messaging.',
        price: 129,
        category: 'Blog',
        features: JSON.stringify(['User Profiles', 'Posts', 'Messaging', 'Notifications']),
        demoUrl: 'https://demo-social.example.com',
        installationService: true,
        fileUrl: '/files/social-network.zip',
      },
      {
        title: 'Project Management Tool',
        description: 'Team collaboration tool with tasks, timelines, and progress tracking.',
        price: 99,
        category: 'Dashboard',
        features: JSON.stringify(['Tasks', 'Timelines', 'Team Collaboration', 'Reports']),
        demoUrl: 'https://demo-pm.example.com',
        installationService: true,
        fileUrl: '/files/project-management.zip',
      },
      {
        title: 'Fitness App Template',
        description: 'Fitness tracking application with workout plans, progress tracking, and nutrition guide.',
        price: 44,
        category: 'Dashboard',
        features: JSON.stringify(['Workouts', 'Progress Tracking', 'Nutrition', 'Community']),
        demoUrl: 'https://demo-fitness.example.com',
        installationService: false,
        fileUrl: '/files/fitness-app.zip',
      },
      {
        title: 'Restaurant Management',
        description: 'Complete restaurant system with menu, orders, reservations, and delivery tracking.',
        price: 139,
        category: 'Booking',
        features: JSON.stringify(['Menu Management', 'Orders', 'Reservations', 'Delivery']),
        demoUrl: 'https://demo-restaurant.example.com',
        installationService: true,
        fileUrl: '/files/restaurant-management.zip',
      },
      {
        title: 'Hospital Management System',
        description: 'Healthcare management system with appointments, patient records, and billing.',
        price: 199,
        category: 'CRM',
        features: JSON.stringify(['Appointments', 'Patient Records', 'Billing', 'Reports']),
        demoUrl: 'https://demo-hospital.example.com',
        installationService: true,
        fileUrl: '/files/hospital-system.zip',
      },
    ];

    const products = await Promise.all(
      demoProducts.map((product) =>
        prisma.product.create({
          data: product as any,
        })
      )
    );

    console.log(`Created ${products.length} demo products`);

    // Create demo orders
    const orders = [
      {
        userId: customer1.id,
        productId: products[0].id,
        amount: products[0].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'DELIVERED',
        downloadToken: 'demo_token_1_' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer1.id,
        productId: products[1].id,
        amount: products[1].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'DELIVERED',
        downloadToken: 'demo_token_2_' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer2.id,
        productId: products[2].id,
        amount: products[2].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'DELIVERED',
        downloadToken: 'demo_token_3_' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer1.id,
        productId: products[3].id,
        amount: products[3].price,
        paymentStatus: 'COMPLETED',
        deliveryStatus: 'PENDING',
        downloadToken: 'demo_token_4_' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer2.id,
        productId: products[4].id,
        amount: products[4].price,
        paymentStatus: 'PENDING',
        deliveryStatus: 'PENDING',
        downloadToken: null,
        expiresAt: null,
      },
    ];

    await Promise.all(
      orders.map((order) =>
        prisma.order.create({
          data: order as any,
        })
      )
    );

    console.log(`Created ${orders.length} demo orders`);
    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoData();
