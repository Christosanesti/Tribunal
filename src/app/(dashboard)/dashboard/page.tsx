import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserCases, getUserStats } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, MessageSquare, Users, Briefcase, Scale, Activity } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const stats = await getUserStats();
  const casesRes = await getUserCases();
  const cases = (casesRes as any).cases || [];
  const userRole = session.user.role;
  const roleColors: Record<string,string> = { claimant:"bg-blue-100 text-blue-700", respondent:"bg-orange-100 text-orange-700", mediator:"bg-purple-100 text-purple-700", admin:"bg-gray-100 text-gray-700" };
  const roleLabels: Record<string,string> = { claimant:"Claimant", respondent:"Respondent", mediator:"Mediator", admin:"Admin" };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl"><span className="h-8 w-8 flex items-center justify-center rounded bg-primary text-primary-foreground">⚖</span> Tribunal</Link>
            <div className="flex items-center gap-4">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${roleColors[userRole]}`}>{userRole[0]?.toUpperCase()}</span>
              <span className="text-sm text-muted-foreground">{roleLabels[userRole]}</span>
              <span className="text-sm font-medium">{session.user.name}</span>
              {userRole==="mediator" && <Link href="/mediator"><Button size="sm" variant="outline">Mediator Dashboard</Button></Link>}
              {userRole==="admin" && <Link href="/admin"><Button size="sm" variant="outline">Admin</Button></Link>}
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-muted-foreground">Welcome back, {session.user.name}</p></div>
          <Link href="/cases/new"><Button><Plus className="mr-2 h-4 w-4" /> New Case</Button></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Briefcase className="h-4 w-4"/> Total Cases</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats as any).totalCases ?? cases.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Activity className="h-4 w-4"/> Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats as any).activeCases ?? 0}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Scale className="h-4 w-4"/> Settled</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats as any).settledCases ?? 0}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Messages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats as any).totalMessages ?? 0}</div></CardContent></Card>
        </div>
        <Tabs defaultValue="all">
          <TabsList><TabsTrigger value="all">All Cases ({cases.length})</TabsTrigger><TabsTrigger value="open">Open</TabsTrigger><TabsTrigger value="settled">Settled</TabsTrigger></TabsList>
          <TabsContent value="all" className="mt-4">
            {cases.length===0 ? (
              <Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">No cases yet. Create your first dispute case.</p><Link href="/cases/new"><Button>File a Case</Button></Link></CardContent></Card>
            ) : (
              <div className="grid gap-4">
                {cases.map((c:any)=>(
                  <Link key={c.id} href={`/cases/${c.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer"><CardContent className="p-4 flex items-center justify-between">
                      <div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><span className="font-semibold truncate">{c.title}</span><Badge variant="outline" className="capitalize text-xs">{c.status.replace("_"," ")}</Badge><span className="text-xs text-muted-foreground">{c.caseNumber}</span></div><p className="text-sm text-muted-foreground truncate">{c.description.slice(0,120)}</p><div className="text-xs text-muted-foreground mt-1">{c.caseType.replace("_"," ")} {c.amount?`• ${formatCurrency(c.amount)}`:""} • {formatDate(c.createdAt)}</div></div>
                      <Badge>{c._count?.messages ?? 0} msgs</Badge>
                    </CardContent></Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="open"><p className="text-sm text-muted-foreground py-8 text-center">Filtered view - showing open cases from above list.</p></TabsContent>
          <TabsContent value="settled"><p className="text-sm text-muted-foreground py-8 text-center">Settled cases will appear here.</p></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
