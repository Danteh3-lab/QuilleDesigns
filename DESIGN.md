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
The latest supplied reference replaces the dark editorial portfolio with a pale patterned page, framed panels, the shared homepage navigation, split hero, project ticker, format-aware project galleries, capabilities, studio manifesto, dark contact invitation and the shared homepage footer. Use Quille's navy and pale blue colors.

All twelve real projects appear: five films and seven logo identities. Captions sit beneath complete artwork. Logo posters retain original pricing and contact text, use object-fit: contain and open the complete originals. Film posters use stills from the films. Replace the reference's fictional metrics, clients, reviews and contact form with accurate collection counts, existing services, Quille's manifesto and working contact links. No invented outcomes or response-time promises.

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
A centered 1280px maximum shell contains framed panels with corner marks. The full-width homepage navigation sits above a split hero and four statistics. The portfolio separates films from brand identities: landscape films use two columns, portrait films use three columns, and square logo posters use three columns. Every gallery centres incomplete final rows for any CMS project count without enlarging the leftover cards or changing the saved order. Portrait films use two columns below 1024px and one below 521px; landscape films use one and identities two below 761px. Empty film-format galleries take no space. The shared gallery rule owns the 16px gap and responsive card widths in portfolio-gallery.css. Each media frame follows its source format, while all original identity posters stay fully visible and unoccluded.

The work collection leads directly into capabilities. Capabilities use two columns, followed by manifesto, three principles, navy contact and the full-width shared footer. Preserve natural scrolling, stable media geometry and anchor clearance.

## Elevation & Depth
Quiet blue borders, small panel corner marks and subtle card shadows follow the supplied design. Film stages extend the complete portrait frame with a blurred still. Native dialogs sit over a dark backdrop.

## Shapes
--gallery-radius owns 12px project/art corners; media dialog corners use 16px. Shared navigation controls keep the homepage's 4px corners. Main panels remain square. Pills serve filters/navigation; circular controls serve arrows, play and close.

## Iconography
Native SVG arrows, play triangles and close marks. Decorative glyphs are hidden from assistive technology; icon-only controls have names.

## Motion
Native CSS/IntersectionObserver handle entrances and reveals. A duplicated, assistive-technology-hidden project ticker moves slowly with a visible pause/resume control. Reduced motion shows one static wrapped list. No animation dependencies or scroll hijacking.

Portfolio films autoplay muted and inline when visible, including Smartwigi and Terzol. The two homepage cards stay on their normal thumbnails until visitors choose to play them. Set muting in HTML and JavaScript before loading preview sources. Shared Pause previews pauses eligible films. Playback stops offscreen, in background tabs, with dialogs open, when filtered out and with reduced motion. Reduced motion shows posters without automatic video requests.

