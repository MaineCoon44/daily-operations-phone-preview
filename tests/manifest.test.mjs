import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url)));

assert.equal(manifest.start_url, "./", "installed app must launch inside the GitHub Pages project");
assert.equal(manifest.scope, "./", "installed app must remain scoped to the project");

for (const icon of manifest.icons) {
  assert.match(icon.src, /^\.\//, "manifest icons must be project-relative");
  await access(new URL(`../${icon.src.slice(2)}`, import.meta.url));
}

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
assert.match(html, /rel="apple-touch-icon"[^>]+hard-hat-180\.png/);

console.log("PWA manifest and hard-hat startup assets are project-scoped.");
