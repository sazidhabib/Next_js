# Master Project Blueprint & Architecture Plan

> **Objective:** Build an ultra-high-fidelity, 60–120 FPS creative portfolio with identical design patterns, canvas engines, particle physics, and interactions to **[hridoy.pro](https://hridoy.pro/)**.  
> **Selected Stack:** **Option A: Vite + Modern Modular Vanilla JavaScript**

---

## 1. Deep Technical Teardown: Why NOT Next.js for This Project?

While Next.js is an industry leader for e-commerce, dashboards, SaaS platforms, and content-heavy platforms, it is **fundamentally the wrong architectural paradigm** for a hyper-interactive, canvas-intensive, 120 FPS motion portfolio.

Here is an honest, deep-level breakdown of why Next.js harms this specific type of project:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS / REACT PARADIGM                        │
│ State Change ──► Virtual DOM Diff ──► Fiber Reconciliation ──► DOM     │
│ ❌ High latency for continuous 60-120 FPS per-frame loops              │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        OPTION A: DIRECT CANVAS / RAF                   │
│ Mouse Move / RAF Loop ──► Math Physics ──► Direct Buffer / Canvas Draw │
│ ⚡ 0ms latency, zero reconciliation, native GPU execution              │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1 The React Virtual DOM & Reconciliation Overhead
* **The Problem:** The core of `hridoy.pro` relies on **8 concurrent `<canvas>` engines**, continuous particle arrays (hundreds of floating elements), spring-dampened physics, and continuous cursor repulsion calculations running on every tick of `requestAnimationFrame` (60 to 120 times per second).
* **Why React Fails Here:** React is designed around **declarative UI reconciliation** (state change $\rightarrow$ diff virtual DOM tree $\rightarrow$ commit mutations). If you trigger React re-renders on high-frequency animation loops or pointer events, the React Fiber scheduler chokes, creating micro-stutters, garbage collection spikes, and dropped frames.

### 1.2 The "useRef Paradox" (React Becomes Deadweight)
* To prevent React from re-rendering on every animation frame, React developers must wrap every canvas, particle array, and animation loop in:
  ```javascript
  const canvasRef = useRef(null);
  useEffect(() => {
    // 100% pure vanilla JavaScript written inside here anyway!
    const ctx = canvasRef.current.getContext('2d');
    const loop = () => { /* canvas math */ requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(loop);
  }, []);
  ```
* **The Truth:** In Next.js, **95% of your creative code will still be written in imperative vanilla JavaScript** inside `useEffect`. React is not helping; it is simply acting as a heavy, restrictive wrapper around native browser APIs.

### 1.3 SSR & Hydration Mismatch for Canvases
* **Server-Side Rendering (SSR) Cannot Render Canvases:** Node.js on the server has no concept of `window`, `document`, `navigator.userAgent`, `pointermove`, screen DPI (`devicePixelRatio`), or HTML5 Canvas 2D contexts.
* **The Result in Next.js:** Canvases render as empty rectangular placeholders on the server. When the browser hydrates:
  * You get React Hydration Mismatch errors unless you disable SSR using `dynamic(() => import(...), { ssr: false })` or `typeof window !== 'undefined'` guards.
  * You experience visible layout shifts (CLS) and flashing when canvases suddenly initialize after hydration completes.

### 1.4 Bundle Bloat & First Contentful Paint (FCP)
* **Next.js Overhead:** A baseline Next.js application ships ~80 KB to 200 KB+ of compressed JavaScript runtime before your own code even executes (React runtime, React DOM, Next.js routing, hydration manifest, chunks).
* **Vite + Vanilla JS Footprint:** The entire bundle for `hridoy.pro` in native JavaScript is **under 35 KB total**.
* **Impact on Hiring / Impression:** Creative directors and design engineers test portfolios on mobile and monitor DevTools. A vanilla Vite site loads in under **0.4 seconds** with a **99–100 Google Lighthouse** score, whereas Next.js often suffers on First Input Delay (FID) and Total Blocking Time (TBT) due to heavy hydration.

### 1.5 120Hz Pointer & Magnetic Physics Throttling
* Mouse tracking for the magnetic cursor, 3D card tilt, distance spec guides, and particle repulsion fires at the monitor’s native refresh rate (up to 120–144 times/sec on ProMotion displays).
* React's synthetic event system adds dispatch overhead and queue latency. Vanilla `addEventListener('pointermove', e => {...}, { passive: true })` bypasses all wrappers and directly feeds normalized coordinates into math vectors with zero input lag.

### 1.6 Hot Module Replacement (HMR) Memory Leaks in Canvas
* In React, every time you edit a file during development, React Fast Refresh re-mounts components.
* If a single `requestAnimationFrame` loop, event listener, or offscreen canvas context is not meticulously destroyed in the cleanup function, multiple ghost loops run concurrently in the background, consuming 100% CPU and crashing the browser tab.
* In Vite with pure ES modules, canvas engines can cleanly register teardown hooks or reload isolated modules cleanly.

### Summary Comparison Table

| Metric | Option A: Vite + Vanilla JS | Option B: Next.js + React |
|---|---|---|
| **Animation Frame Rate** | Consistent 60–120 FPS | 30–60 FPS with micro-jank on low-end hardware |
| **Initial JS Payload** | ~25 KB – 35 KB | 180 KB – 300 KB+ |
| **Lighthouse Performance** | **98 – 100** | 70 – 85 (penalized by hydration TBT) |
| **Canvas Architecture** | Direct buffer access via native RAF | Trapped in `useRef` + `useEffect` wrappers |
| **Startup Speed** | Instant (< 400ms) | Requires JS compilation & hydration |
| **Code Fidelity** | Identical to original `hridoy.pro` | Incompatible rewrite requiring component abstractions |

---

## 2. Master System Architecture (Option A: Vite + Vanilla JS)

### 2.1 Project Directory Structure

```
d:\Github\sazidhabib_javascript_mordern\
├── index.html                   # Master semantic layout, 8 canvas mounts, SVG defs
├── package.json                 # Fast Vite dev script + Lenis smooth scroll
├── vite.config.js               # Minification, asset inlining, dev server configs
├── blueprint/                   # Master plans, specs, and teardowns
│   └── planing.md               # This architecture document
├── src/
│   ├── styles/
│   │   ├── tokens.css           # CSS variables (colors, fonts, radii, easings)
│   │   ├── base.css             # Resets, dark theme background, typography
│   │   ├── figma-sim.css        # Styles for the interactive Figma workspace & cursors
│   │   ├── components.css       # Nav capsule, project cards, service grids, modals
│   │   └── animations.css       # 32 CSS keyframes (grain jitter, scans, glows)
│   ├── scripts/
│   │   ├── main.js              # Application orchestrator, Lenis init, resize handling
│   │   ├── lenis-scroll.js      # Smooth momentum scroll sync with RAF
│   │   ├── cursor.js            # Magnetic cursor follower, dynamic states, 3D card tilt
│   │   ├── figma-playground.js  # Interactive Figma clone (multiplayer cursors, specs)
│   │   ├── split-text.js        # Split-word/split-letter stagger animation triggers
│   │   ├── intersection.js      # Viewport manager (pauses canvases off-screen for 60fps)
│   │   └── canvas/              # The 8 Hardware-Accelerated Canvas Engines:
│   │       ├── 01-hero-particles.js   # Background constellation with repulsion
│   │       ├── 02-terminator-hud.js   # X-Ray face & cybernetic eye tracker
│   │       ├── 03-blueprint-scan.js   # Luminance edge-detection scanline
│   │       ├── 04-vector-pen.js       # Parametric Bezier curve drafting pen
│   │       ├── 05-dot-ripple.js       # Contact grid radial magnetic wave
│   │       ├── 06-footer-assembler.js # Particle typography letterform assembler
│   │       ├── 07-process-nodes.js    # Interactive roadmap timeline indicators
│   │       └── 08-ambient-mesh.js     # Fluid mouse-driven blurred gradient mesh
│   └── assets/
│       ├── images/              # Hero portrait (WebP alpha), project screenshots
│       └── fonts/               # Geist, Geist Mono, Instrument Serif, Doto
```

---

## 3. The 8 Canvas Engines: Technical Specifications

Every canvas engine will follow the **Adaptive Performance Protocol**:
1. **Dynamic Device Pixel Ratio (DPR) Clamping:** High-DPI screens clamp canvas resolution at a max width of 2400px via `RS()`:
   $$\text{scale} = \min(2, \text{window.devicePixelRatio})$$
2. **Offscreen Buffer Caching:** Static elements (dot grids, letterform masks) are drawn once to a hidden `document.createElement('canvas')` and copied via `ctx.drawImage` rather than recalculated each frame.
3. **Viewport Pausing:** When an element is outside the viewport, its `requestAnimationFrame` loop suspends automatically via `IntersectionObserver`.

### Engine Breakdown:

1. **`#particles` (Hero Constellation):**
   * Computes particle distance to mouse:
     $$\text{dist} = \sqrt{(p_x - m_x)^2 + (p_y - m_y)^2}$$
   * Inverse-square spring repulsion when $\text{dist} < 140\text{px}$.
   * Connective lines drawn when particle-to-particle distance $< 65\text{px}$.
2. **`#tmCv` (Terminator / Cybernetic Eye HUD):**
   * Overlaid directly on the hero portrait with normalized eye points `[0.44, 0.392]` and `[0.5725, 0.392]`.
   * Digital reticle, heart-rate graph, lens flares, and chromatic aberration glitch triggered on portrait hover.
3. **`#bpCv` (Blueprint Edge-Detection Scanner):**
   * Samples hero WebP image luminance ($L = 0.299R + 0.587G + 0.114B$) into a `Float32Array`.
   * Vertically sweeps a laser scanline; renders CAD blueprint vector outlines above the scanline and full-color photo below it.
4. **`#abCv` (Vector Bezier Drafting Pen):**
   * Custom mathematical Bezier evaluator that traces cubic curves without SVG DOM overhead.
5. **`#cpDots` (Contact Dot Matrix Ripple):**
   * 22px pitch dot matrix with radial Gaussian intensity falloff under the pointer.
6. **`#ftName` (Typographic Dot-Matrix Assembler):**
   * Offscreen rasterization of the word "Hridoy" (or your custom name).
   * Spawns points at random coordinates that assemble into crisp typography on scroll.
7. **`.sn-ico` (Process Timeline Canvas Nodes):**
   * Dynamic canvas circles that calculate scroll progress to fill illuminated progress rings.
8. **`.atmo` / `#o1`, `#o2`, `#o3` (Ambient Atmosphere):**
   * Multi-stop colored orbs with CSS `mix-blend-mode: screen`, jittering grain overlay, and lerped cursor tracking.

---

## 4. Mouse Interactions & The Figma UI Simulator

### 4.1 Magnetic Cursor
* **Lerp Smoothness:**
  $$x_{\text{current}} = x_{\text{current}} + (x_{\text{target}} - x_{\text{current}}) \times 0.15$$
* **Adaptive States:**
  * Standard: 8px luminous dot.
  * Interactive Target: Snaps magnetically to the center of buttons/links with spring dampening.
  * Project Hover: Morphs into a floating pill with text `View Project ↗`.
  * Figma Canvas Hover: Converts into Figma's native selection pointer.

### 4.2 The Interactive Figma Canvas Replica
* **Multiplayer Cursors:** Simulated collaborator cursors drifting autonomously across the canvas with user labels.
* **Selection Transform Box:** 8-point bounding box with resize handles and rotation anchors.
* **Distance Dimension Guides:** Hovering any element renders red/blue spec overlays with exact pixel measurements (e.g., `16px`, `32px`), matching Figma's `Option + Hover` tool.

---

## 5. Implementation Roadmap & Execution Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Scaffolding & Setup (Vite + Lenis + Design Tokens)            │
│ PHASE 2: Semantic HTML Shell, Layout & Typography                      │
│ PHASE 3: Canvas Engines #1 & #2 (Hero Particles + Terminator HUD)      │
│ PHASE 4: Canvas Engine #3 (Blueprint Edge Scanner)                     │
│ PHASE 5: Interactive Figma UI Simulator & Cursor Physics              │
│ PHASE 6: Split-Text Reveals, Process Nodes & Footer Assembler          │
│ PHASE 7: Assets, Responsiveness & Final Polish                         │
└────────────────────────────────────────────────────────────────────────┘
```

* **Phase 1: Project Scaffolding:** Clean workspace, install Vite and Lenis, set up token variables and baseline resets.
* **Phase 2: Semantic HTML Structure:** Header nav capsule, Hero, About, Works, Services, Process, Contact, and Footer.
* **Phase 3: Hero Canvases:** Implement `#particles` and the `#tmCv` Cybernetic eye overlay.
* **Phase 4: Blueprint Scanner:** Implement the `#bpCv` luminance edge detection system.
* **Phase 5: Figma Workspace Simulator:** Build multiplayer cursors, drag selection, and smart measurement guides.
* **Phase 6: Canvases #4 through #7 + Motion:** Vector pen, contact ripple, and footer dot assembler.
* **Phase 7: Optimization & Polish:** Verify 60–120 FPS on mobile and desktop, refine asset compression, and verify Lighthouse score.

---
*Created and maintained inside `blueprint/planing.md` for project reference.*

