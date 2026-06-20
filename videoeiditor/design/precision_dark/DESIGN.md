---
name: Precision Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  toolbar-height: 48px
  panel-padding: 12px
  gutter: 1px
  timeline-track-height: 32px
---

## Brand & Style

The design system is engineered for high-performance creative workflows, specifically tailored for professional video editing and post-production. The brand personality is **utilitarian, precise, and unobtrusive**, ensuring that the user's content remains the primary focus. 

The aesthetic blends **Modern SaaS minimalism** with the **dense functionality of high-end Pro Tools**. It employs a "Content-First" philosophy where the interface recedes through the use of deep charcoal tones, while critical interactions are highlighted with a surgical application of electric blue. The emotional response should be one of control, reliability, and technical mastery. High-contrast labels and hairline borders ensure that even the most complex multi-track timelines remain legible and navigable during long editing sessions.

## Colors

The palette is optimized for low-light environments typical of editing suites. 

- **Primary (#3B82F6):** Used exclusively for the playhead, active tool states, and primary action buttons. It provides a "vibrant signal" against the dark canvas.
- **Secondary (#10B981):** Reserved for "Success" states, rendering completion, and audio level peaks in the safe zone.
- **Tertiary (#F59E0B):** Used for warnings, proxy indicators, and clip markers that require user attention.
- **Neutral/Backgrounds:** 
    - `#121212` (Surface Base): The primary background for the entire application.
    - `#1E1E1E` (Surface Elevation): Used for panels, toolbars, and the timeline track area to provide subtle depth.
    - `#333333` (Border): The universal hairline stroke for defining panel boundaries and input fields.

## Typography

This design system prioritizes high information density. **Inter** is the workhorse for all UI labels and body text due to its exceptional legibility at small sizes and "tall" x-height. 

For timecodes, frame counts, and numerical metadata, **JetBrains Mono** is utilized to ensure that characters do not shift horizontally as values change (tabular figures), which is critical for precision timing. Text colors should follow a strict hierarchy: `White (High Emphasis)`, `Grey 400 (Medium Emphasis)`, and `Grey 600 (Disabled/Hint)`.

## Layout & Spacing

The layout follows a **Fixed-Flexible Hybrid Grid**. Sidebars (Asset Library, Properties) and Toolbars occupy fixed widths, while the Timeline and Preview Monitor occupy flexible, fluid regions.

- **The 4px Rule:** All margins, paddings, and component heights must be multiples of 4px to maintain a rigid, professional structure.
- **Gaps:** Use 1px borders (`#333333`) as separators between major workspace modules rather than large whitespace gaps to maximize screen real estate.
- **Density:** This is a high-density system. Use `12px` for standard panel padding and `8px` for internal component grouping.
- **Responsiveness:** On smaller screens, the Properties panel should collapse into a drawer or tab to keep the Timeline and Preview areas visible.

## Elevation & Depth

In a professional dark UI, depth is communicated through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Level 0 (#121212):** The global canvas background.
- **Level 1 (#1E1E1E):** Main functional panels (Timeline, Inspector, Project Bin).
- **Level 2 (#2A2A2A):** Popovers, context menus, and active modal overlays.
- **Borders:** Every panel transition must be marked by a 1px solid border of `#333333`. 
- **Shadows:** Use a single, sharp "Macro Shadow" for floating menus: `0px 4px 12px rgba(0, 0, 0, 0.5)`. Avoid shadows on standard UI buttons or cards to maintain a flat, technical aesthetic.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness profile to maintain a modern feel without appearing "consumer-grade" or overly soft.

- **Small Components:** Checkboxes, input fields, and small tool buttons use a `2px` radius.
- **Standard Components:** Cards and major buttons use a `4px` radius.
- **Exceptions:** The Playhead handle and certain timeline markers may use sharp bottoms (0px) to indicate exact frame alignment.

## Components

### Buttons & Tools
- **Action Buttons:** Solid `#3B82F6` with white text for primary actions. 
- **Toolbox Icons:** Ghost-style buttons (no background) that gain a subtle grey highlight on hover and the Primary Blue background when active.

### The Timeline
- **Tracks:** Dark grey (#1E1E1E) with 1px separators. 
- **Clips:** Solid color blocks with 1px rounded corners. Audio clips use a waveform visualization in a desaturated version of the clip color.
- **Playhead:** A 1px wide `#3B82F6` vertical line with a geometric handle at the top containing the current timecode.

### Input Fields & Properties
- **Property Inputs:** Inline labels (left-aligned) with values (right-aligned). Values should be editable via "scrubbable" mouse drag interactions, highlighted in Blue on hover.
- **Dark Mode Inputs:** Backgrounds should be `#121212` with a `#333333` border. Focus state is a 1px `#3B82F6` ring.

### Lists & Trees
- Used for the Project Bin. Selected items use a subtle blue tint (10% opacity) and a 2px left-accent bar in Primary Blue.

### Progress Bars
- Render bars use a thin 4px height. The background is `#333333` and the fill is `#10B981` (Secondary) to indicate a positive background process.