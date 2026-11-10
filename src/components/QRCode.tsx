"use client";

import { useEffect, useRef } from "react";
import { createQR } from "@solana/pay";

// QR needs contrast to scan: dark modules on ghost-parchment, framed by the dark UI.
export default function QRCode({ url, size = 240 }: { url: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    createQR(url, size, "#f0e6d3", "#0d0d0d").append(el);
  }, [url, size]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Solana Pay QR code for this order (DevNet)"
      className="mx-auto rounded-lg overflow-hidden"
      style={{ width: size, height: size, border: "3px solid var(--color-accent)" }}
    />
  );
}
