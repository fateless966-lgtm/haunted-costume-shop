"use client";

import { useState } from "react";
import type { Costume, PurchaseMode } from "@/types";
import { useCart } from "@/lib/cartContext";

interface CostumeCardProps {
  costume: Costume;
}

export default function CostumeCard({ costume }: CostumeCardProps) {
  const [mode, setMode] = useState<PurchaseMode>("rent");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const price = mode === "buy" ? costume.buyPrice : costume.rentPrice;

  function handleAdd() {
    addItem(costume.id, mode);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      className="card-spooky rounded-xl p-5 flex flex-col gap-4"
      style={{ minHeight: "280px" }}
    >
      {/* Emoji visual */}
      <div className="text-6xl text-center animate-float select-none">
        {costume.emoji}
      </div>

      {/* Name + description */}
      <div>
        <h3
          className="text-base font-bold tracking-wider uppercase mb-1"
          style={{ color: "var(--color-accent)" }}
        >
          {costume.name}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
          {costume.description}
        </p>
      </div>

      {/* Buy / Rent toggle */}
      <div
        className="flex rounded-lg overflow-hidden text-xs font-bold tracking-wider"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <button
          onClick={() => setMode("rent")}
          className="flex-1 py-2 transition-colors"
          style={{
            backgroundColor: mode === "rent" ? "var(--color-accent)" : "transparent",
            color: mode === "rent" ? "#0d0d0d" : "var(--color-muted)",
          }}
        >
          RENT · {costume.rentPrice} SOL
          <span className="block font-normal normal-case" style={{ fontSize: "10px" }}>
            3 days
          </span>
        </button>
        <button
          onClick={() => setMode("buy")}
          className="flex-1 py-2 transition-colors"
          style={{
            backgroundColor: mode === "buy" ? "var(--color-accent)" : "transparent",
            color: mode === "buy" ? "#0d0d0d" : "var(--color-muted)",
          }}
        >
          BUY · {costume.buyPrice} SOL
          <span className="block font-normal normal-case" style={{ fontSize: "10px" }}>
            keep forever
          </span>
        </button>
      </div>

      {/* Price display */}
      <div className="text-center">
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--color-accent)" }}
        >
          {price} SOL
        </span>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className="btn-primary w-full py-2 rounded-lg text-sm tracking-wider uppercase mt-auto"
        style={{
          backgroundColor: added ? "var(--color-accent2)" : undefined,
          color: added ? "var(--color-text)" : undefined,
        }}
      >
        {added ? "✓ Added!" : "Add to Cart 🛒"}
      </button>
    </div>
  );
}
