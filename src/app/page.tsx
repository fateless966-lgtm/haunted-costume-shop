import CostumeCard from "@/components/CostumeCard";
import { COSTUMES } from "@/lib/costumes";
import Link from "next/link";

export default function ShopPage() {
  return (
    <div>
      {/* Hero header */}
      <header className="text-center py-10 mb-10">
        <div className="text-5xl mb-4 animate-float">🎃 👻 🧛</div>
        <h1
          className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--color-accent)" }}
        >
          Haunted Costume Shop
        </h1>
        <p className="text-lg tracking-wide" style={{ color: "var(--color-muted)" }}>
          Dress for the darkness. Buy or rent. Pay with Solana on DevNet.
        </p>
        <div className="mt-4 flex justify-center gap-3 text-2xl">
          <span>🕸️</span><span>🦇</span><span>🕸️</span>
        </div>
      </header>

      {/* Costume grid */}
      <section>
        <h2
          className="text-sm font-bold tracking-widest uppercase mb-6"
          style={{ color: "var(--color-muted)" }}
        >
          ── Choose Your Costume ──
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COSTUMES.map((costume) => (
            <CostumeCard key={costume.id} costume={costume} />
          ))}
        </div>
      </section>

      {/* CTA to cart */}
      <div className="mt-12 text-center">
        <Link
          href="/cart"
          className="inline-block btn-primary px-10 py-3 rounded-lg text-sm tracking-widest uppercase"
        >
          View Cart 🛒
        </Link>
      </div>
    </div>
  );
}
