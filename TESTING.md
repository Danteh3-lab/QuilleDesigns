# Local verification

Verified on Windows with Node.js 24, Miniflare's local Worker/D1/R2 runtime and installed Microsoft Edge. The initial CMS verification used no Cloudflare account. Subsequent authorized Cloudflare releases and live checks are recorded below. No Git push was performed.

## Reproduce

```powershell
npm ci
npm run verify
npm audit
```

The integration suite reports nine passing tests, including its nested scenarios. The browser suite contains nine passing scenarios. Type checks, formatting and the asset build pass; the previously recorded dependency audit reports zero known vulnerabilities. `CMS_TEST_FRESH=1` gives the browser server temporary data. Normal `npm run dev` persists edits and uploads under `.local-state`.

The frontend premium strict audit reports zero findings for the admin source. The DESIGN.md lint reports no errors or warnings; runtime CSS remains the declared token owner. These are design checks, not a security certification.

## Evidence covered

| Area | Local evidence |
|---|---|
| Existing content | Every one of the 12 imported rows matches the source fixture, including URLs, dimensions, captions, descriptions, order, publication and IDs. Smartwigi and Terzol remain the initial featured choices. All 12 artwork images decode in the browser. |
| Source preservation | The initial public shells were preserved in `.cms-backup`. Original MP4 files and Netlify documents remain in place. The later local homepage heading edit is preserved in source and excluded from these CMS releases, as recorded below. The build excludes MP4 masters, Worker source, configurations, migrations, tests, backups and secrets. |
| CRUD and conflicts | Create/edit/delete, publication, group ordering, paginated lists, stale project/featured revisions, invalid URLs, escaped HTML, featured removal/category restrictions and malformed featured input. Manually rerunning the guarded seed never restores a deleted project. |
| Authorization | Missing/forged/expired/wrong-audience tokens, disallowed email, missing configuration, encoded and collapsed admin paths, protected JavaScript/CSS, cross-origin and missing-Origin/custom-header writes. Public reads remain available without login. |
| Visibility and outages | Unpublished/deleted projects disappear from server-rendered HTML. Conditional requests cannot return stale seed HTML. Empty groups work. A database outage returns 503 with an unavailable state, without restoring static projects. |
| Uploads | 112 MiB multipart integration upload; a real 175,843,008-byte video through the browser; a failed chunk followed by retry; reload/reselection/resume with part hashes; cancellation; invalid files/checksums; incomplete completion; active/expired completion leases; repeated completion; expired-session cleanup. |
| Playback and retention | Managed R2 GET/HEAD/range responses, invalid ranges, private preview, unpublished media visibility and retention after metadata deletion. The real uploaded video plays in its selected homepage card. |
| Existing homepage | Hero playback using the existing local master as the response fixture for its unchanged public R2 URL. Original process frames render and change on scroll. Featured click-to-play, navigation and contact chip behavior remain operational. Reduced-motion still rendering is checked separately. |
| Browser resilience | Desktop and 390px mobile layouts, no horizontal overflow, Dutch/English, native required-field errors, keyboard activation, Escape/focus restoration in dialogs, initial-load recovery, anonymous rejection and offline draft preservation. |
| Progressive enhancement | With JavaScript disabled, published portfolio cards and both featured media links remain usable server-rendered links. Filters stay hidden. |

The intentional database-outage test logs `CMS database read failed`; this is expected failure-path evidence. Screenshots are generated under ignored `test-results`.

## Original static button findings

The earlier public-site audit reported 25 literal buttons with no detectable inline action. Its scanner cannot resolve external-script event listeners. The implementation preserves those controls and their handlers:

| Controls | Handler owner | Browser evidence |
|---|---|---|
| Language and shared navigation/menu | `language.js`, `site-chrome.js` | Language change, narrow menu open/close, Escape and returned focus |
| Portfolio filters, ticker and media viewer | `portfolio.js` | Category counts/visibility, reduced-motion ticker behavior, complete artwork dialog and Escape |
| Featured media controls | Existing homepage script | Click creates a controlled video; managed video actually plays |
| Contact multi-choice and single-choice chips | Existing homepage script | Toggle state changes; single-choice selection remains exclusive |

