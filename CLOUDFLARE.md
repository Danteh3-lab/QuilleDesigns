# Quille Designs portfolio CMS

This folder contains a locally verified Worker CMS, an unchanged public design, a private `/admin` application, and a guarded migration for the twelve original projects. Cloudflare D1, Access and the CMS Worker were provisioned and deployed with the user's authorization on 2026-10-04. **The CMS is live; no changes have been pushed to Git.** The previous Netlify files are retained as historical configuration.

## Run locally

Use Node.js 24 LTS and the checked-in package lock:

```powershell
npm ci
npm run dev
```

Open `http://127.0.0.1:8788/admin` for the CMS or `http://127.0.0.1:8788/` for the website. Stop with Ctrl+C. Local D1 and R2 data persist under `.local-state`; restart does not reset content or reimport deleted projects. Browser tests use fresh temporary databases instead.

The local proxy binds only to loopback and supplies a signed `client@example.test` identity. The Worker validates its JWT through a local public-key endpoint, using the same validation code as production. The proxy and test identity are excluded from the Worker bundle and public assets. There is no production authentication bypass. Do not expose the local development ports to the internet.

```powershell
npm run check
npm test
npm run test:browser
```

The browser suite uses installed Microsoft Edge. On another machine change the Playwright channel to an installed Chrome/Edge browser, or install Playwright Chromium and remove the `channel` setting. Original MP4 masters remain in `assets` for local tests and are excluded from the public deployment bundle. New client uploads go to R2 without a site deploy.

## Confirmed Cloudflare setup

No Cloudflare configuration was supplied with the original source. The official Cloudflare MCP inspected the account, then provisioned the CMS database and login resources with the user's authorization on 2026-10-04:

| Setting | Confirmed value / state |
|---|---|
| Account ID | `4a9933808783cfe4cc458230f6f57538` |
| Existing Worker | `quilledesigns`, now serving the CMS with static assets, D1, R2 and server-side authentication settings |
| Active CMS version | `b43d479d-e0e2-4b89-8834-db5063253c8d` (dark/light services and brand text colors, 2026-10-05) |
| Current site origin | `https://quilledesigns.toikromodanick.workers.dev` |
| Pages projects / custom domains | None in the connected account |
| Existing R2 bucket | `quille-media` |
| D1 | `quille-portfolio`, ID `7f2f18ef-31a7-4eb2-9bc9-66231fca61be`; both migrations applied, all 12 projects published |
| Featured slots | Slot 1: Smartwigi; slot 2: Terzol |
| Cloudflare Access team | `https://quilledesigns.cloudflareaccess.com` |
| Access application | `Quille Designs Portfolio Admin`, ID `fe3aecc4-473a-44b3-a1a8-d792ab24ee88` |
| Application audience | `52a91c0db73dd3821232353f719091750957841c3635bed71a0141bdb124b81e` |
| PIN identity provider | `Email one-time PIN`, ID `e6fe71a2-7471-4276-8352-adf7f0cb9659` |
| Allow policy | `Approved administrators`, ID `7388598f-fc8c-46ba-8741-6f4af474eb52`; two exact emails plus PIN login method, one-hour session |
| Client login email | `quilledesigns.sv@gmail.com` |
| Additional authorized administrator | `toikromodanick@gmail.com` |
| Existing bucket lifecycle | Incomplete multipart uploads expire after seven days |

After deployment, the live homepage, portfolio and `/api/portfolio` returned HTTP 200 with `Cache-Control: no-store`; all twelve original project records match the source fixture. A live Edge browser decoded every artwork, exercised the seven-logo/five-video filters, verified a 390px layout, and played the original homepage hero and Smartwigi featured video. Anonymous admin page, script, stylesheet and API requests redirect to the Access login page, which renders an email field. No PIN was requested or sent during these checks. Before deployment, unauthorized POST requests redirected to login and cross-origin OPTIONS requests were rejected. The previous static version `8695a91c-21d2-4d16-9191-7461e60d7598`, deployment `1db45a71-332a-4b41-9a18-832f30fbe671` from 2026-10-02, is recorded for rollback. The verified public bucket endpoint is:

