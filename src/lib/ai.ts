import { createOpenAI } from "@ai-sdk/openai";
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-fake-key-for-build",
});
// AI mediation helper with safe fallback when no key
export async function generateMediationSuggestion(caseData: { title: string; description: string; amount?: number | null; caseType: string }, messages: { content: string }[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("fake")) {
    // Deterministic mock for build/demo without API key
    return {
      summary: `Mediation suggestion for "${caseData.title}" (${caseData.caseType})`,
      suggestedPosition: caseData.amount ? `Consider a compromise around $${Math.round((caseData.amount * 0.6))} - $${Math.round((caseData.amount * 0.8))} with a payment plan over 30-60 days.` : "Consider a structured compromise with clear deliverables and a timeline for completion.",
      reasoning: "This suggestion balances both parties' interests based on the dispute description and message history. A middle-ground financial term with a clear timeline often resolves these disputes efficiently.",
      potentialOutcomes: ["Mutual agreement with payment plan", "Escrow release upon milestone completion", "Mediated settlement agreement signed by both parties"],
      riskLevel: "medium" as const,
    };
  }
  try {
    const { generateObject } = await import("ai");
    const { z } = await import("zod");
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        summary: z.string(),
        suggestedPosition: z.string(),
        reasoning: z.string(),
        potentialOutcomes: z.array(z.string()),
        riskLevel: z.enum(["low","medium","high"]),
      }),
      prompt: `You are an impartial AI mediator. Case: ${caseData.title} (${caseData.caseType}) - ${caseData.description}. Amount: ${caseData.amount ?? "N/A"}. Recent messages: ${messages.slice(-5).map(m=>m.content).join(" | ")}. Provide a fair compromise suggestion.`,
    });
    return result.object;
  } catch {
    return {
      summary: "AI mediation temporarily unavailable - fallback suggestion",
      suggestedPosition: "Schedule a mediated session to discuss terms directly.",
      reasoning: "Unable to generate AI suggestion at this time.",
      potentialOutcomes: ["Direct negotiation", "Mediator-assisted settlement"],
      riskLevel: "medium" as const,
    };
  }
}

export async function generateSettlementDraft(caseData: { title: string; description: string; amount?: number | null }, terms: { amount?: number; actions?: string[]; timeline?: string }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("fake")) {
    const amt = terms.amount ?? caseData.amount ?? 0;
    return `SETTLEMENT AGREEMENT\n\nCase: ${caseData.title}\nAmount: $${amt}\nTerms: ${terms.actions?.join("; ") || "Payment in full"}\nTimeline: ${terms.timeline || "Within 30 days"}\n\nBoth parties agree to release all claims related to this dispute upon fulfillment of the above terms. Confidentiality applies.`;
  }
  try {
    const { generateText } = await import("ai");
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Draft a concise, legally-informed settlement agreement for: ${caseData.title} - ${caseData.description}. Terms: Amount $${terms.amount}, Actions: ${terms.actions?.join(", ")}, Timeline: ${terms.timeline}. Include payment terms, release of claims, and confidentiality. Keep it professional and enforceable in plain language.`,
    });
    return text;
  } catch {
    return `SETTLEMENT AGREEMENT - ${caseData.title}\nAmount: $${terms.amount ?? caseData.amount}\nTerms: ${terms.actions?.join("; ")}`;
  }
}