These findings were investigated as scanner limitations; no public buttons were removed or restyled to silence the audit. Admin controls attach external handlers and remain disabled until authenticated data is ready, allowing a strict CSP.

## Account-dependent verification

The local suites do not verify real Access PIN email delivery, account policies, domain routing, cache rules, existing bucket access/lifecycle settings, production R2/Worker limits or actual remote media delivery. Confirm those in the client's account using the checklist in [CLOUDFLARE.md](CLOUDFLARE.md) before an independently authorized deployment.

## Authorized remote resource setup — 2026-10-04

Cloudflare resources were provisioned through the official MCP after the user authorized account writes. These checks supplement the local suites; the CMS Worker was not deployed.

- Created D1 `quille-portfolio` and applied both migrations, including Wrangler-compatible migration history. Remote readback of all 12 records matches every field in `tests/legacy-projects.json`; both featured slots are preserved. The `legacy-v1` guard is present.
- Created the `quilledesigns.cloudflareaccess.com` Zero Trust organization, PIN identity provider, one application covering all four admin destinations, and an Allow policy requiring exactly `quilledesigns.sv@gmail.com` and that PIN provider. Readback confirms the exact email, login method and one-hour session; no bypass or Everyone rule exists.
- Anonymous `/admin`, `/admin/`, admin JavaScript/CSS, `/api/admin` and `/api/admin/session` requests redirect to the Access login page. An unauthenticated cross-origin POST also redirects; OPTIONS returns 400. The login page returns 200 with an email input, and the public signing-key endpoint returns 200. No PIN was requested or sent.
- The live homepage and followed portfolio URL return 200 with all 12 original cards. The original Worker deployment/version and empty binding list remain unchanged. The existing R2 bucket and public endpoint were retained.
- The production config contains real values and no placeholders. Wrangler's production dry run passes with D1, R2, assets, origin, Access values and a hidden `ADMIN_EMAILS` secret read from the ignored file. No upload/deployment occurs in the dry run. The rebuilt public assets contain no client email, account/database/audience IDs, environment files, SQL/TypeScript source or original MP4 files.

The ignored `.cms-backup/cloudflare-setup-2026-10-04.json` records the verified resource IDs, imported records, featured slots, migration names and previous active deployment/version. Actual PIN delivery, authenticated production CRUD, media upload and cleanup activation await CMS deployment and a client login test.

## Authorized production deployment — 2026-10-04

The user subsequently approved deployment. The MCP staged version `0c0d2203-ce72-4723-8e5e-79c8c9f7282b` and activated deployment `4dd71465-8763-4a69-8ab7-87bdb04f744c` at 100%. The asset-upload helper sent thirteen changed assets; the other assets were reused by content hash. Temporary upload credentials were removed. No Git push was performed.

- Cloudflare readback confirms D1, existing R2 and assets bindings, the hidden `ADMIN_EMAILS` secret, real Access values, Worker-first routing, HTML handling `none`, disabled preview URLs and the daily cleanup schedule.
- Live homepage, both portfolio URL forms and public JSON return 200 with `no-store`. Every public project field matches the original fixture. Anonymous admin page, stylesheet, script and session requests redirect to Access.
- A read-only live Edge browser decoded all twelve artwork images, exercised filters with seven logos/five videos, verified no horizontal overflow at 390px, and rendered the Access email field without requesting a PIN.
- The original homepage hero and Smartwigi featured video advance in the live browser. All five original public R2 video URLs return 200 with video content types. No browser JavaScript errors occurred.

The client must complete their first PIN login to confirm email delivery and exercise authenticated production CRUD/uploads. No service-token bypass or production test identity was added. The ignored `.cms-backup/cloudflare-deployment-2026-10-04.json` records current and previous version IDs for recovery.

## Additional administrator — 2026-10-04

At the user's explicit request, `toikromodanick@gmail.com` was added alongside `quilledesigns.sv@gmail.com` in both the Access policy and encrypted Worker `ADMIN_EMAILS` secret. Policy readback confirms exactly those two Include emails, the unchanged required PIN provider, empty exclusions and one-hour session. The secret update activated version `0c79809e-3c5b-4831-91cb-fa7bab5225fb`, deployment `9bfe97d9-7dd3-4351-a13e-cfbc0cae478f`. Remote version comparison confirms an identical script ETag and identical asset configuration; D1, R2, assets and Access bindings remain present. Public homepage, portfolio and JSON return 200 with all 12 records, while anonymous admin page/script/session requests still redirect to Access. Local production secret settings were updated to preserve both emails in future deployments. PIN delivery and authenticated sign-in require the inbox owner to complete login; no code was requested or sent during this update.

