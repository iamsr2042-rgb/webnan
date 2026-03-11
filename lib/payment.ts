import crypto from "crypto";

interface StripePaymentIntentParams {
  amount: number; // Amount in cents
  currency: string;
  productName: string;
  orderId: string;
  customerEmail: string;
  customerName?: string;
}

interface SSLCommerzInitiatePaymentParams {
  store_id: string;
  store_passwd: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone?: string;
  cus_add1?: string;
  cus_city?: string;
  cus_state?: string;
  cus_postcode?: string;
  cus_country?: string;
  shipping_method?: string;
  product_name: string;
  product_category?: string;
  product_profile?: string;
}

export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateDownloadToken(): string {
  return crypto.randomUUID();
}

export function initiateSslcommerzPayment(
  params: SSLCommerzInitiatePaymentParams
): string {
  const apiUrl = process.env.SSLCOMMERZ_API_URL || "https://sandbox.sslcommerz.com";

  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryString.append(key, String(value));
    }
  });

  return `${apiUrl}/gwprocess/v4/api.php?${queryString.toString()}`;
}

export function verifySSLcommerzSignature(
  data: Record<string, string>,
  signature: string
): boolean {
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "";

  // Create a string from the data
  const hashString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("&");

  // Generate SHA256 hash
  const hash = crypto
    .createHash("sha256")
    .update(hashString + storePassword)
    .digest("hex");

  return hash === signature;
}

export function calculateTokenExpiry(daysFromNow: number = 30): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + daysFromNow);
  return expiry;
}

/**
 * Create Stripe Payment Intent
 * Note: This is a mock implementation. In production, use the Stripe SDK:
 * import Stripe from 'stripe';
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 */
export async function createStripePaymentIntent(
  params: StripePaymentIntentParams
): Promise<{
  clientSecret: string;
  intentId: string;
  error?: string;
}> {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error('[v0] STRIPE_SECRET_KEY is not set');
      return {
        clientSecret: '',
        intentId: '',
        error: 'Payment processing is not configured',
      };
    }

    // In production, use the Stripe SDK:
    // const stripe = new Stripe(stripeSecretKey);
    // const intent = await stripe.paymentIntents.create({
    //   amount: params.amount,
    //   currency: params.currency,
    //   description: params.productName,
    //   metadata: {
    //     orderId: params.orderId,
    //   },
    //   receipt_email: params.customerEmail,
    // });

    // Mock response for development
    const mockIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockClientSecret = `${mockIntentId}_secret_${crypto.randomBytes(16).toString('hex')}`;

    console.log('[v0] Created Stripe Payment Intent:', mockIntentId);

    return {
      clientSecret: mockClientSecret,
      intentId: mockIntentId,
    };
  } catch (error) {
    console.error('[v0] Error creating Stripe Payment Intent:', error);
    return {
      clientSecret: '',
      intentId: '',
      error: 'Failed to create payment intent',
    };
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeWebhookSecret) {
      console.error('[v0] STRIPE_WEBHOOK_SECRET is not set');
      return false;
    }

    // In production, use the Stripe SDK:
    // const event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);

    // For now, perform basic signature verification
    const expectedSig = crypto
      .createHmac('sha256', stripeWebhookSecret)
      .update(body)
      .digest('hex');

    return signature === expectedSig || signature === `t=${expectedSig}`;
  } catch (error) {
    console.error('[v0] Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Get payment status from Stripe Intent ID
 * In production, query the actual Stripe API
 */
export async function getStripePaymentStatus(
  intentId: string
): Promise<'succeeded' | 'processing' | 'requires_action' | 'requires_payment_method' | 'canceled' | 'unknown'> {
  try {
    // In production, use the Stripe SDK:
    // const intent = await stripe.paymentIntents.retrieve(intentId);
    // return intent.status;

    // Mock implementation
    console.log('[v0] Getting Stripe payment status for:', intentId);
    return 'unknown';
  } catch (error) {
    console.error('[v0] Error getting Stripe payment status:', error);
    return 'unknown';
  }
}

/**
 * Refund a Stripe payment
 */
export async function refundStripePayment(
  intentId: string,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' };
    }

    // In production, use the Stripe SDK:
    // const refund = await stripe.refunds.create({
    //   payment_intent: intentId,
    //   reason: reason as any,
    // });

    console.log('[v0] Refund initiated for payment:', intentId);

    return {
      success: true,
      refundId: `ref_${Date.now()}`,
    };
  } catch (error) {
    console.error('[v0] Error refunding payment:', error);
    return { success: false, error: 'Failed to process refund' };
  }
}
