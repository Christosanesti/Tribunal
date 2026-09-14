import { z } from "zod";

export const createCaseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(20, "Please provide a detailed description (min 20 characters)")
    .max(5000, "Description must be under 5000 characters"),
  caseType: z.enum([
    "small_claims",
    "freelance_contract",
    "tenant_landlord",
    "community_dispute",
    "roommate",
    "other",
  ]),
  respondentEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  amount: z
    .number({ required_error: "Amount is required" })
    .min(0, "Amount cannot be negative")
    .max(1000000, "Amount cannot exceed $1,000,000")
    .optional()
    .nullable(),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;

export const caseDetailSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(20, "Please provide a detailed description")
    .max(5000, "Description must be under 5000 characters"),
  caseType: z.enum([
    "small_claims",
    "freelance_contract",
    "tenant_landlord",
    "community_dispute",
    "roommate",
    "other",
  ]),
  amount: z
    .number({ required_error: "Amount is required" })
    .min(0, "Amount cannot be negative")
    .max(1000000, "Amount cannot exceed $1,000,000")
    .optional()
    .nullable(),
  status: z.enum([
    "draft",
    "open",
    "in_mediation",
    "pending_payment",
    "settled",
    "closed",
  ]).optional(),
});

export type CaseDetailInput = z.infer<typeof caseDetailSchema>;

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(10000, "Message must be under 10000 characters"),
  category: z
    .enum([
      "general",
      "proposal",
      "counter_proposal",
      "complaint",
      "response",
      "ai_suggestion",
      "system",
    ])
    .default("general"),
  parentMessageId: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export const settlementTermsSchema = z.object({
  amount: z
    .number({ required_error: "Settlement amount is required" })
    .min(0, "Amount cannot be negative"),
  paymentSchedule: z
    .array(
      z.object({
        dueDate: z.string().date("Invalid date"),
        amount: z.number().min(0),
        description: z.string().max(200),
      })
    )
    .optional(),
  actions: z.array(z.string().max(500)).optional(),
  timeline: z.string().max(500).optional(),
  confidentiality: z.boolean().default(false),
  releaseOfClaims: z.boolean().default(true),
});

export type SettlementTermsInput = z.infer<typeof settlementTermsSchema>;

export const documentUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.enum([
    "contract",
    "receipt",
    "message",
    "email",
    "photo",
    "evidence",
    "other",
  ]),
  mimeType: z.string().regex(
    /^(application|image|text|audio|video)\/[a-zA-Z0-9.+-]+$/,
    "Invalid file type"
  ),
  size: z.number().min(0).max(50 * 1024 * 1024), // 50MB max
});

export const createDocumentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["contract","receipt","message","email","photo","evidence","other"]),
  mimeType: z.string(),
  url: z.string(),
  size: z.number(),
});
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
