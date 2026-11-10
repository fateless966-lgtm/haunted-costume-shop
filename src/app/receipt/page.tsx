"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadReceipt } from "@/lib/receipt";
import { explorerTxUrl } from "@/lib/solana";
import type { Receipt } from "@/types";

export default function ReceiptPage() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReceipt(loadReceipt());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!receipt) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6 animate-float">🧾</div>
        <h1
          className="text-2xl font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          No receipt found
        </h1>
        <Link
          href="/"
          className="btn-primary inline-block px-8 py-3 rounded-lg text-sm tracking-widest uppercase"
        >
          Browse Costumes 🎃
        </Link>
      </div>
    );
  }

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
        Your haunted costume is on its way. 👻 (DevNet — no real money)
      </p>

      <div className="card-spooky rounded-xl p-6 mb-8 text-left">
        <ul className="mb-4 flex flex-col gap-2">
          {receipt.lines.map((l, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {l.emoji} {l.name} · {l.mode === "buy" ? "Buy" : "Rent (3 days)"} × {l.quantity}
              </span>
              <span style={{ color: "var(--color-accent)" }}>
                {(l.unitPrice * l.quantity).toFixed(4)} SOL
              </span>
            </li>
          ))}
        </ul>

        <div
          className="pt-4 mb-4 flex justify-between items-center"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)" }}>
            Total paid
          </span>
          <span className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
            {receipt.amountSol.toFixed(4)} SOL
          </span>
        </div>

        <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>
          Transaction signature
        </div>
        <div className="text-xs break-all font-mono">{receipt.signature}</div>

        <a
          href={explorerTxUrl(receipt.signature)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm font-bold tracking-widest uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          View on Solana Explorer (DevNet) ↗
        </a>
      </div>

      <Link
        href="/"
        className="btn-primary inline-block px-10 py-3 rounded-lg text-sm tracking-widest uppercase"
      >
        Shop Again 🎃
      </Link>
    </div>
  );
}
