# Tribunal

AI-powered online dispute resolution (ODR) platform for small claims, community disputes, freelance contract disputes, tenant-landlord issues, and roommate conflicts.

## Features

- **Case Intake Wizard**: Multi-step guided case creation with Zod-validated forms
- **AI Mediation Assistant**: Suggests compromise positions using AI
- **Document Upload & Summarization**: Secure document storage with AI-powered summaries
- **Mediated Messaging**: Structured communication channel between parties
- **Settlement Agreement Generator**: AI-generated settlement documents
- **Payment Escrow**: Stripe-powered escrow integration for settlements
- **Admin/Mediator Panel**: Dashboard for mediators to manage cases
- **Mobile-Responsive**: Fully responsive design for all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Prisma ORM with PostgreSQL
- **Auth**: NextAuth.js v5 (Auth.js) with Prisma adapter
- **Payments**: Stripe integration
- **Forms**: React Hook Form + Zod validation
- **AI**: AI SDK for mediation suggestions

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- OpenAI API key (for AI features)

### Installation

```bash
npm install
npx prisma generate
npx prisma db push
```

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tribunal"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Clerk (alternative auth)
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
Tribunal/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data
│   └── migrations/          # Prisma migrations
├── src/
│   ├── app/                 # App Router pages
│   │   ├── (auth)/          # Auth routes
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── (public)/        # Public routes (landing, etc.)
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── case/            # Case-related components
│   │   ├── chat/            # Chat/Message components
│   │   ├── document/        # Document components
│   │   └── dashboard/       # Dashboard components
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # Auth configuration
│   │   ├── stripe.ts        # Stripe configuration
│   │   ├── ai.ts            # AI configuration
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── _bmad/                   # BMAD configuration
├── _bmad-output/            # BMAD planning artifacts
└── AGENTS.md                # AI agent instructions
```

## Database Schema

### User Roles
- **Claimant**: The party initiating the dispute
- **Respondent**: The party responding to the dispute
- **Mediator**: Neutral third party facilitating resolution
- **Admin**: Platform administrator

### Core Entities
- **Case**: Dispute case with status, type, and parties
- **Message**: Mediated communication between parties
- **Document**: Uploaded documents with AI summaries
- **Settlement**: Generated settlement agreement
- **Payment**: Stripe payment records and escrow

## Deployment

### Vercel

```bash
vercel --prod
```

Configure environment variables in Vercel dashboard.

### Docker

```bash
docker build -t tribunal .
docker run -p 3000:3000 tribunal
```

## License

MIT
