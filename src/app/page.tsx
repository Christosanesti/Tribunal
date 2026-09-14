import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tribunal - AI-Powered Dispute Resolution",
  description:
    "Resolve disputes fairly and efficiently with AI-mediation. For small claims, freelance contracts, tenant-landlord, and community disputes.",
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-primary"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17l10 5 10-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Tribunal
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl text-center">
            <div className="rounded-lg border bg-card p-4 px-6 py-3 text-center text-sm font-medium text-muted-foreground">
              AI-Powered Online Dispute Resolution
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Resolve Disputes{" "}
              <span className="text-primary">Fairly & Efficiently</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tribunal brings AI-assisted mediation to online disputes —
              from small claims to freelance contracts. Get unbiased
              compromise suggestions, document analysis, and structured
              settlement agreements.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Start Your Case Free
              </a>
              <a
                href="/#how-it-works"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium text-muted-foreground shadow hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free case intake
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                AI mediation assistant
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure document storage
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 pb-24">
            <div className="rounded-lg border bg-card shadow-lg">
              <div className="flex flex-col border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      T
                    </div>
                    <span className="font-semibold">Tribunal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-3 w-3 rounded-full border border-primary/20 bg-primary/20" />
                    <span className="text-xs text-muted-foreground">
                      AI Mediation Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <svg
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Case #TRB-2024-00123
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs font-medium uppercase text-muted-foreground">
                      Claimant
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        MK
                      </div>
                      <div>
                        <div className="font-medium">Maria Kowalski</div>
                        <div className="text-sm text-muted-foreground">
                          Freelance Designer
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs font-medium uppercase text-muted-foreground">
                      Respondent
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 font-semibold text-secondary">
                        JP
                      </div>
                      <div>
                        <div className="font-medium">James Park</div>
                        <div className="text-sm text-muted-foreground">
                          Design Studio Owner
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <span className="font-medium">AI Mediation Suggestion:</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Based on the contract terms and correspondence, a reasonable
                    compromise would be a partial refund of $2,400 representing
                    60% of the disputed amount, with both parties sharing the
                    revised deliverables cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-t bg-muted/30 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need to Resolve Disputes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From case intake to settlement agreement — Tribunal guides you
              through every step with AI assistance.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Case Intake Wizard
              </h3>
              <p className="mt-2 text-muted-foreground">
                Multi-step guided process to capture all details of your dispute.
                Zod-validated forms ensure complete, accurate case documentation.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                AI Mediation Assistant
              </h3>
              <p className="mt-2 text-muted-foreground">
                Our AI analyzes case details, documents, and communications to
                suggest fair compromise positions — unbiased and data-driven.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Document Upload & Analysis
              </h3>
              <p className="mt-2 text-muted-foreground">
                Upload contracts, receipts, messages, and more. AI generates
                summaries and highlights key terms relevant to your dispute.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M8 8h.01M12 8h.01M16 8h.01"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Mediated Messaging
              </h3>
              <p className="mt-2 text-muted-foreground">
                Structured communication channel that keeps discussions focused,
                respectful, and on-track toward resolution.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Settlement Generator
              </h3>
              <p className="mt-2 text-muted-foreground">
                AI drafts legally-structured settlement agreements based on
                agreed terms. Review, modify, and sign digitally.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Payment Escrow
              </h3>
              <p className="mt-2 text-muted-foreground">
                Stripe-powered escrow holds funds until settlement is reached.
                Secure, transparent, and compliant with payment regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How Tribunal Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Resolve your dispute in four simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Create Your Case",
                description:
                  "Answer a few questions about your dispute. Our wizard guides you through capturing all relevant details, parties, and evidence.",
              },
              {
                step: "02",
                title: "Upload Evidence",
                description:
                  "Share contracts, messages, receipts, and other documents. AI analyzes and summarizes key information automatically.",
              },
              {
                step: "03",
                title: "AI Mediation",
                description:
                  "Our AI assistant reviews your case and suggests fair compromise positions. Communicate through our structured messaging system.",
              },
              {
                step: "04",
                title: "Reach Settlement",
                description:
                  "Agree on terms and generate a binding settlement agreement. Use our escrow service for secure payments, or download your signed agreement.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section
        id="use-cases"
        className="border-t bg-muted/30 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Disputes We Handle
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tribunal is designed for a wide range of dispute types.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Small Claims",
                description:
                  "Consumer disputes, property damage, unpaid debts, and other small claims matters up to $10,000.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                ),
                title: "Freelance Contracts",
                description:
                  "Scope disputes, payment disagreements, deliverable issues, and contract breaches between freelancers and clients.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
                title: "Tenant-Landlord",
                description:
                  "Security deposit disputes, maintenance issues, lease violations, and rent disagreements.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 00-5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a4 4 0 11-8 0 4 4 0 018 0zM7 10a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                title: "Community Disputes",
                description:
                  "Roommate conflicts, HOA disagreements, neighborhood disputes, and community association matters.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="text-primary">{item.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-card p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Resolve Your Dispute?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start your case in minutes. Free to create, pay only when you
              reach a settlement.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Start Free Case
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-primary"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17l10 5 10-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12l10 5 10-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Tribunal
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tribunal. AI-powered dispute resolution.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
