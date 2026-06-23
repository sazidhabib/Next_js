# Product

## Register

product

## Users
Social media content creators, vloggers, and digital marketers editing short-form videos (TikToks, Instagram Reels, YouTube Shorts, YouTube Intros). They need speed, intuitive clip manipulation, quick templates, subtitles, overlays, and transitions, all working fast in the browser.

## Product Purpose
Provide a high-fidelity web-based video editor that actually functions on the client side: managing multiple projects, adding media assets, dragging/moving/trimming clips on a multi-track timeline (text V3, effects/overlays V2, video V1, audio dialog A1, audio music A2), synchronizing playback of unmuted video and audio layers, applying CSS-based VFX filters (glitch, vintage, green grades), generating captions/subtitles using web-based speech or timed sequences, and rendering/exporting projects with state persisted in `localStorage`.

## Brand Personality
- Sleek & Professional
- Dark & Cinematic (Neon accents)
- High-efficiency & Fast

## Anti-references
- Heavy, bloated third-party state libraries (avoid introducing Redux, Zustand, or large audio libraries).
- Non-functional mockups (mocked buttons that do nothing, empty states that can't be resolved, projects that don't load/save).
- Static timeline components (timeline where elements can't be edited, trimmed, or resized).

## Design Principles
- **Direct Manipulation**: Allow direct horizontal dragging and resizing of timeline elements to trim or move clips.
- **Immediate Feedback**: The preview monitor should play, scrub, sync audio and video, and apply active filters instantly without delay.
- **Zero Loss Persistence**: All user changes (projects, timelines, clip adjustments, exports) must automatically save to the browser's storage and load seamlessly.

## Accessibility & Inclusion
- Respect user motion preferences (`prefers-reduced-motion: reduce`) for animations.
- Legible text with high contrast (>4.5:1) in the dark-themed editor panels.
- Keyboard shortcuts for play/pause, zooming, and seeking.