## Admin header logo — 2026-10-04

Replaced the typed admin wordmark with the existing `assets/branding/quille-designs.png` logo and shared responsive `site-brandmark` component. The link keeps an accessible name and keyboard focus indicator. Public-page source and branding assets remain unchanged.

- Formatting, TypeScript checks, the build, nine integration tests, seven browser scenarios and the strict frontend audit (zero findings) pass after this change.
- Activated version `b1515dad-4d8d-4af9-ab7b-441ecae0e844`, deployment `84db8584-9e62-4455-9e5d-f03a20d464bd`; only two static assets changed. The Worker script ETag is unchanged, Worker-first routing is retained and both authorized emails remain in the secret. Previous version: `0c79809e-3c5b-4831-91cb-fa7bab5225fb`.
- A separate live Edge tab used the owner's existing authenticated session. The original logo decodes at 1774px natural width, displays in the 178px desktop / 152px mobile component, and has no horizontal overflow at 390px. Tab reaches the named logo link with a visible outline. The existing tab's unsaved project form was left untouched.
- Live public JSON still returns 200 with all 12 projects; anonymous admin requests still redirect to Access. Temporary asset-upload credentials were removed. No Git push was performed.

Live screenshots: ignored `test-results/admin-logo-live.png` and `test-results/admin-logo-mobile-live.png`. The owner's authenticated admin page is confirmed; client-inbox PIN delivery and production CRUD/uploads still need the client's own session.

## Admin browser-tab icon — 2026-10-04

Added the missing favicon link to admin/index.html, using the existing public QD asset at `/assets/branding/favicon.png?v=4`. No image or public-page changes were needed. Formatting, type checks, the build, nine integration tests, seven browser scenarios and the strict frontend audit (zero findings) pass.

Activated version `c0c72392-525e-44fd-abfb-8dad72f35ea1`, deployment `f15e787f-3122-416f-9867-dd558d579528`; one admin HTML asset changed. The Worker ETag, bindings, authentication settings and both administrator emails are preserved. Previous version: `b1515dad-4d8d-4af9-ab7b-441ecae0e844`.

Live icon response is 200, image/png, 494857 bytes. A separate authenticated Edge tab confirms the original favicon href and the 1254×1254 QD image decodes. Browser control temporarily replaces the visible tab icon with its own badge, recording `data-codex-original-favicon-href`; that badge is browser tooling, not application source. The user's existing form tab was not reloaded. Public JSON still contains all 12 projects, anonymous admin access redirects to Access, and temporary upload credentials were removed. Live asset screenshot: ignored `test-results/admin-favicon-live.png`. No Git push was performed.

## Automatic video covers — 2026-10-04

Completed video uploads now generate a JPEG cover from near the first second when poster/artwork is empty. Existing artwork is preserved, including edits made while extraction is pending. The explicit Use video thumbnail button captures a cover from an already uploaded managed video. Image generation is browser-local, bounded to 20 seconds and a 1280px longest edge, and cancellable; the resulting JPEG uses the existing protected, validated multipart upload flow. Alt text remains required and client-authored. Decoder failures retain the video and offer artwork/retry. Cover upload checkpoints permit reload/recreation/resume without a second video upload. Mobile grid tracks now keep all form controls inside their panel.