The homepage “About us” section (#process) no longer scrubs the Mage EV film frames (client choice, 2026-10-11): about-threads.js renders React Bits “Threads” in Quille blues (#4a86bd lines, #7fb2e0 accent) behind the story and the four steps. The lines follow the steps as you scroll: loose, wide and soft at Discover, then flatter, tighter and brighter until they run as one bright bundle at Deliver; the cursor gently parts them. A dark veil on the left keeps the story readable (an even veil below 1024px). It mounts only near the section, runs as plain WebGL2 without React, pauses offscreen, follows reduced motion and falls back to a still navy glow. The frame files in assets/process/mage-ev-sequence are no longer referenced. The homepage hero no longer plays a film (client request, 2026-10-11): hero-background.js renders the React Bits landing-page look (client choice, variant B in “Quille-blauw”): a flowing light band in accent #4a86bd that rises from the bottom (the reactbits.dev “HeroBand”, a ColorBends variant, with their Nebula settings; screen-blended on ink #00050d, 150% tall, fading out towards the top) and the mouse-reactive React Bits “Dot Grid” above it (client asked to keep it: dots #2a4a68 every 22 px, lighting to #d6e9fa near the cursor; a click sends a small shock wave). A soft overlay darkens the top edge and fades the bottom into the next section. Both run as plain WebGL without React or three.js (the band ported from three.js), pause offscreen, follow reduced motion, and fall back to a still navy gradient without WebGL2. Source and licence notice live in the bundle header (MIT + Commons Clause, David Haz).

## Portfolio CMS

The private administration surface uses the same pale paper, navy ink, Inter Tight text, mono labels and framed panels. Existing runtime CSS remains canonical: brandmark.css → portfolio-gallery.css aliases → admin/admin.css consumers. The gallery token selector also applies to html:has(.cms-admin); public selectors and styles retain their existing scope. Admin-only danger/error colors are #a12c39 and hover #852231; they never replace brand colors on the public pages.

The admin header reuses the homepage's original `assets/branding/quille-designs.png` image and `site-brandmark` component from brandmark.css, including its reserved dimensions and mobile sizing. The logo links to the admin landing page and has the accessible brand name; do not replace it with a typed wordmark.

The homepage, portfolio and admin share the existing QD browser-tab icon at `assets/branding/favicon.png`; admin uses the root-relative URL so it resolves from nested admin routes.

Public portfolio cards, counts and ticker now render from published D1 projects into the original HTML shell. Landscape films, portrait films and contained logo artwork keep their existing layouts and preview behavior. The two homepage featured cards select published videos while retaining their existing card geometry and click-to-play interaction. Hero film, process sequence, services, navigation and footer behavior remain unchanged.

Admin uses natural document scrolling, 44px controls, a paginated project list, an accessible editor, native selects, a native confirmation dialog and one shared status/error system. New media receives explicit aspect dimensions. Error, offline and expired-session states preserve safe entered content. UX-CONTRACT.md records canonical ownership, publication and deletion rules. The original files are retained in .cms-backup locally and excluded from the public bundle.

Video uploads create a JPEG cover from a frame near the start only when poster/artwork is empty. The artwork section also offers “Use video thumbnail” for an existing uploaded video and permits a deliberate replacement. Generated covers reuse the ordinary validated upload flow, preview, dimensions and status system. Keep custom artwork intact during automatic generation; a decode or cover-upload failure retains the completed video and offers retry or manual artwork.

## Components
Twelve static project articles work without JavaScript through real media links. Filters use aria-pressed, hide individual cards and announce resulting counts. Hero/filter counts derive from markup.

Native modal dialogs contain focus, close with Escape, restore focus and release media on close. Selecting a film opens a native player with sound/controls after explicit interaction. Persistent source links remain available beside loading errors. Both pages use the same fullscreen native mobile dialog with focus restoration, Escape support and scroll suspension. Portfolio previews pause while this menu is open.

Preview sources lazy-load from R2 only when eligible. Failed autoplay retains posters and film links. Complete images open without cropping. Keep visible focus, sufficient contrast, stable dimensions and visible scrollbars. Contact uses Quille's email and the separate contact page (contact.html); no placeholder social/legal links.

## Shared site chrome
The homepage's service overview uses the section label “Our expertise” / “Onze expertise”. The “Services” / “Diensten” navigation label opens the separate services page. Preserve the services anchor. The overview follows the client's 2026-10-11 reference style, adapted to Quille's own four homepage services: a large Montserrat “Our expertise” heading with an underlined “All services” link to services.html, then white 24px-radius cards for Promo production, Posters, Logos & business cards and Social media on the pale patterned surface. Each card has a black artwork panel with a soft blue top glow showing real Quille material on a 392 × 314 canvas: the Smartwigi commercial still in an editor screen with timeline, three original logo posters fanned out, seven client logos cropped from the original posters as round marks, and the Mage EV reel still in a phone with the Baby still as a small avatar. Optimised derivatives live in assets/expertise; the originals stay unchanged. Below the art: number, Montserrat title, existing service copy and pill tags. The title link stretches over the whole card and opens the matching services-page anchor. Four columns from 1200px, two by two from 640px, stacked below. Hover lifts the card 4px and gently moves the artwork; reduced motion removes it. services.css owns these styles.

Home, Services, Portfolio and Contact appear in the shared full-width header; the active page gets an underline. The Dutch/English language control appears in the fixed header and mobile dialog and persists across both pages. The footer follows the homepage's Studio, Services and Contact columns with its original large Quille logo. Both pages retain static semantic HTML, use the same shared stylesheet and script, and keep correct local or cross-page anchors. Omit unavailable social and legal destinations rather than keeping empty hash links. Homepage manifesto, services and results sections share the portfolio's --brand-surface and --brand-paper-pattern tokens.

## Services page
The supplied reference owns the services composition: short introduction, five static cards and a contact invitation. The deployed services page follows the homepage's dark/light rhythm: full-width dark intro, pale patterned services band, full-width dark contact band and existing light footer. The page has no additional hero video, process, reviews, portfolio gallery or contact form. A broad dark promo card uses the existing Smartwigi still; posters, logos, business cards and social media occupy the pale cards. Do not invent delivery dates, availability, business capabilities or example client work. Copy follows the existing public service descriptions, and the contact link opens index.html#contact.

brandmark.css remains canonical for the pale background, paper pattern, navy ink and shared borders. services-page.css owns scoped --services-* aliases: ink #00050d, blue #245a86, muted #586775, line #d7e0e7 and translucent white cards. Montserrat display and Jost body fonts follow the supplied reference and homepage; 4px card corners, 16px gaps, quiet hover elevation and native decorative SVG icons preserve the composition. Keep readable contrast over the film still, explicit image dimensions, visible focus and visible scrollbars. Reduced motion removes hover movement and transitions.

The services dark/light design uses --services-dark-text #fff, --services-dark-accent #7fb2e0, --services-dark-muted #b1beca and --services-dark-line #314353, matching the existing homepage showcase palette. Dark section labels and heading emphasis use the light blue accent; the contact heading follows the intro's white/light-blue split. The white contact button uses canonical --brand-ink navy for its label and icon. Full-width bands remain in normal block flow; inner content keeps the 1400px maximum and 40px desktop / 24px mobile gutters. Animate only the inner intro/contact content so the dark band backgrounds never move or fade. Header/footer styles and the five-card grid remain canonical and unchanged. The prior light version is preserved in .cms-backup/services-light-before-dark-preview-2026-10-05.

The desktop grid has three columns with the video spanning two; tablet has two columns with the video spanning both; below 768px all cards form one column. Natural document scrolling keeps all content reachable. services.html serves at /services and /services.html, with /services/ redirecting to /services.html. All three public pages share site-chrome.js and language.js; explicit data-site-page marks Services active. Without JavaScript, keep the service navigation visible and the header in document flow. Service footer links target each card's stable anchor on the separate page, while the historic homepage #services anchor continues to work.

services-page.js adds a once-per-visit scroll reveal to the introduction, five cards and contact invitation using native IntersectionObserver and Web Animations. Match the portfolio's 24px rise, 0.12 intersection threshold, 36px viewport inset and brief card stagger. The 800ms animation owns opacity and translate, leaving the CSS hover transform independent. Default content is visible: missing/failed JavaScript or unsupported APIs must never hide it. Keyboard focus cancels the target's reveal so its link is immediately visible. Reduced motion disables reveals and cancels any running animation when the preference changes.

## Contact page
The client asked (2026-10-11) for two contact routes: a booking system for small jobs (logo, poster and business card design) and a contact form for bigger projects (promo production and social media management). contact.html, contact.css and contact.js own this page; it shares the header, footer, language control and fonts with the services page, and the Contact navigation item, header project button and footer “Start a project” links on every page open it.

Composition: a full-width dark introduction (Montserrat heading with light-blue second line, lead text, email, phone +597 892-2692 from Quille's own posters, and opening hours), then two white 24px-radius path cards overlapping the dark band in the same style as the homepage expertise cards: “Book an appointment” with a calendar/time-slot illustration and “Send an enquiry” with a brief illustration holding the Smartwigi and Mage EV stills. Below, a pill tab control switches between the two white panels. Without JavaScript both panels stack and the enquiry form explains that booking needs JavaScript.

Booking panel: four numbered steps — service (radio cards with real logo/poster thumbnails), day (horizontal strip of weekdays for four weeks showing free-time counts, full or closed days disabled), time (morning/afternoon pill grid) and details (name, email, phone, preferred contact: phone call, WhatsApp or video call, optional notes). A sticky dark summary card shows the selection on desktop and is hidden below 1100px. Success replaces the panel with a confirmation, an .ics “Add to calendar” download and “Book another appointment”. Enquiry panel: service pills (promo production, social media management, something else), project description, name, email, optional phone and company, with a dark “What happens next” aside that makes no response-time promise.

The homepage #contact section is now a dark routing band with two option cards linking to contact.html#booking and contact.html#enquiry (home-contact.css). The earlier homepage form, which did not send anything, and its placeholder phone number were removed.

Admin: /admin/bookings (admin/bookings.html, admin/bookings.js, styles appended to admin/admin.css) lists upcoming appointments by day with cancel, enquiries with new/handled filters, closed days, and past appointments. It is protected by the same Cloudflare Access login and is linked from the portfolio manager header.

## Logo intro
Client request (2026-10-11): a short loading intro with the logo before the site appears. intro.js and intro.css run on the four public pages (not admin). The QD mark, traced from assets/branding/quille-designs.png into SVG shapes, draws itself as outlines (~0.55 s), fills with the logo colours (#00162a navy, #0074f3 blue ring, #010c1f D lines), the divider grows and the original wordmark (assets/branding/intro-wordmark.webp, cropped from the same PNG) wipes in from the left. A loading counter (“Laden”/“Loading”, 0–100% in Montserrat, bottom right) and a thin blue line along the bottom edge run together: they follow a 1.35 s curve, hold at 90% while the page is still loading (4 s at most), then complete. At 100% the pale brand surface lifts like a curtain (0.75 s) to reveal the page; on the homepage nothing starts before loading reaches 100%: the band and Dot Grid background mount and the hero text entrance plays only then, as the curtain lifts.

It plays every time the homepage opens (client request, 2026-10-11) and once per browser session on the other pages (sessionStorage `qd-intro-seen`), a click or any key skips it, reduced motion never shows it, and automated browsers skip it unless the URL contains `?intro`. A small inline script in each page head covers the page before the first paint so the site never flashes; if intro.js fails to load, that cover removes itself after 4 s.

## Typography

Client request (2026-10-11): the public site uses two Google Fonts only. Montserrat (300–700, italic 300/400) for headings, display text, numbers and the intro counter; Jost (300–600) for body text, labels, buttons and forms. They replace Syne and Plus Jakarta Sans on the homepage, services, contact and intro, and Inter Tight, Instrument Serif and JetBrains Mono on the portfolio page (its serif accents now use Montserrat, its small caption labels Jost). Every public page loads the same stylesheet: `family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap`. The admin (/admin and the bookings inbox) uses the same two fonts: Montserrat headings, Jost for everything else.

## Scroll motion

Client approval (2026-10-11): motion.js and motion.css give the homepage one motion language on top of the existing GSAP/ScrollTrigger/Lenis setup. (1) Section headings (all h2 below the hero) rise line by line out of a mask, 1.15 s expo-out with a 0.12 s stagger; text nodes are moved, never rewritten, so language.js still translates them. (2) The four expertise artworks and the two showcase films open like a curtain (clip-path from the bottom, 1.3 s), the picture settling from 115% while it opens; the films then drift ±3% with the scroll. (3) The light #statement and #results sections slide over the dark section before them with 56 px rounded top corners that flatten as they reach the top, while the section underneath dims to 55%. (4) The disciplines marquee leans (skewX up to 12°) with scroll speed and straightens when scrolling stops. Only transform, opacity and clip-path animate; nothing runs with reduced motion or without GSAP.

## Horizon background (partners, client feedback, contact)

Client request (2026-10-11): one shared WebGL background (horizon.js, horizon.css; original code, idea inspired by React Bits Pro “Horizon Bloom”) runs behind the partners, the client testimonials and the contact section. A sticky full-screen canvas inside the .qd-horizon wrapper shows a starry ink sky (#00050d, two layers of twinkling stars) above the rim of a dark planet with a #4a86bd/#7fb2e0 atmosphere. Scrolling into “Let’s start your project” makes a pale (#e6eff7) sun rise over the rim, right of centre, low enough to stay under the copy; the rim and halo brighten with it. A click in the sky raises a soft blue aurora; the pointer shifts the view slightly. The sections inside drop their own dark fills and glows; the contact cards get a blurred dark glass fill for legibility. It pauses offscreen and in background tabs, caps the pixel ratio at 1.5, and with reduced motion shows one still frame that only follows the scroll. Without WebGL the wrapper stays plain ink.


## Results charts

Client request (2026-10-12): “The results in numbers” shows the figures as graphs in its own layout (the first tile-grid attempt was rejected; it is kept in .cms-backup/results-tile-charts-2026-10-12.html, the original stat grid in .cms-backup/results-before-graphs-2026-10-12.html). Below the unchanged eyebrow, heading and intro sits one dark “Quille client dashboard” window (navy gradient, 28px radius, top bar with three dots and an “Averages · last 12 months” label) holding a bento of four cards. Traffic (hero, 7 of 12 columns, two rows): 212% and Before/After columns at 1 : 3.12 with a dashed previous-level line and a +212% pill. Retention: a 96-of-100 ring with the figure in its centre. Ad return: 3.8× with Spent 1× / Returned 3.8× bars. Projects (full-width strip): 140+ and 140 dots, 28 × 5 (14 × 10 on phones). Only the four published figures are charted; no history is invented. Marks use #7fb2e0 / #4a86bd, reference marks white 16%, text white and #b1beca; every value is labelled in text. Two columns from 640px, one below. results-charts.css owns the styles; results-charts.js draws each card once on view (columns and bars grow, ring sweeps, dots fill in steps). The existing GSAP counters still count the figures. Charts are fully drawn without JavaScript or with reduced motion. Dutch strings live in language.js.