`https://pub-7c35d354f58947c690a1af63934b929f.r2.dev`

The R2 API confirmed that this endpoint belongs to `quille-media` and remains enabled. Keep its current public endpoint enabled and keep every existing object/key intact.

The deployment uses **Workers Static Assets** with D1 and the existing R2 bucket. The ignored `wrangler.production.jsonc` contains the real Worker, account, origin, bucket, D1 ID, Access team and application audience, with no placeholders. The client allowlist from ignored `.env.production` was installed as the `ADMIN_EMAILS` Worker secret alongside the CMS code. Neither file is part of the public asset bundle. The generic `wrangler.production.example.jsonc` remains available for a different hostname or account.

The account serves the site through `workers.dev`, and preview URLs are disabled. Protect only the admin paths with a hostname/path-based Access application, keeping the public homepage available. Cloudflare supports this approach on `workers.dev` as well as custom domains. [Workers Access documentation](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)

## Deployment and future updates

The CMS, bindings, client allowlist secret and daily upload cleanup are deployed. The official MCP registered the asset manifest, staged the Worker version and activated it. `scripts/cloudflare-assets.mjs` transferred the thirteen changed assets using Cloudflare's short-lived upload token, following the [direct upload API](https://developers.cloudflare.com/workers/static-assets/direct-upload/); it never received an account API token or deployed the Worker. Temporary upload credentials were removed afterwards. A production dry run passed before activation. The following commands document future authorized updates through Wrangler; they were not used for this cutover.

1. Sign in to the correct Cloudflare account using `npx wrangler login`, or supply a least-privilege deployment API token through the local environment. Do not put tokens in HTML, JavaScript, the public bundle, or source control.
2. Use the prepared ignored `wrangler.production.jsonc`. Keep `DB`, `MEDIA`, and `ASSETS` as the code binding names. Both SQL migrations were applied through the MCP and recorded in `d1_migrations`; do not create another database or regenerate the import. Check migration status before future schema updates:

   ```powershell
   npx wrangler d1 migrations list quille-portfolio --remote --config wrangler.production.jsonc
   ```

   Remote readback verified all 12 project records, their original URLs, order, artwork and dimensions, two featured slots, and the `legacy-v1` import guard. Manual migration reexecution cannot restore deleted entries or overwrite edits. Do not rerun `scripts/import-current.py` to regenerate production content; it records the initial source import and local backups only. Builds never run it.

3. Keep the verified current hostname unless a custom-domain cutover is explicitly requested. For a future custom domain, update `PUBLIC_ORIGIN` and the Access destinations together, and decide whether to disable the old `workers.dev` route. For an apex domain plus `www`, redirect the alternate hostname to the canonical origin so authentication and Origin checks agree. Keep preview URLs disabled; do not add extra domains without corresponding Access protection.
4. For a future authorized code update, run `npm run build` and inspect `build/public`. Its explicit allowlist excludes secrets, server code, configuration, tests, backups and all original MP4 files. Deploy the Worker, assets, bindings and client allowlist secret together:

   ```powershell
   npx wrangler deploy --config wrangler.production.jsonc --secrets-file .env.production
   ```

   The secret file contains `ADMIN_EMAILS="quilledesigns.sv@gmail.com,toikromodanick@gmail.com"`; both exact addresses are authorized. Uploading secrets alongside code avoids an intermediate deployment with incomplete authentication settings. Cloudflare's [secrets documentation](https://developers.cloudflare.com/workers/configuration/secrets/) describes this flag and explains that `wrangler secret put` deploys immediately. Adding, removing or changing an administrator email requires updating both this allowlist and the Access policy. Empty or placeholder authentication settings deny access. No R2 S3 access key or secret is needed: the Worker uses its account binding. Preserve `assets.run_worker_first: true` and `html_handling: none`; asset-first hosting would bypass authentication and dynamic rendering.
5. Verify public counts, featured playback and unauthorized admin access after code updates. The client's first PIN sign-in, authenticated production CRUD and a production upload still require an actual client session. Do not alter the client's live portfolio as a test; use a clearly named unpublished draft and delete it afterwards. Confirm the active deployment version and keep the previous version ID above for rollback. Content edits through the CMS require no deployment.

