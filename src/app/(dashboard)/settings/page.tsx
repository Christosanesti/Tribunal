import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard"><Button variant="ghost" size="sm">← Back</Button></Link>
            <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account</p></div>
          </div>
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your account information</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">{session.user.name?.charAt(0).toUpperCase()||"U"}</div>
                <div><p className="font-medium">{session.user.name||"User"}</p><p className="text-sm text-muted-foreground">{session.user.email}</p><p className="text-xs capitalize text-muted-foreground">Role: {session.user.role}</p></div>
              </div>
              <div className="space-y-4">
                <div><Label>Display Name</Label><Input defaultValue={session.user.name||""} placeholder="Your name" /></div>
                <div><Label>Email</Label><Input defaultValue={session.user.email||""} disabled /></div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6"><CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-3">Contact support to delete your account.</p><Button variant="destructive" disabled>Delete Account</Button></CardContent></Card>
        </div>
      </div>
    </main>
  );
}
