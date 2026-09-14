import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ChevronRight, User, FileText, DollarSign, MessageSquare, Shield } from "lucide-react";

export default async function MediatorsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const mediators = session.user.role === "admin" 
    ? await prisma.user.findMany({
        where: { role: "mediator" },
        include: {
          _count: {
            select: {
              casesAsMediator: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const activeCases = session.user.role === "admin"
    ? await prisma.case.findMany({
        where: {
          status: { in: ["open", "in_mediation", "pending_payment"] },
        },
        include: {
          claimant: { select: { name: true, email: true } },
          respondent: { select: { name: true, email: true } },
          mediator: { select: { name: true, email: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      })
    : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mediators</span>
          </div>

          <Tabs defaultValue="mediators">
            <TabsList className="mb-6">
              <TabsTrigger value="mediators">
                <User className="mr-2 h-4 w-4" />
                Mediators ({mediators.length})
              </TabsTrigger>
              <TabsTrigger value="cases">
                <MessageSquare className="mr-2 h-4 w-4" />
                Active Cases ({activeCases.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mediators" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mediator Directory
                  </CardTitle>
                  <CardDescription>
                    Manage mediators and their caseload
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mediators.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No mediators registered yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {mediators.map((mediator) => (
                        <div
                          key={mediator.id}
                          className="p-4 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-lg font-medium">
                                {mediator.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="font-semibold">{mediator.name}</p>
                                <p className="text-sm text-muted-foreground">{mediator.email}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              Active
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{mediator._count.casesAsMediator} cases</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Active Cases
                  </CardTitle>
                  <CardDescription>
                    Cases awaiting mediator assignment or in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeCases.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No active cases at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeCases.map((caseData) => (
                        <div
                          key={caseData.id}
                          className="p-4 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{caseData.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {caseData.caseNumber} · {formatDate(caseData.createdAt)}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                caseData.status === "open"
                                  ? "bg-blue-100 text-blue-700"
                                  : caseData.status === "in_mediation"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {caseData.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Claimant:</span>
                              <span className="font-medium">{caseData.claimant.name}</span>
                            </div>
                            {caseData.respondent && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Respondent:</span>
                                <span className="font-medium">{caseData.respondent.name}</span>
                              </div>
                            )}
                            {caseData.mediator && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Mediator:</span>
                                <span className="font-medium text-purple-700">
                                  {caseData.mediator.name}
                                </span>
                              </div>
                            )}
                          </div>
                          {caseData.amount && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formatCurrency(caseData.amount)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
