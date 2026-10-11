(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let language = "nl";
  try {
    language = localStorage.getItem("quille-language") === "en" ? "en" : "nl";
  } catch {
    /* Optional storage. */
  }
  const nl = {
    "Portfolio manager": "Portfolio beheer",
    "View contact page": "Contactpagina bekijken",
    "Sign out": "Uitloggen",
    "Studio inbox": "Studio inbox",
    "Appointments & enquiries": "Afspraken & aanvragen",
    Refresh: "Vernieuwen",
    Reload: "Opnieuw laden",
    "Sign in again": "Opnieuw inloggen",
    "Upcoming appointments": "Komende afspraken",
    Enquiries: "Aanvragen",
    New: "Nieuw",
    Handled: "Afgehandeld",
    All: "Alles",
    "Closed days": "Gesloten dagen",
    "Close a day for holidays or when you are unavailable. Customers can no longer book that day. Existing appointments stay; cancel them separately if needed.":
      "Sluit een dag voor feestdagen of wanneer jullie niet beschikbaar zijn. Klanten kunnen die dag dan niet meer boeken. Bestaande afspraken blijven staan; annuleer ze zo nodig apart.",
    Date: "Datum",
    "Close day": "Dag sluiten",
    "Past appointments (last 60 days)": "Eerdere afspraken (laatste 60 dagen)",
    Keep: "Behouden",
    "Loading…": "Laden…",
    "No upcoming appointments yet.": "Nog geen komende afspraken.",
    "No enquiries here.": "Geen aanvragen in deze lijst.",
    "No closed days.": "Geen gesloten dagen.",
    "No past appointments.": "Geen eerdere afspraken.",
    Cancel: "Annuleren",
    "Cancel appointment": "Afspraak annuleren",
    "Cancel this appointment?": "Deze afspraak annuleren?",
    "The time becomes available again on the website. Let the customer know yourself.":
      "De tijd komt weer vrij op de website. Laat het de klant zelf weten.",
    Cancelled: "Geannuleerd",
    Booked: "Geboekt",
    "Mark as handled": "Markeren als afgehandeld",
    "Mark as new": "Markeren als nieuw",
    Reopen: "Weer openen",
    "Logo design": "Logo-ontwerp",
    "Poster design": "Posterontwerp",
    "Business card design": "Visitekaartjesontwerp",
    "Promo production": "Reclameproductie",
    "Social media management": "Socialmediabeheer",
    "Something else": "Iets anders",
    "Phone call": "Telefonisch",
    WhatsApp: "WhatsApp",
    "Video call": "Videogesprek",
    "Prefers:": "Voorkeur:",
    "Received:": "Ontvangen:",
    "Language:": "Taal:",
    Dutch: "Nederlands",
    English: "Engels",
    "Appointment cancelled.": "Afspraak geannuleerd.",
    "Enquiry updated.": "Aanvraag bijgewerkt.",
    "Day closed.": "Dag gesloten.",
    "Day reopened.": "Dag weer geopend.",
    "Updated.": "Bijgewerkt.",
    "Choose today or a later date.": "Kies vandaag of een latere datum.",
    "Note: this day already has appointments. They stay booked.":
      "Let op: op deze dag staan al afspraken. Die blijven staan.",
    "Your session expired. Sign in again, then retry.":
      "Je sessie is verlopen. Log opnieuw in en probeer het opnieuw.",
    "This account does not have administrator access.":
      "Dit account heeft geen beheerderstoegang.",
    "Administrator access has not been configured.":
      "Beheerderstoegang is nog niet ingesteld.",
    "This item was already changed. Refresh the page.":
      "Dit item is al gewijzigd. Vernieuw de pagina.",
    "The service is temporarily unavailable. Check your connection and retry.":
      "De dienst is tijdelijk niet beschikbaar. Controleer je verbinding en probeer het opnieuw.",
    upcoming: "komend",
    new: "nieuw",
    "Times are Suriname time.": "Tijden zijn in Surinaamse tijd.",
  };
  const t = (key) => (language === "nl" ? nl[key] || key : key);
  const serviceNames = {
    logo: "Logo design",
    poster: "Poster design",
    "business-card": "Business card design",
    promo: "Promo production",
    social: "Social media management",
    other: "Something else",
  };
  const methodNames = {
    phone: "Phone call",
    whatsapp: "WhatsApp",
    video: "Video call",
  };
  let data = null,
    filter = "new",
    busy = false;
  const locale = () => (language === "nl" ? "nl-NL" : "en-GB");
  const dayLabel = (day) =>
    new Intl.DateTimeFormat(locale(), {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${day}T12:00:00Z`));
  const received = (ms) =>
    new Intl.DateTimeFormat(locale(), {
      timeZone: "America/Paramaribo",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const link = (href, text) => {
    const a = el("a", "", text);
    a.href = href;
    return a;
  };
  const button = (label, action, className = "") => {
    const b = el("button", className, t(label));
    b.type = "button";
    b.addEventListener("click", action);
    return b;
  };

  function localize() {
    document.documentElement.lang = language;
    document.title = `Quille Designs — ${t("Appointments & enquiries")}`;
    document
      .querySelectorAll("[data-label]")
      .forEach((e) => (e.textContent = t(e.dataset.label)));
    $("languageButton").textContent = language === "nl" ? "EN" : "NL";
  }
  function errorMessage(error) {
    const messages = {
      sign_in_required: "Your session expired. Sign in again, then retry.",
      not_allowed: "This account does not have administrator access.",
      auth_configuration: "Administrator access has not been configured.",
      not_found: "This item was already changed. Refresh the page.",
      validation: "Choose today or a later date.",
    };
    return t(
      messages[error.code] ||
        "The service is temporarily unavailable. Check your connection and retry.",
    );
  }
  function showError(error) {
    $("errorBanner").hidden = false;
    $("errorText").textContent = errorMessage(error);
    $("loginLink").hidden = error.code !== "sign_in_required";
    $("retryButton").disabled = false;
  }
  async function api(path, options = {}) {
    const response = await fetch(`/api/admin/${path}`, {
      credentials: "same-origin",
      ...options,
      headers: {
        "X-CMS-Request": "1",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
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
  async function run(action, message) {
    if (busy) return;
    busy = true;
    $("errorBanner").hidden = true;
    const controls = [...document.querySelectorAll("main button")];
    controls.forEach((b) => (b.disabled = true));
    try {
      await action();
      if (message) $("status").textContent = t(message);
    } catch (error) {
      showError(error);
    } finally {
      busy = false;
      document
        .querySelectorAll("main button")
        .forEach((b) => (b.disabled = false));
    }
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

  function appointmentRow(item, past = false) {
    const row = el("article", "inbox-row");
    if (item.status === "cancelled") row.classList.add("is-cancelled");
    const time = el("p", "inbox-time", item.slot_time);
    const main = el("div", "inbox-main");
    const title = el("h3", "", t(serviceNames[item.service] || item.service));
    const badge = el(
      "span",
      `badge ${item.status === "cancelled" ? "badge--muted" : "badge--ok"}`,
      t(item.status === "cancelled" ? "Cancelled" : "Booked"),
    );
    title.append(" ", badge);
    const who = el("p", "inbox-who");
    who.append(el("strong", "", item.name), " · ");
    who.append(link(`mailto:${item.email}`, item.email), " · ");
    who.append(link(`tel:${item.phone.replace(/[^+0-9]/g, "")}`, item.phone));
    const meta = el(
      "p",
      "muted inbox-meta",
      `${t("Prefers:")} ${t(methodNames[item.contact_method] || item.contact_method)} · ${t("Language:")} ${t(item.language === "en" ? "English" : "Dutch")} · ${t("Received:")} ${received(item.created_at)}`,
    );
    main.append(title, who, meta);
    if (item.notes) main.append(el("p", "inbox-message", item.notes));
    row.append(time, main);
    if (!past && item.status === "booked") {
      const actions = el("div", "row-actions");
      actions.append(
        button("Cancel appointment", async () => {
          const ok = await confirmAction(
            t("Cancel this appointment?"),
            `${t(serviceNames[item.service])} · ${dayLabel(item.slot_date)} ${item.slot_time} · ${item.name}. ${t("The time becomes available again on the website. Let the customer know yourself.")}`,
            t("Cancel appointment"),
          );
          if (!ok) return;
          await run(async () => {
            await api(`appointments/${item.id}/cancel`, { method: "POST" });
            await load();
          }, "Appointment cancelled.");
        }),
      );
      row.append(actions);
    }
    return row;
  }
  function renderAppointments(target, items, empty, past = false) {
    target.textContent = "";
    target.setAttribute("aria-busy", "false");
    if (!items.length) {
      target.append(el("p", "muted inbox-empty", t(empty)));
      return;
    }
    let current = "";
    items.forEach((item) => {
      if (item.slot_date !== current) {
        current = item.slot_date;
        target.append(el("h3", "inbox-day", dayLabel(current)));
      }
      target.append(appointmentRow(item, past));
    });
  }
  function enquiryRow(item) {
    const row = el("article", "inbox-row inbox-row--enquiry");
    if (item.status === "handled") row.classList.add("is-handled");
    const main = el("div", "inbox-main");
    const tags = el("p", "inbox-tags");
    item.services.forEach((s) =>
      tags.append(el("span", "badge", t(serviceNames[s] || s))),
    );
    if (item.status === "new")
      tags.append(el("span", "badge badge--new", t("New")));
    const who = el("p", "inbox-who");
    who.append(el("strong", "", item.name));
    if (item.company) who.append(` (${item.company})`);
    who.append(" · ", link(`mailto:${item.email}`, item.email));
    if (item.phone)
      who.append(
        " · ",
        link(`tel:${item.phone.replace(/[^+0-9]/g, "")}`, item.phone),
      );
    const meta = el(
      "p",
      "muted inbox-meta",
      `${t("Received:")} ${received(item.created_at)} · ${t("Language:")} ${t(item.language === "en" ? "English" : "Dutch")}`,
    );
    main.append(tags, who, meta, el("p", "inbox-message", item.message));
    const actions = el("div", "row-actions");
    actions.append(
      button(
        item.status === "new" ? "Mark as handled" : "Mark as new",
        () =>
          run(async () => {
            await api(`inquiries/${item.id}/status`, {
              method: "POST",
              body: JSON.stringify({
                status: item.status === "new" ? "handled" : "new",
              }),
            });
            await load();
          }, "Enquiry updated."),
        item.status === "new" ? "primary" : "",
      ),
    );
    row.append(main, actions);
    return row;
  }
  function renderEnquiries() {
    const target = $("enquiryList");
    target.textContent = "";
    target.setAttribute("aria-busy", "false");
    const items = data.inquiries.filter(
      (i) => filter === "all" || i.status === filter,
    );
    if (!items.length) {
      target.append(el("p", "muted inbox-empty", t("No enquiries here.")));
      return;
    }
    items.forEach((i) => target.append(enquiryRow(i)));
  }
  function renderClosed() {
    const list = $("closedList");
    list.textContent = "";
    if (!data.closedDays.length) {
      list.append(el("li", "muted", t("No closed days.")));
      return;
    }
    data.closedDays.forEach((day) => {
      const item = el("li", "closed-item");
      item.append(
        el("span", "", dayLabel(day)),
        button("Reopen", () =>
          run(async () => {
            await api(`closed-days/${day}`, { method: "DELETE" });
            await load();
          }, "Day reopened."),
        ),
      );
      list.append(item);
    });
  }
  function render() {
    if (!data) return;
    const booked = data.upcoming.filter((a) => a.status === "booked").length;
    $("upcomingCount").textContent =
      `${booked} ${t("upcoming")} · ${t("Times are Suriname time.")}`;
    renderAppointments(
      $("upcomingList"),
      data.upcoming,
      "No upcoming appointments yet.",
    );
    renderAppointments(
      $("pastList"),
      data.recent,
      "No past appointments.",
      true,
    );
    renderEnquiries();
    renderClosed();
    const fresh = data.inquiries.filter((i) => i.status === "new").length;
    $("enquiryTitle").textContent = fresh
      ? `${t("Enquiries")} (${fresh} ${t("new").toLowerCase()})`
      : t("Enquiries");
    $("closedDate").min = data.today;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
      );
  }
  async function load() {
    data = await api("bookings");
    render();
  }

  document.querySelectorAll("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.filter;
      render();
    }),
  );
  $("closedForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const day = $("closedDate").value;
    $("closedError").textContent = "";
    if (!day || (data && day < data.today)) {
      $("closedError").textContent = t("Choose today or a later date.");
      $("closedDate").focus();
      return;
    }
    run(async () => {
      const result = await api("closed-days", {
        method: "POST",
        body: JSON.stringify({ day }),
      });
      $("closedDate").value = "";
      await load();
      if (result.existingAppointments)
        $("closedError").textContent = t(
          "Note: this day already has appointments. They stay booked.",
        );
    }, "Day closed.");
  });
  $("refreshButton").addEventListener("click", () => run(load, "Updated."));
  $("retryButton").addEventListener("click", () => location.reload());
  $("languageButton").addEventListener("click", () => {
    language = language === "nl" ? "en" : "nl";
    try {
      localStorage.setItem("quille-language", language);
    } catch {
      /* Optional storage. */
    }
    localize();
    render();
  });
  localize();
  $("languageButton").disabled = false;
  ["upcomingList", "enquiryList"].forEach(
    (id) => ($(id).textContent = t("Loading…")),
  );
  (async () => {
    try {
      const session = await api("session");
      $("signedIn").textContent = session.email;
      await load();
      document
        .querySelectorAll("main button")
        .forEach((b) => (b.disabled = false));
    } catch (error) {
      showError(error);
    }
  })();
})();
