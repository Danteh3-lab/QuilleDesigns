---
version: alpha
omitted:
  - section: colors
    reason: Runtime CSS variables own the palette; the role mapping below records ownership.
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
The latest supplied reference replaces the dark editorial portfolio with a pale patterned page, framed panels, the shared homepage navigation, split hero, project ticker, asymmetric work grid, capabilities, studio manifesto, dark contact invitation and the shared homepage footer. Use Quille's navy and pale blue colors.

All ten real projects appear: three films and seven logo identities. Captions sit beneath complete artwork. Logo posters retain original pricing and contact text, use object-fit: contain and open the complete originals. Film posters come from actual films. Replace the reference's fictional metrics, clients, reviews and contact form with accurate collection counts, existing services, Quille's manifesto and working contact links. No invented outcomes or response-time promises.

## Colors
Model B: runtime CSS is canonical. Shared brand tokens remain in brandmark.css; scoped portfolio aliases remain in portfolio-gallery.css.

| Role | Runtime owner | Consumers |
| --- | --- | --- |
| Pale page | --gallery-bg / --brand-surface | Patterned page |
| Pale panel | --gallery-surface | Artwork, viewer |
| White | --gallery-white | Captions, buttons |
| Navy ink | --gallery-ink / --brand-ink | Text, CTA, buttons |
| Muted blue | --gallery-muted | Descriptions |
| Border | --gallery-line | Panels, cards |
| Accent | --gallery-accent | Serif emphasis, links, focus |
| Hover accent | --gallery-accent-hover | Interactive states |
| Soft accent | --gallery-accent-soft | Navigation, controls |
| Media navy | --gallery-media | Film stages |
| Glass | --gallery-glass | Framed surfaces |
| Scrollbar states | --scrollbar-thumb, --scrollbar-hover, --scrollbar-active, --scrollbar-track | Owned scroll regions |

Shared colors: pale blue #e6eff7 and navy #123555. Scoped colors: accent #245a86, panel #f8fbfd, muted #486883, line #c4d5e4, media #10233a. Variables live on html:has(.portfolio-gallery). Homepage light sections use the same pale surface and diagonal paper pattern as the portfolio. The homepage and portfolio share the header/footer styles and behavior in site-chrome.css and site-chrome.js.

## Typography
Inter Tight 300/400/500/600 owns --gallery-font-display and --gallery-font-body. Instrument Serif owns italic emphasis and manifesto text via --gallery-font-serif. JetBrains Mono owns utility labels via --gallery-font-mono. System/Georgia fallbacks preserve readability. Large headlines use tight tracking and responsive sizes. Site copy supports Dutch by default and English as an alternate; original artwork keeps its own language.

## Layout
A centered 1280px maximum shell contains framed panels with corner marks. The full-width homepage navigation sits above a split hero and four statistics. Work uses a 12-column grid with alternating 7/5 cards followed by six 4-column identities. Filtered categories use equal columns. Tablets use two columns; phones stack. All original identity posters stay fully visible and unoccluded.

The work collection leads directly into capabilities. Capabilities use two columns, followed by manifesto, three principles, navy contact and the full-width shared footer. Preserve natural scrolling, stable media geometry and anchor clearance.

## Elevation & Depth
Quiet blue borders, small panel corner marks and subtle card shadows follow the supplied design. Film stages extend the complete portrait frame with a blurred still. Native dialogs sit over a dark backdrop.

## Shapes
--gallery-radius owns 12px project/art corners; media dialog corners use 16px. Shared navigation controls keep the homepage's 4px corners. Main panels remain square. Pills serve filters/navigation; circular controls serve arrows, play and close.

## Iconography
Native SVG arrows, play triangles and close marks. Decorative glyphs are hidden from assistive technology; icon-only controls have names.

## Motion
Native CSS/IntersectionObserver handle entrances and reveals. A duplicated, assistive-technology-hidden project ticker moves slowly with a visible pause/resume control. Reduced motion shows one static wrapped list. No animation dependencies or scroll hijacking.

Films autoplay muted and inline when visible. Set muting in HTML and JavaScript before loading sources. Shared Pause previews pauses all films. Playback stops offscreen, in background tabs, with dialogs open, when filtered out and with reduced motion. Reduced motion shows posters without automatic video requests.

The separate homepage retains its existing process frame sequence and hero film.

## Components
Ten static project articles work without JavaScript through real media links. Filters use aria-pressed, hide individual cards and announce resulting counts. Hero/filter counts derive from markup.

Native modal dialogs contain focus, close with Escape, restore focus and release media on close. Selecting a film opens a native player with sound/controls after explicit interaction. Persistent source links remain available beside loading errors. Both pages use the same fullscreen native mobile dialog with focus restoration, Escape support and scroll suspension. Portfolio previews pause while this menu is open.

Preview sources lazy-load from R2 only when eligible. Failed autoplay retains posters and film links. Complete images open without cropping. Keep visible focus, sufficient contrast, stable dimensions and visible scrollbars. Contact uses Quille's email and homepage contact section; no placeholder social/legal links.

## Shared site chrome
Home, Services, Portfolio and Contact appear in the shared full-width header; the active page gets an underline. The Dutch/English language control appears in the fixed header and mobile dialog and persists across both pages. The footer follows the homepage's Studio, Services and Contact columns with its original large Quille logo. Both pages retain static semantic HTML, use the same shared stylesheet and script, and keep correct local or cross-page anchors. Omit unavailable social and legal destinations rather than keeping empty hash links. Homepage manifesto, services and results sections share the portfolio's --brand-surface and --brand-paper-pattern tokens.
