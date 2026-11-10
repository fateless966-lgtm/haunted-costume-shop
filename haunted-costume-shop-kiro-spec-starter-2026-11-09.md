# Haunted Costume Shop — Kiro spec starter (Kiroween 2026)

Prepared 2026-11-09 (Mon) lunchtime, Asia/Bangkok, while waiting for the
4,000-credit code. The user submitted the credit-request form at ~12:11
Bangkok on 2026-11-09; the code is expected in ~48 working hours
(about Wed–Thu 12–13 Nov), after the Didit ID check email from Devpost.
Nothing here submits, registers or spends anything — it is a starter the
user can paste into Kiro and build with the 50 free credits already in
the account (Free plan, resets 1 Dec).

## The project, as the user chose it

- Hackathon: Kiroween 2026, Devpost — https://kiroween.devpost.com/
- Category: **Costume Contest**
- Project: **Haunted Costume Shop** — browse / buy or rent Halloween
  costumes, pay with Solana Pay on DevNet.
- User's own description (already submitted in the credit form):
  > Category: Costume Contest. I will build a Halloween costume rental
  > shop with a spooky dark UI, where users can browse costumes, add to
  > cart, and check out with Solana Pay on DevNet. I will use Kiro specs,
  > hooks, and steering to build the shop, cart, and payment receipt flow.
- Devpost profile: https://devpost.com/fateless966
- Deadlines: redeem the credit code before **14:00 4 Dec 2026 PT**
  (= **05:00 5 Dec 2026 Bangkok**); submit the project by the same time;
  credits expire **31 Dec 2026**.

## What to reuse from the MLH Solana shop (7–8 Nov 2026)

The user already built and submitted this exact payment flow solo, so the
Kiroween shop should copy it, not re-invent it:

- Stack: Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4.
- Libraries already proven: `@solana/pay`, `@solana/web3.js`,
  wallet-adapter packages. No custom Anchor program, no database, no
  accounts, no Mainnet.
- DevNet only, with a clear "DevNet only — no real money" badge.
- Payment flow: `encodeURL` + QR (`createQR`) per order with a fresh
  reference (`new Keypair().publicKey`), poll with `findReference`,
  confirm with `validateTransfer`, receipt with product, amount,
  transaction signature and Solana Explorer link (`?cluster=devnet`).
- Reference implementation / prompt:
  `~/workspace/goals/mlh-events-and-livestream-reminders/files/solana-pay-mini-shop-coding-prompt.md`
- Live MLH shop: https://solana-pay-mini-shop.vercel.app/
  (repo https://github.com/fateless966-lgtm/solana-pay-mini-shop,
  demo video https://youtu.be/RlSUZTH2mtQ — buying the 0.25 SOL T-shirt).
- Merchant wallet used there (DevNet, public address only):
  `ETg62c95bHoBY2ndXVQxLsTiggn5hLUHkKTLGWsbuKY6`
  — reuse it, or swap in a fresh DevNet wallet; never put a private key
  or seed phrase in the repo.

## Costume catalogue — proposal, user to confirm prices

Four items, same price scale as the MLH shop (0.02–0.25 SOL). Rent is
cheaper than buy; the user can change any price before building.

| Costume | Buy | Rent (3 days) |
|---|---|---|
| Vampire Cloak | 0.20 SOL | 0.05 SOL |
| Witch Hat & Robe | 0.15 SOL | 0.04 SOL |
| Ghost Sheet (glow) | 0.10 SOL | 0.03 SOL |
| Pumpkin King Suit | 0.25 SOL | 0.06 SOL |

Cart holds items with a buy/rent toggle per item; checkout pays the cart
total in one Solana Pay transaction.

## Kiro spec to create (paste into Kiro, spec-driven workflow)

Create a **new repo** (not the MLH repo — Kiroween requires a project
built 30 Oct–4 Dec 2026), then in Kiro ask for a spec and paste the
requirements below. Kiro should create
`.kiro/specs/haunted-costume-shop/{requirements.md,design.md,tasks.md}`.
Keep `.kiro/` in git — do **not** put it in `.gitignore`; judges check
for specs, hooks and steering.

### requirements.md (draft)

1. Shop page lists 4 costumes with name, buy price, rent price,
   buy/rent toggle, and an Add to cart button.
2. Cart page shows items, quantities, buy/rent choice, total in SOL,
   and a Checkout button.
3. Checkout generates one Solana Pay URL for the cart total on DevNet,
   shows a QR code, and a "Pay with connected wallet" option.
4. Payment is verified on-chain (`findReference` + `validateTransfer`);
   success shows a receipt with items, amount, signature and Explorer
   (DevNet) link. Rejection, timeout and insufficient-funds cases show a
   clear message and a "Try again" that generates a new reference.
5. UI is a spooky dark theme: near-black background, pumpkin orange
   accents, ghost/pumpkin motifs, English UI. Judging for Costume
   Contest weights the Halloween look, so the theme is a requirement,
   not decoration.
6. `npm run build` passes with no TypeScript errors; no secrets, no
   `.env`, no Mainnet code path.

### design.md (draft)

- Next.js 16 + TypeScript + Tailwind 4, one-page shop + cart drawer
  (or a second cart view — keep it to one or two pages).
- Same Solana Pay stack as the MLH shop (`@solana/pay`,
  `@solana/web3.js`, wallet-adapter). DevNet endpoint
  `https://api.devnet.solana.com`.
- State machine visible on screen: Not connected / Ready to pay /
  Waiting for payment / Payment confirmed / Payment failed.
- Steering note: add `.kiro/steering/` with the DevNet-only rule and
  the "never commit keys" rule, and a hook that runs `npm run build`
  after file changes if Kiro supports it.

### tasks.md (draft, in order)

1. Scaffold Next.js + Tailwind, spooky dark theme shell.
2. Hardcode the 4-costume catalogue with buy/rent prices.
3. Cart with buy/rent toggle and total.
4. Wallet connection (Phantom, DevNet, Testnet Mode warning).
5. Solana Pay checkout: encodeURL + QR + connected-wallet pay.
6. On-chain verification + receipt with Explorer link.
7. Error states (reject / timeout / insufficient funds) + retry.
8. `npm run build` clean, deploy to Vercel, record a <3 min demo video
   on the live link (same routine as the MLH shop).
9. Submit on Devpost before 05:00 5 Dec Bangkok, with repo link,
   live link and video.

## Suggested order of work

- **Now, while waiting for the code (9–12 Nov):** use the 50 free
  credits to create the repo, generate the spec above in Kiro, and build
  steps 1–3 (theme + catalogue + cart — no payment yet, cheap on credits).
- **When the 4,000 credits arrive (~12–13 Nov):** build steps 4–7
  (wallet + Solana Pay + receipt), reusing the MLH shop code as the
  reference.
- **By 4 Dec:** deploy, demo video, Devpost submission. The 26-day
  window from 9 Nov leaves comfortable buffer; the binding dates are
  redeem/submit by 05:00 5 Dec Bangkok and credit expiry 31 Dec 2026.

## Still waiting on (not done by this file)

- Didit ID-check email from Devpost (check inbox + Spam for the Devpost
  email) — no code without it.
- The 4,000-credit code itself (~48 working hours after the form).
- User's confirmation of the 4 costume prices above (or replacements).