- Formatting, TypeScript checks, the build, nine Worker/D1/R2 integration tests and all eight Edge browser scenarios pass. Strict frontend audit: zero findings.
- The new scenario uses a real 31,147,034-byte MP4, fails cover completion deliberately, reloads and resumes the JPEG with one video/one cover upload session, checks publication and image/jpeg delivery, preserves a custom poster on another video upload, explicitly replaces it through keyboard activation, and verifies unreadable-source recovery and a 390px layout. The full-suite fixture-count assertion was corrected to account for the preceding featured-video test's retained project; product behavior was not changed to accommodate the test.
- Final live version `4ad5f07d-879e-40b0-80a8-c59115eb9c7b`, deployment `b4475f9c-88fa-4444-8787-4165b3963c03`, at 100%. The Worker ETag and bindings are unchanged, both authorized emails remain in the secret, public JSON returns 12 records and anonymous admin requests redirect to Access. Temporary upload credentials were removed.
- An unrelated local homepage heading edit was caught in the initial asset bundle. The final deployment reuses the known pre-release homepage asset (`7aaf2a544ace45aa1524f2a73da65c2c`); local index.html was left intact. Final live readback confirms `Ideas, out in the world.` The public portfolio source still matches its original backup.
- Live authenticated verification generated JPEG `/media/6e1e705e-ea1f-4ea9-b640-c9276f91ad2b` from the owner's previously uploaded video, automatically filling the poster URL, preview and 1280×720 dimensions. The temporary form was discarded without Save; the original list, featured choices and 12 projects are intact. The generated image remains in R2 under the existing retention policy. The browser initially blocked opening a new verification tab; verification continued through the existing idle admin tab after confirming no draft was open.

Screenshots: ignored `test-results/video-cover-live.png` and `test-results/automatic-cover-mobile.png`. No Git push was performed.

## Responsive gallery counts — 2026-10-04

- Replaced fixed-count final-card exceptions with a shared wrapping layout. Landscape, portrait and identity rows centre their remaining cards at unchanged widths and 16px spacing. Empty film-format containers no longer reserve space. DESIGN.md records the runtime owner and responsive column counts.
- npm run verify passed: formatting, TypeScript, explicit asset build, nine integration tests and nine browser scenarios. The new gallery scenario creates and removes local projects to exercise full and incomplete rows at 1440, 900, 650 and 390px, including zero identities after the unpublished-group scenario, category filters, DOM ordering, no overflow and keyboard viewer/focus restoration.
- A screenshot-only improvement waits for lazy artwork decoding before capture; its targeted gallery test and format check passed afterwards. The earlier fixture failure when the preceding test unpublished all identities was corrected by reading the authenticated local source records, without changing production behavior.
- Premium strict audit: zero findings, saved under ignored .wrangler/premium-audit-gallery.json. The documented runtime layout mapping was reviewed against the CSS. No official DESIGN.md lint tool was available for this revision; no new lint result is claimed.
- Authorized MCP deployment uploaded exactly one changed public asset, portfolio-gallery.css. Active version 73ea0500-1972-4238-9351-52f23fbf27c8, deployment e48ed41e-8017-49c2-a9cb-3bef499b300c, at 100%. Worker ETag 2d9b731265371da5d60a55d9f0a140af3c36099dc90d7949e39e885ec4410b08, seven bindings and Worker-first assets are unchanged; the existing secret was inherited rather than replaced. No D1 or R2 mutation was made. Temporary upload credentials were removed.
- Live readback matches the local CSS exactly. The complete public JSON before and after is identical: 12 published records, Smartwigi/Terzol featured, original links intact. The pre-release homepage heading remains live; its unrelated local source edit remains intact. Anonymous admin CSS still redirects to Access.
- Live Edge geometry at its normal 1528px viewport confirms each final row is centred within 0.01px and no horizontal overflow. At 390px the final identity keeps its ordinary 150.8px width in the 317.6px gallery, is centred, and causes no horizontal overflow. The temporary viewport override was reset.

Screenshots are ignored under test-results: gallery-centred-desktop.png demonstrates three landscape films in the local fixture; gallery-centred-mobile.png and gallery-layout-live-desktop.png record additional layout checks. The previous active version 4ad5f07d-879e-40b0-80a8-c59115eb9c7b remains available for rollback. No Git push was performed.

## Homepage expertise label — 2026-10-05

The client selected “Onze expertise” / “Our expertise”. index.html and language.js update only the overview label and its Dutch/English dictionary entry. The earlier “What we do” candidate was replaced before deployment. The existing Services/Diensten navigation, service disclosure rows, CTA, layout and anchors remain intact. DESIGN.md records the wording and future separate-page distinction.

