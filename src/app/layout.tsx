import type { Metadata } from "next";
import "@/styles/globals.css";
import DevNetBadge from "@/components/DevNetBadge";
import NavBar from "@/components/NavBar";
import { CartProvider } from "@/lib/cartContext";
import AppWalletProvider from "@/lib/walletProvider";

export const metadata: Metadata = {
  title: "Haunted Costume Shop 🎃",
  description:
    "Browse and rent Halloween costumes. Pay with Solana Pay on DevNet. No real money.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
        {/* DevNet safety banner — always visible, per steering rule */}
        <DevNetBadge />

        {/* Push content below the fixed banner */}
        <div style={{ paddingTop: "28px" }}>
          <AppWalletProvider>
            <CartProvider>
              <NavBar />
              <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
                {children}
              </main>
              <footer
                className="text-center py-6 text-sm tracking-wide"
                style={{
                  color: "var(--color-muted)",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <span>🕷️</span>{" "}
                Haunted Costume Shop · Kiroween 2026 · DevNet only · No real SOL{" "}
                <span>🕷️</span>
              </footer>
            </CartProvider>
          </AppWalletProvider>
        </div>
      </body>
    </html>
  );
}
