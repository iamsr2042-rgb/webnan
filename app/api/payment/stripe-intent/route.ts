import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { jwtSecret } from '@/lib/env';
import { prisma } from '@/lib/db';
import { createStripePaymentIntent } from '@/lib/payment';
import { z } from 'zod';

const stripeIntentSchema = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(accessToken, jwtSecret);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = stripeIntentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { productId } = validation.data;

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        productId,
        type: 'READY_SCRIPT',
        amount: product.price,
        paymentStatus: 'PENDING',
      },
    });

    console.log('[v0] Order created:', order.id);

    // Create Stripe Payment Intent
    const stripeResult = await createStripePaymentIntent({
      amount: Math.round(product.price * 100), // Convert to cents
      currency: 'usd',
      productName: product.title,
      orderId: order.id,
      customerEmail: user.email,
      customerName: user.name || undefined,
    });

    if (stripeResult.error) {
      return NextResponse.json(
        { error: stripeResult.error },
        { status: 500 }
      );
    }

    console.log('[v0] ✓ Stripe Payment Intent created:', stripeResult.intentId);

    return NextResponse.json(
      {
        clientSecret: stripeResult.clientSecret,
        orderId: order.id,
        amount: product.price,
        productName: product.title,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error creating Stripe Payment Intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
