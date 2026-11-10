"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { getCostumeById } from "@/lib/costumes";
import type { PurchaseMode } from "@/types";

export default function CartPage() {
  const { items, totalSOL, removeItem, updateMode, updateQuantity, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6 animate-float">🛒</div>
        <h2
          className="text-2xl font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Your cart is empty
        </h2>
        <p style={{ color: "var(--color-muted)" }} className="mb-8">
          No costumes? The ghosts are disappointed.
        </p>
        <Link
          href="/"
          className="btn-primary inline-block px-8 py-3 rounded-lg text-sm tracking-widest uppercase"
        >
          Browse Costumes 🎃
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="text-3xl font-bold tracking-widest uppercase mb-8"
        style={{ color: "var(--color-accent)" }}
      >
        🛒 Your Cart
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => {
          const costume = getCostumeById(item.costumeId);
          if (!costume) return null;
          const price =
            item.mode === "buy" ? costume.buyPrice : costume.rentPrice;
          const subtotal = (price * item.quantity).toFixed(4);

          return (
            <div
              key={item.costumeId}
              className="card-spooky rounded-xl p-4 flex items-center gap-4"
            >
              {/* Emoji */}
              <span className="text-4xl shrink-0">{costume.emoji}</span>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold tracking-wide uppercase text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {costume.name}
                </div>

                {/* Buy / Rent toggle */}
                <div className="flex gap-2 mt-2 text-xs font-bold">
                  {(["rent", "buy"] as PurchaseMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateMode(item.costumeId, m)}
                      className="px-3 py-1 rounded transition-colors"
                      style={{
                        backgroundColor:
                          item.mode === m
                            ? "var(--color-accent)"
                            : "var(--color-border)",
                        color: item.mode === m ? "#0d0d0d" : "var(--color-muted)",
                      }}
                    >
                      {m.toUpperCase()}{" "}
                      {m === "rent"
                        ? `${costume.rentPrice} SOL`
                        : `${costume.buyPrice} SOL`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.costumeId, -1)}
                  className="w-7 h-7 rounded flex items-center justify-center font-bold text-lg transition-colors"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  −
                </button>
                <span className="w-6 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.costumeId, 1)}
                  className="w-7 h-7 rounded flex items-center justify-center font-bold text-lg transition-colors"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div
                className="text-right font-bold tracking-wide shrink-0 w-24"
                style={{ color: "var(--color-accent)" }}
              >
                {subtotal} SOL
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.costumeId)}
                className="shrink-0 text-lg transition-opacity hover:opacity-60"
                title="Remove"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {/* Total + actions */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-accent)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <span
            className="text-lg font-bold tracking-widest uppercase"
            style={{ color: "var(--color-text)" }}
          >
            Total
          </span>
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            {totalSOL.toFixed(4)} SOL
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors"
            style={{
              backgroundColor: "transparent",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="flex-1 btn-primary py-3 rounded-lg text-sm tracking-widest uppercase text-center"
          >
            Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
}
