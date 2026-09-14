"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const caseTypes = [
  { value: "small_claims", label: "Small Claims" },
  { value: "freelance_contract", label: "Freelance Contract" },
  { value: "tenant_landlord", label: "Tenant-Landlord" },
  { value: "community_dispute", label: "Community Dispute" },
  { value: "roommate", label: "Roommate Dispute" },
  { value: "other", label: "Other" },
];

export default function CaseWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caseType, setCaseType] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canNext = () => {
    if (step===0) return title.length>=5 && description.length>=20 && caseType;
    if (step===1) return true;
    if (step===2) return true;
    return true;
  };
  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/cases", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ title, description, caseType, respondentEmail: respondentEmail||undefined, amount: amount? parseInt(amount): undefined }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      router.push(`/cases/${d.id}`);
    } catch(e:any){ setError(e.message); setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={()=> step===0?router.push("/dashboard"):setStep(s=>s-1)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2"/>{step===0?"Back to Dashboard":"Back"}</Button>
        <div className="flex gap-2 mb-6">
          {["Details","Parties","Amount","Review"].map((l,i)=>(
            <div key={l} className={`flex-1 h-2 rounded-full ${i<=step?"bg-primary":"bg-muted"}`} title={l} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{["Case Details","Parties","Disputed Amount","Review & Submit"][step]}</CardTitle>
            <CardDescription>{["Describe your dispute","Who is involved?","What's the amount in dispute?","Review before filing"][step]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step===0 && <>
              <div><Label>Case Title *</Label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Unpaid freelance work - $3,000" /></div>
              <div><Label>Case Type *</Label><Select value={caseType} onValueChange={setCaseType}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{caseTypes.map(c=><SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Description * (min 20 chars)</Label><Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the dispute, timeline, and what resolution you seek..." rows={6} /></div>
            </>}
            {step===1 && <>
              <div><Label>Respondent Email (optional)</Label><Input type="email" value={respondentEmail} onChange={e=>setRespondentEmail(e.target.value)} placeholder="other.party@example.com" /><p className="text-xs text-muted-foreground mt-1">We'll invite them to respond. You can add later.</p></div>
            </>}
            {step===2 && <>
              <div><Label>Disputed Amount (USD, optional)</Label><Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="3000" min="0" /></div>
              <p className="text-xs text-muted-foreground">For escrow: funds are held securely via Stripe until settlement.</p>
            </>}
            {step===3 && <>
              <div className="space-y-2 text-sm bg-muted p-4 rounded-md">
                <p><strong>Title:</strong> {title}</p><p><strong>Type:</strong> {caseType}</p><p><strong>Description:</strong> {description.slice(0,200)}</p><p><strong>Respondent:</strong> {respondentEmail||"None yet"}</p><p><strong>Amount:</strong> {amount?`$${amount}`:"Not specified"}</p>
              </div>
            </>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={()=> step===0?router.push("/dashboard"):setStep(s=>s-1)}>{step===0?"Cancel":"Back"}</Button>
              {step<3 ? <Button onClick={()=>setStep(s=>s+1)} disabled={!canNext()}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button>
              : <Button onClick={submit} disabled={loading}>{loading?"Filing...":<><CheckCircle className="mr-2 h-4 w-4"/>File Case</>}</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
