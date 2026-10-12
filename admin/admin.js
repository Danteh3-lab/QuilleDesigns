(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const form = $("projectForm");
  let language = "nl";
  try {
    language = localStorage.getItem("quille-language") === "en" ? "en" : "nl";
  } catch {
    /* Optional storage. */
  }
  const nl = {
    "View portfolio": "Portfolio bekijken",
    "Appointments & enquiries": "Afspraken & aanvragen",
    "Sign out": "Uitloggen",
    "Studio content": "Studio content",
    "Portfolio manager": "Portfolio beheer",
    "Add project": "Project toevoegen",
    Reload: "Opnieuw laden",
    "Sign in again": "Opnieuw inloggen",
    Projects: "Projecten",
    "Gallery row": "Galerijrij",
    "All projects": "Alle projecten",
    "Landscape films": "Liggende films",
    "Portrait films": "Staande films",
    "Brand identities": "Merkidentiteiten",
    Previous: "Vorige",
    Next: "Volgende",
    Cancel: "Annuleren",
    "Project title": "Projecttitel",
    Category: "Categorie",
    Video: "Video",
    Logo: "Logo",
    "Brand (company)": "Merk (bedrijf)",
    "Films with the same brand are shown together under one card on the portfolio.":
      "Films met hetzelfde merk staan samen onder één kaart in het portfolio.",
    "Brand logo URL": "Merklogo URL",
    "Upload logo": "Logo uploaden",
    "Optional. Sets the logo on this brand's portfolio card. A new brand name adds a new card.":
      "Optioneel. Dit wordt het logo op de portfoliokaart van dit merk. Een nieuwe merknaam maakt een nieuwe kaart.",
    "Video format": "Videoformaat",
    Landscape: "Liggend",
    Portrait: "Staand",
    "Poster / artwork URL": "Poster / illustratie URL",
    "Upload artwork": "Illustratie uploaden",
    "Use video thumbnail": "Videominiatuur gebruiken",
    "Video uploads create a cover automatically when this field is empty. You can replace it with your own image.":
      "Video-uploads maken automatisch een omslag als dit veld leeg is. Je kunt deze vervangen door je eigen afbeelding.",
    "Creating video cover…": "Video-omslag maken…",
    "Could not create a video cover. Upload artwork or try again.":
      "De video-omslag kon niet worden gemaakt. Upload een afbeelding of probeer opnieuw.",
    "The video is uploaded. Add a cover with Upload artwork or retry the thumbnail.":
      "De video is geüpload. Voeg een omslag toe via Illustratie uploaden of probeer de miniatuur opnieuw.",
    "Cover upload failed. The video is uploaded. Retry or upload artwork.":
      "Uploaden van de omslag is mislukt. De video is geüpload. Probeer opnieuw of upload een afbeelding.",
    "Video cover": "Video-omslag",
    "JPEG, PNG or WebP. Maximum 20 MiB.": "JPEG, PNG of WebP. Maximaal 20 MiB.",
    "Media URL": "Media URL",
    "Upload media": "Media uploaden",
    "MP4 / WebM up to 2 GiB, or artwork up to 20 MiB. Direct HTTPS file URLs are supported.":
      "MP4 / WebM tot 2 GiB, of illustraties tot 20 MiB. Directe HTTPS-bestandslinks zijn toegestaan.",
    "Retry upload": "Upload opnieuw proberen",
    "Cancel upload": "Upload annuleren",
    "Alt text": "Alt-tekst",
    Caption: "Bijschrift",
    "Display order": "Weergavevolgorde",
    Description: "Omschrijving",
    "Artwork width": "Breedte illustratie",
    "Artwork height": "Hoogte illustratie",
    "Published on the website": "Gepubliceerd op de website",
    "Unpublishing removes the project from the website. Existing public media links remain accessible.":
      "Na het intrekken verdwijnt het project van de website. Bestaande openbare medialinks blijven toegankelijk.",
    "Save project": "Project opslaan",
    "Homepage videos": "Video’s op de homepage",
    "Choose two different published videos. Replace a featured video here before unpublishing or deleting it.":
      "Kies twee verschillende gepubliceerde video’s. Vervang een uitgelichte video hier voordat je deze intrekt of verwijdert.",
    "First featured card": "Eerste uitgelichte kaart",
    "Second featured card": "Tweede uitgelichte kaart",
    "Save homepage videos": "Homepage video’s opslaan",
    Edit: "Bewerken",
    Publish: "Publiceren",
    Unpublish: "Publicatie intrekken",
    Delete: "Verwijderen",
    "Move up": "Omhoog",
    "Move down": "Omlaag",
    Published: "Gepubliceerd",
    Draft: "Concept",
    "Loading…": "Laden…",
    "No projects yet. Add your first project.":
      "Er zijn nog geen projecten. Voeg je eerste project toe.",
    "No projects in this gallery row.": "Geen projecten in deze galerijrij.",
    "Saved.": "Opgeslagen.",
    "Project deleted. Media files are retained.":
      "Project verwijderd. Mediabestanden blijven bewaard.",
    "Edit project": "Project bewerken",
    "New project": "Nieuw project",
    "Discard changes?": "Wijzigingen weggooien?",
    "Your unsaved changes will be lost.":
      "Je niet-opgeslagen wijzigingen gaan verloren.",
    Discard: "Weggooien",
    "Delete project?": "Project verwijderen?",
    "The project will be removed from the website. Media files will be retained.":
      "Het project wordt verwijderd van de website. Mediabestanden blijven bewaard.",
    "Please check this field.": "Controleer dit veld.",
    "Please correct the highlighted fields.":
      "Controleer de gemarkeerde velden.",
    "Choose two different published videos.":
      "Kies twee verschillende gepubliceerde video’s.",
    "Choose a replacement in Homepage videos before removing this featured project.":
      "Kies eerst een vervanging bij Video’s op de homepage voordat je dit uitgelichte project verwijdert of intrekt.",
    "Your session expired. Sign in again, then retry.":
      "Je sessie is verlopen. Log opnieuw in en probeer het opnieuw.",
    "This account does not have administrator access.":
      "Dit account heeft geen toegang tot het beheer.",
    "This content changed in another tab. Reload before saving.":
      "Deze inhoud is gewijzigd in een ander tabblad. Laad opnieuw voordat je opslaat.",
    "The service is temporarily unavailable. Check your connection and retry.":
      "De dienst is tijdelijk niet beschikbaar. Controleer je verbinding en probeer het opnieuw.",
    "Please check the project fields or media URL.":
      "Controleer de projectvelden of de media URL.",
    "The file is empty, too large, or unsupported.":
      "Het bestand is leeg, te groot of niet ondersteund.",
    "The file contents do not match the selected file type.":
      "De bestandsinhoud komt niet overeen met het geselecteerde bestandstype.",
    "This upload expired or was cancelled. Select the file to start again.":
      "Deze upload is verlopen of geannuleerd. Selecteer het bestand om opnieuw te beginnen.",
    "Reselect the original file to resume this upload.":
      "Selecteer het oorspronkelijke bestand opnieuw om deze upload te hervatten.",
    "Upload failed. Retry or reselect the original file.":
      "Upload mislukt. Probeer opnieuw of selecteer het oorspronkelijke bestand opnieuw.",
    "Upload complete. Save the project to use this file.":
      "Upload voltooid. Sla het project op om dit bestand te gebruiken.",
    "Upload cancelled.": "Upload geannuleerd.",
    "Completing upload…": "Upload afronden…",
    "Resuming upload…": "Upload hervatten…",
    "Finish or cancel the current upload first.":
      "Voltooi of annuleer eerst de huidige upload.",
    "Administrator access has not been configured.":
      "Beheerderstoegang is nog niet ingesteld.",
  };
  const t = (key) => (language === "nl" ? nl[key] || key : key);
  const button = (label, action, className = "") => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t(label);
    b.className = className;
    b.addEventListener("click", action);
    return b;
  };
  let editing = null,
    dirty = false,
    busy = false,
    initialized = false,
    featured = [],
    list = [],
    loading = null,
    activeUpload = null,
    total = 0;
  const params = new URLSearchParams(location.search);
  let page = Math.max(1, Number(params.get("page") || 1)),
    group = ["all", "landscape", "portrait", "logo"].includes(
      params.get("group"),
    )
      ? params.get("group")
      : "all";
  $("groupFilter").value = group;
  function localize() {
    document.documentElement.lang = language;
    document.title = `Quille Designs — ${t("Portfolio manager")}`;
    document
      .querySelectorAll("[data-label]")
      .forEach((e) => (e.textContent = t(e.dataset.label)));
    $("languageButton").textContent = language === "nl" ? "EN" : "NL";
  }
  function announce(key) {
    $("status").textContent = t(key);
  }
  function errorMessage(error) {
    const messages = {
      sign_in_required: "Your session expired. Sign in again, then retry.",
      not_allowed: "This account does not have administrator access.",
      auth_configuration: "Administrator access has not been configured.",
      stale_revision:
        "This content changed in another tab. Reload before saving.",
      featured_project:
        "Choose a replacement in Homepage videos before removing this featured project.",
      invalid_featured: "Choose two different published videos.",
      validation: "Please check the project fields or media URL.",
      unsupported_file:
        "The file contents do not match the selected file type.",
      file_changed: "Reselect the original file to resume this upload.",
      upload_expired:
        "This upload expired or was cancelled. Select the file to start again.",
      thumbnail_unavailable:
        "Could not create a video cover. Upload artwork or try again.",
    };
    return t(
      messages[error.code] ||
        "The service is temporarily unavailable. Check your connection and retry.",
    );
  }
  function showError(error) {
    if (error.name === "AbortError") return;
    $("errorBanner").hidden = false;
    $("errorText").textContent = errorMessage(error);
    $("loginLink").hidden = error.code !== "sign_in_required";
    $("retryButton").disabled = false;
    $("projectList").setAttribute("aria-busy", "false");
  }
  async function api(path, options = {}) {
    const response = await fetch(`/api/admin/${path}`, {
      credentials: "same-origin",
      ...options,
      headers: {
        "X-CMS-Request": "1",
        ...(options.body && typeof options.body === "string"
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });
    if (!response.headers.get("content-type")?.includes("application/json"))
      throw Object.assign(new Error("Session expired"), {
        code: "sign_in_required",
      });
    const value = await response.json();
    if (!response.ok)
      throw Object.assign(new Error(value.message), {
        code: value.error,
        status: response.status,
      });
    return value;
  }
  async function run(action) {
    if (busy) return;
    busy = true;
    $("errorBanner").hidden = true;
    const controls = [...document.querySelectorAll("button")];
    controls.forEach((b) => {
      b.dataset.wasDisabled = String(b.disabled);
      b.disabled = true;
    });
    try {
      await action();
    } catch (error) {
      showError(error);
    } finally {
      busy = false;
      controls.forEach((b) => {
        b.disabled = b.dataset.wasDisabled === "true";
      });
      $("previousPage").disabled = page <= 1;
      $("nextPage").disabled = page * 24 >= total;
    }
  }
  function previewURL(url) {
    return /^\/media\//.test(url)
      ? url.replace("/media/", "/api/admin/media/")
      : url.startsWith("assets/")
        ? "/" + url
        : url;
  }
  // Suggest the brand list so films group under the same spelling.
  async function loadBrands() {
    try {
      const brands = await api("brands");
      $("brandOptions").replaceChildren(
        ...brands.map((brand) => new Option(brand.name)),
      );
    } catch {
      /* Suggestions are optional. */
    }
  }
  async function loadList() {
    loading?.abort();
    loading = new AbortController();
    $("projectList").setAttribute("aria-busy", "true");
    $("projectList").textContent = t("Loading…");
    const data = await api(`projects?page=${page}&group=${group}`, {
      signal: loading.signal,
    });
    list = data.projects;
    loadBrands();
    page = data.page;
    total = data.total;
    const url = new URL(location.href);
    url.searchParams.set("page", page);
    url.searchParams.set("group", group);
    history.replaceState(null, "", url);
    const fragment = document.createDocumentFragment();
    for (const p of list) {
      const article = document.createElement("article");
      article.className = "project-row";
      const image = document.createElement("img");
      image.src = previewURL(p.poster_url);
      image.alt = "";
      image.loading = "lazy";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = p.title;
      const meta = document.createElement("p");
      meta.textContent = `${t(p.category === "logo" ? "Logo" : p.orientation === "landscape" ? "Landscape films" : "Portrait films")} · ${t(p.published ? "Published" : "Draft")} · ${p.display_order}`;
      details.append(title, meta);
      const actions = document.createElement("div");
      actions.className = "row-actions";
      actions.append(
        button("Edit", () => openEditor(p)),
        button("Move up", () =>
          mutate(`projects/${p.id}/move`, "POST", {
            direction: "up",
            revision: p.revision,
          }),
        ),
        button("Move down", () =>
          mutate(`projects/${p.id}/move`, "POST", {
            direction: "down",
            revision: p.revision,
          }),
        ),
        button(p.published ? "Unpublish" : "Publish", () =>
          mutate(`projects/${p.id}`, "PUT", { ...p, published: !p.published }),
        ),
        button(
          "Delete",
          async () => {
            if (
              await confirmAction(
                t("Delete project?"),
                `${p.title}. ${t("The project will be removed from the website. Media files will be retained.")}`,
                t("Delete"),
              )
            )
              await mutate(
                `projects/${p.id}`,
                "DELETE",
                { revision: p.revision },
                "Project deleted. Media files are retained.",
              );
          },
          "delete",
        ),
      );
      article.append(image, details, actions);
      fragment.append(article);
    }
    if (!list.length) {
      const empty = document.createElement("p");
      empty.textContent = t(
        group === "all"
          ? "No projects yet. Add your first project."
          : "No projects in this gallery row.",
      );
      fragment.append(empty);
    }
    $("projectList").replaceChildren(fragment);
    $("projectList").setAttribute("aria-busy", "false");
    $("pageStatus").textContent =
      language === "nl"
        ? `Pagina ${page} van ${Math.max(1, Math.ceil(data.total / 24))} · ${data.total} projecten`
        : `Page ${page} of ${Math.max(1, Math.ceil(data.total / 24))} · ${data.total} projects`;
    $("previousPage").disabled = page <= 1;
    $("nextPage").disabled = page * 24 >= data.total;
  }
  async function loadFeatured() {
    const [slots, options] = await Promise.all([
      api("featured"),
      api("video-options"),
    ]);
    featured = slots;
    ["featuredOne", "featuredTwo"].forEach((id, index) => {
      const select = $(id);
      select.replaceChildren(
        ...options.map((p) => {
          const o = document.createElement("option");
          o.value = p.id;
          o.textContent = p.title;
          return o;
        }),
      );
      select.value = slots[index]?.project_id || "";
    });
  }
  async function refresh() {
    await Promise.all([loadList(), loadFeatured()]);
  }
  async function mutate(path, method, value, message = "Saved.") {
    await run(async () => {
      await api(path, { method, body: JSON.stringify(value) });
      await refresh();
      announce(message);
    });
  }
  function confirmAction(title, message, label) {
    return new Promise((resolve) => {
      const dialog = $("confirmDialog"),
        opener = document.activeElement;
      $("confirmTitle").textContent = title;
      $("confirmMessage").textContent = message;
      $("confirmAction").textContent = label;
      const close = () => {
        dialog.removeEventListener("close", close);
        resolve(dialog.returnValue === "yes");
        opener?.focus({ preventScroll: true });
      };
      dialog.returnValue = "";
      dialog.addEventListener("close", close);
      dialog.showModal();
      $("confirmCancel").focus();
    });
  }
  $("confirmCancel").addEventListener("click", () =>
    $("confirmDialog").close("no"),
  );
  $("confirmAction").addEventListener("click", () =>
    $("confirmDialog").close("yes"),
  );
  function values() {
    const data = Object.fromEntries(new FormData(form));
    ["width", "height", "display_order"].forEach(
      (k) => (data[k] = Number(data[k])),
    );
    data.published = form.elements.published.checked;
    if (editing) data.revision = editing.revision;
    return data;
  }
  function saveDraft() {
    if (!dirty) return;
    try {
      sessionStorage.setItem(
        "cms-draft",
        JSON.stringify({ editing, data: values() }),
      );
    } catch {
      /* Storage optional. */
    }
  }
  async function canLeave() {
    if (activeUpload?.running) {
      announce("Finish or cancel the current upload first.");
      return false;
    }
    return (
      !dirty ||
      (await confirmAction(
        t("Discard changes?"),
        t("Your unsaved changes will be lost."),
        t("Discard"),
      ))
    );
  }
  async function openEditor(project = null, restored = null) {
    if (!restored && !(await canLeave())) return;
    editing = project;
    const data = restored ||
      project || {
        title: "",
        category: "video",
        orientation: "landscape",
        poster_url: "",
        media_url: "",
        alt_text: "",
        caption: "",
        description: "",
        brand: "",
        brand_logo_url: "",
        display_order: Math.max(-10, ...list.map((p) => p.display_order)) + 10,
        width: 1280,
        height: 720,
        published: false,
      };
    form.reset();
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) {
        if (field.type === "checkbox") field.checked = !!value;
        else field.value = value;
      }
    });
    document
      .querySelectorAll(".field-error")
      .forEach((e) => (e.textContent = ""));
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((e) => e.removeAttribute("aria-invalid"));
    $("editorTitle").textContent = t(project ? "Edit project" : "New project");
    $("listPanel").hidden = true;
    $("featuredPanel").hidden = true;
    $("editPanel").hidden = false;
    dirty = !!restored;
    $("orientationField").hidden = $("brandFields").hidden =
      data.category === "logo";
    updatePoster();
    updateVideoCoverControls();
    form.elements.title.focus();
  }
  async function closeEditor() {
    if (!(await canLeave())) return;
    dirty = false;
    sessionStorage.removeItem("cms-draft");
    $("editPanel").hidden = true;
    $("listPanel").hidden = false;
    $("featuredPanel").hidden = false;
    editing = null;
    $("newProject").focus();
  }
  function updatePoster() {
    const url = form.elements.poster_url.value;
    $("posterPreview").hidden = !url;
    if (url && validURL(url)) $("posterPreview").src = previewURL(url);
  }
  function videoCoverSource() {
    const url = form.elements.media_url.value.trim();
    if (validURL(url)) return previewURL(url);
    const file = $("mediaFile").files[0];
    return file?.type.startsWith("video/") ? file : null;
  }
  function updateVideoCoverControls() {
    const video = form.elements.category.value === "video";
    $("videoCoverControls").hidden = !video;
    $("useVideoCover").disabled =
      !video || !!activeUpload?.running || !videoCoverSource();
  }
  function validURL(url) {
    if (/^\/?assets\//.test(url) && !url.includes("..")) return true;
    if (/^\/media\/[a-f0-9-]{36}$/.test(url)) return true;
    try {
      const u = new URL(url);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }
  form.addEventListener("input", () => {
    dirty = true;
    saveDraft();
    updateVideoCoverControls();
  });
  form.elements.category.addEventListener("change", () => {
    $("orientationField").hidden = $("brandFields").hidden =
      form.elements.category.value === "logo";
    updateVideoCoverControls();
  });
  form.elements.poster_url.addEventListener("change", updatePoster);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (activeUpload?.running) {
      announce("Finish or cancel the current upload first.");
      return;
    }
    const data = values();
    let first = null;
    [
      "title",
      "poster_url",
      "media_url",
      "alt_text",
      "display_order",
      "width",
      "height",
    ].forEach((key) => {
      const field = form.elements.namedItem(key);
      const invalid =
        !String(data[key]).trim() ||
        (["poster_url", "media_url"].includes(key) && !validURL(data[key])) ||
        (["display_order", "width", "height"].includes(key) &&
          (!Number.isInteger(data[key]) ||
            data[key] < (key === "display_order" ? 0 : 1) ||
            data[key] > (key === "display_order" ? 1000000 : 20000)));
      field.setAttribute("aria-invalid", String(invalid));
      const error = form.querySelector(`[data-error="${key}"]`);
      error.id = `error-${key}`;
      field.setAttribute("aria-describedby", error.id);
      error.textContent = invalid ? t("Please check this field.") : "";
      if (invalid && !first) first = field;
    });
    if (first) {
      announce("Please correct the highlighted fields.");
      first.focus();
      return;
    }
    run(async () => {
      await api(editing ? `projects/${editing.id}` : "projects", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      dirty = false;
      sessionStorage.removeItem("cms-draft");
      await closeEditor();
      await refresh();
      announce("Saved.");
    });
  });
  $("featuredForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      $("featuredOne").value === $("featuredTwo").value ||
      !$("featuredOne").value ||
      !$("featuredTwo").value
    ) {
      $("featuredError").textContent = t(
        "Choose two different published videos.",
      );
      $("featuredOne").focus();
      return;
    }
    $("featuredError").textContent = "";
    mutate("featured", "PUT", {
      slots: featured.map((s, i) => ({
        slot: s.slot,
        revision: s.revision,
        project_id: $(i ? "featuredTwo" : "featuredOne").value,
      })),
    });
  });
  $("newProject").addEventListener("click", () => openEditor());
  $("closeEditor").addEventListener("click", closeEditor);
  $("discardProject").addEventListener("click", closeEditor);
  $("groupFilter").addEventListener("change", () => {
    group = $("groupFilter").value;
    page = 1;
    loadList().catch(showError);
  });
  $("previousPage").addEventListener("click", () => {
    page--;
    loadList().catch(showError);
  });
  $("nextPage").addEventListener("click", () => {
    page++;
    loadList().catch(showError);
  });
  $("retryButton").addEventListener("click", () =>
    (initialized ? refresh() : initialize())
      .then(() => {
        $("errorBanner").hidden = true;
      })
      .catch(showError),
  );
  $("languageButton").addEventListener("click", () => {
    language = language === "nl" ? "en" : "nl";
    try {
      localStorage.setItem("quille-language", language);
    } catch {}
    localize();
    if (!$("listPanel").hidden) loadList().catch(showError);
    if (!$("editPanel").hidden)
      $("editorTitle").textContent = t(
        editing ? "Edit project" : "New project",
      );
  });
  window.addEventListener("beforeunload", (event) => {
    if (dirty || activeUpload?.running) {
      saveDraft();
      event.preventDefault();
      event.returnValue = "";
    }
  });
  $("loginLink").target = "_blank";
  $("loginLink").rel = "noopener";
  document
    .querySelector('a[href="/cdn-cgi/access/logout"]')
    .addEventListener("click", async (event) => {
      event.preventDefault();
      if (await canLeave()) {
        dirty = false;
        sessionStorage.removeItem("cms-draft");
        location.assign("/cdn-cgi/access/logout");
      }
    });
  const hash = async (bytes) =>
    [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  async function fingerprint(file) {
    const metadata = new TextEncoder().encode(
      `${file.name}|${file.size}|${file.lastModified}|`,
    );
    const first = new Uint8Array(await file.slice(0, 8192).arrayBuffer()),
      last = new Uint8Array(
        await file.slice(Math.max(0, file.size - 8192)).arrayBuffer(),
      );
    const bytes = new Uint8Array(metadata.length + first.length + last.length);
    bytes.set(metadata);
    bytes.set(first, metadata.length);
    bytes.set(last, metadata.length + first.length);
    return hash(bytes);
  }
  function uploadPart(upload, part, blob, checksum, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      upload.requests.add(xhr);
      xhr.open("PUT", `/api/admin/uploads/${upload.id}/parts/${part}`);
      xhr.setRequestHeader("X-CMS-Request", "1");
      xhr.setRequestHeader("X-Part-SHA256", checksum);
      xhr.timeout = 120000;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded);
      };
      const finish = () => upload.requests.delete(xhr);
      xhr.onload = () => {
        finish();
        let data;
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          reject({ code: "sign_in_required" });
          return;
        }
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject({ code: data.error, status: xhr.status });
      };
      xhr.onerror = xhr.ontimeout = () => {
        finish();
        reject({ status: 503 });
      };
      xhr.onabort = () => {
        finish();
        reject({ code: "cancelled" });
      };
      xhr.send(blob);
    });
  }
  function extractVideoCover(source, signal) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const objectURL =
        source instanceof File ? URL.createObjectURL(source) : null;
      let settled = false,
        capturing = false,
        seeking = false;
      const finish = (error, file) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal.removeEventListener("abort", cancel);
        video.onloadeddata = video.onseeked = video.onerror = null;
        video.pause();
        video.removeAttribute("src");
        video.load();
        if (objectURL) URL.revokeObjectURL(objectURL);
        canvas.width = canvas.height = 0;
        if (error) reject(error);
        else resolve(file);
      };
      const cancel = () => finish({ code: "cancelled" });
      const timer = setTimeout(
        () => finish({ code: "thumbnail_unavailable" }),
        20000,
      );
      const capture = () => {
        if (settled || capturing || video.readyState < 2) return;
        capturing = true;
        try {
          if (!video.videoWidth || !video.videoHeight)
            throw new Error("No video frame");
          const scale = Math.min(
            1,
            1280 / Math.max(video.videoWidth, video.videoHeight),
          );
          canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
          canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (!blob) finish({ code: "thumbnail_unavailable" });
              else
                finish(
                  null,
                  new File([blob], "video-cover.jpg", {
                    type: "image/jpeg",
                    lastModified: 0,
                  }),
                );
            },
            "image/jpeg",
            0.85,
          );
        } catch {
          finish({ code: "thumbnail_unavailable" });
        }
      };
      video.onloadeddata = () => {
        if (settled || seeking) return;
        const time = Number.isFinite(video.duration)
          ? Math.min(1, video.duration / 2)
          : 1;
        if (time > 0) {
          seeking = true;
          video.currentTime = time;
        } else capture();
      };
      video.onseeked = capture;
      video.onerror = () => finish({ code: "thumbnail_unavailable" });
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      signal.addEventListener("abort", cancel, { once: true });
      if (signal.aborted) cancel();
      else {
        video.src = objectURL || source;
        video.load();
      }
    });
  }
  async function performVideoCover(
    source = videoCoverSource(),
    onlyIfEmpty = false,
  ) {
    if (
      activeUpload?.running ||
      !source ||
      form.elements.category.value !== "video"
    )
      return;
    const generation = {
      running: true,
      cancelled: false,
      requests: new Set(),
      controller: new AbortController(),
      coverSource: source,
      onlyIfEmpty,
      restoreFocus: document.activeElement === $("useVideoCover"),
    };
    activeUpload = generation;
    $("uploadPanel").hidden = false;
    $("uploadName").textContent = t("Video cover");
    $("uploadProgress").removeAttribute("value");
    $("uploadMessage").textContent = t("Creating video cover…");
    $("retryUpload").hidden = true;
    $("posterFile").disabled =
      $("brandLogoFile").disabled =
      $("mediaFile").disabled =
      $("saveProject").disabled =
        true;
    updateVideoCoverControls();
    try {
      const file = await extractVideoCover(
        source,
        generation.controller.signal,
      );
      if (generation.cancelled) throw { code: "cancelled" };
      if (
        form.elements.category.value !== "video" ||
        (onlyIfEmpty && form.elements.poster_url.value.trim())
      ) {
        $("uploadMessage").textContent = t(
          "Upload complete. Save the project to use this file.",
        );
        return;
      }
      generation.running = false;
      await performUpload(file, "poster_url", {
        onlyIfEmpty,
        coverSource: form.elements.media_url.value.trim(),
      });
    } catch (error) {
      $("uploadMessage").textContent = t(
        error.code === "cancelled"
          ? "Upload cancelled."
          : "The video is uploaded. Add a cover with Upload artwork or retry the thumbnail.",
      );
      if (error.code !== "cancelled") {
        $("retryUpload").hidden = false;
        showError(error);
      }
    } finally {
      generation.running = false;
      if (activeUpload === generation) {
        $("posterFile").disabled =
          $("brandLogoFile").disabled =
          $("mediaFile").disabled =
          $("saveProject").disabled =
            false;
        updateVideoCoverControls();
      }
      if (
        generation.restoreFocus &&
        (document.activeElement === document.body ||
          document.activeElement === $("useVideoCover"))
      )
        $("useVideoCover").focus();
    }
  }
  async function performUpload(file, field, options = {}) {
    if (activeUpload?.running) return;
    const limit = file.type.startsWith("video/")
      ? 2 * 1024 ** 3
      : 20 * 1024 ** 2;
    if (
      ![
        "video/mp4",
        "video/webm",
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type) ||
      !file.size ||
      file.size > limit ||
      (["poster_url", "brand_logo_url"].includes(field) &&
        !file.type.startsWith("image/")) ||
      (field === "media_url" &&
        (form.elements.category.value === "video") !==
          file.type.startsWith("video/"))
    ) {
      announce("The file is empty, too large, or unsupported.");
      return;
    }
    const upload = {
      file,
      field,
      running: true,
      requests: new Set(),
      cancelled: false,
      id: null,
      options,
    };
    let coverSource = null;
    activeUpload = upload;
    $("uploadPanel").hidden = false;
    $("uploadName").textContent = file.name;
    $("retryUpload").hidden = true;
    $("posterFile").disabled =
      $("brandLogoFile").disabled =
      $("mediaFile").disabled =
        true;
    $("saveProject").disabled = true;
    updateVideoCoverControls();
    try {
      const fp = await fingerprint(file);
      let saved;
      try {
        saved = JSON.parse(sessionStorage.getItem("cms-upload") || "null");
      } catch {}
      let state;
      if (saved && saved.field === field) {
        upload.id = saved.id;
        state = await api(`uploads/${saved.id}`);
        if (state.fingerprint !== fp) throw { code: "file_changed" };
        if (state.status === "aborted" || state.expires_at < Date.now()) {
          sessionStorage.removeItem("cms-upload");
          state = null;
        }
      }
      if (!state) {
        const created = await api("uploads", {
          method: "POST",
          body: JSON.stringify({
            filename: file.name,
            size: file.size,
            content_type: file.type,
            fingerprint: fp,
          }),
        });
        upload.id = created.id;
        state = { ...created, parts: [], status: "uploading" };
        sessionStorage.setItem(
          "cms-upload",
          JSON.stringify({
            id: created.id,
            field,
            ...(options.coverSource
              ? {
                  cover_source: options.coverSource,
                  only_if_empty: !!options.onlyIfEmpty,
                }
              : {}),
          }),
        );
      }
      const chunk = state.chunk_size;
      let confirmed = 0;
      const inflight = new Map();
      const progress = () => {
        const loaded =
          confirmed + [...inflight.values()].reduce((a, b) => a + b, 0);
        $("uploadProgress").value = Math.min(99, (loaded / file.size) * 100);
        $("uploadMessage").textContent =
          `${Math.floor((loaded / file.size) * 100)}% · ${(loaded / 1024 ** 2).toFixed(1)} / ${(file.size / 1024 ** 2).toFixed(1)} MiB`;
      };
      const done = new Set();
      for (const part of state.parts || []) {
        const bytes = await file
          .slice(
            (part.part - 1) * chunk,
            Math.min(part.part * chunk, file.size),
          )
          .arrayBuffer();
        if ((await hash(bytes)) !== part.sha256) throw { code: "file_changed" };
        done.add(part.part);
        confirmed += bytes.byteLength;
      }
      progress();
      const queue = Array.from(
        { length: Math.ceil(file.size / chunk) },
        (_, i) => i + 1,
      ).filter((p) => !done.has(p));
      const worker = async () => {
        while (queue.length && !upload.cancelled) {
          const part = queue.shift(),
            blob = file.slice(
              (part - 1) * chunk,
              Math.min(part * chunk, file.size),
            ),
            checksum = await hash(await blob.arrayBuffer());
          let success = false;
          for (let attempt = 0; attempt < 5; attempt++) {
            if (upload.cancelled) throw { code: "cancelled" };
            try {
              await uploadPart(upload, part, blob, checksum, (loaded) => {
                inflight.set(part, loaded);
                progress();
              });
              success = true;
              break;
            } catch (error) {
              inflight.delete(part);
              progress();
              if (
                attempt === 4 ||
                (error.status &&
                  ![429, 503, 500, 502, 504].includes(error.status)) ||
                error.code === "cancelled"
              )
                throw error;
              await new Promise((resolve) =>
                setTimeout(resolve, Math.min(8000, 1000 * 2 ** attempt)),
              );
            }
          }
          if (success) {
            inflight.delete(part);
            confirmed += blob.size;
            progress();
          }
        }
      };
      if (state.status !== "complete") {
        const results = await Promise.allSettled([worker(), worker()]);
        const failure = results.find((r) => r.status === "rejected");
        if (failure) throw failure.reason;
        if (upload.cancelled) throw { code: "cancelled" };
      }
      $("uploadMessage").textContent = t("Completing upload…");
      const completed = await api(`uploads/${upload.id}/complete`, {
        method: "POST",
        body: "{}",
      });
      if (upload.cancelled) throw { code: "cancelled" };
      const apply =
        !options.onlyIfEmpty || !form.elements.poster_url.value.trim();
      if (apply) {
        form.elements.namedItem(field).value = completed.url;
        form.elements.namedItem(field).removeAttribute("aria-invalid");
        const error = form.querySelector(`[data-error="${field}"]`);
        if (error) error.textContent = "";
      }
      if (apply && field === "poster_url") {
        const image = new Image();
        image.onload = () => {
          if (form.elements.poster_url.value !== completed.url) return;
          form.elements.width.value = image.naturalWidth;
          form.elements.height.value = image.naturalHeight;
          if (form.elements.category.value === "video")
            form.elements.orientation.value =
              image.naturalWidth >= image.naturalHeight
                ? "landscape"
                : "portrait";
          dirty = true;
          saveDraft();
        };
        image.src = previewURL(completed.url);
        updatePoster();
        if (
          form.elements.category.value === "logo" &&
          !form.elements.media_url.value
        )
          form.elements.media_url.value = completed.url;
      }
      dirty = true;
      saveDraft();
      sessionStorage.removeItem("cms-upload");
      $("uploadProgress").value = 100;
      $("uploadMessage").textContent = t(
        "Upload complete. Save the project to use this file.",
      );
      if (options.coverSource) $("errorBanner").hidden = true;
      if (
        field === "media_url" &&
        file.type.startsWith("video/") &&
        form.elements.category.value === "video" &&
        !form.elements.poster_url.value.trim()
      )
        coverSource = file;
    } catch (error) {
      if (error.code === "cancelled")
        $("uploadMessage").textContent = t("Upload cancelled.");
      else {
        $("uploadMessage").textContent = options.coverSource
          ? t(
              "Cover upload failed. The video is uploaded. Retry or upload artwork.",
            )
          : error.code === "file_changed"
            ? errorMessage(error)
            : t("Upload failed. Retry or reselect the original file.");
        $("retryUpload").hidden = false;
        showError(error);
      }
    } finally {
      upload.running = false;
      $("posterFile").disabled =
        $("brandLogoFile").disabled =
        $("mediaFile").disabled =
          false;
      $("saveProject").disabled = false;
      updateVideoCoverControls();
    }
    if (coverSource) await performVideoCover(coverSource, true);
  }
  $("posterFile").addEventListener("change", (event) => {
    if (event.target.files[0])
      performUpload(event.target.files[0], "poster_url");
  });
  $("brandLogoFile").addEventListener("change", (event) => {
    if (event.target.files[0])
      performUpload(event.target.files[0], "brand_logo_url");
  });
  $("mediaFile").addEventListener("change", (event) => {
    if (event.target.files[0])
      performUpload(event.target.files[0], "media_url");
  });
  $("retryUpload").addEventListener("click", () => {
    if (activeUpload?.file)
      performUpload(
        activeUpload.file,
        activeUpload.field,
        activeUpload.options,
      );
    else if (activeUpload?.coverSource)
      performVideoCover(activeUpload.coverSource, activeUpload.onlyIfEmpty);
    else {
      let saved;
      try {
        saved = JSON.parse(sessionStorage.getItem("cms-upload") || "null");
      } catch {}
      if (saved?.cover_source)
        performVideoCover(
          previewURL(saved.cover_source),
          !!saved.only_if_empty,
        );
    }
  });
  $("useVideoCover").addEventListener("click", () => performVideoCover());
  $("cancelUpload").addEventListener("click", async () => {
    let saved;
    try {
      saved = JSON.parse(sessionStorage.getItem("cms-upload") || "null");
    } catch {}
    if (activeUpload) {
      activeUpload.cancelled = true;
      activeUpload.controller?.abort();
      activeUpload.requests.forEach((xhr) => xhr.abort());
    }
    if (saved) {
      try {
        await api(`uploads/${saved.id}`, { method: "DELETE", body: "{}" });
        sessionStorage.removeItem("cms-upload");
        $("retryUpload").hidden = true;
        $("uploadMessage").textContent = t("Upload cancelled.");
      } catch (error) {
        showError(error);
      }
    }
  });
  localize();
  $("languageButton").disabled = false;
  async function initialize() {
    const session = await api("session");
    $("signedIn").textContent = session.email;
    await refresh();
    document.querySelectorAll("button").forEach((b) => (b.disabled = false));
    $("previousPage").disabled = page <= 1;
    $("nextPage").disabled = page * 24 >= total;
    initialized = true;
    updateVideoCoverControls();
    const draft = sessionStorage.getItem("cms-draft");
    if (draft) {
      try {
        const d = JSON.parse(draft);
        openEditor(d.editing, d.data);
      } catch {}
    }
    if (sessionStorage.getItem("cms-upload")) {
      $("uploadPanel").hidden = false;
      let checkpoint;
      try {
        checkpoint = JSON.parse(sessionStorage.getItem("cms-upload"));
      } catch {}
      $("uploadMessage").textContent = t(
        checkpoint?.cover_source
          ? "The video is uploaded. Add a cover with Upload artwork or retry the thumbnail."
          : "Reselect the original file to resume this upload.",
      );
      $("retryUpload").hidden = !checkpoint?.cover_source;
    }
  }
  initialize().catch(showError);
})();
