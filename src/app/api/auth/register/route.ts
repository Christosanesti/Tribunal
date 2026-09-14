import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6), role: z.enum(["claimant","respondent","mediator"]).default("claimant") });
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    const { name, email, password, role } = parsed.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role: role as any } });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to create account" }, { status: 500 }); }
}
