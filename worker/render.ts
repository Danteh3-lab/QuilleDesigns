import { Brand, Project } from "./types";
import { brandSlug, publicData } from "./projects";
export const escape = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const arrow =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M5 5h14v14"/></svg>';
function card(p: Project) {
  const video = p.category === "video",
    kind = video ? "film" : "logo",
    format = video ? ` film-card-${p.orientation}` : "";
  return `<article id="project-${escape(p.id)}" class="project-card ${kind}-card${format}${p.id === "smartwigi" ? " smartwigi-card" : ""}" data-category="${p.category}" data-reveal>
  <a class="project-link" href="${escape(p.media_url)}" data-media="${video ? "video" : "image"}" data-title="${escape(p.title)}" data-poster="${escape(p.poster_url)}" aria-label="${escape(video ? `Watch ${p.title} video` : `View complete ${p.title} poster`)}">
  <div class="project-visual ${video ? "film" : "identity"}-visual">${video ? `<img class="film-backdrop" src="${escape(p.poster_url)}" width="${p.width}" height="${p.height}" alt="" loading="lazy" decoding="async" aria-hidden="true" />` : ""}
  <img class="project-image" src="${escape(p.poster_url)}" width="${p.width}" height="${p.height}" alt="${escape(p.alt_text)}" loading="lazy" decoding="async" />
  ${video ? `<video class="film-preview" data-preview muted loop playsinline preload="none" poster="${escape(p.poster_url)}" aria-hidden="true" tabindex="-1"></video>` : ""}
  <span class="project-tags" aria-hidden="true"><span>${video ? "Film" : "Identity"}</span><span>${video ? "Commercial" : "Logo design"}</span></span><span class="project-open" aria-hidden="true">${arrow}</span></div>
  <div class="project-caption"><div><p>${escape(p.caption || (video ? "Selected film" : "Original identity"))}</p><h3 data-client-content>${escape(p.title)}</h3><span class="project-description" ${p.id.length === 36 ? "data-client-content" : ""}>${escape(p.description)}</span></div><span class="project-type" aria-hidden="true">${video ? "Play film" : "View artwork"} ${arrow}</span></div></a></article>`;
}
type BrandGroup = { id: string; name: string; logo: string; films: Project[] };
// Every brand in the brand list gets a card, also before it has films. Brands with films come
// first, in brand-list order; a film without a known brand gets a card of its own.
export function brandGroups(films: Project[], brands: Brand[]): BrandGroup[] {
  const groups = new Map<string, BrandGroup>();
  brands.forEach((b) =>
    groups.set(`brand:${b.name.trim().toLowerCase()}`, {
      id: b.id,
      name: b.name,
      logo: b.logo_url,
      films: [],
    }),
  );
  [...films]
    .sort((a, b) => a.display_order - b.display_order || (a.id < b.id ? -1 : 1))
    .forEach((p) => {
      const name = (p.brand || "").trim();
      const key = name ? `brand:${name.toLowerCase()}` : `film:${p.id}`;
      if (!groups.has(key))
        groups.set(key, {
          id: brandSlug(name || p.title),
          name: name || p.title,
          logo: "",
          films: [],
        });
      groups.get(key)!.films.push(p);
    });
  const used = new Set<string>();
  const all = [...groups.values()];
  return [
    ...all.filter((g) => g.films.length),
    ...all.filter((g) => !g.films.length),
  ].map((group) => {
    let id = group.id;
    for (let n = 2; used.has(id); n++) id = `${group.id}-${n}`;
    used.add(id);
    return { ...group, id };
  });
}
function brandCard(group: BrandGroup) {
  const count = group.films.length;
  const face = `<span class="project-visual brand-visual">
  ${group.logo ? `<span class="brand-logo"><img src="${escape(group.logo)}" alt="${escape(`${group.name} logo`)}" loading="lazy" decoding="async" /></span>` : `<span class="brand-wordmark" data-client-content aria-hidden="true">${escape(group.name)}</span>`}
  ${count ? `<span class="project-open" aria-hidden="true">${arrow}</span>` : ""}</span>`;
  const name = `<h3 class="brand-name" data-client-content>${escape(group.name)}</h3>`;
  if (!count)
    return `<article class="brand-card is-empty" id="brand-${escape(group.id)}" data-reveal><div class="brand-summary">${face}
  <span class="brand-count mono"><span>Films coming soon</span></span>${name}</div></article>`;
  return `<details class="brand-card" id="brand-${escape(group.id)}" data-brand="${escape(group.id)}" data-brand-name="${escape(group.name)}" data-reveal>
  <summary class="brand-summary" aria-label="${escape(`View ${group.name} films`)}">${face}
  <span class="brand-count mono"><b>${String(count).padStart(2, "0")}</b> <span>${count === 1 ? "film" : "films"}</span></span>${name}<span class="project-type brand-cue" aria-hidden="true">View films ${arrow}</span>
  </summary>
  <div class="brand-films">${group.films.map(card).join("")}</div></details>`;
}
function collection(projects: Project[], brands: Brand[]) {
  if (!projects.length && !brands.length)
    return '<p role="status">No projects are currently published.</p>';
  const films = projects.filter((p) => p.category === "video"),
    logos = projects.filter((p) => p.category === "logo");
  return `${
    films.length || brands.length
      ? `<section class="project-group film-group" data-project-group="video" aria-labelledby="film-group-title"><div class="project-group-heading"><h3 id="film-group-title">Films</h3><span class="project-group-count mono" aria-hidden="true"><span data-count-category="video">${films.length.toString().padStart(2, "0")}</span></span></div><div class="project-grid project-grid-brands">${brandGroups(
          films,
          brands,
        )
          .map(brandCard)
          .join("")}</div></section>`
      : ""
  }
  ${logos.length ? `<section class="project-group identity-group" data-project-group="logo" aria-labelledby="identity-group-title"><div class="project-group-heading"><h3 id="identity-group-title">Brand identities</h3><span class="project-group-count mono" aria-hidden="true"><span data-count-category="logo">${logos.length.toString().padStart(2, "0")}</span></span></div><div class="project-grid project-grid-identities">${logos.map(card).join("")}</div></section>` : ""}`;
}
function featured(p: Project, index: number) {
  const theme = index === 0 ? "smartwigi" : "terzol";
  return `<article class="showcase-card showcase-card-${theme}"><div class="showcase-visual showcase-visual-${theme}" data-showcase-video-stage><img class="showcase-image" src="${escape(p.poster_url)}" width="${p.width}" height="${p.height}" alt="${escape(p.alt_text)}" loading="lazy" decoding="async" />
  <a class="showcase-play" href="${escape(p.media_url)}" data-showcase-play data-video-url="${escape(p.media_url)}" data-video-title="${escape(p.title)}" aria-label="${escape(`Play ${p.title} commercial`)}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.8c0-.8.9-1.3 1.6-.9l10 6.2a1 1 0 0 1 0 1.7l-10 6.2a1 1 0 0 1-1.6-.9V5.8Z"/></svg><span>Play film</span></a><p class="showcase-video-status" data-showcase-video-status role="status" aria-live="polite" hidden></p></div>
  <div class="showcase-project-info"><div><span class="showcase-project-kind">Commercial film</span><h3><a data-client-content href="portfolio.html#project-${escape(p.id)}">${escape(p.title)}</a></h3></div><a class="showcase-project-action" href="portfolio.html#project-${escape(p.id)}" aria-label="${escape(`View ${p.title} project`)}">View project <span aria-hidden="true">↗</span></a></div></article>`;
}
export function render(
  response: Response,
  data: Awaited<ReturnType<typeof publicData>> | null,
  portfolio: boolean,
) {
  const {
    projects,
    featured: slots,
    brands,
  } = data ?? { projects: [], featured: [], brands: [] };
  const error =
    '<p role="status">Projects are temporarily unavailable. Please try again later.</p>';
  let rewriter = new HTMLRewriter();
  if (portfolio) {
    rewriter = rewriter
      .on("#work-collection", {
        element(e) {
          e.setInnerContent(data ? collection(projects, brands) : error, {
            html: true,
          });
        },
      })
      .on("[data-count-category]", {
        element(e) {
          e.setInnerContent(
            data
              ? String(
                  projects.filter(
                    (p) =>
                      e.getAttribute("data-count-category") === "all" ||
                      p.category === e.getAttribute("data-count-category"),
                  ).length,
                ).padStart(2, "0")
              : "—",
          );
        },
      })
      .on(".portfolio-filters button span", {
        element(e) {
          const i = filterIndex++;
          e.setInnerContent(
            String(
              i === 0
                ? projects.length
                : projects.filter(
                    (p) => p.category === (i === 1 ? "video" : "logo"),
                  ).length,
            ).padStart(2, "0"),
          );
        },
      })
      .on(".collection-count", {
        element(e) {
          e.setInnerContent(
            data ? `${projects.length} projects` : "Projects unavailable",
          );
        },
      })
      .on(".ticker-group", {
        element(e) {
          e.setInnerContent(
            projects
              .map((p) => `<li data-client-content>${escape(p.title)}</li>`)
              .join(""),
            { html: true },
          );
        },
      });
    const hero =
      projects.find((p) => p.id === "mage-ev") ??
      projects.find((p) => p.category === "video") ??
      projects[0];
    rewriter = rewriter
      .on(".hero-photo > img", {
        element(e) {
          if (hero) {
            e.setAttribute("src", hero.poster_url);
            e.setAttribute("alt", hero.alt_text);
          } else e.remove();
        },
      })
      .on(".hero-art-label", {
        element(e) {
          e.setInnerContent(
            hero
              ? `<p class="mono">In the collection</p><p data-client-content>${escape(hero.title)} <span>${hero.category === "video" ? "Selected film" : "Logo design"}</span></p>`
              : "",
            { html: true },
          );
        },
      })
      .on(".hero-miniatures", {
        element(e) {
          e.setInnerContent(
            projects
              .filter((p) => p.category === "logo")
              .slice(0, 3)
              .map(
                (p) =>
                  `<img src="${escape(p.poster_url)}" width="${p.width}" height="${p.height}" alt="" />`,
              )
              .join(""),
            { html: true },
          );
        },
      });
  } else {
    rewriter = rewriter
      .on("#showcase-track", {
        element(e) {
          e.setInnerContent(data ? slots.map(featured).join("") : error, {
            html: true,
          });
        },
      })
      .on(".showcase-heading > p", {
        element(e) {
          e.setInnerContent(
            slots.length === 2
              ? `Commercial films for ${slots[0].title} and ${slots[1].title}.`
              : "Selected commercial films.",
          );
        },
      });
  }
  let filterIndex = 0;
  const transformed = rewriter.transform(response);
  const headers = new Headers(transformed.headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("ETag");
  headers.delete("Content-Length");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(transformed.body, {
    status: data ? response.status : 503,
    headers,
  });
}
