import { getPaginationParams } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMessageSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: caseId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Check access
    const hasAccess =
      caseRecord.claimantId === session.user.id ||
      caseRecord.respondentId === session.user.id ||
      caseRecord.mediatorId === session.user.id ||
      session.user.role === "admin";

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";
    const category = searchParams.get("category");

    const pagination = getPaginationParams(page, limit);

    const where: Record<string, unknown> = { caseId };
    if (category) {
      where.category = category;
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: { id: true, name: true, email: true, image: true, role: true },
          },
          replies: {
            include: {
              sender: {
                select: { id: true, name: true, email: true, image: true, role: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.message.count({ where }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        caseId,
        senderId: { not: session.user.id },
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      messages,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: caseId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        claimant: true,
        respondent: true,
      },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Check access
    const hasAccess =
      caseRecord.claimantId === session.user.id ||
      caseRecord.respondentId === session.user.id ||
      caseRecord.mediatorId === session.user.id ||
      session.user.role === "admin";

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = createMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderId: session.user.id,
        caseId,
        category: data.category || "general",
        parentMessageId: data.parentMessageId || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name,
      senderRole: message.sender.role,
      category: message.category,
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
