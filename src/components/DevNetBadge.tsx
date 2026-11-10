"use client";

// ─── DevNet safety badge — must appear on every page ─────────────────
// Rule: visible on every page. See .kiro/steering/devnet-only.md
export default function DevNetBadge() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-1 text-xs font-bold tracking-widest uppercase"
      style={{
        backgroundColor: "#1a0a00",
        color: "var(--color-accent)",
        borderBottom: "1px solid var(--color-accent)",
      }}
    >
      <span>⚠️</span>
      <span>DevNet only — no real money — test SOL only</span>
      <span>⚠️</span>
    </div>
  );
}
