# Haunted Costume Shop — Requirements

## Project Overview
A Halloween costume rental/purchase shop with a spooky dark UI, built for
Kiroween 2026 (Devpost Costume Contest). Users browse 4 costumes, add to
cart with a buy/rent toggle per item, and check out with Solana Pay on DevNet.

## Functional Requirements

### 1. Shop / Catalogue Page
- Displays exactly 4 costumes: Vampire Cloak, Witch Hat & Robe, Ghost Sheet
  (glow), Pumpkin King Suit.
- Each costume card shows: name, image/icon, buy price (SOL), rent price
  (SOL, 3 days), a buy/rent toggle, and an **Add to Cart** button.
- Prices:
  | Costume           | Buy (SOL) | Rent 3 days (SOL) |
  |-------------------|-----------|-------------------|
  | Vampire Cloak     | 0.20      | 0.05              |
  | Witch Hat & Robe  | 0.15      | 0.04              |
  | Ghost Sheet       | 0.10      | 0.03              |
  | Pumpkin King Suit | 0.25      | 0.06              |

### 2. Cart
- Persists selected items with quantity and the chosen buy/rent option.
- Shows per-item subtotal and overall **total in SOL**.
- Buy/rent toggle is editable from the cart.
- Quantity controls (+/−) and item removal.
- **Checkout** button navigates to payment.

### 3. Checkout & Solana Pay
- Generates a single Solana Pay URL (`encodeURL`) for the cart total on
  DevNet using a fresh reference (`new Keypair().publicKey`) per order.
- Renders a QR code (`createQR`) and a "Pay with connected wallet" button.
- Merchant wallet: `ETg62c95bHoBY2ndXVQxLsTiggn5hLUHkKTLGWsbuKY6` (DevNet).
- DevNet RPC: `https://api.devnet.solana.com`.

### 4. On-Chain Verification
- Polls `findReference` until the payment transaction appears.
- Confirms with `validateTransfer` (correct amount + merchant).
- On success → Receipt page.
- On rejection / timeout (60 s) / insufficient funds → clear error message
  + **Try again** button that generates a new reference keypair and resets
  the payment flow.

### 5. Receipt
- Shows: costume items purchased/rented, total SOL amount, transaction
  signature, and a Solana Explorer link (`?cluster=devnet`).

### 6. UI / Theme
- **Dark spooky theme**: near-black background (`#0d0d0d`), pumpkin-orange
  accents (`#ff6a00`), ghost-white text, subtle Halloween motifs (🎃 👻 🧛).
- English UI only.
- Prominent **"DevNet only — no real money"** badge visible on every page.
- The Halloween look is a judging criterion (Costume Contest), so theme is
  a hard requirement.

### 7. Build & Security
- `npm run build` passes with **zero TypeScript errors**.
- No secrets, no private keys, no `.env` file in the repo.
- No Mainnet code path.

## Non-Functional Requirements
- Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS 4.
- Solana libraries: `@solana/pay`, `@solana/web3.js`, wallet-adapter.
- No custom Anchor program, no database, no user accounts.
- Deployable to Vercel from the GitHub repo.
