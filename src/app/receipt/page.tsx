"use client";

// Receipt page — shown after confirmed on-chain payment
// Fully wired in Task 6. This is the shell.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ReceiptContent() {
  const params = useSearchParams();
  const sig = params.get("sig") ?? "";
  const amount = params.get("amount") ?? "0";

  // DevNet Explorer link — always ?cluster=devnet per steering rule
  const explorerUrl = sig
    ? `https://explorer.solana.com/tx/${sig}?cluster=devnet`
    : null;

  return (
    <div className="max-w-lg mx-auto text-center py-10">
      <div className="text-6xl mb-6 animate-float">🎉</div>
      <h1
        className="text-3xl font-bold tracking-widest uppercase mb-2"
        style={{ color: "var(--color-accent)" }}
      >
        Payment Confirmed!
      </h1>
      <p className="mb-8 tracking-wide" style={{ color: "var(--color-muted)" }}>
        Your haunted costume is on its way. 👻
      </p>

      {sig ? (
        <div
          className="card-spooky rounded-xl p-6 mb-8 text-left"
        >
          <div className="mb-4">
            <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>
              Amount paid
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
              {Number(amount).toFixed(4)} SOL
            </div>
          </div>
          <div>
            <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>
              Transaction signature
            </div>
            <div
              className="text-xs break-all font-mono"
              style={{ color: "var(--color-text)" }}
            >
              {sig}
            </div>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-bold tracking-widest uppercase transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              View on Solana Explorer ↗
            </a>
          )}
        </div>
      ) : (
        <div
          className="card-spooky rounded-xl p-6 mb-8"
          style={{ color: "var(--color-muted)" }}
        >
          Receipt details will appear here after a confirmed payment.
        </div>
      )}

      <Link
        href="/"
        className="btn-primary inline-block px-10 py-3 rounded-lg text-sm tracking-widest uppercase"
      >
        Shop Again 🎃
      </Link>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20" style={{ color: "var(--color-muted)" }}>
        Loading receipt…
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
