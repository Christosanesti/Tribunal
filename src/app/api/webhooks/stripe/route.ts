import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  if (secret && sig) {
    try {
      const { verifyWebhookSignature } = await import("@/lib/stripe");
      const event = verifyWebhookSignature(body, sig, secret);
      if ((event as any).type === "checkout.session.completed") {
        const session = (event as any).data.object;
        if (session.id) await prisma.payment.updateMany({ where: { stripeSessionId: session.id }, data: { status: "processing" } });
      }
      if ((event as any).type === "payment_intent.succeeded") {
        const pi = (event as any).data.object;
        await prisma.payment.updateMany({ where: { stripePaymentIntentId: pi.id }, data: { status: "completed" } });
      }
    } catch (e:any) { return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 }); }
  } else {
    // No secret configured - log only
    console.log("Stripe webhook received (no verification - set STRIPE_WEBHOOK_SECRET)");
  }
  return NextResponse.json({ received: true });
}
