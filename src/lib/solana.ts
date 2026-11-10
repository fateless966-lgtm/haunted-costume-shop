import { Connection, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// ─── DevNet ONLY — no Mainnet code path ──────────────────────────────
// Rule: RPC endpoint is always DevNet. See .kiro/steering/devnet-only.md
export const WALLET_NETWORK = WalletAdapterNetwork.Devnet;
export const DEVNET_RPC = "https://api.devnet.solana.com";

export const connection = new Connection(DEVNET_RPC, "confirmed");

// Public merchant wallet address (DevNet). Safe to hardcode — public address only.
// NEVER put a private key or seed phrase here. See .kiro/steering/no-secrets.md
export const MERCHANT_WALLET = new PublicKey(
  "ETg62c95bHoBY2ndXVQxLsTiggn5hLUHkKTLGWsbuKY6"
);

const BASE58_SIGNATURE = /^[1-9A-HJ-NP-Za-km-z]{64,90}$/;

export function isValidSignature(sig: string): boolean {
  return BASE58_SIGNATURE.test(sig);
}

// Explorer links ALWAYS use ?cluster=devnet
export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}
