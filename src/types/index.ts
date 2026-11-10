// ─── Costume catalogue ───────────────────────────────────────────────
export interface Costume {
  id: string;
  name: string;
  buyPrice: number;   // SOL
  rentPrice: number;  // SOL (3-day rental)
  emoji: string;
  description: string;
}

// ─── Cart ────────────────────────────────────────────────────────────
export type PurchaseMode = "buy" | "rent";

export interface CartItem {
  costumeId: string;
  mode: PurchaseMode;
  quantity: number;
}

// ─── Payment state machine ───────────────────────────────────────────
export type PaymentState =
  | "idle"
  | "ready"       // QR generated, waiting for user to scan/pay
  | "waiting"     // findReference polling
  | "confirmed"   // validateTransfer passed
  | "failed"      // rejected / validateTransfer failed
  | "timeout";    // 60 s elapsed with no tx found

export interface PaymentResult {
  signature: string;
  amount: number;     // SOL
  items: CartItem[];
}
