# Haunted Costume Shop — Tasks

## Task 1: Scaffold + Spooky Theme Shell
- [x] `package.json` with Next.js 15, Tailwind 4, Solana deps
- [x] `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- [x] `src/styles/globals.css` — Tailwind base + CSS vars (bg, accent, text)
- [x] `src/app/layout.tsx` — Root layout: dark bg, NavBar, DevNetBadge, WalletProvider stub
- [x] `src/components/NavBar.tsx` — Logo 🎃, nav links, cart count badge
- [x] `src/components/DevNetBadge.tsx` — "DevNet only — no real money" badge (always visible)
- [x] `src/types/index.ts` — Costume, CartItem, PaymentState types
- [x] `npm run build` green ✅

## Task 2: Costume Catalogue
- [x] `src/lib/costumes.ts` — 4 costumes hardcoded (id, name, buyPrice, rentPrice, emoji)
- [x] `src/components/CostumeCard.tsx` — Card with emoji, name, prices, buy/rent toggle, Add to Cart button
- [x] `src/app/page.tsx` — Shop page: grid of CostumeCard, spooky header copy
- [x] `npm run build` green ✅

## Task 3: Cart
- [x] `src/lib/cartContext.tsx` — CartContext with add/remove/update/clear + total helper
- [x] `src/app/cart/page.tsx` — Cart page: item list, qty +/−, buy/rent toggle, total, Checkout button
- [x] NavBar cart count badge wired to CartContext
- [x] `npm run build` green ✅

## Task 4: Wallet Connection
- [x] Install / verify `@solana/wallet-adapter-*` packages
- [x] `src/lib/walletProvider.tsx` — WalletProvider (Phantom + Solflare, Devnet)
- [x] Wire WalletProvider into `layout.tsx`
- [x] "Connect Wallet" button in NavBar (Checkout stays enabled — QR works without a connected wallet; only "Pay with connected wallet" is disabled)
- [x] `npm run build` green ✅

## Task 5: Solana Pay Checkout
- [x] `src/lib/solana.ts` — `MERCHANT_WALLET`, `connection` (DevNet)
- [x] `src/lib/solanaPay.ts` — `buildPayUrl(cartTotal, reference)`, `buildQR(url)`
- [x] `src/components/QRCode.tsx` — renders `createQR` canvas
- [x] `src/components/PaymentStatus.tsx` — state machine display (IDLE→READY→WAITING→…)
- [x] `src/app/checkout/page.tsx` — build URL, show QR + "Pay with Phantom" button
- [x] `npm run build` green ✅

## Task 6: On-Chain Verification + Receipt
- [x] `src/lib/solanaPay.ts` — `pollPayment(reference, timeoutMs=60000)` with `findReference`
- [x] `src/lib/solanaPay.ts` — `confirmPayment(sig, amount)` with `validateTransfer`
- [x] `src/app/checkout/page.tsx` — start polling on QR display; on confirm → redirect to receipt
- [x] `src/app/receipt/page.tsx` — show items, total SOL, tx signature, Explorer link (`?cluster=devnet`)
- [x] `npm run build` green ✅

## Task 7: Error States + Retry
- [x] Rejection, timeout (60 s), insufficient-funds error banners
- [x] "Try again" button: new `Keypair()`, reset state to READY_TO_PAY
- [x] Wallet not connected → disabled "Pay with connected wallet" + tooltip
- [x] Network error catch → "Connection error — Try again"
- [x] `npm run build` green ✅

## Task 8: Polish, Deploy & Demo
- [ ] Final spooky visual polish (animations, hover effects, pumpkin motifs)
- [x] `npm run build` clean, zero TS errors
- [ ] Push to GitHub (`main` branch), import to Vercel, get live URL
- [ ] Record <3 min demo video on the live URL (browse → cart → checkout → receipt)
- [ ] Upload video to YouTube (unlisted or public)

## Task 9: Devpost Submission
- [ ] Fill in Devpost project page: title, description, live URL, repo URL, video URL
- [ ] Confirm screenshots uploaded and Halloween theme visible
- [ ] Submit before **05:00 5 Dec 2026 Bangkok time** (= 14:00 4 Dec 2026 PT)
- [ ] Redeem 4,000-credit code on Kiro before the same deadline

## Current Status
- Tasks 1–7 implemented; `npm run build` green.
- Verified on DevNet: unknown reference -> `FindReferenceError` (keeps polling). Full transfer round-trip NOT yet verified: the DevNet RPC faucet is closed (410), so it needs a manual test with a Phantom wallet funded from https://faucet.solana.com.
- Remaining (needs the user): manual wallet test, GitHub push, Vercel deploy, demo video, Devpost submission.
