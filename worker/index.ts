import { Env, HttpError, fail, json } from "./types";
import { authorize } from "./auth";
import { projectAPI, publicData } from "./projects";
import { uploadAPI, serveMedia, cleanup } from "./uploads";
import { render } from "./render";
import { contactAPI, bookingAdminAPI } from "./contact";
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      let path: string;
      try {
        path = decodeURIComponent(new URL(request.url).pathname).replace(
          /\/+/g,
          "/",
        );
      } catch {
        return json({ error: "invalid_path" }, 400);
      }
      if (/[\\\u0000]/.test(path!)) fail(400, "invalid_path", "Invalid path.");
      const admin =
        path!.startsWith("/admin") || path!.startsWith("/api/admin");
      let email = "";
      if (admin) email = await authorize(request, env);
      if (path === "/api/admin/session" && request.method === "GET")
        return json({ email });
      if (path!.startsWith("/api/admin/")) {
        const media = path!.match(/^\/api\/admin\/media\/([a-f0-9-]{36})$/);
        if (media && ["GET", "HEAD"].includes(request.method))
          return await serveMedia(request, env, media[1], true);
        const response =
          (await projectAPI(request, env, path!)) ??
          (await bookingAdminAPI(request, env, path!)) ??
          (await uploadAPI(request, env, path!, email));
        if (response) return response;
        fail(
          405,
          "method_not_allowed",
          "This endpoint or method is not available.",
        );
      }
      const contactResponse = await contactAPI(request, env, path!);
      if (contactResponse) return contactResponse;
      if (!["GET", "HEAD"].includes(request.method))
        fail(405, "method_not_allowed", "This method is not available.");
      if (
        path === "/portfolio/" ||
        path === "/services/" ||
        path === "/contact/"
      )
        return new Response(null, {
          status: 301,
          headers: {
            Location:
              path === "/services/"
                ? "/services.html"
                : path === "/contact/"
                  ? "/contact.html"
                  : "/portfolio.html",
            "Cache-Control": "no-store",
          },
        });
      if (path === "/api/portfolio") return json(await publicData(env));
      const media = path!.match(/^\/media\/([a-f0-9-]{36})$/);
      if (media) return await serveMedia(request, env, media[1]);
      const portfolio = [
          "/portfolio",
          "/portfolio/",
          "/portfolio.html",
        ].includes(path!),
        home = ["/", "/index", "/index.html"].includes(path!),
        services = ["/services", "/services.html"].includes(path!),
        contact = ["/contact", "/contact.html"].includes(path!);
      const assetURL = new URL(request.url);
      assetURL.pathname = portfolio
        ? "/portfolio.html"
        : home
          ? "/index.html"
          : services
            ? "/services.html"
            : contact
              ? "/contact.html"
              : ["/admin", "/admin/"].includes(path!)
                ? "/admin/index.html"
                : path === "/admin/bookings"
                  ? "/admin/bookings.html"
                  : path!;
      const assetHeaders = new Headers(request.headers);
      if (portfolio || home) {
        assetHeaders.delete("If-None-Match");
        assetHeaders.delete("If-Modified-Since");
        assetHeaders.delete("Range");
      }
      const asset = await env.ASSETS.fetch(
        new Request(assetURL, {
          method: request.method,
          headers: assetHeaders,
        }),
      );
      if (
        (portfolio || home) &&
        request.method === "GET" &&
        asset.status === 200
      ) {
        let data = null;
        try {
          data = await publicData(env);
        } catch {
          console.error("CMS database read failed");
        }
        return render(asset, data, portfolio);
      }
      if ((portfolio || home) && request.method === "HEAD") {
        const headers = new Headers(asset.headers);
        headers.set("Cache-Control", "no-store");
        headers.delete("ETag");
        headers.delete("Content-Length");
        return new Response(null, { status: asset.status, headers });
      }
      if (admin) {
        const headers = new Headers(asset.headers);
        headers.set("Cache-Control", "no-store");
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set("Referrer-Policy", "same-origin");
        headers.set(
          "Content-Security-Policy",
          "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: blob:; media-src 'self' https: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
        );
        return new Response(asset.body, { status: asset.status, headers });
      }
      return asset;
    } catch (error) {
      if (error instanceof HttpError)
        return json(
          { error: error.code, message: error.message },
          error.status,
        );
      const message =
        String(error) + " " + String((error as { cause?: unknown })?.cause);
      if (message.includes("featured_project"))
        return json(
          {
            error: "featured_project",
            message:
              "Choose a replacement in Homepage videos before removing this featured project.",
          },
          409,
        );
      if (
        message.includes("invalid_featured") ||
        message.includes("featured_slots.project_id")
      )
        return json(
          {
            error: "invalid_featured",
            message: "Choose two different published video projects.",
          },
          400,
        );
      if (message.includes("mutation_guard") || message.includes("valid=1"))
        return json(
          {
            error: "stale_revision",
            message:
              "This content changed in another tab. Reload before saving.",
          },
          409,
        );
      console.error("CMS request failed");
      return json(
        {
          error: "service_unavailable",
          message:
            "The service is temporarily unavailable. Your changes may not have been saved. Reload or retry.",
        },
        503,
      );
    }
  },
  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(cleanup(env));
  },
} satisfies ExportedHandler<Env>;
