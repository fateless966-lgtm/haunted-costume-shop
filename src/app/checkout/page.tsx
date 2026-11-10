"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useCart } from "@/lib/cartContext";
import { getCostumeById } from "@/lib/costumes";
import { saveReceipt } from "@/lib/receipt";
import { MERCHANT_WALLET } from "@/lib/solana";
import {
  buildPayUrl,
  classifyPaymentError,
  newReference,
  sendWalletPayment,
  waitForPayment,
} from "@/lib/solanaPay";
import QRCode from "@/components/QRCode";
import PaymentStatus from "@/components/PaymentStatus";
import type { CartItem, PaymentState, ReceiptLine } from "@/types";

/** Everything fixed for one checkout attempt: reference + amount + line items. */
interface Attempt {
  id: number;
  reference: PublicKey;
  amountSol: number;
  lines: ReceiptLine[];
}

function toLines(items: CartItem[]): ReceiptLine[] {
  return items.flatMap((i) => {
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
}

export default function CheckoutPage() {
  const { items, totalSOL, clearCart } = useCart();
  const router = useRouter();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [state, setState] = useState<PaymentState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState(0);
  const [current, setCurrent] = useState<Attempt | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronous guard: blocks a second click before React re-renders.
  const isSubmittingRef = useRef(false);
  const attemptRef = useRef<Attempt | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const completedRef = useRef(false);

  // Latest cart values, read only when a new attempt starts.
  const itemsRef = useRef(items);
  const totalRef = useRef(totalSOL);
  itemsRef.current = items;
  totalRef.current = totalSOL;

  const endProcessing = useCallback(() => {
    isSubmittingRef.current = false;
    setIsProcessing(false);
  }, []);

  /** (Re)starts on-chain polling for an attempt, with a full timeout window. */
  const startPolling = useCallback(
    (attempt: Attempt) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setState("waiting");

      waitForPayment(attempt.reference, attempt.amountSol, ctrl.signal).then(
        (outcome) => {
          if (ctrl.signal.aborted || attemptRef.current?.id !== attempt.id) return;
          switch (outcome.status) {
            case "confirmed":
              completedRef.current = true;
              saveReceipt({
                signature: outcome.signature,
                amountSol: attempt.amountSol,
                lines: attempt.lines,
                paidAt: Date.now(),
              });
              setState("confirmed");
              router.push("/receipt");
              clearCart();
              break; // button stays disabled while navigating
            case "timeout":
              setState("timeout");
              setError("No payment detected within 60 seconds.");
              endProcessing();
              break;
            case "failed":
              setState("failed");
              setError(outcome.message);
              endProcessing();
              break;
            case "cancelled":
              break;
          }
        }
      );
    },
    [router, clearCart, endProcessing]
  );

  // Exactly one reference per attempt. Re-renders (and StrictMode's double
  // effect run) reuse the stored attempt instead of generating a new key.
  useEffect(() => {
    if (completedRef.current) return;
    if (itemsRef.current.length === 0) {
      router.replace("/cart");
      return;
    }

    let attempt = attemptRef.current;
    if (!attempt || attempt.id !== attemptId) {
      attempt = {
        id: attemptId,
        reference: newReference(),
        amountSol: totalRef.current,
        lines: toLines(itemsRef.current),
      };
      attemptRef.current = attempt;
      setCurrent(attempt);
      setError(null);
      endProcessing();
    }

    startPolling(attempt);
    return () => abortRef.current?.abort();
  }, [attemptId, router, startPolling, endProcessing]);

  const payUrl = useMemo(
    () => (current ? buildPayUrl(current.amountSol, current.reference) : null),
    [current]
  );

  async function handlePayWithWallet() {
    const attempt = attemptRef.current;
    if (isSubmittingRef.current || !publicKey || !attempt) return;
    if (publicKey.equals(MERCHANT_WALLET)) {
      // Paying yourself nets zero balance change, so validateTransfer would fail.
      setError("This wallet is the shop's merchant wallet. Switch to a different wallet to pay.");
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      await sendWalletPayment(
        publicKey,
        attempt.reference,
        attempt.amountSol,
        sendTransaction
      );
      // Wallet confirmed and the tx is sent. Stay in "Processing…" and restart
      // polling with the SAME reference so verification gets a full 60 s window.
      startPolling(attempt);
    } catch (e) {
      abortRef.current?.abort();
      setState("failed");
      setError(classifyPaymentError(e).message);
      endProcessing();
    }
  }

  function handleRetry() {
    setAttemptId((a) => a + 1); // new attempt → new reference + new polling loop
  }

  const canRetry = state === "failed" || state === "timeout";
  const buttonFx =
    "transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

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
          {(current?.amountSol ?? totalSOL).toFixed(4)}
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
            className={`btn-primary flex-1 py-3 rounded-lg text-sm tracking-widest uppercase ${buttonFx}`}
          >
            Try again 🔄
          </button>
        ) : (
          <button
            onClick={handlePayWithWallet}
            disabled={!connected || !current || isProcessing}
            aria-busy={isProcessing}
            title={connected ? undefined : "Connect a wallet (top right) to pay directly"}
            className={`btn-primary flex-1 py-3 rounded-lg text-sm tracking-widest uppercase inline-flex items-center justify-center gap-2 ${buttonFx}`}
          >
            {isProcessing ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                />
                Processing...
              </>
            ) : connected ? (
              "Pay with connected wallet"
            ) : (
              "Connect wallet to pay"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
