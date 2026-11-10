---
inclusion: always
---

# Spooky Halloween Theme Rule

**The Halloween dark theme is a judging criterion — treat it as a hard requirement.**

## Design Tokens

```css
--color-bg:      #0d0d0d;   /* near-black background */
--color-surface: #1a1a2e;   /* deep navy card/panel background */
--color-accent:  #ff6a00;   /* pumpkin orange — buttons, borders, highlights */
--color-accent2: #c0392b;   /* blood red — hover states */
--color-text:    #f0e6d3;   /* ghost parchment — primary text */
--color-muted:   #8a8a9a;   /* muted text */
```

## Rules

1. Background is always near-black (`#0d0d0d`). No white or light-grey backgrounds.
2. Primary accent is pumpkin orange (`#ff6a00`). Use it for buttons, borders, price tags, and active states.
3. Hover states use blood red (`#c0392b`).
4. Text is ghost parchment (`#f0e6d3`), not pure white.
5. Every costume card uses a Halloween emoji (🧛 🧙 👻 🎃) as the visual.
6. Headings use a spooky/gothic feel — uppercase, letter-spacing, or a horror-adjacent font if loaded.
7. Subtle Halloween motifs (spiderwebs, bats, pumpkins) are welcome as decorative SVG or emoji in headers/footers.
8. The DevNetBadge uses orange text on a dark background — never a bright/white badge.
9. Animations: subtle flicker on hover, floating ghost effect where appropriate — keep them lightweight (CSS only, no heavy JS).
