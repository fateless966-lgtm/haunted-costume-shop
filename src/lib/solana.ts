import { Connection, PublicKey } from "@solana/web3.js";

// ─── DevNet ONLY — no Mainnet code path ──────────────────────────────
// Rule: RPC endpoint is always DevNet. See .kiro/steering/devnet-only.md
export const DEVNET_RPC = "https://api.devnet.solana.com";

export const connection = new Connection(DEVNET_RPC, "confirmed");

// Public merchant wallet address (DevNet). Safe to hardcode — public address only.
// NEVER put a private key or seed phrase here. See .kiro/steering/no-secrets.md
export const MERCHANT_WALLET = new PublicKey(
  "ETg62c95bHoBY2ndXVQxLsTiggn5hLUHkKTLGWsbuKY6"
);

// SOL → lamports helper
export const LAMPORTS_PER_SOL_UNIT = 1_000_000_000;
export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL_UNIT);
}
