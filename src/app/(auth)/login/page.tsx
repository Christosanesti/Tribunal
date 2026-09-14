"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("maria@example.com");
  const [password, setPassword] = useState("user123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid credentials"); setLoading(false); }
    else { router.push("/dashboard"); }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><CardTitle className="text-2xl">Sign in to Tribunal</CardTitle><CardDescription>AI dispute resolution</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading?"Signing in...":"Sign In"}</Button>
          </form>
          <div className="mt-4 text-sm text-center space-y-2">
            <p className="text-muted-foreground">Demo accounts: maria@example.com / user123 (claimant), sarah.mediator@tribunal.app / mediator123, admin@tribunal.app / admin123</p>
            <p><Link href="/register" className="text-primary hover:underline">Create account</Link> • <Link href="/" className="hover:underline">Back home</Link></p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
