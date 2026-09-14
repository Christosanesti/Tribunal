import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        claimant: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        respondent: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        mediator: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        documents: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        _count: {
          select: {
            messages: true,
            documents: true,
            settlements: true,
          },
        },
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

    return NextResponse.json(caseRecord);
  } catch (error) {
    console.error("Failed to fetch case:", error);
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Only claimant, mediator, or admin can update
    const canUpdate =
      caseRecord.claimantId === session.user.id ||
      caseRecord.mediatorId === session.user.id ||
      session.user.role === "admin";

    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, caseType, amount, status, mediatorId } = body;

    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(caseType !== undefined && { caseType }),
        ...(amount !== undefined && { amount }),
        ...(status !== undefined && { status }),
        ...(mediatorId !== undefined && { mediatorId }),
        updatedAt: new Date(),
      },
      include: {
        claimant: {
          select: { id: true, name: true, email: true, image: true },
        },
        respondent: {
          select: { id: true, name: true, email: true, image: true },
        },
        mediator: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update case:", error);
    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Only claimant or admin can delete
    const canDelete =
      caseRecord.claimantId === session.user.id ||
      session.user.role === "admin";

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if case has activity
    const messageCount = await prisma.message.count({
      where: { caseId: id },
    });

    if (messageCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete case with existing messages" },
        { status: 400 }
      );
    }

    await prisma.case.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete case:", error);
    return NextResponse.json(
      { error: "Failed to delete case" },
      { status: 500 }
    );
  }
}
