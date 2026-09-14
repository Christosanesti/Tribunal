import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function MediatorDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["mediator","admin"].includes(session.user.role)) redirect("/dashboard");
  const cases = await prisma.case.findMany({
    where: { OR: [{ mediatorId: session.user.id }, { status: "open" as any }] },
    include: { claimant: { select:{name:true,email:true}}, respondent:{select:{name:true,email:true}}, _count:{select:{messages:true}} },
    orderBy:{updatedAt:"desc"}, take: 20
  });
  const pending = await prisma.case.count({ where: { status: "open" as any, mediatorId: null } });
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold">Mediator Dashboard</h1><p className="text-muted-foreground">Manage assigned disputes and generate settlements</p></div>
          <Link href="/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card><CardHeader><CardTitle className="text-sm">Assigned Cases</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cases.filter((c:any)=>c.mediatorId===session.user.id).length}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Unassigned (needs mediator)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{pending}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Total in Pool</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cases.length}</div></CardContent></Card>
        </div>
        <div className="space-y-3">
          {cases.map((c:any)=>(
            <Card key={c.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold truncate">{c.title}</span><Badge variant="outline">{c.status.replace("_"," ")}</Badge><span className="text-xs text-muted-foreground">{c.caseNumber}</span>{!c.mediatorId && <Badge className="bg-amber-100 text-amber-700">Unassigned</Badge>}</div>
                  <p className="text-sm text-muted-foreground truncate">{c.description.slice(0,100)}</p>
                  <p className="text-xs text-muted-foreground">{c.caseType} {c.amount?`• ${formatCurrency(c.amount)}`:""} • {formatDate(c.createdAt)} • {c._count.messages} msgs</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/cases/${c.id}`}><Button size="sm">View</Button></Link>
                  {!c.mediatorId && <form action={async()=>{
                    "use server";
                    const { auth } = await import("@/lib/auth");
                    const { prisma } = await import("@/lib/prisma");
                    const s = await auth(); if(!s?.user) return;
                    await prisma.case.update({ where:{id:c.id}, data:{ mediatorId: s.user.id, status:"in_mediation" as any }});
                  }}><Button size="sm" variant="outline" type="submit">Claim</Button></form>}
                </div>
              </CardContent>
            </Card>
          ))}
          {cases.length===0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No cases in mediation pool.</CardContent></Card>}
        </div>
      </div>
    </main>
  );
}
