import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCaseNumber } from "@/lib/utils";
import { createCaseSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {
      OR: [
        { claimantId: session.user.id },
        { respondentId: session.user.id },
        { mediatorId: session.user.id },
      ],
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.caseType = type;
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
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
          _count: {
            select: { messages: true, documents: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take,
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createCaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // If respondent email is provided, find or create the respondent
    let respondentId: string | undefined;
    if (data.respondentEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.respondentEmail },
      });

      if (existingUser) {
        respondentId = existingUser.id;
      } else {
        // Create respondent user (they'll need to set password via email flow)
        const respondent = await prisma.user.create({
          data: {
            email: data.respondentEmail,
            name: data.respondentEmail.split("@")[0],
            role: "respondent",
          },
        });
        respondentId = respondent.id;
      }
    }

    const caseNumber = generateCaseNumber();

    const newCase = await prisma.$transaction(async (tx) => {
      // Create the case
      const caseRecord = await tx.case.create({
        data: {
          title: data.title,
          description: data.description,
          caseType: data.caseType,
          amount: data.amount ?? null,
          status: data.caseType === "other" ? "open" : "open",
          caseNumber,
          claimantId: session.user.id,
          respondentId,
        },
        include: {
          claimant: {
            select: { id: true, name: true, email: true, image: true },
          },
          respondent: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      // Create system message for case creation
      await tx.message.create({
        data: {
          content: `Case "${data.title}" has been created. Awaiting respondent invitation.`,
          senderId: session.user.id,
          caseId: caseRecord.id,
          category: "system",
        },
      });

      return caseRecord;
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Failed to create case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
