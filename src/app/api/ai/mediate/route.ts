import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMediationSuggestion } from "@/lib/ai";
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { caseId } = await req.json();
    if (!caseId) return NextResponse.json({ error: "caseId required" }, { status: 400 });
    const c = await prisma.case.findUnique({ where: { id: caseId } });
    if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
    const hasAccess = c.claimantId===session.user.id || c.respondentId===session.user.id || c.mediatorId===session.user.id || session.user.role==="admin";
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const messages = await prisma.message.findMany({ where: { caseId }, orderBy: { createdAt: "desc" }, take: 10 });
    const suggestion = await generateMediationSuggestion({ title: c.title, description: c.description, amount: c.amount, caseType: c.caseType } as any, messages.map(m=>({content:m.content})));
    // Save as system message
    await prisma.message.create({ data: { content: `AI Mediation: ${suggestion.summary}\n\nSuggested: ${suggestion.suggestedPosition}\n\nReasoning: ${suggestion.reasoning}`, senderId: session.user.id, caseId, category: "ai_suggestion" } });
    return NextResponse.json(suggestion);
  } catch(e:any){ return NextResponse.json({ error: e.message }, { status: 500 }); }
}
