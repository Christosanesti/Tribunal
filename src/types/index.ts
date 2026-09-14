export type UserRole = "claimant" | "respondent" | "mediator" | "admin";

export type CaseType =
  | "small_claims"
  | "freelance_contract"
  | "tenant_landlord"
  | "community_dispute"
  | "roommate"
  | "other";

export type CaseStatus =
  | "draft"
  | "open"
  | "in_mediation"
  | "pending_payment"
  | "settled"
  | "closed";

export type DocumentType =
  | "contract"
  | "receipt"
  | "message"
  | "email"
  | "photo"
  | "evidence"
  | "other";

export type MessageCategory =
  | "general"
  | "proposal"
  | "counter_proposal"
  | "complaint"
  | "response"
  | "ai_suggestion"
  | "system";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCaseInput {
  title: string;
  description: string;
  caseType: CaseType;
  claimantId: string;
  respondentId?: string;
  amount?: number;
  status?: CaseStatus;
}

export interface CreateMessageInput {
  caseId: string;
  senderId: string;
  content: string;
  category?: MessageCategory;
  parentMessageId?: string;
}

export interface CreateDocumentInput {
  caseId: string;
  uploadedById: string;
  name: string;
  type: DocumentType;
  mimeType: string;
  url: string;
  size: number;
}

export interface SettlementTerms {
  amount?: number;
  paymentSchedule?: Array<{
    dueDate: string;
    amount: number;
    description: string;
  }>;
  actions?: string[];
  timeline?: string;
  confidentiality?: boolean;
  releaseOfClaims?: boolean;
}

export interface AICompromiseSuggestion {
  summary: string;
  suggestedPosition: string;
  reasoning: string;
  potentialOutcomes: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface Case {
  id: string;
  title: string;
  description: string;
  caseType: CaseType;
  status: CaseStatus;
  amount: number | null;
  caseNumber: string;
  claimantId: string;
  respondentId: string | null;
  mediatorId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export interface Document {
  id: string; name: string; type: DocumentType; mimeType: string; url: string; size: number; caseId: string; uploadedById: string; createdAt: string|Date;
}
export interface Settlement {
  id: string; caseId: string; terms: string; amount: number|null; status: string; createdAt: string|Date;
}
