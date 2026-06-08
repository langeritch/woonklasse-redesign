// Minimal CMS token replacer for woonklasse-redesign.
//
// Reads cms-blocks.json and replaces {{key.path}} tokens in every .html file
// at the repo root, IN PLACE. Vercel runs this via `npm run build`, edits the
// freshly checked-out files, and serves the result. The repo on GitHub keeps
// the tokenized version, which is the canonical source of truth.
//
// Phase 1 wires only the hero on index.html. Other HTML files contain no
// tokens, so they pass through untouched but are still rewritten (idempotent).
//
// No npm deps on purpose — keeps the install step trivial on Vercel.

const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const BLOCKS_PATH = path.join(ROOT, "cms-blocks.json");

if (!fs.existsSync(BLOCKS_PATH)) {
  console.error(`[cms] cms-blocks.json not found at ${BLOCKS_PATH}`);
  process.exit(1);
}

const blocks = JSON.parse(fs.readFileSync(BLOCKS_PATH, "utf8"));

// Flatten nested keys into dot-paths so authors can write {{hero.title}}
// while still grouping the JSON by section.
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

const flat = flatten(blocks);

// Match {{ some.key }} with optional surrounding whitespace.
const TOKEN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function render(html) {
  return html.replace(TOKEN, (match, key) => {
    if (key in flat) return String(flat[key]);
    console.warn(`[cms] missing block: ${key} (left token in place)`);
    return match;
  });
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
