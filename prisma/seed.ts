// Seed script for Tribunal database
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tribunal.app" },
    update: {},
    create: {
      email: "admin@tribunal.app",
      name: "System Admin",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create mediator users
  const mediatorPassword = await bcrypt.hash("mediator123", 12);
  const mediator1 = await prisma.user.upsert({
    where: { email: "sarah.mediator@tribunal.app" },
    update: {},
    create: {
      email: "sarah.mediator@tribunal.app",
      name: "Sarah Mitchell",
      password: mediatorPassword,
      role: "mediator",
    },
  });
  console.log("Created mediator:", mediator1.email);

  const mediator2 = await prisma.user.upsert({
    where: { email: "james.mediator@tribunal.app" },
    update: {},
    create: {
      email: "james.mediator@tribunal.app",
      name: "James Chen",
      password: mediatorPassword,
      role: "mediator",
    },
  });
  console.log("Created mediator:", mediator2.email);

  // Create claimant users
  const claimantPassword = await bcrypt.hash("user123", 12);
  const claimant1 = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      name: "Maria Kowalski",
      password: claimantPassword,
      role: "claimant",
    },
  });
  console.log("Created claimant:", claimant1.email);

  const claimant2 = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      email: "alex@example.com",
      name: "Alex Thompson",
      password: claimantPassword,
      role: "claimant",
    },
  });
  console.log("Created claimant:", claimant2.email);

  // Create respondent users
  const respondentPassword = await bcrypt.hash("user123", 12);
  const respondent1 = await prisma.user.upsert({
    where: { email: "james.park@example.com" },
    update: {},
    create: {
      email: "james.park@example.com",
      name: "James Park",
      password: respondentPassword,
      role: "respondent",
    },
  });
  console.log("Created respondent:", respondent1.email);

  const respondent2 = await prisma.user.upsert({
    where: { email: "lisa.wong@example.com" },
    update: {},
    create: {
      email: "lisa.wong@example.com",
      name: "Lisa Wong",
      password: respondentPassword,
      role: "respondent",
    },
  });
  console.log("Created respondent:", respondent2.email);

  // Create sample cases
  const case1 = await prisma.case.create({
    data: {
      title: "Unpaid Freelance Design Work",
      description:
        "I completed a logo redesign project for a client who has refused to pay the final milestone of $3,000. We have a written contract and all communication is documented. The client claims the work was not satisfactory but has not provided specific feedback or allowed revisions.",
      caseType: "freelance_contract",
      status: "in_mediation",
      amount: 3000,
      caseNumber: "TRB-2024-00001",
      claimantId: claimant1.id,
      respondentId: respondent1.id,
      mediatorId: mediator1.id,
    },
  });
  console.log("Created case:", case1.caseNumber);

  const case2 = await prisma.case.create({
    data: {
      title: "Security Deposit Dispute",
      description:
        "My landlord refused to return my $2,400 security deposit claiming damages beyond normal wear and tear. I have photos of the apartment when I moved in and out, and a move-out inspection report that shows the apartment was in good condition.",
      caseType: "tenant_landlord",
      status: "open",
      amount: 2400,
      caseNumber: "TRB-2024-00002",
      claimantId: claimant2.id,
      respondentId: respondent2.id,
    },
  });
  console.log("Created case:", case2.caseNumber);

  // Create sample messages for case 1
  await prisma.message.createMany({
    data: [
      {
        content: "Thank you for bringing this case to Tribunal. I understand there's a dispute about the final payment for the logo redesign project. Can you provide more details about what was agreed upon?",
        senderId: mediator1.id,
        caseId: case1.id,
        category: "general",
      },
      {
        content: "Sure. We had a contract for a logo redesign project. The total was $5,000 with milestones: $2,000 upfront, $1,500 for initial concepts, and $1,500 for final delivery. I completed all work and the client approved the initial concepts. They're refusing to pay the final $1,500 claiming dissatisfaction.",
        senderId: claimant1.id,
        caseId: case1.id,
        category: "response",
      },
      {
        content: "I hired Maria for a logo redesign and paid the initial milestones. However, the final designs don't match what I requested. I've been patient but I can't justify paying the full amount for work that doesn't meet the brief.",
        senderId: respondent1.id,
        caseId: case1.id,
        category: "response",
      },
    ],

  });
  console.log("Created sample messages for case 1");

  // Create sample documents
  await prisma.document.create({
    data: {
      name: "Freelance_Contract_Maria_James.pdf",
      type: "contract",
      mimeType: "application/pdf",
      url: "/uploads/sample-contract.pdf",
      size: 245000,
      uploadedById: claimant1.id,
      caseId: case1.id,
      aiSummary: "Contract for freelance logo design services. Total value: $5,000 with milestone payments. Scope includes initial concepts and final delivery. Client approval required at each stage.",
    },
  });
  console.log("Created sample document for case 1");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
