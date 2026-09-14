"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, FileText, MessageSquare, DollarSign, Clock, AlertCircle } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MediatedChat } from "@/components/chat/mediated-chat";
import Link from "next/link";

const caseTypeLabels: Record<string,string> = { small_claims:"Small Claims", freelance_contract:"Freelance Contract", tenant_landlord:"Tenant-Landlord", community_dispute:"Community Dispute", roommate:"Roommate", other:"Other" };
const statusLabels: Record<string,string> = { draft:"Draft", open:"Open", in_mediation:"In Mediation", pending_payment:"Pending Payment", settled:"Settled", closed:"Closed" };
const statusColors: Record<string,string> = { draft:"bg-slate-100 text-slate-700", open:"bg-blue-100 text-blue-700", in_mediation:"bg-purple-100 text-purple-700", pending_payment:"bg-amber-100 text-amber-700", settled:"bg-green-100 text-green-700", closed:"bg-gray-100 text-gray-700" };

export default function CaseDetailView() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<"details"|"chat"|"settlement">("details");
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [settlementDraft, setSettlementDraft] = useState<string>("");

  useEffect(() => {
    const fetchCase = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cases/${id}`);
        if (!res.ok) throw new Error(res.status===404?"Case not found":"Failed to load case");
        const data = await res.json();
        setCaseData(data);
      } catch (err:any) { setError(err.message); } finally { setIsLoading(false); }
    };
    if (id) fetchCase();
  }, [id]);

  const handleAiMediation = async () => {
    try {
      const res = await fetch("/api/ai/mediate", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ caseId: id }) });
      const data = await res.json();
      if (res.ok) setAiSuggestion(data);
    } catch {}
  };
  const handleGenerateSettlement = async () => {
    try {
      const res = await fetch("/api/settlement/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ caseId: id }) });
      const data = await res.json();
      if (res.ok) setSettlementDraft(data.draft || data.terms);
      setActiveTab("settlement");
    } catch {}
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div>;
  if (error || !caseData) return <div className="flex flex-col items-center justify-center min-h-[400px] text-center"><AlertCircle className="h-12 w-12 text-destructive mb-4" /><h2 className="text-lg font-semibold">{error||"Case not found"}</h2><Button onClick={()=>router.push("/dashboard")} className="mt-4">Back to Dashboard</Button></div>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Button variant="ghost" size="sm" onClick={()=>router.push("/dashboard")} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{caseData.title}</h1>
              <Badge className={statusColors[caseData.status]||""}>{statusLabels[caseData.status]||caseData.status}</Badge>
              <span className="text-sm text-muted-foreground">{caseData.caseNumber}</span>
            </div>
            <p className="text-muted-foreground mt-1">{caseTypeLabels[caseData.caseType]} {caseData.amount ? `• ${formatCurrency(caseData.amount)}` : ""} • {formatDate(caseData.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAiMediation}>AI Mediation</Button>
            <Button size="sm" onClick={handleGenerateSettlement}>Generate Settlement</Button>
          </div>
        </div>
        <div className="flex gap-2 mb-6 border-b pb-2">
          {(["details","chat","settlement"] as const).map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${activeTab===t?"bg-primary text-primary-foreground":"hover:bg-muted"}`}>{t}</button>
          ))}
        </div>
        {aiSuggestion && (
          <Card className="mb-6 border-purple-200 bg-purple-50/50">
            <CardHeader><CardTitle className="text-purple-900 flex items-center gap-2">AI Mediation Suggestion</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Summary:</strong> {aiSuggestion.summary}</p>
              <p><strong>Suggested Position:</strong> {aiSuggestion.suggestedPosition}</p>
              <p><strong>Reasoning:</strong> {aiSuggestion.reasoning}</p>
              {aiSuggestion.potentialOutcomes && <ul className="list-disc ml-4">{aiSuggestion.potentialOutcomes.map((o:string,i:number)=><li key={i}>{o}</li>)}</ul>}
            </CardContent>
          </Card>
        )}
        {activeTab==="details" && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2"><CardHeader><CardTitle>Case Description</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-relaxed">{caseData.description}</p></CardContent></Card>
            <div className="space-y-4">
              <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Parties</CardTitle></CardHeader><CardContent className="text-sm space-y-2">
                <div><span className="text-muted-foreground">Claimant:</span> {caseData.claimant?.name||caseData.claimant?.email}</div>
                {caseData.respondent && <div><span className="text-muted-foreground">Respondent:</span> {caseData.respondent.name||caseData.respondent.email}</div>}
                {caseData.mediator && <div><span className="text-muted-foreground">Mediator:</span> {caseData.mediator.name}</div>}
                {!caseData.respondent && <p className="text-muted-foreground text-xs">No respondent yet</p>}
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4"/> Escrow</CardTitle></CardHeader><CardContent>
                <p className="text-sm text-muted-foreground mb-3">Secure funds until settlement. Stripe escrow holds payment until both parties agree.</p>
                <Button size="sm" className="w-full" onClick={async()=>{
                  const amt = caseData.amount ? caseData.amount*100 : 5000;
                  const res = await fetch("/api/payments/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({caseId:id, amount: amt})});
                  const d=await res.json(); if(d.url) window.location.href=d.url; else alert(d.error||"Payment setup - Stripe key required for live payments. Escrow mock: $"+(amt/100));
                }}>Fund Escrow {caseData.amount?formatCurrency(caseData.amount):"$50"}</Button>
              </CardContent></Card>
            </div>
          </div>
        )}
        {activeTab==="chat" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Mediation Chat</CardTitle><CardDescription>AI-assisted mediation - all messages are reviewed for fair outcomes</CardDescription></CardHeader>
            <CardContent><MediatedChat caseId={id} userId={caseData.claimantId} userName={caseData.claimant?.name||"User"} userRole="claimant" /></CardContent></Card>
        )}
        {activeTab==="settlement" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Settlement Agreement</CardTitle><CardDescription>AI-generated draft - review with mediator before signing</CardDescription></CardHeader>
            <CardContent>
              {settlementDraft ? <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{settlementDraft}</pre> : <p className="text-sm text-muted-foreground">Click Generate Settlement to create a draft agreement.</p>}
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleGenerateSettlement}>Regenerate</Button>
                <Button size="sm" variant="outline" onClick={async()=>{
                  const res=await fetch("/api/settlement",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({caseId:id, terms: settlementDraft, amount: caseData.amount})});
                  const d=await res.json(); alert(res.ok?"Settlement saved!":"Error: "+(d.error||"failed"));
                }}>Save Settlement</Button>
              </div>
            </CardContent></Card>
        )}
      </div>
    </main>
  );
}
