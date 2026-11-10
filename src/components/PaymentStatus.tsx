import type { PaymentState } from "@/types";

const LABELS: Record<PaymentState, { icon: string; text: string }> = {
  idle: { icon: "🕯️", text: "Preparing…" },
  ready: { icon: "🎃", text: "Ready to pay" },
  waiting: { icon: "👻", text: "Waiting for payment…" },
  confirmed: { icon: "🦇", text: "Payment confirmed!" },
  failed: { icon: "💀", text: "Payment failed" },
  timeout: { icon: "⏳", text: "Timed out — no payment detected" },
};

export default function PaymentStatus({
  state,
  error,
}: {
  state: PaymentState;
  error: string | null;
}) {
  const { icon, text } = LABELS[state];
  const bad = state === "failed" || state === "timeout";
  return (
    <div role="status" aria-live="polite" className="mb-6">
      <div
        className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
          state === "waiting" ? "animate-glow" : ""
        }`}
        style={{
          backgroundColor: "var(--color-surface)",
          border: `1px solid ${bad ? "var(--color-accent2)" : "var(--color-accent)"}`,
          color: bad ? "var(--color-accent2)" : "var(--color-accent)",
        }}
      >
        <span>{icon}</span>
        <span>{text}</span>
      </div>
      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--color-accent2)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
