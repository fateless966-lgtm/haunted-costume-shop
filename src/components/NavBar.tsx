"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "@/lib/cartContext";

// ssr:false avoids a known hydration mismatch in the wallet button
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function NavBar() {
  const { totalItems } = useCart();

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span className="text-2xl animate-flicker">🎃</span>
        <span
          className="text-xl font-bold tracking-widest uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          Haunted Costume Shop
        </span>
        <span className="text-2xl animate-float">👻</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-sm tracking-wider uppercase transition-colors"
          style={{ color: "var(--color-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-muted)")
          }
        >
          Shop
        </Link>

        <WalletMultiButton />

        <Link href="/cart" className="relative flex items-center gap-1">
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#0d0d0d",
              }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