## Client login: email one-time PIN

Follow Cloudflare's [one-time PIN setup](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) and [JWT validation guidance](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

The following setup has already been applied; these steps document its configuration for maintenance or recovery:

1. Zero Trust organization **Quille Designs** uses `quilledesigns.cloudflareaccess.com`, with PIN provider **Email one-time PIN**. WARP authentication is disabled; unmatched public requests are allowed so the homepage stays public.
2. **One self-hosted Access application** contains these paths on `quilledesigns.toikromodanick.workers.dev`: `/admin`, `/admin/*`, `/api/admin`, and `/api/admin/*`. They share one audience. The application protects the page, script, stylesheet, session endpoint and every write/upload API. Do not use whole-Worker Access protection, which would also require the public homepage to sign in.
3. Its **Allow** policy includes exactly `quilledesigns.sv@gmail.com` and `toikromodanick@gmail.com`, and requires the PIN provider. The second address was explicitly authorized on 2026-10-04 and added to both the policy and Worker secret. There are no Everyone, email-domain-wide, bypass or service-token rules. The application accepts only PIN login, uses HttpOnly cookies, and has a one-hour session. Add further maintenance emails only if separately authorized.
4. The prepared config has the exact application audience in `ACCESS_AUD`, `ACCESS_TEAM_DOMAIN="https://quilledesigns.cloudflareaccess.com"`, and the current HTTPS origin in `PUBLIC_ORIGIN` without a trailing slash or path.
5. Open `https://quilledesigns.toikromodanick.workers.dev/admin`, enter either authorized email address, enter the PIN delivered to that inbox, and use the CMS. The client needs no Cloudflare dashboard account. Actual PIN delivery and the authenticated production CMS session still require a user login test; no PIN was requested during deployment checks.

The Worker independently verifies RS256 signatures, expiry, issuer, audience, subject and email using Access public keys. Spoofing the email header or posting directly to an API is insufficient. Browser mutations also require the exact configured Origin and `X-CMS-Request: 1`; cross-origin requests are rejected. Sign out uses `/cdn-cgi/access/logout`.

Do not record client PINs, Access cookies, JWTs, or deployment tokens in logs or screenshots. If login email is missing, check spam/mail-gateway filtering; blocked emails deliberately receive no PIN. The client can open Sign in again in a new tab to renew an expired session while preserving the current editor and selected file.

## Client workflow

- **Add project** starts a draft. Enter title, category, poster/artwork, direct media URL or upload, alt text, optional caption/description and display order. Choose landscape/portrait for videos. Artwork uploads populate width/height; check dimensions for manually entered URLs.
- MP4/WebM videos are limited to 2 GiB; JPEG/PNG/WebP images to 20 MiB. SVG, HTML, executable uploads, YouTube/Vimeo page URLs and embeds are unsupported. Use direct HTTPS media-file URLs. The CMS does not transcode video; use browser-compatible codecs such as H.264/AAC in MP4.
- Select **Published on the website** and Save, or use Publish/Unpublish in the list. Changes appear on the next public page request without redeployment.
- A video upload creates a cover automatically when **Poster / artwork URL** is empty, using a frame near the first second. The generated JPEG goes to R2 through the ordinary upload API and fills the poster URL, preview, dimensions and orientation. Existing custom artwork is preserved. **Use video thumbnail** creates or replaces the cover for an already uploaded video; **Upload artwork** remains available for a different image. Browser-readable direct video URLs can use the button too, but external servers must allow cross-origin image capture. If decoding or cover upload fails, the uploaded video is retained; retry the cover or choose artwork manually. Save is still required, and alt text must describe the cover.
- Move up/down reorders within landscape films, portrait films or identities. Display order has no effect across those existing layout groups.
- Public galleries automatically centre incomplete final rows as projects are added, removed or unpublished. Card widths, media formats, the 16px gap and saved ordering remain consistent. No manual spacer projects or layout adjustments are needed.
- **Homepage videos** selects two distinct published video projects. Save replacement slots before deleting, unpublishing or converting a featured video to a logo. The database enforces this rule, including direct API requests.
- Delete confirms the project name and removes the record; it retains media. Unpublishing removes website visibility, including managed `/media` reads, but cannot revoke existing raw public R2 links. The existing bucket is public; uploaded drafts must not contain confidential material. Permanent file purging is intentionally outside the CMS.

