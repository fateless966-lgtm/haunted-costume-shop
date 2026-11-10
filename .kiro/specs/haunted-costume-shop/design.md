# Haunted Costume Shop — Design

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 |
| Blockchain | Solana DevNet (`https://api.devnet.solana.com`) |
| Payment | `@solana/pay` — `encodeURL`, `createQR`, `findReference`, `validateTransfer` |
| Wallet | `@solana/wallet-adapter-react` + Phantom |
| State | React `useState` / `useContext` (no external store needed) |
| QR render | `@solana/pay` built-in `createQR` |
| Deploy | Vercel |

## Page / Route Structure

```
src/
  app/
    layout.tsx          ← Root layout: WalletProvider, spooky theme shell, DevNet badge
    page.tsx            ← Shop page (costume catalogue)
    cart/
      page.tsx          ← Cart page
    checkout/
      page.tsx          ← Checkout: QR + wallet pay
    receipt/
      page.tsx          ← Receipt after confirmed payment
  components/
    CostumeCard.tsx     ← Single costume card (name, price, toggle, Add to Cart)
    CartDrawer.tsx      ← Slide-out cart summary (optional alt to /cart page)
    QRCode.tsx          ← Wraps createQR canvas render
    PaymentStatus.tsx   ← State-machine display
    DevNetBadge.tsx     ← "DevNet only — no real money" badge
    NavBar.tsx          ← Top nav with cart count badge
  lib/
    costumes.ts         ← Hardcoded catalogue data
    solana.ts           ← Connection, MERCHANT_WALLET constant
    solanaPay.ts        ← buildPayUrl(), pollPayment(), validatePayment()
  types/
    index.ts            ← CartItem, Costume, PaymentState types
  styles/
    globals.css         ← Tailwind base + spooky CSS vars
```

## Costume Catalogue (hardcoded, `src/lib/costumes.ts`)

```ts
export const COSTUMES = [
  { id: "vampire-cloak",    name: "Vampire Cloak",     buyPrice: 0.20, rentPrice: 0.05, emoji: "🧛" },
  { id: "witch-hat-robe",   name: "Witch Hat & Robe",  buyPrice: 0.15, rentPrice: 0.04, emoji: "🧙" },
  { id: "ghost-sheet",      name: "Ghost Sheet (glow)",buyPrice: 0.10, rentPrice: 0.03, emoji: "👻" },
  { id: "pumpkin-king",     name: "Pumpkin King Suit", buyPrice: 0.25, rentPrice: 0.06, emoji: "🎃" },
];
```

## Cart State

```ts
type CartItem = {
  costumeId: string;
  mode: "buy" | "rent";
  quantity: number;
};
```

Cart is stored in React Context + `useState`. On checkout, the cart total is
computed as: `sum(item.quantity * (mode === "buy" ? buyPrice : rentPrice))`.

## Solana Pay Flow

```
1. User clicks Checkout
2. Generate: reference = new Keypair().publicKey
3. url = encodeURL({ recipient: MERCHANT_WALLET, amount, reference, label, message })
4. Show QR (createQR) + "Pay with Phantom" button
5. Poll findReference(connection, reference) every 2 s, timeout 60 s
6. On tx found → validateTransfer(connection, sig, { recipient, amount })
7. Success → /receipt?sig=...&amount=...
8. Failure → show error + "Try again" (new reference keypair)
```

## Payment State Machine

```
IDLE → READY_TO_PAY → WAITING → CONFIRMED | FAILED | TIMEOUT
```

Visible on-screen via `PaymentStatus` component with animated icons.

## UI Tokens (Tailwind CSS vars, `globals.css`)

```css
:root {
  --color-bg:       #0d0d0d;   /* near-black */
  --color-surface:  #1a1a2e;   /* deep navy card bg */
  --color-accent:   #ff6a00;   /* pumpkin orange */
  --color-accent2:  #c0392b;   /* blood red hover */
  --color-text:     #f0e6d3;   /* ghost parchment */
  --color-muted:    #8a8a9a;
}
```

## Wallet Connection
- `WalletProvider` wraps the whole app in `layout.tsx`.
- Supported wallets: Phantom (primary), Solflare.
- Network: `WalletAdapterNetwork.Devnet`.
- `useWallet()` in checkout page drives the "Pay with connected wallet" button.

## Error Handling
| Case | Behaviour |
|---|---|
| Wallet not connected | Disabled Checkout button + tooltip |
| Payment rejected | "Payment rejected" banner + Try again |
| Timeout (60 s) | "No payment detected — Try again" |
| Insufficient funds | `validateTransfer` throws → "Insufficient funds" banner |
| Network error | Generic "Connection error — Try again" |

## Deployment
- Vercel free tier, auto-deploy from `main` branch on GitHub.
- No env vars needed (DevNet endpoint and merchant wallet are public constants).
- `npm run build` must be green before every push.
