import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/payment';
import { prisma } from '@/lib/db';
import { generateDownloadToken, calculateTokenExpiry } from '@/lib/payment';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      console.warn('[v0] Stripe webhook received without signature');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify webhook signature
    const isValid = verifyStripeWebhookSignature(body, signature);
    if (!isValid) {
      console.error('[v0] Stripe webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    console.log('[v0] ✓ Stripe webhook signature verified');

    // Parse event
    let event: any;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Handle payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        console.warn('[v0] Webhook: payment_intent.succeeded without orderId');
        return NextResponse.json({ received: true }, { status: 200 });
      }

      console.log('[v0] Processing payment success for order:', orderId);

      // Update order status
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { product: true },
      });

      if (!order) {
        console.error('[v0] Order not found:', orderId);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Check if already processed (idempotency)
      if (order.paymentStatus === 'COMPLETED') {
        console.log('[v0] Order already marked as completed:', orderId);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Generate download token
      const downloadToken = generateDownloadToken();
      const expiresAt = calculateTokenExpiry(30);

      // Update order
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          deliveryStatus: 'DELIVERED',
          downloadToken,
          expiresAt,
        },
      });

      // Create download record
      await prisma.download.create({
        data: {
          orderId,
          userId: order.userId,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });

      console.log('[v0] ✓ Order completed and download token generated:', orderId);
    }

    // Handle payment_intent.payment_failed event
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        console.log('[v0] Processing payment failure for order:', orderId);

        // Update order status
        await prisma.order.update(
          {
            where: { id: orderId },
            data: { paymentStatus: 'FAILED' },
          }
        ).catch(err => {
          console.error('[v0] Failed to update order status:', err);
        });

        console.log('[v0] Order marked as failed:', orderId);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[v0] Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
