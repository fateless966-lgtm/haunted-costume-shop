import type { Costume } from "@/types";

// ─── Hardcoded catalogue — 4 Halloween costumes ──────────────────────
// Prices confirmed from spec: buy 0.10–0.25 SOL, rent 0.03–0.06 SOL (3 days)
export const COSTUMES: Costume[] = [
  {
    id: "vampire-cloak",
    name: "Vampire Cloak",
    buyPrice: 0.20,
    rentPrice: 0.05,
    emoji: "🧛",
    description: "Sweep through the night in this floor-length crimson-lined cloak. Fangs not included.",
  },
  {
    id: "witch-hat-robe",
    name: "Witch Hat & Robe",
    buyPrice: 0.15,
    rentPrice: 0.04,
    emoji: "🧙",
    description: "Classic pointed hat and flowing dark robe with silver star embroidery. Broomstick ready.",
  },
  {
    id: "ghost-sheet",
    name: "Ghost Sheet (glow)",
    buyPrice: 0.10,
    rentPrice: 0.03,
    emoji: "👻",
    description: "Glow-in-the-dark ghost sheet with hand-cut eye holes. Simple, iconic, terrifying.",
  },
  {
    id: "pumpkin-king",
    name: "Pumpkin King Suit",
    buyPrice: 0.25,
    rentPrice: 0.06,
    emoji: "🎃",
    description: "Full pumpkin-head monarch ensemble. Command the holiday with an orange LED crown.",
  },
];

export function getCostumeById(id: string): Costume | undefined {
  return COSTUMES.find((c) => c.id === id);
}
