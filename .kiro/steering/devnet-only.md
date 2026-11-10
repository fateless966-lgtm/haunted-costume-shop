---
inclusion: always
---

# DevNet-Only Rule

**This project uses Solana DevNet exclusively. There is NO Mainnet code path.**

## Rules (enforced for every code generation)

1. The RPC endpoint is always `https://api.devnet.solana.com` — never `https://api.mainnet-beta.solana.com`.
2. The `WalletAdapterNetwork` value is always `WalletAdapterNetwork.Devnet`.
3. All Solana Explorer links use `?cluster=devnet`.
4. Every page must display the **"DevNet only — no real money"** badge (the `DevNetBadge` component).
5. Never add a network switcher or any code path that could reach Mainnet.
6. The `MERCHANT_WALLET` constant (`5hMaBEB2NdYLHJPLZU88JNAVuroZzJLDSF6QixoiQsBi`) is a DevNet address — do not replace it with a Mainnet address.

## Why
This is a hackathon demo. Using real SOL on Mainnet would charge users real money.
DevNet SOL is free (airdrop via `solana airdrop`). The badge protects testers and judges.
