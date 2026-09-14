import Stripe from "stripe";
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("fake")) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" as any, typescript: true });
}
export const stripe = getStripe();

export async function createCheckoutSession({ amount, currency = "usd", customerEmail, metadata }: { amount: number; currency?: string; customerEmail?: string; metadata?: Record<string, string> }) {
  const s = getStripe();
  if (!s) throw new Error("Stripe not configured - set STRIPE_SECRET_KEY");
  if (amount < 50) throw new Error("Amount must be at least $0.50");
  if (amount > 100000000) throw new Error("Amount exceeds maximum");
  return s.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency, product_data: { name: "Tribunal Escrow", description: "Dispute resolution escrow - funds held until settlement" }, unit_amount: amount }, quantity: 1 }],
    mode: "payment",
    customer_email: customerEmail,
    metadata: { ...metadata, escrow: "true", createdAt: new Date().toISOString() },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
    payment_intent_data: { capture_method: "manual", metadata: metadata || {} } as any,
  });
}

export async function createPaymentIntent({ amount, currency = "usd", metadata }: { amount: number; currency?: string; metadata?: Record<string, string> }) {
  const s = getStripe();
  if (!s) throw new Error("Stripe not configured");
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("Invalid amount - must be positive integer cents");
  return s.paymentIntents.create({ amount, currency, metadata, capture_method: "manual", description: "Tribunal escrow hold" });
}

export async function captureEscrow(paymentIntentId: string) {
  const s = getStripe();
  if (!s) throw new Error("Stripe not configured");
  return s.paymentIntents.capture(paymentIntentId);
}
export async function cancelEscrow(paymentIntentId: string) {
  const s = getStripe();
  if (!s) throw new Error("Stripe not configured");
  return s.paymentIntents.cancel(paymentIntentId);
}
export function verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string) {
  const s = getStripe();
  if (!s) throw new Error("Stripe not configured");
  return s.webhooks.constructEvent(payload, signature, secret);
}
