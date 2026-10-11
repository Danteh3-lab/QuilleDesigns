# Portfolio CMS behavior

The client owns all CMS operations. This request and the accepted implementation plan establish the rules below. Visual ownership remains in DESIGN.md and the existing CSS.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in admin/index.html | This contract | Category, gallery row, featured project | Browser keyboard and narrow layout |
| Form | projectForm and featuredForm in admin/admin.js | Worker validation and this contract | Create, edit, featured selection | Browser CRUD and integration validation |
| Scrollbar | portfolio-gallery.css tokens and admin/admin.css baseline | DESIGN.md | Document, textarea, dialog | Browser mobile and computed styles |
| Toast | status and errorBanner in admin/admin.js | This contract | Success status, persistent error | Browser success, offline and session failures |
| CRUD | admin/admin.js and Worker project API | Accepted client plan and database triggers | Save returns to list; cancel restores list | Browser full flow and Worker integration |

- Access authentication and an exact email allowlist grant one administrator role. The Worker checks every admin request; credentials never enter browser storage.
- Lists paginate at 24 and preserve gallery row/page in the URL. Move up/down changes order within a format group and works without dragging.
- New projects start as drafts. Explicit Save commits. Server-confirmed success returns to the list and refreshes featured choices. Failure retains entered values.
- Both homepage slots select distinct published video projects. Database triggers reject deletion, unpublication and conversion to logo for featured projects until replacements are saved.
- Project deletion uses an accessible native dialog, names the project, retains media, and focuses Cancel first. Escape cancels; focus returns to the opener when present.
- Native selects intentionally use platform-owned popups. Product forms use novalidate and inline, associated errors. The page owns validation; the Worker validates independently.
- Safe project drafts and upload checkpoints live in sessionStorage, contain no authentication tokens, and are removed on save, discard or successful cancellation. The server still rejects stale revisions after restoration.
- Uploads use one active file per editor, two chunk requests, five bounded attempts, checksum validation, retry, cancellation and reselection of the original file after reload. The server owns upload receipts and expires unfinished sessions after 24 hours.
- Completed video uploads generate a JPEG cover near the first second if the poster field is empty. Generated artwork uses the same authenticated upload APIs and validation as a selected image. Automatic generation preserves custom artwork, including edits made while it runs. “Use video thumbnail” is an explicit, reversible poster replacement before Save; it also works for an already uploaded managed video. Browser decoding is bounded and cancellable. Unsupported codecs or unreadable external sources offer manual artwork instead; the video URL and safe draft remain intact. A failed cover upload can resume after reload using the saved video reference without reuploading the video. Alt text remains client-authored and required.
- Publication affects website visibility. Previously public R2 URLs cannot be revoked by unpublishing. Deletion retains all R2 files; permanent asset purging is outside this CMS.
- Admin defaults to Dutch and shares the existing English language preference. Client-authored titles and new descriptions are shown as entered. Authentication screens belong to Cloudflare Access.
- Keep natural document scrolling, visible focus, 44px controls, mobile actions and reduced-motion support. Errors stay visible until a new operation or reload.

Static audit limitations: the bundled audit scans literal HTML buttons for inline handlers and cannot recognize the site's existing external-script handlers. The 25 original public-site findings are retained as baseline evidence; browser tests verify language/menu/filter/viewer/showcase controls and contact chips. New admin controls start disabled until the authenticated data load finishes and attach handlers in the external script, consistent with its strict CSP.

# Booking system and enquiries

| Capability | Canonical owner | Source of truth | Verification |
|---|---|---|---|
| Availability and booking | worker/contact.ts | This contract; migration 0003 | tests/cms.test.ts contact suite |
| Enquiries | worker/contact.ts | This contract | tests/cms.test.ts contact suite |
| Inbox, cancel, closed days | admin/bookings.js + worker/contact.ts | This contract | tests/cms.test.ts contact suite |

- Small jobs (logo, poster, business card design) are booked; bigger projects (promo production, social media management, other) use the enquiry form.
- Appointments are 30 minutes, Monday to Friday, 09:00–17:30 start times, in Suriname time (America/Paramaribo, UTC−3, no daylight saving). Customers can book from two hours ahead up to 28 days ahead.
- A partial unique index guarantees one booked appointment per slot; the Worker also rechecks availability. A taken slot returns 409 and the page reloads the times.
- One email address can hold at most two upcoming appointments. Enquiries are limited to three per email per 24 hours and thirty per hour overall. Public POSTs must come from PUBLIC_ORIGIN and carry an empty hidden “website” field.
- Administrators can cancel an appointment (the slot becomes free again), mark enquiries handled/new, and close or reopen whole days. Closing a day keeps existing appointments; the response reports how many exist so the admin can contact those customers.
- Notifications appear in /admin/bookings only. No email is sent to Quille or to customers; customers get an on-screen confirmation and a calendar file.