The initial copy revision passed npm run verify (formatting, TypeScript, build, nine integration tests and nine browser scenarios) and the premium strict audit with zero findings. After the client selected the final wording, language.js syntax and formatting checks passed, and a real local Edge browser verified the final Dutch/English labels and keyboard language toggle at desktop and 390px. The final wording was also checked in both languages on the live site. No new tests were added for this reversible copy edit.

The authorized MCP release uploaded exactly two public assets: /index.html and /language.js. Version a6454ee0-b520-43a2-b747-4302fe0ef321, deployment f3406e62-fced-4538-a39b-afac8483821c, is active at 100%. Worker ETag, seven bindings, inherited secret and Worker-first handling are unchanged. The complete before/after live HTML differs only at the requested section label, the served language.js matches source, and published JSON remains byte-equivalent after parsing: 12 projects with Smartwigi/Terzol featured. Anonymous admin script still redirects to Access. No content or media was changed, and no Git push was made. Temporary upload credentials were removed.

Screenshot: ignored test-results/home-expertise-live-nl.png. The unrelated local “Our latest work” heading remains preserved in source and excluded from this copy release.


## Separate services page — 2026-10-05

The public services page uses the supplied five-card composition, the existing Smartwigi still and shared site header/footer. Header, mobile menu, footer and service-discovery links open services.html; individual footer links target stable card anchors. The homepage Our expertise / Onze expertise overview and historical #services anchor remain. No database, R2, authentication configuration or content changes are required.

Verification commands: npm run verify; python <frontend-design-premium skill>/scripts/audit_project.py . --mode strict --output .wrangler/premium-audit-services.json.

Worker integration covers anonymous GET/HEAD on /services and /services.html, the /services/ redirect and rejected POST. tests/browser/services.spec.mjs covers all five cards in Dutch and English at 1440, 900, 390 and 320 pixels, the wide video span, image loading, reduced motion, cross-page navigation, language persistence, anchor clearance, contact navigation, mobile keyboard focus trapping/restoration, and native links without JavaScript. Existing CMS, public gallery and homepage playback/process tests remain part of the full suite. Screenshots: ignored test-results/services-1440-nl.png, services-900-nl.png and services-390-nl.png.

The first navigation test attempted a language switch before the shared scripts had initialized after cross-page navigation. It now waits for the localized heading and ready navigation before keyboard activation; the browser journey passes. Final npm run verify passes formatting, TypeScript, build, all 10 integration tests and all 12 browser tests. Static strict audit reports zero findings. Public asset references resolve and server/config/backup files remain excluded. Local source snapshots for index.html, portfolio.html and language.js are retained under .cms-backup/services-page-before-2026-10-05. The unrelated local Our latest work heading is preserved. This task does not deploy or push changes.


## Separate services page release — 2026-10-05

Deployed with explicit user authorization (push) through the official Cloudflare MCP. Active version 88f54eaa-9273-45e2-ab54-1f80760805f8, deployment 438f62c0-35b0-4860-aa8a-148775629439 at 100%. The new /services and /services.html routes serve the bilingual static services page; /services/ redirects to /services.html. Seven public assets changed plus the Worker route handler. D1, existing R2, Access bindings, the administrator secret, runtime asset protection and scheduled cleanup are unchanged.

The homepage asset is built from the preceding live copy release with only services navigation/footer links updated. Current isolated homepage base: .cms-backup/services-release-index.html. The unrelated local Our latest work heading remains in source and is excluded from this release. Public JSON still has the same 12 records and Smartwigi/Terzol featured slots. HTTP route checks, live NL/EN desktop/mobile browser checks, keyboard menu and cross-page navigation passed; anonymous admin, admin JavaScript and admin API requests still redirect to Access. Temporary upload tokens were removed. No Git push was possible or performed: this workspace is not a Git repository.

Live screenshots: test-results/services-live-desktop-nl.png and test-results/services-live-mobile-nl.png.


## Services scroll reveal — 2026-10-05

Published with user authorization: version a013f76e-ca25-4411-8472-71c062b52f97, deployment 5eb5a4fb-f581-4372-a11b-2478d5d8cb95 at 100%. Only services.html and new services-page.js changed. Worker code, bindings, Access, current homepage base, D1 content, R2 media and cleanup remain unchanged.

