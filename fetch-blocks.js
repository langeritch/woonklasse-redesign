// Pulls the latest cms_blocks rows for slug "woonklasse" from Supabase and
// writes them to cms-blocks.json so build.js can render them into the HTML.
//
// Behavior:
//   - If SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)
//     env vars are set, fetch live rows and overwrite cms-blocks.json.
//   - If env vars are missing or the fetch fails, leave cms-blocks.json
//     alone and exit 0. This keeps local dev offline-friendly and lets the
//     committed defaults serve as a fallback if Supabase is unreachable.
//
// No npm deps — uses Node 18+ built-in fetch.

const fs = require("node:fs");
const path = require("node:path");

const SLUG = process.env.CMS_SLUG || "woonklasse";
const URL_BASE = process.env.SUPABASE_URL || "";
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";
const OUT = path.join(__dirname, "cms-blocks.json");

async function main() {
  if (!URL_BASE || !KEY) {
    console.log("[cms] SUPABASE_URL / SUPABASE_*_KEY not set, using committed cms-blocks.json");
    return;
  }

  // PostgREST query: rows for this slug, ordered for predictability.
  const endpoint =
    URL_BASE.replace(/\/$/, "") +
    "/rest/v1/cms_blocks" +
    `?dashboard_slug=eq.${encodeURIComponent(SLUG)}` +
    "&select=block_key,kind,text_value,image_url" +
    "&order=sort_order.asc";

  let rows;
  try {
    const res = await fetch(endpoint, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) {
      console.warn(`[cms] fetch failed: ${res.status} ${res.statusText} — keeping local file`);
      return;
    }
    rows = await res.json();
  } catch (err) {
    console.warn(`[cms] fetch error: ${err.message} — keeping local file`);
    return;
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn(`[cms] no rows for slug "${SLUG}" — keeping local file`);
    return;
  }

  // Convert flat rows into the nested shape build.js expects.
  // block_key "hero.title" → { hero: { title: "..." } }.
  const out = {};
  for (const row of rows) {
    const value = row.kind === "image" ? row.image_url : row.text_value;
    if (value == null) continue;
    const parts = String(row.block_key).split(".");
    let node = out;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] = node[parts[i]] || {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
  }

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`[cms] wrote ${rows.length} block(s) from Supabase to cms-blocks.json`);
}

main().catch((err) => {
  console.error("[cms] fatal:", err);
  process.exit(1);
});
