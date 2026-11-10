# Haunted Costume Shop — Tasks

## Task 1: Scaffold + Spooky Theme Shell
- [x] `package.json` with Next.js 15, Tailwind 4, Solana deps
- [x] `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- [ ] `src/styles/globals.css` — Tailwind base + CSS vars (bg, accent, text)
- [ ] `src/app/layout.tsx` — Root layout: dark bg, NavBar, DevNetBadge, WalletProvider stub
- [ ] `src/components/NavBar.tsx` — Logo 🎃, nav links, cart count badge
- [ ] `src/components/DevNetBadge.tsx` — "DevNet only — no real money" badge (always visible)
- [ ] `src/types/index.ts` — Costume, CartItem, PaymentState types
- [ ] `npm run build` green ✅

## Task 2: Costume Catalogue
- [ ] `src/lib/costumes.ts` — 4 costumes hardcoded (id, name, buyPrice, rentPrice, emoji)
- [ ] `src/components/CostumeCard.tsx` — Card with emoji, name, prices, buy/rent toggle, Add to Cart button
- [ ] `src/app/page.tsx` — Shop page: grid of CostumeCard, spooky header copy
- [ ] `npm run build` green ✅

## Task 3: Cart
- [ ] `src/lib/cartContext.tsx` — CartContext with add/remove/update/clear + total helper
- [ ] `src/app/cart/page.tsx` — Cart page: item list, qty +/−, buy/rent toggle, total, Checkout button
- [ ] NavBar cart count badge wired to CartContext
- [ ] `npm run build` green ✅

## Task 4: Wallet Connection
- [ ] Install / verify `@solana/wallet-adapter-*` packages
- [ ] `src/lib/walletProvider.tsx` — WalletProvider (Phantom + Solflare, Devnet)
- [ ] Wire WalletProvider into `layout.tsx`
- [ ] "Connect Wallet" button in NavBar; disable Checkout if not connected
- [ ] `npm run build` green ✅

## Task 5: Solana Pay Checkout
- [ ] `src/lib/solana.ts` — `MERCHANT_WALLET`, `connection` (DevNet)
- [ ] `src/lib/solanaPay.ts` — `buildPayUrl(cartTotal, reference)`, `buildQR(url)`
- [ ] `src/components/QRCode.tsx` — renders `createQR` canvas
- [ ] `src/components/PaymentStatus.tsx` — state machine display (IDLE→READY→WAITING→…)
- [ ] `src/app/checkout/page.tsx` — build URL, show QR + "Pay with Phantom" button
- [ ] `npm run build` green ✅

## Task 6: On-Chain Verification + Receipt
- [ ] `src/lib/solanaPay.ts` — `pollPayment(reference, timeoutMs=60000)` with `findReference`
- [ ] `src/lib/solanaPay.ts` — `confirmPayment(sig, amount)` with `validateTransfer`
- [ ] `src/app/checkout/page.tsx` — start polling on QR display; on confirm → redirect to receipt
- [ ] `src/app/receipt/page.tsx` — show items, total SOL, tx signature, Explorer link (`?cluster=devnet`)
- [ ] `npm run build` green ✅

## Task 7: Error States + Retry
- [ ] Rejection, timeout (60 s), insufficient-funds error banners
- [ ] "Try again" button: new `Keypair()`, reset state to READY_TO_PAY
- [ ] Wallet not connected → disabled button + tooltip on checkout
- [ ] Network error catch → "Connection error — Try again"
- [ ] `npm run build` green ✅

## Task 8: Polish, Deploy & Demo
- [ ] Final spooky visual polish (animations, hover effects, pumpkin motifs)
- [ ] `npm run build` clean, zero TS errors, zero ESLint errors
- [ ] Push to GitHub (`main` branch), import to Vercel, get live URL
- [ ] Record <3 min demo video on the live URL (browse → cart → checkout → receipt)
- [ ] Upload video to YouTube (unlisted or public)

## Task 9: Devpost Submission
- [ ] Fill in Devpost project page: title, description, live URL, repo URL, video URL
- [ ] Confirm screenshots uploaded and Halloween theme visible
- [ ] Submit before **05:00 5 Dec 2026 Bangkok time** (= 14:00 4 Dec 2026 PT)
- [ ] Redeem 4,000-credit code on Kiro before the same deadline

## Current Status
- Tasks 1 (partial): package.json, tsconfig, next.config, .gitignore created.
- Tasks 2–9: not started.
- Next action: complete Task 1 source files (globals.css, layout.tsx, NavBar, DevNetBadge, types).
