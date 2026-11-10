import type { Receipt } from "@/types";
import { isValidSignature } from "@/lib/solana";

const KEY = "hcs:lastReceipt";

export function saveReceipt(receipt: Receipt): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(receipt));
  } catch {
    /* storage unavailable — receipt page will show empty state */
  }
}

/** Loads and shape-checks the receipt (storage is treated as untrusted input). */
export function loadReceipt(): Receipt | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as Receipt;
    if (
      typeof r.signature !== "string" ||
      !isValidSignature(r.signature) ||
      typeof r.amountSol !== "number" ||
      !Array.isArray(r.lines)
    ) {
      return null;
    }
    return r;
  } catch {
    return null;
  }
}
