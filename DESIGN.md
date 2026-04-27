# Design Brief — Nephron Explorer: Adventure Game

**Purpose**: Interactive exploration game traversing kidney filtration stages as a visual map | **Tone**: Vibrant, hand-crafted, biology notebook meets retro game UI—detailed enough for high schooler passion project, NOT clinical

## Palette
| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| stage-1 | `oklch(0.52 0.28 260)` | `oklch(0.65 0.26 260)` | Renal Corpuscle—electric vivid blue, map node |
| stage-2 | `oklch(0.62 0.26 140)` | `oklch(0.70 0.28 140)` | Proximal Tubule—fresh bright green |
| stage-3 | `oklch(0.60 0.32 45)` | `oklch(0.70 0.35 45)` | Loop of Henle—warm saturated orange |
| stage-4 | `oklch(0.55 0.28 280)` | `oklch(0.68 0.30 280)` | Distal Tubule—vibrant violet |
| stage-5 | `oklch(0.50 0.30 20)` | `oklch(0.62 0.32 20)` | Collecting Duct—deep bold red |
| background | `oklch(0.98 0 0)` | `oklch(0.12 0 0)` | Clean white / deep dark for map background |
| foreground | `oklch(0.2 0 0)` | `oklch(0.95 0 0)` | High contrast for text labels |

## Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Display | General Sans | 32–48px | 600–700 |
| Body | DM Sans | 14–16px | 400–500 |
| Mono | Geist Mono | 12–14px | 400 |

## Structural Zones
| Zone | Elevation | Treatment | Purpose |
|------|-----------|-----------|---------|
| Welcome Screen | N/A | Full-screen `bg-background`, centered kidney SVG, zoom-in entrance, "Start your inner journey" at renal pyramid | Immersive animated kidney—sets exploration tone |
| Map Container | Base | `bg-background` or gradient subtle, kidney outline diagram top-left corner | Overworld-style layout showing all 5 stages, pathways, droplet position |
| Stage Nodes | Elevated | `map-node` + stage color glow aura, clickable, `stage-pulse` on hover | 5 interactive circles representing filtration stages, each with distinct color + glowing ring |
| Info Panel | Card | `bg-card` + `shadow-elevated`, right sidebar or modal, fade-in transition | Displays stage name, description, animation preview, reabsorption rates when node clicked |
| Animation Zone | Base | SVG/Canvas area within info panel, contained animation of water movement through current stage | Visual explanation of what happens at each stage (e.g., water entering capillary, glucose reabsorption) |
| Stage Label | Text | Typography with `stage-text-glow`, chunky display font (General Sans, 600 weight) | Each node shows roman numeral (I–V) + stage name below map |
| Footer | Subtle | `bg-muted/5` + `border-t`, navigation (back/next arrows), stage counter | Non-intrusive progress indicator |

## Motion
- **Welcome zoom**: 1.2s ease-out (kidney diagram full-screen entrance, droplet enters at renal pyramid)
- **Map node hover**: 0.3s smooth (glow aura brightens, node scales slightly +5%)
- **Info panel fade**: 0.4s ease-out (new stage data revealed)
- **Droplet float**: 3s ease-in-out infinite (subtle bobbing on current stage node)
- **Stage pulse**: 2s cubic-bezier (ring expansion, supports keyboard focus navigation)
- **Pathway flow**: 2s linear infinite (animated dashes along connecting lines between nodes)
- **Shimmer accent**: 3s infinite (subtle highlight across info card on stage reveal)

## Components
- **Map nodes**: Circles (60–80px), stage color fill, glowing radial-gradient aura (pre-glow), pulse on hover/focus
- **Droplet sprite**: Positioned on current stage node, subtle float animation, layer above node
- **Stage labels**: Roman numerals (I–V) + stage name, General Sans 600, positioned below each node
- **Pathway connectors**: SVG lines linking nodes, stage-colored stroke, animated dash animation for flow effect
- **Info card**: `bg-card` + `shadow-elevated`, left border accent in stage color, content: stage name, description, key molecules, reabsorption %, animation zone
- **Kidney diagram**: Top-left corner, light outline style (stroked SVG), subtle for context, NOT overwhelming
- **Animation zones**: Small 150–200px SVG canvas showing water droplet movement, molecule icons, arrows indicating flow direction

## Spacing & Rhythm
- Grid: 4px base unit | 4, 8, 12, 16, 24, 32px steps | 16px max for internal card padding
- Breakpoints: mobile-first (`sm: 640px`, `md: 768px`, `lg: 1024px`)
- Density: Spacious middle (card gap 16px), tight internal (button padding 12px)

## Constraints
- All interactions keyboard-accessible: Tab to cycle nodes, Enter/Space to select, arrows to navigate adjacent stages
- Info panel auto-focuses on new stage reveal (stage-pulse highlight via `:focus-visible`)
- No quiz, scoring, or branching logic—pure exploration in any order
- Glowing/pulsing animations respect `prefers-reduced-motion` (scale down to opacity + solid color only)
- Map responsive: collapse to vertical stacking on mobile (`<md` breakpoint)
- Stage colors always saturated and distinct—readable in both light/dark modes
- Animations 2–3s range (avoid jittery rapid effects, respect cognitive load)
- Info cards max 2 per screen (primary content focus)

## Signature Detail
**Map as adventure**: Overworld-style layout with colorful stage nodes as "locations"—clicking a node is like entering a new area. Droplet character floats on current position, pathway lines show the journey route. **Glowing nodes**: Each stage node has a radial-gradient aura that brightens on hover—creates tactile, game-like feel. **Animation preview**: Small contained SVG animation inside info card explains the mechanism (e.g., filtration basket opening, glucose molecules being reabsorbed)—educational without text-heavy explanation. **Vibrant color story**: Each stage has distinct saturated color (not muted)—makes exploration feel playful, not clinical. Aesthetic achieves "high schooler passion project" through chunky typography, organic glow effects, and game UI patterns while maintaining educational clarity.
