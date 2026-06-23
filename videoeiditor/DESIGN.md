---
name: CineFlow Video Editor
description: Sleek and high-fidelity client-side video editor designed for digital creators.
colors:
  primary: "#adc6ff"
  on-primary: "#002e6a"
  primary-container: "#4d8eff"
  on-primary-container: "#00285d"
  secondary: "#4edea3"
  on-secondary: "#003824"
  secondary-container: "#00a572"
  on-secondary-container: "#00311f"
  tertiary: "#ffb95f"
  on-tertiary: "#472a00"
  neutral-bg: "#131313"
  surface-lowest: "#0e0e0e"
  surface-low: "#1c1b1b"
  surface: "#201f1f"
  surface-high: "#2a2a2a"
  surface-highest: "#353534"
  outline: "#8c909f"
  outline-variant: "#424754"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "24px"
  toolbar: "48px"
  track: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  bento-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: CineFlow Video Editor

## 1. Overview

**Creative North Star: "The Neon Cutting Room"**

CineFlow utilizes a dark, high-contrast user interface tailored for creative digital output. The interface maximizes visibility and reduces eye strain in dark environments where editors spend most of their time. It combines deep backgrounds with vibrant primary (neon blue), secondary (mint green), and tertiary (orange gold) accents.

The layout employs structural grids (Bento Grid cards) to separate core functional zones—the library, the player, the properties controller, and the multi-track timeline.

### Key Characteristics:
- Low-lit workspaces using deep grey and black shades (surface-lowest to surface-highest)
- Vivid functional indicators (primary highlight for selections, secondary for audio nodes, tertiary for media elements)
- Micro-interactions (hover scale transforms, neon outlines, and drag/drop feedbacks)

## 2. Colors

Deep cinematic backgrounds with high-contrast functional accent rules.

### Primary
- **Neon Blue** (#adc6ff): Accent color for selections, timelines, and primary buttons.
- **Deep Blue** (#002e6a): Text and icon color on top of Neon Blue buttons.

### Secondary
- **Mint Green** (#4edea3): Accent color for audio clips, playback wave markers, and render flags.
- **Deep Green** (#003824): Label indicators on top of Mint Green.

### Tertiary
- **Gold Orange** (#ffb95f): Accent color for visual fx, overlays, and warnings.

### Neutral
- **Midnight Black** (#131313): Base body and canvas background.
- **Subway Dark** (#0e0e0e): Lowest container background, used for monitors and canvas frames.
- **Steel Grey** (#8c909f): Outline color for structural panel borders.

### Named Rules
**The Accent-Dose Rule.** Accent colors (primary/secondary/tertiary) should not exceed 15% of the total workspace screen area, ensuring they draw focus immediately without causing visual fatigue.

## 3. Typography

**Display Font:** Inter, sans-serif
**Body Font:** Inter, sans-serif
**Label/Mono Font:** JetBrains Mono, monospace

### Hierarchy
- **Display** (Bold, clamp(2rem, 5vw, 3.5rem), 1.1): Used for large hero text and dashboard greetings.
- **Headline** (Semi-bold, 1.5rem, 1.2): Used for sections and modal headers.
- **Title** (Medium, 1.125rem, 1.3): Used for subheadings and card titles.
- **Body** (Regular, 0.875rem, 1.5): Used for general reading, text areas, and descriptive copy.
- **Label** (Medium, 0.75rem, 1.4): Used for timecodes, statistical numbers, metadata tags, and caps.

## 4. Elevation

The system is flat-by-default to preserve space and speed up screen updates. Visual hierarchy and depth are conveyed using layered surfaces (shades of dark grey) and thin, precise outlines, rather than heavy blurred shadows.

### Depth Palette
- **Resting Canvas**: midnight black background (#131313)
- **Panel Containers**: Subway Dark (#0e0e0e)
- **Interactive Cards**: Bento Surface (#201f1f) with fine `#333333` borders.

## 5. Components

### Buttons
- **Shape:** Rounded corners (8px)
- **Primary:** Background Neon Blue, Text Deep Blue, padding (8px 16px)
- **Secondary:** Background Mint Green, Text Deep Green, padding (8px 16px)

### Bento Cards
- **Corner Style:** Rounded (12px)
- **Background:** Bento Surface (#201f1f)
- **Border:** 1px solid #333333, transitions to Neon Blue on hover.

### Timeline Clips
- **Shape:** Soft rounded corners (4px)
- **Hover:** Increases brightness by 10% and triggers visual outline shifts.

## 6. Do's and Don'ts

### Do:
- **Do** align all text elements to panels with dynamic contrast ratio checks.
- **Do** use JetBrains Mono for timecodes and coordinate values.
- **Do** support responsive layouts down to tablet screens.

### Don't:
- **Don't** use standard box-shadow blur effects on panels. Use clean, solid 1px border dividers instead.
- **Don't** use bright gradients as text backgrounds (use solid white/neon text for readability).
- **Don't** round input field corners more than 8px.
