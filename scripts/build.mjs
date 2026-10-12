import { mkdir, copyFile, readdir, stat, lstat, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { build } from "esbuild";
const root = resolve(".");
const out = join(root, "build/public");
// Clean only the fixed build output inside this workspace; never follow a linked build directory.
if (!out.startsWith(root + "\\") && !out.startsWith(root + "/"))
  throw new Error("Unsafe output path");
for (const path of [join(root, "build"), out]) {
  try {
    if ((await lstat(path)).isSymbolicLink())
      throw new Error("Linked build directory is not permitted");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const files = [
  "index.html",
  "portfolio.html",
  "services.html",
  "services-page.css",
  "services-page.js",
  "contact.html",
  "contact.css",
  "contact.js",
  "home-contact.css",
  "hero-background.js",
  "hero-background.css",
  "intro.js",
  "intro.css",
  "brandmark.css",
  "portfolio-gallery.css",
  "portfolio.js",
  "site-chrome.css",
  "site-chrome.js",
  "language.js",
  "showcase.css",
  "services.css",
  "process-images.css",
  "about-threads.js",
  "motion.js",
  "motion.css",
];
async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const item of await readdir(from, { withFileTypes: true })) {
    const source = join(from, item.name),
      target = join(to, item.name);
    if (item.isSymbolicLink())
      throw new Error(`Symlink not permitted in assets: ${source}`);
    if (item.isDirectory()) await copyDir(source, target);
    else if (/\.(png|jpe?g|webp|svg|css|js|html)$/i.test(item.name)) {
      if ((await stat(source)).size > 25 * 1024 * 1024)
        throw new Error(`Static file exceeds Cloudflare limit: ${source}`);
      await copyFile(source, target);
    }
  }
}
for (const file of files) await copyFile(join(root, file), join(out, file));
await copyDir(join(root, "assets"), join(out, "assets"));
await copyDir(join(root, "admin"), join(out, "admin"));
await build({
  entryPoints: ["worker/index.ts"],
  outfile: "build/worker.mjs",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
});
console.log("Built Worker and explicit public asset bundle.");