## Upload recovery and operational checks

Videos are split into uniform 8 MiB parts, with at most two browser requests in flight. The Worker validates checksums, exact part lengths and first-part file signatures; D1 stores ownership and receipts. No request contains the whole large video. R2 multipart operations use the binding and unique `cms/UUID.ext` object keys, preserving every legacy key. [R2 multipart documentation](https://developers.cloudflare.com/r2/objects/upload-objects/)

- If a request fails, the browser retries up to five times with bounded backoff. If it still fails, retry the upload or reselect the same original file. Reloading retains an upload checkpoint; reselection verifies already uploaded part hashes before continuing. Use Cancel upload before switching to a different file/field. A selected file remains only in browser memory; no local filesystem path is stored.
- Sessions expire after 24 hours. The daily scheduled handler aborts expired unfinished uploads and recovers an R2 completion that preceded a database write failure. Keep the configured cleanup trigger enabled. Confirm the bucket's incomplete-multipart lifecycle policy as a secondary cleanup mechanism; R2's default is seven days. Completed unreferenced media is retained and can require an account-owner storage review.
- Completion is retry-safe. An active completion lock expires after two minutes if a Worker request stops; retry after that delay to recover without uploading the file again. Do not publish until the upload has completed and Save succeeds. For uncertain create/save responses, reload the list before retrying to check whether the project was created.
- Public HTML, portfolio JSON, admin responses and managed media use `Cache-Control: no-store`. Check existing Cloudflare Cache Rules: bypass cache for `/`, `/index*`, `/portfolio*`, `/admin*`, `/api/*` and `/media/*`; ensure no Cache Everything rule overrides these headers. Purge old public-page caches at cutover. Static CSS/JS/images can remain cached normally.
- Back up D1 before future schema changes using `wrangler d1 export ... --remote --output ... --config wrangler.production.jsonc`. Keep exports outside the public bundle. R2 keys are never overwritten or purged by this CMS.
- Use Cloudflare Worker error metrics/logs and Access authentication logs after an authorized deployment. Errors intentionally omit tokens and backend details. Investigate repeated 401, 409 and 503 responses, expired uploads and missing objects. Revoking an email through the Worker allowlist denies subsequent requests even with a previously issued JWT.

## Public/API interfaces

`GET /api/portfolio` returns published projects and the two featured projects. `/portfolio.html` and the homepage are server-rendered from the same data, preserving real media links without JavaScript. A database failure shows a temporary-unavailable collection instead of restoring stale hardcoded projects.

Authenticated routes:

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/session` | GET | Signed-in email |
| `/api/admin/projects?page=1&group=all` | GET | 24-item paginated list; groups all/logo/landscape/portrait |
| `/api/admin/projects` | POST | Create project |
| `/api/admin/projects/:id` | GET / PUT / DELETE | Read, replace fields, delete; writes include revision |
| `/api/admin/projects/:id/move` | POST | `{direction: up/down, revision}` within the gallery row |
| `/api/admin/video-options` | GET | Published video choices |
| `/api/admin/featured` | GET / PUT | Both `{slot, project_id, revision}` records in a slots array |
| `/api/admin/uploads` | POST | Filename, content_type, size and SHA-256 file fingerprint |
| `/api/admin/uploads/:id` | GET / DELETE | Owner-only status/receipts or cancellation |
| `/api/admin/uploads/:id/parts/:part` | PUT | Binary part plus X-Part-SHA256 |
| `/api/admin/uploads/:id/complete` | POST | Validate all parts and complete |
| `/api/admin/media/:id` | GET / HEAD | Authorized preview of completed media |
| `/media/:id` | GET / HEAD | Media referenced by published projects; supports single byte ranges |

Project writes use snake_case fields matching the D1 schema, with a boolean `published`; `revision` is required for existing records. JSON and binary request bodies are bounded. API failures use `{error, message}` and appropriate 400/401/403/404/409/410/413/429/503 status codes. User text is escaped when rendered, and unsafe URL schemes are rejected.

## Remaining account-dependent validation

The CMS, D1 import, Access organization/provider/application/policy, secret, bindings and scheduled cleanup are live. Readback confirms the active version, hidden secret binding, existing bucket, real database ID, disabled previews and cleanup schedule. Live public reads, images, filters, mobile layout, original R2 video availability and playback passed. Actual PIN delivery, authenticated production CRUD, account quotas and large production uploads require a client login test. The generic example contains placeholders; the ignored production config contains real resource values.

The automatic-cover release was also verified in the owner's authenticated production session: the already uploaded video produced a 1280×720 JPEG in R2, filling the poster field and preview. The temporary editor was discarded without saving a project; the public collection remains at 12 entries. An unrelated local edit to the homepage heading (`Our latest work`) was preserved in source and excluded from this admin release; the deployment uses the previous live homepage asset. Review that local heading before a future full-site build/deployment. No Git push was performed.

The 2026-10-05 copy release changes only the homepage overview label to “Our expertise” / “Onze expertise”. The Services/Diensten navigation label stays in place for the planned separate page. The copy-release homepage asset is retained as .cms-backup/home-label-release-index.html. The later services release below records the current base; preserve the unrelated local showcase heading edit.


## Separate services page release — 2026-10-05

Deployed with explicit user authorization (push) through the official Cloudflare MCP. Active version 88f54eaa-9273-45e2-ab54-1f80760805f8, deployment 438f62c0-35b0-4860-aa8a-148775629439 at 100%. The new /services and /services.html routes serve the bilingual static services page; /services/ redirects to /services.html. Seven public assets changed plus the Worker route handler. D1, existing R2, Access bindings, the administrator secret, runtime asset protection and scheduled cleanup are unchanged.

The homepage asset is built from the preceding live copy release with only services navigation/footer links updated. Current isolated homepage base: .cms-backup/services-release-index.html. The unrelated local Our latest work heading remains in source and is excluded from this release. Public JSON still has the same 12 records and Smartwigi/Terzol featured slots. HTTP route checks, live NL/EN desktop/mobile browser checks, keyboard menu and cross-page navigation passed; anonymous admin, admin JavaScript and admin API requests still redirect to Access. Temporary upload tokens were removed. No Git push was possible or performed: this workspace is not a Git repository.


## Services scroll reveal — 2026-10-05

Published with user authorization: version a013f76e-ca25-4411-8472-71c062b52f97, deployment 5eb5a4fb-f581-4372-a11b-2478d5d8cb95 at 100%. Only services.html and new services-page.js changed. Worker code, bindings, Access, current homepage base, D1 content, R2 media and cleanup remain unchanged.

Native IntersectionObserver/Web Animations reveal the intro, five cards and contact invitation once per visit, with 24px movement, 800ms easing and brief card stagger. The animation uses translate independently of the existing hover transform. Content remains visible without JavaScript or reveal APIs; reduced motion disables and cancels animation, and keyboard focus immediately reveals the contact link. No new animation library is loaded.

Verification: npm run verify passed formatting, typecheck, build, 10 integration tests and 14 browser tests. The focused services suite also passed after adding keyboard-focus coverage. Strict static audit has zero findings. Live desktop/mobile reveal and reduced-motion cancellation passed; homepage HTTP output and public project JSON are unchanged, and anonymous admin JavaScript still redirects to Access. Temporary upload credentials removed. Screenshots: test-results/services-reveal-live-1440.png and services-reveal-live-390.png. No Git repository or Git push.


## Services dark/light release — 2026-10-05

Published with explicit user authorization through the official Cloudflare MCP. Version b43d479d-e0e2-4b89-8834-db5063253c8d, deployment 1a032249-e81d-420c-8713-5dd927186d96 at 100%. Exactly three public assets changed: services.html, services-page.css and language.js. The dark intro and contact sections use the existing homepage palette, with white/light-blue heading emphasis, blue labels, navy text on the white contact button, and a pale five-card services band. Shared header/footer and inner-only scroll reveal remain.

Worker code/resources, all bindings, inherited administrator secret, Worker-first asset protection, database, media and cleanup configuration are unchanged. The staged homepage uses .cms-backup/services-release-index.html; the unrelated local draft heading stays in source and is excluded. Live homepage HTML and portfolio JSON match the pre-release captures exactly. All 12 published records and initial featured selections remain.

Live HTTP checks passed for both services routes, trailing-slash redirect, exact HTML/CSS/language asset bytes, and Access redirects on admin page, script and API. Live Edge checks passed in NL/EN at 1440, 900 and 390 pixels: brand colors, full-width bands, responsive columns, no overflow, keyboard menu, contact navigation, reveal, reduced motion and visible content without JavaScript. No page errors. The browser band-width assertion compares against document body width to accommodate the normal scrollbar. Screenshots: test-results/services-dark-live-1440.png and services-dark-live-390.png. The first immediate HTTP check saw the previous asset during Cloudflare propagation; the subsequent checks passed. Temporary upload tokens removed. No Git repository or Git push.


## Contact page and booking system (prepared locally 2026-10-11, not deployed)

New public files: contact.html, contact.css, contact.js, home-contact.css; changed: index.html, services.html, portfolio.html, services.css, language.js, admin/index.html, admin/admin.js, admin/admin.css; new admin files admin/bookings.html and admin/bookings.js; Worker changes in worker/index.ts and new worker/contact.ts. New routes: /contact, /contact.html (/contact/ redirects), /admin/bookings, public GET /api/booking/slots, POST /api/booking, POST /api/inquiry, and admin endpoints under /api/admin/bookings, /api/admin/appointments/:id/cancel, /api/admin/inquiries/:id/status and /api/admin/closed-days.

**Deploy order matters:** apply the new D1 migration before deploying the Worker, otherwise booking requests fail with 503.

```
npx wrangler d1 migrations list quille-portfolio --remote --config wrangler.production.jsonc
npx wrangler d1 migrations apply quille-portfolio --remote --config wrangler.production.jsonc
npm run build
npx wrangler deploy --config wrangler.production.jsonc
```

Migration 0003_bookings_inquiries.sql only creates new tables and indexes (appointments, closed_days, inquiries); it does not touch projects or uploads. Local verification: formatting, typecheck, build and 19 integration tests passed (10 existing + 9 new contact tests). The Playwright suite was run with Chromium instead of Edge: 14 of 17 tests passed, including the three new tests in tests/browser/contact.spec.mjs (booking with a taken-slot retry, enquiry to admin inbox, phone width and no-JavaScript). The three failures need the large local video files (assets/Material/*.mp4, assets/Landingpage/LandingpageQuille.mp4), which were not present in the verification copy; they do not touch the contact code. Run `npm run verify` on the machine that has the videos before deploying.

## Automatic deploys from GitHub (2026-10-11)

The Worker `quilledesigns` is connected to GitHub `Danteh3-lab/QuilleDesigns` through Cloudflare Workers Builds. Every push to `main` runs `npm clean-install` and the default deploy command `npx wrangler deploy`. The committed `wrangler.jsonc` describes the real Worker and runs `node scripts/build.mjs` as its build step, so no dashboard build command is needed. It contains no account ID (the build environment supplies it) and no secrets; `ADMIN_EMAILS` remains a Worker secret. `wrangler.production.jsonc` stays local and ignored for manual deploys.

The first push (commit a775890) had no Wrangler config: Wrangler guessed a static site and failed on an esbuild host/binary mismatch, so nothing was deployed and the CMS Worker kept running. esbuild is now pinned to 0.28.1, the version Wrangler uses, so installs that skip postinstall scripts still find a matching binary.

Migration 0003_bookings_inquiries.sql was applied to the production D1 database through the Cloudflare MCP on 2026-10-11 and recorded in `d1_migrations` (id 3). Future schema changes: apply the migration first (`npx wrangler d1 migrations apply quille-portfolio --remote --config wrangler.production.jsonc`), then push.

Large video masters in `assets/Material/*.mp4` are ignored by Git (GitHub rejects files over 100 MB); the site streams them from R2. CLOUDFLARE.md and TESTING.md are kept out of the public repository because they list account/database IDs and the admin emails.