Native IntersectionObserver/Web Animations reveal the intro, five cards and contact invitation once per visit, with 24px movement, 800ms easing and brief card stagger. The animation uses translate independently of the existing hover transform. Content remains visible without JavaScript or reveal APIs; reduced motion disables and cancels animation, and keyboard focus immediately reveals the contact link. No new animation library is loaded.

Verification: npm run verify passed formatting, typecheck, build, 10 integration tests and 14 browser tests. The focused services suite also passed after adding keyboard-focus coverage. Strict static audit has zero findings. Live desktop/mobile reveal and reduced-motion cancellation passed; homepage HTTP output and public project JSON are unchanged, and anonymous admin JavaScript still redirects to Access. Temporary upload credentials removed. Screenshots: test-results/services-reveal-live-1440.png and services-reveal-live-390.png. No Git repository or Git push.


## Services dark/light local trial — 2026-10-05

Local-only variant: full-width nearly-black introduction, pale patterned five-card band, full-width nearly-black contact invitation, unchanged light site header/footer. Existing copy, assets, routes, card layout and contact destination remain. Reveal targets the inner introduction/contact content; the full-width background bands never animate. Scoped dark tokens match the existing homepage showcase palette.

Final npm run verify passes formatting, typecheck, build, all 10 integration tests and 14 browser tests. Services browser checks now also assert full-width dark/light/dark bands, equal content gutters at all four viewport widths in both languages, and static backgrounds during reveal. Existing menu keyboard, focus, no-JavaScript, reduced-motion, hover-independent reveal, anchors and navigation checks pass. Static strict audit: zero findings in .wrangler/premium-audit-services-dark-preview.json. Actual computed dark text contrast exceeds 4.5:1. Screenshots: test-results/services-1440-nl.png, services-900-nl.png, services-390-nl.png plus services-dark-preview-desktop.png and services-dark-preview-mobile.png.

The existing light source is preserved under .cms-backup/services-light-before-dark-preview-2026-10-05. Read-only production HTTP checks confirm services.html and services-page.css remain byte-equivalent to that light source. No Cloudflare resource, D1, R2, deployment or Git push was performed. The local preview is http://127.0.0.1:8788/services.html. The unrelated homepage draft heading remains preserved.


Local contact color refinement: dark labels use #7fb2e0; the contact heading now uses a white/light-blue emphasis split matching the intro and homepage showcase. The white CTA uses canonical navy --brand-ink. Exact heading copy stays unchanged in NL/EN through split-node translations. All five services browser tests pass, plus computed-style, NL/EN heading and narrow viewport checks. Screenshots: test-results/services-contact-colors-nl.png, services-contact-colors-en.png and services-contact-colors-mobile.png. The variant remains local; no deployment was performed.


## Services dark/light release — 2026-10-05

Published with explicit user authorization through the official Cloudflare MCP. Version b43d479d-e0e2-4b89-8834-db5063253c8d, deployment 1a032249-e81d-420c-8713-5dd927186d96 at 100%. Exactly three public assets changed: services.html, services-page.css and language.js. The dark intro and contact sections use the existing homepage palette, with white/light-blue heading emphasis, blue labels, navy text on the white contact button, and a pale five-card services band. Shared header/footer and inner-only scroll reveal remain.

Worker code/resources, all bindings, inherited administrator secret, Worker-first asset protection, database, media and cleanup configuration are unchanged. The staged homepage uses .cms-backup/services-release-index.html; the unrelated local draft heading stays in source and is excluded. Live homepage HTML and portfolio JSON match the pre-release captures exactly. All 12 published records and initial featured selections remain.

Live HTTP checks passed for both services routes, trailing-slash redirect, exact HTML/CSS/language asset bytes, and Access redirects on admin page, script and API. Live Edge checks passed in NL/EN at 1440, 900 and 390 pixels: brand colors, full-width bands, responsive columns, no overflow, keyboard menu, contact navigation, reveal, reduced motion and visible content without JavaScript. No page errors. The browser band-width assertion compares against document body width to accommodate the normal scrollbar. Screenshots: test-results/services-dark-live-1440.png and services-dark-live-390.png. The first immediate HTTP check saw the previous asset during Cloudflare propagation; the subsequent checks passed. Temporary upload tokens removed. No Git repository or Git push.
