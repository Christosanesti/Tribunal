import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema = z.object({ caseId: z.string(), terms: z.string().min(10), amount: z.number().optional() });
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.flatten() }, { status: 400 });
  const { caseId, terms, amount } = parsed.data;
  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  const hasAccess = c.claimantId===session.user.id || c.mediatorId===session.user.id || session.user.role==="admin";
  if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const existing = await prisma.settlement.findUnique({ where: { caseId } });
  if (existing) {
    const updated = await prisma.settlement.update({ where: { caseId }, data: { terms, amount, status: "pending_review" } });
    return NextResponse.json(updated);
  }
  const s = await prisma.settlement.create({ data: { caseId, terms, amount, createdById: session.user.id, status: "pending_review" } });
  return NextResponse.json(s, { status: 201 });
}
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const caseId = new URL(req.url).searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId required" }, { status: 400 });
  const s = await prisma.settlement.findUnique({ where: { caseId } });
  return NextResponse.json(s);
}
