# Anti-Slop UI & Industrial Design Invariants

All AI agents (Google Antigravity, GitHub Copilot, Cursor, Claude Code, etc.) modifying frontend user interfaces in TrailGuard must strictly adhere to these design invariants. Never generate generic, flashy "AI-demo" templates.

---

### 1. Zero Gradient Headlines
- **Rule:** Never use multi-stop clipped gradient text (`bg-gradient-to-r ... bg-clip-text text-transparent`) for headlines.
- **Enforcement:** All primary titles and headers must use solid, high-contrast, accessible typography (`text-white` in dark mode, `text-slate-900` in light mode).

### 2. No Pinging Pill Eyebrows
- **Rule:** Do not place animated pinging dots (`animate-ping`) or rounded-full badge pills (`rounded-full border px-3 py-1`) above section headings.
- **Enforcement:** If a category or section descriptor is needed, use quiet, unbordered, uppercase small text (`text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400`).

### 3. No Full-Page 60 FPS Background Canvases
- **Rule:** Do not mount full-viewport canvas loops generating glowing radial gradient orbs, ambient particle fog, or continuous undulating sine waves.
- **Enforcement:** Backgrounds must be grounded, solid surfaces (`#070D1B` dark / `#F8FAFC` light) with optional static, high-performance CSS grid patterns or real product imagery.

### 4. No 3D Wireframe Terrain or Scanning Lasers
- **Rule:** Never add synthetic 3D wireframe terrain loops, cycling orange LiDAR lasers, or mock game-engine animations to product heroes.
- **Enforcement:** Use real photography, crisp CAD illustrations, or functional telemetry UI components.

### 5. Flat 1px Borders (No Spinning Conic Gradient Beams)
- **Rule:** Never use rotating conic gradient border beams (`BorderBeamCard`, `animate-border-beam`, `bg-[conic-gradient(...)]`).
- **Enforcement:** Surfaces must use single-layer cards with clean, subtle 1px borders (`border-slate-800` in dark mode, `border-slate-200` in light mode).

### 6. No Nested Card "Squircles"
- **Rule:** Prohibit nesting 3 to 4 layers of rounded cards inside each other (`rounded-3xl` > `rounded-[23px]` > `rounded-xl` > `rounded-lg`).
- **Enforcement:** Maintain clean, flat single-layer card surfaces with uniform corner radiuses (`rounded-xl` or `rounded-2xl`).

### 7. Authentic Telemetry (No Mock Sci-Fi Arcade Jargon)
- **Rule:** Never invent arcade sci-fi HUD strings (e.g., `REC [●] LIVE LiDAR SCAN`, `GPS LOCK // 12-SATELLITE FIX`).
- **Enforcement:** Present data as serious industrial/defense hardware telemetry (e.g., `Live Device Telemetry`, `Sector IV (Mont Blanc)`, `868 MHz · 12 Locked`).

### 8. Restraint Over Opacity Stacking
- **Rule:** Avoid stacking multiple semi-transparent blur layers (`bg-white/[0.08] backdrop-blur-2xl` inside `bg-black/60`).
- **Enforcement:** Use clean, solid surface tokens defined in `frontend/src/index.css`.
