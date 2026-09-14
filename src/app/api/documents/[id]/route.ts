import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const caseId = searchParams.get("caseId");

    const pagination = getPaginationParams(page, limit);

    const where: Record<string, unknown> = {};

    if (caseId) {
      // Check access to the case
      const caseRecord = await prisma.case.findUnique({
        where: { id: caseId },
      });

      if (!caseRecord) {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }

      const hasAccess =
        caseRecord.claimantId === session.user.id ||
        caseRecord.respondentId === session.user.id ||
        caseRecord.mediatorId === session.user.id ||
        session.user.role === "admin";

      if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      where.caseId = caseId;
    } else {
      // Get all documents user has access to
      where.OR = [
        { uploadedById: session.user.id },
        { case: { claimantId: session.user.id } },
        { case: { respondentId: session.user.id } },
        { case: { mediatorId: session.user.id } },
      ];
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true, image: true },
          },
          case: {
            select: {
              id: true,
              title: true,
              caseNumber: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
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

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        case: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check access
    const hasAccess =
      document.uploadedById === session.user.id ||
      document.case.claimantId === session.user.id ||
      document.case.respondentId === session.user.id ||
      document.case.mediatorId === session.user.id ||
      session.user.role === "admin";

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
