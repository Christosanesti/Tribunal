"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [role,setRole]=useState("claimant");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const router=useRouter();
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setError("");
    const res=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password,role})});
    const d=await res.json();
    if(!res.ok) { setError(d.error||"Failed"); setLoading(false); }
    else router.push("/login");
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><CardTitle className="text-2xl">Create account</CardTitle><CardDescription>Join Tribunal dispute resolution</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} /></div>
            <div><Label>Role</Label><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="claimant">Claimant</SelectItem><SelectItem value="respondent">Respondent</SelectItem><SelectItem value="mediator">Mediator</SelectItem></SelectContent></Select></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading?"Creating...":"Create Account"}</Button>
          </form>
          <p className="text-sm text-center mt-4"><Link href="/login" className="text-primary hover:underline">Already have account? Sign in</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
