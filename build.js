// CMS token replacer for woonklasse-redesign.
//
// Reads cms-blocks.json (committed to the repo by the Datareaches admin's
// "Deploy" action) and replaces {{block.key}} tokens in every .html file
// at the repo root, IN PLACE.
//
// Expected JSON shape (written by hightouch-clone's deployAction):
//
//   {
//     "dashboard": "woonklasse",
//     "generated_at": "2026-06-08T12:34:56.000Z",
//     "blocks": [
//       { "key": "hero.title", "kind": "text", "text": "...", "image": null,
//         "label": "Hero title", "sort_order": 10 },
//       { "key": "hero.image", "kind": "image", "text": null,
//         "image": "https://...", "label": "Hero image", "sort_order": 20 }
//     ]
//   }
//
// For each block, the value is `image` when kind === "image", otherwise
// `text`. Tokens whose key isn't present are left untouched and logged.
//
// No npm deps on purpose — keeps install trivial on Vercel.

const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const BLOCKS_PATH = path.join(ROOT, "cms-blocks.json");

if (!fs.existsSync(BLOCKS_PATH)) {
  console.error(`[cms] cms-blocks.json not found at ${BLOCKS_PATH}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(BLOCKS_PATH, "utf8"));

// Build a flat key→value map from whichever JSON shape is present.
function buildMap(raw) {
  const map = {};
  if (raw && Array.isArray(raw.blocks)) {
    for (const b of raw.blocks) {
      const v = b.kind === "image" ? b.image : b.text;
      if (v != null) map[b.key] = String(v);
    }
    return map;
  }
  // Legacy nested-object shape: { hero: { title: "...", image: "..." } }
  // Kept as a fallback so old snapshots and hand-authored files still work.
  flatten(raw, "", map);
  return map;
}

function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v == null ? "" : String(v);
    }
  }
}

const map = buildMap(raw);

// Match {{ some.key }} with optional surrounding whitespace.
const TOKEN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function render(html) {
  // Loop until no more tokens get resolved. Block values can reference
  // other block keys (e.g. a CTA label "Bel direct {{footer.phoneDisplay}}"),
  // and a single pass would leave those nested references behind.
  // Cap at 5 passes so a self-referential block can't infinite-loop.
  let out = html;
  for (let pass = 0; pass < 5; pass++) {
    let touched = false;
    const next = out.replace(TOKEN, (match, key) => {
      if (key in map) {
        touched = true;
        return map[key];
      }
      return match;
    });
    if (!touched) return next;
    out = next;
  }
  // Final pass: any tokens left are missing keys; warn once.
  out.replace(TOKEN, (_m, key) => {
    if (!(key in map)) console.warn(`[cms] missing block: ${key} (left token in place)`);
    return _m;
  });
  return out;
}

const FILES = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let touched = 0;
for (const file of FILES) {
  const p = path.join(ROOT, file);
  const before = fs.readFileSync(p, "utf8");
  const after = render(before);
  if (before !== after) {
    fs.writeFileSync(p, after);
    touched++;
    console.log(`[cms] wrote ${file}`);
  }
}
console.log(`[cms] done, ${touched} file(s) updated`);
