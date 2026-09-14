import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSettlementDraft } from "@/lib/ai";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { caseId } = await req.json();
  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  const draft = await generateSettlementDraft({ title: c.title, description: c.description, amount: c.amount }, { amount: c.amount||undefined, timeline: "Within 30 days" });
  return NextResponse.json({ draft });
}
