import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema = z.object({ caseId: z.string().min(1), amount: z.number().int().min(50).max(100000000) });
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid amount", details: parsed.error.flatten() }, { status: 400 });
    const { caseId, amount } = parsed.data;
    const c = await prisma.case.findUnique({ where: { id: caseId } });
    if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
    const hasAccess = c.claimantId===session.user.id || c.respondentId===session.user.id || c.mediatorId===session.user.id || session.user.role==="admin";
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // Rate limit: check recent payments
    const recent = await prisma.payment.count({ where: { caseId, createdAt: { gte: new Date(Date.now()-60000) } } });
    if (recent >= 3) return NextResponse.json({ error: "Too many requests - try again shortly" }, { status: 429 });

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes("fake")) {
      // Mock escrow for demo/build
      const payment = await prisma.payment.create({ data: { caseId, userId: session.user.id, amount, currency: "usd", status: "pending", stripeSessionId: `mock_${Date.now()}` } });
      return NextResponse.json({ mock: true, paymentId: payment.id, message: "Stripe not configured - mock escrow created. Set STRIPE_SECRET_KEY for live payments.", amount });
    }
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    // verify idempotency - don't duplicate pending payments
    const existing = await prisma.payment.findFirst({ where: { caseId, status: "pending", amount } });
    if (existing?.stripeSessionId && !existing.stripeSessionId.startsWith("mock_")) {
      return NextResponse.json({ url: existing.stripeSessionId, reused: true });
    }
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: `Tribunal Escrow - ${c.caseNumber}`, description: `Escrow hold for case: ${c.title.slice(0,60)}` }, unit_amount: amount }, quantity: 1 }],
      mode: "payment",
      customer_email: session.user.email || undefined,
      metadata: { caseId, userId: session.user.id, escrow: "true" },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cases/${caseId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cases/${caseId}?payment=cancelled`,
      payment_intent_data: { capture_method: "manual", metadata: { caseId } } as any,
    });
    await prisma.payment.create({ data: { caseId, userId: session.user.id, amount, currency: "usd", status: "pending", stripeSessionId: sessionStripe.id, stripePaymentIntentId: sessionStripe.payment_intent as string | null } });
    return NextResponse.json({ url: sessionStripe.url, sessionId: sessionStripe.id });
  } catch (e:any) { console.error(e); return NextResponse.json({ error: e.message||"Failed to create payment" }, { status: 500 }); }
}
