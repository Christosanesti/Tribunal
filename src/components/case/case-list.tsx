"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  FileText,
  MessageSquare,
  User,
  DollarSign,
  MapPin,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import type { Case, CaseStatus } from "@/types";

interface CaseListItemProps {
  caseData: Case & {
    claimant: { id: string; name: string | null; email: string; image: string | null };
    respondent?: { id: string; name: string | null; email: string; image: string | null } | null;
    mediator?: { id: string; name: string | null; email: string; image: string | null } | null;
    _count: { messages: number; documents: number };
  };
  userId: string;
  userRole: string;
  onClick: () => void;
}

const statusColors: Record<CaseStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  open: "bg-blue-100 text-blue-700",
  in_mediation: "bg-purple-100 text-purple-700",
  pending_payment: "bg-amber-100 text-amber-700",
  settled: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<CaseStatus, string> = {
  draft: "Draft",
  open: "Open",
  in_mediation: "In Mediation",
  pending_payment: "Pending Payment",
  settled: "Settled",
  closed: "Closed",
};

const caseTypeLabels: Record<string, string> = {
  small_claims: "Small Claims",
  freelance_contract: "Freelance Contract",
  tenant_landlord: "Tenant-Landlord",
  community_dispute: "Community Dispute",
  roommate: "Roommate Dispute",
  other: "Other",
};

export function CaseListItem({
  caseData,
  userId,
  userRole,
  onClick,
}: CaseListItemProps) {
  const isClaimant = caseData.claimantId === userId;
  const isRespondent = caseData.respondentId === userId;
  const isMediator = caseData.mediatorId === userId;

  const otherParty = isClaimant
    ? caseData.respondent
    : isRespondent
    ? caseData.claimant
    : caseData.claimant;

  return (
    <Link href="#" onClick={onClick} className="block">
      <Card
        className={cn(
          "hover:border-primary/50 hover:shadow-md transition-all cursor-pointer",
          "border-border/50"
        )}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground truncate">
                  {caseData.title}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs capitalize",
                    statusColors[caseData.status]
                  )}
                >
                  {statusLabels[caseData.status]}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {caseData.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{caseTypeLabels[caseData.caseType] || caseData.caseType}</span>
                </div>

                {caseData.amount !== null && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(caseData.amount)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDate(caseData.createdAt)}</span>
                </div>
              </div>

              {/* Parties */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {caseData.claimant.name?.charAt(0) || "?"}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-foreground">
                      {isClaimant ? "You" : caseData.claimant.name}
                    </p>
                    <p className="text-muted-foreground">Claimant</p>
                  </div>
                </div>

                {otherParty && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                      {otherParty.name?.charAt(0) || "?"}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-foreground">
                        {isRespondent ? "You" : otherParty.name}
                      </p>
                      <p className="text-muted-foreground">
                        {isClaimant ? "Respondent" : "Claimant"}
                      </p>
                    </div>
                  </div>
                )}

                {caseData.mediator && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-medium">
                      {caseData.mediator.name?.charAt(0) || "?"}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-foreground">
                        {caseData.mediator.name}
                      </p>
                      <p className="text-muted-foreground">Mediator</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity indicators */}
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                {caseData._count.messages > 0 && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{caseData._count.messages} msgs</span>
                  </div>
                )}
                {caseData._count.documents > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{caseData._count.documents} docs</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onClick();
              }}
            >
              View
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface CaseListProps {
  cases: (Case & {
    claimant: { id: string; name: string | null; email: string; image: string | null };
    respondent?: { id: string; name: string | null; email: string; image: string | null } | null;
    mediator?: { id: string; name: string | null; email: string; image: string | null } | null;
    _count: { messages: number; documents: number };
  })[];
  userId: string;
  userRole: string;
  onCaseClick: (caseId: string) => void;
}

export function CaseList({ cases, userId, userRole, onCaseClick }: CaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted/50 p-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">No cases yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          You haven&apos;t created any cases yet. Start by creating your first
          dispute resolution case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cases.map((caseData) => (
        <CaseListItem
          key={caseData.id}
          caseData={caseData}
          userId={userId}
          userRole={userRole}
          onClick={() => onCaseClick(caseData.id)}
        />
      ))}
    </div>
  );
}
