---
version: alpha
omitted:
  - section: colors
    reason: Runtime CSS custom properties own the palette; the mapping below documents ownership without duplicating token values.
  - section: typography
    reason: Runtime font variables own typography.
  - section: rounded
    reason: Runtime radius variable owns shape.
  - section: spacing
    reason: Responsive component layout is authored in the portfolio stylesheet.
  - section: components
    reason: Semantic HTML and scoped CSS are the component source of truth.
---

# Quille Designs — Portfolio

## Overview
Brand portfolio for prospective design and video clients. The approved direction is cinematic dark: a generous featured film, complete original logo posters, quiet captions, and a clear route to contact. The homepage’s four-step process uses the Mage EV film as a full-section, scroll-scrubbed frame sequence behind the process copy.

Show seven complete logo posters and three films from the supplied assets. Video thumbnails are genuine frames from their source films with a restrained title and dark gradient for legibility. The featured frame remains fully visible over a softly blurred extension of itself. Preserve promotional pricing and contact text inside the original images. Never crop posters, invent project outcomes, add stock projects, or imply that a media viewer is a case study.

## Colors
Runtime ownership follows Model B: `portfolio-gallery.css` is canonical; this document records intent and maps roles to its variables. No generated theme or separate Tailwind configuration.

| Role | Runtime owner | Consumers |
| --- | --- | --- |
| Deep navy page | `--gallery-bg` | Page, video stage, viewer backdrop surfaces |
| Raised navy | `--gallery-surface` | Featured film, media viewer |
| Soft white | `--gallery-ink` | Headings, active controls |
| Muted text | `--gallery-muted` | Descriptions, captions |
| Blue accent | `--gallery-accent` | Display text, links, focus rings |
| Subtle border | `--gallery-line` | Dividers, controls, viewer |
| Scrollbar states | `--scrollbar-thumb`, `--scrollbar-hover`, `--scrollbar-active`, `--scrollbar-track` | All owned scroll regions |

Variables live on `html:has(.portfolio-gallery)` and flow directly into scoped component CSS. The pale navigation/footer use existing `brandmark.css` tokens. Never edit those shared tokens to change this page alone.

## Typography
`--gallery-font-display`: Syne for oversized selected-work heading and project titles. `--gallery-font-body`: Plus Jakarta Sans for readable copy and controls. Both are explicitly loaded via Google Fonts with system fallbacks. Use responsive CSS sizes and reserved image geometry. Copy stays English; original artwork retains its own language.

## Layout
Maximum content width 1400px. Spacious two-line introduction, filter strip, full-width featured film, two secondary films, logo gallery, contact invitation. Logos use three columns from 1200px, two below 1200px, one at 600px and below. Films stack on phones. Logo posters retain square intrinsic geometry and `object-fit: contain`; the video stills retain their authentic imagery and portrait composition.

## Elevation
No decorative floating cards. Media has quiet borders and hover outlines. The featured video uses its full portrait still over a subtly blurred copy of the same frame. Native modal dialogs occupy the top layer over a dark blurred backdrop.

## Shapes
`--gallery-radius` owns the small rectangular corners. Round play and close controls are semantic exceptions. Avoid decorative pill collections and heavy gradients.

## Iconography
Simple arrows, play triangles, and close marks. Decorative glyphs are hidden from assistive technology. Icon-only controls have explicit accessible names.

## Motion
Short hover transitions, a calm heading entrance, small scroll reveals, and a slow blue ambient light give the page movement without distracting from the artwork. In the homepage process section, a lazily loaded 193-frame JPEG sequence is drawn to a full-bleed canvas and follows scroll through all four steps, matching the Phase 5 frame-sequence approach. Reduced-motion users see a still frame. The source MP4 is not used as a page background, so the browser never seeks through the large video file. No autoplay on page load, custom cursor, or scroll hijacking. Portfolio reveals and ambient light stay inactive when reduced motion is requested.

## Components
Native links lead to the source media without JavaScript. The enhanced viewer uses a native modal dialog, closes with Escape, restores focus, and tears down video playback on close. YouTube embeds are created only after a film is selected, and are removed when the viewer closes. The persistent YouTube link is available if playback is blocked. The mobile menu uses the same modal semantics. Filters use buttons and `aria-pressed`, hide whole category sections, and announce the resulting count.

All ten projects are static HTML. Counts derive from that markup. Video players are created only after an explicit selection; no video iframe, element, or preload request is present on initial load. Original image links and YouTube controls provide inspection paths. Errors appear inside the viewer beside a persistent source link.

Use keyboard-visible focus, sufficient contrast, stable dimensions, and visible scrollbars. Content remains readable if scripts or remote fonts fail. No placeholder social/legal links or unsupported performance claims.

