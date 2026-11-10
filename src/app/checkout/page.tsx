"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useCart } from "@/lib/cartContext";
import { getCostumeById } from "@/lib/costumes";
import { saveReceipt } from "@/lib/receipt";
import {
  buildPayUrl,
  classifyPaymentError,
  newReference,
  sendWalletPayment,
  waitForPayment,
} from "@/lib/solanaPay";
import QRCode from "@/components/QRCode";
import PaymentStatus from "@/components/PaymentStatus";
import type { PaymentState, ReceiptLine } from "@/types";

export default function CheckoutPage() {
  const { items, totalSOL, clearCart } = useCart();
  const router = useRouter();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [state, setState] = useState<PaymentState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<PublicKey | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [paying, setPaying] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const completed = useRef(false);

  // One attempt = one fresh reference + one polling loop.
  useEffect(() => {
    if (completed.current) return;
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    const ref = newReference();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setReference(ref);
    setError(null);
    setState("ready");

    const amount = totalSOL;
    const lines: ReceiptLine[] = items.flatMap((i) => {
      const c = getCostumeById(i.costumeId);
      if (!c) return [];
      return [
        {
          name: c.name,
          emoji: c.emoji,
          mode: i.mode,
          quantity: i.quantity,
          unitPrice: i.mode === "buy" ? c.buyPrice : c.rentPrice,
        },
      ];
    });

    setState("waiting");
    waitForPayment(ref, amount, ctrl.signal).then((outcome) => {
      switch (outcome.status) {
        case "confirmed":
          completed.current = true;
          saveReceipt({
            signature: outcome.signature,
            amountSol: amount,
            lines,
            paidAt: Date.now(),
          });
          setState("confirmed");
          router.push("/receipt");
          clearCart();
          break;
        case "timeout":
          setState("timeout");
          setError("No payment detected within 60 seconds.");
          break;
        case "failed":
          setState("failed");
          setError(outcome.message);
          break;
        case "cancelled":
          break;
      }
    });

    return () => ctrl.abort();
  }, [attempt, items, totalSOL, router, clearCart]);

  const payUrl = useMemo(
    () => (reference ? buildPayUrl(totalSOL, reference) : null),
    [reference, totalSOL]
  );

  async function handlePayWithWallet() {
    if (!publicKey || !reference) return;
    setPaying(true);
    try {
      await sendWalletPayment(publicKey, reference, totalSOL, sendTransaction);
      // Confirmation comes from the on-chain polling loop, not from this call.
    } catch (e) {
      const c = classifyPaymentError(e);
      abortRef.current?.abort();
      setState("failed");
      setError(c.message);
    } finally {
      setPaying(false);
    }
  }

  function handleRetry() {
    setAttempt((a) => a + 1); // new reference + new polling loop
  }

  const canRetry = state === "failed" || state === "timeout";

  return (
    <div className="max-w-lg mx-auto text-center py-10">
      <h1
        className="text-3xl font-bold tracking-widest uppercase mb-4"
        style={{ color: "var(--color-accent)" }}
      >
        Checkout
      </h1>

      <PaymentStatus state={state} error={error} />

      <div className="card-spooky rounded-xl p-6 mb-6">
        <div
          className="text-sm tracking-widest uppercase mb-2"
          style={{ color: "var(--color-muted)" }}
        >
          Total to pay
        </div>
        <div className="text-5xl font-bold" style={{ color: "var(--color-accent)" }}>
          {totalSOL.toFixed(4)}
        </div>
        <div
          className="text-sm tracking-widest uppercase mt-1"
          style={{ color: "var(--color-muted)" }}
        >
          SOL (DevNet)
        </div>
      </div>

      <div
        className="rounded-xl p-6 mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2px dashed var(--color-accent)",
        }}
      >
        {payUrl && !canRetry ? (
          <>
            <QRCode url={payUrl} />
            <p className="text-xs mt-3" style={{ color: "var(--color-muted)" }}>
              Scan with a Solana Pay wallet set to <strong>Devnet</strong>
            </p>
          </>
        ) : (
          <div className="py-10">
            <div className="text-5xl animate-float mb-2">{canRetry ? "💀" : "👻"}</div>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              {canRetry ? "This payment request has expired." : "Summoning QR code…"}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>
        Phantom: Settings → Developer Settings → Testnet Mode → select Solana Devnet.
        Get free test SOL from the Solana faucet.
      </p>

      <div className="flex gap-3">
        <Link
          href="/cart"
          className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-center"
          style={{
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          ← Back to Cart
        </Link>

        {canRetry ? (
          <button
            onClick={handleRetry}
            className="btn-primary flex-1 py-3 rounded-lg text-sm tracking-widest uppercase"
          >
            Try again 🔄
          </button>
        ) : (
          <button
            onClick={handlePayWithWallet}
            disabled={!connected || !reference || paying}
            title={connected ? undefined : "Connect a wallet (top right) to pay directly"}
            className="btn-primary flex-1 py-3 rounded-lg text-sm tracking-widest uppercase"
          >
            {paying
              ? "Check your wallet…"
              : connected
                ? "Pay with connected wallet"
                : "Connect wallet to pay"}
          </button>
        )}
      </div>
    </div>
  );
}
