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
Brand portfolio for prospective design and video clients. The user-approved portfolio reference is an editorial studio page: a large three-line “Work that moves the needle.” hero, rounded project cards in an offset grid, an identity archive, a centered studio statement, and an oversized “LET’S TALK” footer. Adapt that composition to Quille's navy, blue, and pale brand surfaces. The homepage’s four-step process uses the Mage EV film as a full-section, scroll-scrubbed frame sequence behind the process copy.

Show three films, a featured Yuchel Solutions identity, and the six remaining identities in an archive with complete poster thumbnails. Each logo opens its full original poster. Video thumbnails are genuine frames from their source films with a restrained title and dark gradient for legibility. The featured frame remains fully visible over a softly blurred extension of itself. Preserve promotional pricing and contact text inside the original images. Use the reference's structure with actual Quille content; its fictional clients, years, testimonials, and stock images are not portfolio evidence. Never crop posters, invent project outcomes, or imply that a media viewer is a case study.

## Colors
Runtime ownership follows Model B: `portfolio-gallery.css` is canonical; this document records intent and maps roles to its variables. No generated theme or separate Tailwind configuration.

| Role | Runtime owner | Consumers |
| --- | --- | --- |
| Deep navy page | `--gallery-bg` | Page, video stage, viewer backdrop surfaces |
| Raised navy | `--gallery-surface` | Work section, media viewer |
| Media navy | `--gallery-stage` | Film card backgrounds |
| Soft white | `--gallery-ink` | Headings, active controls |
| Muted text | `--gallery-muted` | Descriptions, captions |
| Blue accent | `--gallery-accent` | Display text, links, focus rings |
| Strong blue | `--gallery-accent-strong` | Navigation underline, light-surface CTA hover |
| Glass surface | `--gallery-glass` | Identity artwork panel |
| Subtle border | `--gallery-line` | Dividers, controls, viewer |
| Scrollbar states | `--scrollbar-thumb`, `--scrollbar-hover`, `--scrollbar-active`, `--scrollbar-track` | All owned scroll regions |

Variables live on `html:has(.portfolio-gallery)` and flow directly into scoped component CSS. Palette: near-black navy #00050d, raised navy #0c1927, media navy #10233a, soft white #f3f7fa, blue #7fb2e0, and strong blue #2e6da4. The pale navigation/footer consume existing `brandmark.css` tokens: `--brand-surface` and `--brand-ink`. Never edit those shared tokens to change this page alone.

## Typography
`--gallery-font-display` and `--gallery-font-body`: Inter with system fallbacks, explicitly loaded at 300/400/500/600 weights. The reference's neutral geometric sans is preserved on the portfolio: large medium-weight masked headlines, lighter descriptions, restrained uppercase utility text. The homepage retains its existing Syne/Plus Jakarta Sans typography. Use responsive CSS sizes and reserved media geometry. Copy stays English; original artwork retains its own language.

## Layout
Maximum portfolio content width 1280px. Fixed pale navigation, viewport-height three-line introduction, a rounded raised work section, filter strip, wide featured film, two square secondary films with a 48px desktop offset, wide featured identity, and six archive rows. At 600px and below films stack as 4:5 cards, the identity stacks above its copy, and archive metadata moves beneath project names. Logo posters use `object-fit: contain`. Follow with a centered studio statement and the reference's oversized contact invitation inside the pale footer. Preserve natural document scrolling and stable image geometry.

## Elevation & Depth
The supplied reference authorizes rounded editorial cards, a subtle glass treatment, and a shadow at the work-section boundary. Use quiet blue borders, two restrained navy/blue background glows, and dark card gradients to keep film titles readable. The featured video uses its full portrait frame over a softly blurred still. Native modal dialogs occupy the top layer over a dark blurred backdrop.

## Shapes
`--gallery-radius` owns the 24px editorial card corners; `--gallery-section-radius` owns the 40px work/footer section corners. Phones use 20px cards and 28px section corners. Pills are reserved for navigation/filter controls; circular scroll, play, and close controls follow the reference.

## Iconography
Simple arrows, play triangles, and close marks. Decorative glyphs are hidden from assistive technology. Icon-only controls have explicit accessible names.

## Motion
Masked headline entrances, small scroll reveals, and slow card hover transitions reproduce the reference's motion with native CSS and IntersectionObserver. No extra animation dependencies, custom cursor, or scroll hijacking. In the homepage process section, a lazily loaded 193-frame JPEG sequence is drawn to a full-bleed canvas and follows scroll through all four steps, matching the Phase 5 frame-sequence approach. Reduced-motion users see a still frame. The process sequence never seeks through the original Mage EV MP4. The homepage hero film is served from R2. Portfolio films autoplay as muted, looping inline previews when their cards enter view. Pause previews provides a shared motion control. Previews pause offscreen, in background tabs, while a dialog is open, and when filtered out; reduced-motion users see the original stills without automatic video requests. Portfolio entrance/reveal/hover motion stays inactive when reduced motion is requested.

## Components
Native links lead to the source media without JavaScript. The enhanced viewer uses a native modal dialog, closes with Escape, restores focus, and stops/removes video playback on close. R2-hosted MP4s open in a native player with controls only after a film is selected; a direct video link remains available if inline playback fails. The mobile menu uses the same modal semantics. Filters use buttons and `aria-pressed`, hide whole category sections, and announce the resulting count.

All ten projects are static HTML. Counts derive from that markup. Preview video elements retain poster images and receive their R2 sources only when visible and motion is enabled. Muting is established in both markup and JavaScript before the source is assigned. If autoplay or loading fails, the still and Watch film link remain usable. Original image links and native video controls provide inspection paths. Errors appear inside the viewer beside a persistent source link. The four MP4 masters stay in the repository, while `.assetsignore` excludes them from Cloudflare Worker static uploads. They are served from the provided R2 development URL during testing; replace that host with the bucket's production custom domain when it is connected.

Use keyboard-visible focus, sufficient contrast, stable dimensions, and visible scrollbars. Content remains readable if scripts or remote fonts fail. No placeholder social/legal links or unsupported performance claims.
