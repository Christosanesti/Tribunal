"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserCases() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const cases = await prisma.case.findMany({
      where: {
        OR: [
          { claimantId: session.user.id },
          { respondentId: session.user.id },
          { mediatorId: session.user.id },
        ],
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
        _count: {
          select: {
            messages: true,
            documents: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { cases };
  } catch (error) {
    console.error("Failed to fetch user cases:", error);
    return { error: "Failed to fetch cases" };
  }
}

export async function getUserStats() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [
      totalCases,
      activeCases,
      settledCases,
      totalMessages,
      totalDocuments,
    ] = await Promise.all([
      prisma.case.count({
        where: {
          OR: [
            { claimantId: session.user.id },
            { respondentId: session.user.id },
            { mediatorId: session.user.id },
          ],
        },
      }),
      prisma.case.count({
        where: {
          OR: [
            { claimantId: session.user.id },
            { respondentId: session.user.id },
            { mediatorId: session.user.id },
          ],
          status: {
            in: ["open", "in_mediation", "pending_payment"],
          },
        },
      }),
      prisma.case.count({
        where: {
          OR: [
            { claimantId: session.user.id },
            { respondentId: session.user.id },
            { mediatorId: session.user.id },
          ],
          status: "settled",
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: session.user.id },
            { case: { claimantId: session.user.id } },
            { case: { respondentId: session.user.id } },
            { case: { mediatorId: session.user.id } },
          ],
        },
      }),
      prisma.document.count({
        where: {
          OR: [
            { uploadedById: session.user.id },
            { case: { claimantId: session.user.id } },
            { case: { respondentId: session.user.id } },
            { case: { mediatorId: session.user.id } },
          ],
        },
      }),
    ]);

    return {
      totalCases,
      activeCases,
      settledCases,
      totalMessages,
      totalDocuments,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { error: "Failed to fetch stats" };
  }
}
