"use client";

// Checkout page — Solana Pay QR + wallet pay
// Payment integration will be wired in Task 5–7.
// This stub renders the shell with payment state machine UI.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import type { PaymentState } from "@/types";

export default function CheckoutPage() {
  const { items, totalSOL } = useCart();
  const router = useRouter();
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    } else {
      setPaymentState("ready");
    }
  }, [items, router]);

  const stateLabel: Record<PaymentState, string> = {
    idle:      "Preparing…",
    ready:     "Ready to pay",
    waiting:   "Waiting for payment…",
    confirmed: "Payment confirmed! ✓",
    failed:    "Payment failed",
    timeout:   "Timed out — no payment detected",
  };

  return (
    <div className="max-w-lg mx-auto text-center py-10">
      <h1
        className="text-3xl font-bold tracking-widest uppercase mb-2"
        style={{ color: "var(--color-accent)" }}
      >
        Checkout
      </h1>

      {/* Payment state badge */}
      <div
        className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-accent)",
          color: "var(--color-accent)",
        }}
      >
        {stateLabel[paymentState]}
      </div>

      {/* Amount */}
      <div
        className="card-spooky rounded-xl p-6 mb-8"
      >
        <div className="text-sm tracking-widest uppercase mb-2" style={{ color: "var(--color-muted)" }}>
          Total to pay
        </div>
        <div className="text-5xl font-bold" style={{ color: "var(--color-accent)" }}>
          {totalSOL.toFixed(4)}
        </div>
        <div className="text-sm tracking-widest uppercase mt-1" style={{ color: "var(--color-muted)" }}>
          SOL (DevNet)
        </div>
      </div>

      {/* QR placeholder — wired in Task 5 */}
      <div
        className="rounded-xl p-8 mb-8 flex flex-col items-center justify-center gap-3"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2px dashed var(--color-accent)",
          minHeight: "220px",
        }}
      >
        <span className="text-5xl animate-float">👻</span>
        <p className="text-sm tracking-wide" style={{ color: "var(--color-muted)" }}>
          Solana Pay QR code will appear here
        </p>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          (Wallet integration — Task 5)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/cart"
          className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors text-center"
          style={{
            backgroundColor: "transparent",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          ← Back to Cart
        </Link>
        <button
          disabled
          className="btn-primary flex-1 py-3 rounded-lg text-sm tracking-widest uppercase"
        >
          Connect Wallet to Pay
        </button>
      </div>
    </div>
  );
}
