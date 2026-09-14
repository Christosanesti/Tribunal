import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/dashboard");
  const stats = await Promise.all([prisma.user.count(), prisma.case.count(), prisma.user.count({where:{role:"mediator"}})]);
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1><p className="text-muted-foreground mb-6">Platform overview</p>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card><CardHeader><CardTitle className="text-sm">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats[0]}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Total Cases</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats[1]}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mediators</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats[2]}</div></CardContent></Card>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/mediators"><Button>Mediator Directory</Button></Link>
          <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>
      </div>
    </main>
  );
}
