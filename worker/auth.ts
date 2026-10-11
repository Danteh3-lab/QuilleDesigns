import { createRemoteJWKSet, jwtVerify } from "jose";
import { Env, fail } from "./types";
const sets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function authorize(request: Request, env: Env): Promise<string> {
  if (
    !env.ACCESS_TEAM_DOMAIN ||
    !env.ACCESS_AUD ||
    !env.ADMIN_EMAILS ||
    !env.PUBLIC_ORIGIN ||
    /REPLACE_WITH/.test(
      [
        env.ACCESS_TEAM_DOMAIN,
        env.ACCESS_AUD,
        env.ADMIN_EMAILS,
        env.PUBLIC_ORIGIN,
      ].join(" "),
    )
  )
    fail(
      503,
      "auth_configuration",
      "Administrator access has not been configured.",
    );
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) fail(401, "sign_in_required", "Please sign in to continue.");
  let email: string;
  try {
    const issuer = env.ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
    let keys = sets.get(issuer);
    if (!keys) {
      keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      sets.set(issuer, keys);
    }
    const { payload } = await jwtVerify(token!, keys, {
      issuer,
      audience: env.ACCESS_AUD,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "sub", "email"],
    });
    email =
      typeof payload.email === "string" ? payload.email.toLowerCase() : "";
  } catch {
    return fail(
      401,
      "sign_in_required",
      "Your session is invalid or expired. Please sign in again.",
    );
  }
  if (
    !env.ADMIN_EMAILS.split(",")
      .map((value) => value.trim().toLowerCase())
      .includes(email!)
  )
    fail(
      403,
      "not_allowed",
      "This account does not have administrator access.",
    );
  if (!["GET", "HEAD"].includes(request.method)) {
    if (
      request.headers.get("Origin") !== env.PUBLIC_ORIGIN ||
      request.headers.get("X-CMS-Request") !== "1"
    )
      fail(
        403,
        "origin_rejected",
        "This request must come from the administrator page.",
      );
  }
  return email!;
}
