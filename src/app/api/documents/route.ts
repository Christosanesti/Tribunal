import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const docs = await prisma.document.findMany({ where: { uploadedById: session.user.id }, take: 50, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ documents: docs });
}
