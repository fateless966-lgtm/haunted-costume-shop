// Solana Pay helpers — DevNet only.
// @solana/pay 0.2.x requires web3.js 1.x types (Connection/PublicKey), so the
// legacy classes are contained in this module and solana.ts.
import {
  encodeURL,
  createTransfer,
  findReference,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
} from "@solana/pay";
import { Keypair, type PublicKey, type Transaction } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";
import { connection, MERCHANT_WALLET } from "@/lib/solana";

export const PAYMENT_TIMEOUT_MS = 60_000;
export const POLL_INTERVAL_MS = 2_000;
const MAX_CONSECUTIVE_RPC_ERRORS = 5;

/** Fresh, unique reference per order attempt (public key only — no secrets kept). */
export function newReference(): PublicKey {
  return Keypair.generate().publicKey;
}

/** Cart totals are sums of floats; round to lamport precision (9 dp). */
export function solToBigNumber(sol: number): BigNumber {
  return new BigNumber(sol.toFixed(9));
}

export function buildPayUrl(amountSol: number, reference: PublicKey): string {
  return encodeURL({
    recipient: MERCHANT_WALLET,
    amount: solToBigNumber(amountSol),
    reference,
    label: "Haunted Costume Shop",
    message: "Haunted Costume Shop order (DevNet)",
  }).toString();
}

export type PaymentOutcome =
  | { status: "confirmed"; signature: string }
  | { status: "timeout" }
  | { status: "failed"; message: string }
  | { status: "cancelled" };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Polls the chain for a transaction carrying `reference`, then validates
 * recipient + amount from on-chain state (never trusts client callbacks).
 */
export async function waitForPayment(
  reference: PublicKey,
  amountSol: number,
  signal: AbortSignal,
  timeoutMs: number = PAYMENT_TIMEOUT_MS
): Promise<PaymentOutcome> {
  const deadline = Date.now() + timeoutMs;
  let rpcErrors = 0;

  while (Date.now() < deadline) {
    if (signal.aborted) return { status: "cancelled" };
    try {
      const info = await findReference(connection, reference, {
        finality: "confirmed",
      });
      if (signal.aborted) return { status: "cancelled" };
      try {
        await validateTransfer(
          connection,
          info.signature,
          {
            recipient: MERCHANT_WALLET,
            amount: solToBigNumber(amountSol),
            reference,
          },
          { commitment: "confirmed" }
        );
        return { status: "confirmed", signature: info.signature };
      } catch (e) {
        if (e instanceof ValidateTransferError) {
          return {
            status: "failed",
            message: `Payment did not match the order (${e.message}).`,
          };
        }
        throw e;
      }
    } catch (e) {
      if (e instanceof FindReferenceError) {
        rpcErrors = 0; // not found yet — keep polling
      } else {
        rpcErrors += 1;
        if (rpcErrors >= MAX_CONSECUTIVE_RPC_ERRORS) {
          return {
            status: "failed",
            message: "Connection error — could not reach DevNet.",
          };
        }
      }
    }
    await sleep(POLL_INTERVAL_MS);
  }
  return signal.aborted ? { status: "cancelled" } : { status: "timeout" };
}

/** Builds the transfer (includes the reference key) and asks the wallet to sign + send. */
export async function sendWalletPayment(
  sender: PublicKey,
  reference: PublicKey,
  amountSol: number,
  sendTransaction: WalletContextState["sendTransaction"]
): Promise<string> {
  const tx: Transaction = await createTransfer(connection, sender, {
    recipient: MERCHANT_WALLET,
    amount: solToBigNumber(amountSol),
    reference,
  });
  return sendTransaction(tx, connection);
}

export interface ClassifiedError {
  kind: "rejected" | "insufficient" | "network";
  message: string;
}

export function classifyPaymentError(e: unknown): ClassifiedError {
  const text = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  if (/insufficient|sender not found|0x1\b/i.test(text)) {
    return {
      kind: "insufficient",
      message:
        "Insufficient funds — top up your DevNet wallet (free airdrop) and try again.",
    };
  }
  if (/reject|denied|declin|cancel/i.test(text)) {
    return { kind: "rejected", message: "Payment rejected in the wallet." };
  }
  return {
    kind: "network",
    message: "Connection error — the payment could not be sent.",
  };
}
