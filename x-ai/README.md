# Xai — Intelligence Workspace

An interactive, high-fidelity product experience prototype for **Xai**, designed to demonstrate UI/UX clarity, precise design-to-code execution, advanced motion choreography, and engineering discipline. 

This prototype visually and interactively communicates how Xai ingests raw, unstructured data sources, structures them using transformer-based AI extraction pipelines, and delivers actionable, decision-grade intelligence.

---

## 🚀 Live Demo & Documentation
- **Live Deployment:** [Deploy on Vercel] *(Insert your Vercel/Netlify URL here)*
- **Figma Design File:** [Figma Design Link] *(Insert your public Figma link here)*
- **Interactive Video Walkthrough:** [Google Drive/YouTube Link] *(Insert your video walkthrough link here)*

---

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (Sleek dark zinc color palette, monospace telemetry overlays)
- **Animation Orchestration:** Framer Motion (version 12)
- **Scroll Timelines:** GSAP & ScrollTrigger
- **3D & Canvas Interactions:** Three.js, React Three Fiber (R3F), `@react-three/drei`
- **Charts:** Recharts
- **Typographic System:** `Inter` (UI) and `JetBrains Mono` (Data Telemetry) via Google Fonts

---

## 📦 Directory Structure & Component Architecture

To maintain high engineering discipline, the initial monolithic layout has been decomposed into a modular, reusable component hierarchy:

```
app/
├── page.tsx                    # Slim orchestrator (imports + renders sections)
├── layout.tsx                  # SEO Metadata, Google Fonts integration, smooth scroll
├── globals.css                 # Custom scrollbars, Webkit selectors, Tailwind imports
│
components/
├── layout/
│   ├── Navbar.tsx              # Sticky navigation with scroll-aware backdrop blur
│   └── Footer.tsx              # Global footer with site navigation elements
│
├── sections/
│   ├── HeroSection.tsx         # Responsive Hero with WebGL container
│   ├── PipelineSection.tsx     # 3-stage GSAP Insight Flow
│   ├── DashboardSection.tsx    # Mock product interface with Framer Motion transitions
│   └── SignatureSection.tsx    # WOW Moment: 3D interactive wireframe mesh
│
├── three/
│   ├── SceneWrapper.tsx        # Dynamic Canvas wrapper with SSR compatibility fallback
│   ├── ParticleCloud.tsx       # R3F particle morphing cloud
│   └── DataMesh.tsx            # R3F signature geometric wireframe mesh
│
├── animation/
│   ├── ScrollReveal.tsx        # Reusable Framer Motion viewport reveal component
│   └── AnimatedCounter.tsx     # Smooth spring-based numerical counting utility
│
└── icons/
    └── index.tsx               # Consolidated SVG icon primitives
```

---

## ⚡ Key Animation & Interaction Decisions

### 1. Hero: Raw Data → Structured Intelligence (Three.js & R3F)
- **The Concept:** Visually represent the core narrative: turning chaotic raw data into highly organized structure.
- **Implementation:** 4,000 points are spawned with random spherical coordinates. As the user scrolls down, we interpolate (`lerp`) their positions to a perfectly structured 3D grid layout (`GRID_SIZE = 18`). 
- **Idle Motion:** Simplex-style float waves keep the point cloud dynamic on wait states.
- **Interactivity:** Damped mouse coordinates rotate the camera target slightly, creating immediate spatial depth.

### 2. Interactive Insight Flow (GSAP & ScrollTrigger)
- **The Concept:** Walk decision-makers step-by-step through ingestion, analysis, and generation.
- **Implementation:** Integrated GSAP ScrollTrigger on individual stage cards. Each card triggers a timeline sequence: sliding card container up, drawing SVG connection lines (`stroke-dashoffset` animation), and scaling intersection nodes using custom `back.out(2)` easing.

### 3. Intelligence Dashboard Preview (Framer Motion)
- **The Concept:** A dark, minimal, product-first dashboard mockup that feels "alive" but professional.
- **Implementation:** 
  - Staggered entrances for metrics, sidebar nav items, and data tables.
  - Smooth custom transitions using layout changes.
  - Active navigation state transitions managed via `<AnimatePresence mode="wait">` to avoid sudden layout pops.

### 4. Signature Interaction: R3F Geometry Morph (The WOW Moment)
- **The Concept:** Demonstrate deep mathematical understanding and high interaction craft.
- **Implementation:** A wireframe points mesh consisting of 200 vertices and edge lines that dynamically morphs between `Icosahedron` (raw ingestion states) → `Torus` (deep model processing) → `Sphere` (unified output data) depending on scroll progress.

---

## ⚙️ Local Development Setup

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd x-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is used to prevent peer conflicts between newer React 19 packages and custom component configurations).*

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build the production release:**
   ```bash
   npm run build
   npm run start
   ```
