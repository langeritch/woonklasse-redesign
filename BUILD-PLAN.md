# Woonklasse — Content-Aware BUILD PLAN

> Companion to `file_intake/woonklasse-site-mapping.md` (target architecture) and
> `file_intake/woonklasse-sectieplan.md` (per-page section plan). This document maps
> the **target design** onto the content that **actually exists in this repository today**,
> so Ilias gets the full splitscreen/two-worlds build realised with real content now and
> `<ContentGap>` placeholders only where content is a genuine gap — never blocked waiting.
>
> Scope note: fase 1 + 2 (route groups, tokens, mode-switch, footer, splitscreen `/`)
> are **already built**. This plan starts at **fase 3**.

---

## 1. Executive summary

- **Target:** the Next.js 14 App Router site from the site-mapping — a splitscreen `/`
  fronting two worlds (`(shop)` "IKEA-model" webshop, `(verbouwen)` aannemerstak) on one
  shared technical/legal base, with a `(info)` group for shared pages. The scaffold for
  this is already in place under `app/`.
- **Approach:** **reuse-first.** Every section is filled from content that already lives in
  this repo (the static HTML pages, `generate-cities.js` city data, the working lead-API
  proxies, the existing copy/prices/FAQ). A high-visibility `<ContentGap>` placeholder is
  used **only** where the content is a true gap, and every gap is registered in
  `content-gaps.json`. No lorem, no invented prices/reviews/names, no stock photos passed
  off as owned work.
- **The reality that shapes everything below:** this repo is **not** the dual webshop+verbouwen
  woonklasse.nl the specs describe. It is a **verbouwen-only contractor marketing site**.
  There is **no product catalog, no `/wk/` media, no plissé photos, no sale feed, no 300+
  brands** anywhere in these files. Therefore the **verbouwen tak can be built almost
  entirely from real content**, while the **entire shop tak is structure + placeholder**
  until a product feed and owned media are delivered. The plan is honest about that split
  rather than faking a webshop.

---

## 2. Current-state inventory (what really exists in this repo)

**Static HTML (verbouwen/contractor content — the real reusable copy):**

| File | Real content it holds |
|---|---|
| `index.html` | Hero + **3-staps lead-quiz** (kamers → per-kamer details+foto's → contact, incl. budget/timing selects); "Wat doen wij?" 3-alinea body; pull-quote; **Discipline** split (Ontwerp/Vergunningen/Uitvoering/Oplevering); **Specialisme** split (Saninet 3D badkamers); **Vier beloftes** (accordion); "Uit ons werk" 5 project cards; CTA; footer |
| `diensten.html` | **4-fase aanpak** (Context·Compositie·Emotie·Ambacht); **8 specialismen met vanaf-prijzen** (Badkamer €8.500, Keuken €7.500, Aanbouw €1.800/m², Woningrenovatie €800/m², Dakwerk €85/m², Vloeren €55/m², Schilderwerk €38/m², Onderhoud €65/uur) |
| `prijzen.html` | **4 prijs-tiers** (Basis €500 / Standaard €5k / Uitgebreid €15k / Maatwerk €50k+) met inhoudslijsten + doorlooptijden; **5-vraag FAQ** (categorie, vaste prijs, inbegrepen, betaalschema, garantie) |
| `projecten.html` | 5 realisaties (namen + beschrijvingen), Unsplash imagery |
| `over-ons.html` | Bedrijfsverhaal (3 alinea's), **5 waarden**, **stats: opgericht 2010, 200+ projecten, 28 eigen vakmensen, 9.4 beoordeling** |
| `contact.html` | Contactgegevens + **volledig lead-formulier** (honeypot, type-project select), openingstijden, KvK/BTW |
| ~50 `[stad].html` | City landing pages generated from `generate-cities.js` |
| `content-editor.html` | In-browser copy editor (dev tool, not a site page) |

**City data — the de-facto `steden.ts`:** `generate-cities.js` holds a `CITIES` array of
**50 entries**, each with `slug, name, wijken[4], nearby[4], positioning` (a genuinely
**unique per-city positioning paragraph** — e.g. Amsterdam "elke vierkante meter kostbaar…",
Groningen "aardbevingsbestendig bouwen is standaard"). This is real, reusable structured
data and should become the App Router `steden` source.

**Serverless API (real, working lead pipeline):** `api/contact.js`, `api/advies.js`,
`api/advies/upload-url.js` — same-origin proxies that force `brand: 'woonklasse'` and forward
to the Badkamerstijl monorepo (`badkamerstijl.nl/api/advies` / `/api/contact`): validation,
lead storage, push notification, SMTP mail, and Vercel Blob photo upload for the quiz.
**This is production-grade and must be preserved/wired into the new intake + contact forms.**

**App Router scaffold (fase 1+2, DONE):**
`app/layout.tsx` (Advent Pro + Inter, metadata), `app/page.tsx` (splitscreen `/` + scroll
content), `app/(entry)/SplitEntry.tsx` (client, localStorage `wk_last_mode`, reduced-motion,
real `<a>` panels), `app/(shop)/layout.tsx` + `app/(shop)/shop/page.tsx` (placeholder),
`app/(verbouwen)/layout.tsx` + `app/(verbouwen)/verbouwen/page.tsx` (placeholder),
`app/(info)/layout.tsx`, components `Footer`, `ModeSwitcher`, `UspBar`, `ContentGap`,
CSS `tokens.css` (mode-scoped `--wk-*`), `globals.css`, `components.css`, `split-entry.css`.
Headers are **minimal mode-heads** with only logo + ModeSwitcher — the full `ShopHeader`
(mega-menu) and `VerbouwHeader` are **not** built yet.

**Media/assets (this is the big gap):** `assets/` + `public/assets/` contain **only**
`woonklasse-logo-dark.png`, `woonklasse-logo-white.png`, `footer-project.jpg`/`.avif`,
and `placeholder.svg`. **Every other image on the static site is a hot-linked Unsplash URL**
(see `generate-cities.js` HERO_IMAGES/PROJECT_IMAGES and each page's `hero__media`) — i.e.
**not owned**, not licensed for production, and not the `/wk/*.mp4` media the sectieplan
assumes. There are **no** `/wk/home`, `/wk/verbouwing`, `/wk/plisse-product-photos`,
`/wk/homepage-videos` directories anywhere.

**Config:** `next.config.mjs` (legacy `.html` preserved on disk, not served by Next),
`package.json` (next 14.2.35, react 18.3), `.vercel/project.json` (`woonklasse-redesign`),
`content-gaps.json` (5 gaps registered).

### The webshop question — explicit answer
**There is NO webshop product feed, product data, price matrix, brand list, or product
imagery in this repo. It is verbouwen-only.** Nothing here can populate a PLP, PDP,
configurator, cart, merken or inspiratie page with real products. The shop tak must be
built as **structure + placeholder**, wired to a real feed later (see §5).

---

## 3. Route-by-route content mapping

Legend: **EXISTING** = build from a named real file in this repo · **NEW-from-data** =
derivable from existing structured data (city array, lead-API, existing copy reshaped) ·
**PLACEHOLDER** = true gap → `<ContentGap>` + `content-gaps.json`.

### Entry
| Route | Section sourcing |
|---|---|
| `/` | Splitscreen + scroll content **DONE** (fase 2). Topbar/USP EXISTING. Merkverhaal PLACEHOLDER (`home-merkverhaal`). Uitgelicht: 1 verbouwproject EXISTING (`assets/footer-project.jpg`); 4 producten PLACEHOLDER (`home-uitgelicht-producten`). Panel videos PLACEHOLDER (`home-split-video-*`) — currently branded CSS / project-photo poster |

### SHOP world — **entirely structure + placeholder (no product data in repo)**
| Route | Content source |
|---|---|
| `/shop` | Layout/blocks NEW-from-data (block components). Hero, categorie-tegels, op-maat rij, sale, nieuw, shop-op-merk, inspiratie → **all PLACEHOLDER** (no products/media). Montage-blok, showroom-blok, **verbouwen-brug** → NEW-from-data (reuse verbouwen copy + `footer-project.jpg`). USP-bar/footer EXISTING |
| `/shop/alles`, `/zoeken` | PLACEHOLDER (needs catalog) |
| `/badkamer`, `/badkamer/alle`, `/badkamer/[...groep]` | PLACEHOLDER — no products. Build hub/PLP shell; SEO-tekst can seed from existing badkamer/Saninet copy in `index.html`/`diensten.html` (NEW-from-data) |
| `/p/[id]` (PDP) | PLACEHOLDER — no product feed. Montage-optie PLACEHOLDER (montageprijs unknown). Verbouwen-brug NEW-from-data |
| `/raamdecoratie`, `/raamdecoratie/[product]` | PLACEHOLDER — **no plissé products, no price matrix, no photos** exist here. This is the deepest gap (§5) |
| `/raamdecoratie/opmeten`, `/stalen` | PLACEHOLDER |
| `/merken`, `/merken/[merk]` | PLACEHOLDER — no brand list/products |
| `/sale`, `/nieuw` | PLACEHOLDER — no product feed |
| `/inspiratie/*` | PLACEHOLDER — no owned interior photography (sectieplan advises defer to fase 2) |
| `/diensten/montage` etc. (shop-diensten) | Structure NEW-from-data; montage "hoe werkt het" + werkgebied reuse city list (NEW-from-data); prijs/scope PLACEHOLDER |
| `/cart`, `/checkout`, `/verlanglijst` | PLACEHOLDER — no cart/catalog/payment |

### VERBOUWEN world — **almost all buildable from real content**
| Route | Content source |
|---|---|
| `/verbouwen` (home) | Hero + **3-veld intake** NEW-from-data (reuse `index.html` lead-quiz + `api/advies`); vertrouwensbalk EXISTING (`index.html` "Vier beloftes"); "Wat we verbouwen" 7-8 kaarten EXISTING (`diensten.html` specialismen); werkwijze EXISTING (`diensten.html` 4 fases / `index.html` Discipline list); "Wat kost het" EXISTING (`prijzen.html` tiers); shop-brug NEW-from-data. **Voor&na, reviews, team → PLACEHOLDER** (no owned project photos / named team / review source) |
| `/verbouwen/diensten` | Hero + intro EXISTING (`diensten.html`); 7-8 dienstkaarten EXISTING; vakdisciplines NEW-from-data (city-page dienst list already names loodgieter/elektra/dakwerk etc.) |
| `/verbouwen/diensten/[dienst]` (×7) | Introtekst EXISTING (`diensten.html` per-specialisme copy); scope/werkzaamheden NEW-from-data (city dienst blurbs); richtprijzen EXISTING (`diensten.html` + `prijzen.html`); werkwijze EXISTING. **Hero beeld per ruimte + voor&na + per-ruimte FAQ → PLACEHOLDER** |
| `/verbouwen/werkwijze` | Steps 1-4 EXISTING (`diensten.html` fases + `index.html` Discipline). Doorlooptijden NEW-from-data (city FAQ already states 2-4 wk badkamer, 3-6 mnd woning). "Wat verwachten we van jou" PLACEHOLDER |
| `/verbouwen/kosten` | Tiers + disclaimer EXISTING (`prijzen.html`); kostenindicator NEW-from-data (build calculator on existing tier ranges). Meerwerk/financiering PLACEHOLDER |
| `/verbouwen/projecten` + `/[slug]` | **PLACEHOLDER** — real project photos (voor/na) do not exist; current cards are Unsplash + generic names. Overview shell NEW-from-data |
| `/verbouwen/vakmensen` | PLACEHOLDER (stat "28 eigen vakmensen" EXISTING as a number, but no photos/names) |
| `/verbouwen/garantie` | NEW-from-data seed (`prijzen.html` FAQ: "5 jr constructief / 2 jr afwerking"; city FAQ: "tot 10 jr constructief / 5 jr installaties") — **conflicting figures → needs owner confirmation**, treat as PLACEHOLDER-with-seed |
| `/verbouwen/reviews` | PLACEHOLDER (only the "9.4" stat exists, no review bodies/source) |
| `/verbouwen/veelgestelde-vragen` | NEW-from-data (aggregate `prijzen.html` FAQ + city FAQ); expand PLACEHOLDER |
| `/verbouwen/intake` (wizard) | Steps NEW-from-data — **directly reuse the `index.html` lead-quiz logic + `api/advies` + `api/advies/upload-url` Blob upload**. 7 ruimte-tegels EXISTING. Budget schijven EXISTING (`index.html` select). Bedankpagina EXISTING ("binnen 2 werkdagen") |
| `/verbouwen/[stad]` (×50) | Hero/intro/positioning/wijken/nearby/dienst-kaarten/prijs-tiers/FAQ **all EXISTING** in `generate-cities.js`. Woningtype-context, lokale richtprijzen, regio-projecten PLACEHOLDER-with-seed |
| `/verbouwen/[stad]/[dienst]` | NEW-from-data, **fase A only** (10 steden × 3 klussen), gated by whitelist |

### GEDEELD (info)
| Route | Content source |
|---|---|
| `/over-ons` | EXISTING (`over-ons.html` verhaal + waarden + stats). Team photos PLACEHOLDER |
| `/contact` | EXISTING (`contact.html` form + info) + wire `api/contact.js`. **Address/WhatsApp conflict — see §7** |
| `/showroom` | PLACEHOLDER (no showroom photos; address itself is disputed, §7) |
| `/klantenservice`, `/verzending`, `/retourneren`, `/veelgestelde-vragen` | PLACEHOLDER — these are webshop service pages with **no existing content** in this repo |
| `/blog` + `/blog/[slug]` | PLACEHOLDER — **no blog articles exist here** (the sectieplan's "3 bestaande blogs" refer to live woonklasse.nl, not this repo) |
| `/algemene-voorwaarden`, `/privacybeleid`, `/cookies` | PLACEHOLDER — currently `#` links in footer; no legal copy in repo |
| `/404`, `/500`, `/sitemap.xml`, `/robots.txt` | NEW-from-data |

**Headline:** verbouwen + shared = mostly EXISTING/NEW-from-data. Shop = almost all
PLACEHOLDER. Build accordingly (verbouwen first — see §6).

---

## 4. The 50 city pages + the 7 diensten — migration approach

**City pages.** The 50 `[stad].html` files are all generated from one source array in
`generate-cities.js`. **Do not migrate 50 HTML files — migrate the data.**

1. Lift `CITIES` into `app/(verbouwen)/verbouwen/_data/steden.ts` (typed:
   `slug, naam, wijken[], nearby[], positioning`). This single file is **both** the content
   source **and** the route whitelist (site-mapping §7.4: "de whitelist uit die file bepaalt
   óók welke `/verbouwen/[slug]` routes bestaan").
2. Build `app/(verbouwen)/verbouwen/[stad]/page.tsx` with `generateStaticParams()` over
   `steden.ts`. Any slug not in the list must **404** (guards against `/verbouwen/keuken`
   colliding with a city, per §2's routing valkuil — diensten live under
   `/verbouwen/diensten/[dienst]`, never `/verbouwen/[dienst]`).
3. Port the existing city template markup (hero, "We kennen het werk hier" + positioning,
   Vier beloftes, Diensten-grid, Prijzen-tiers, Recent werk, FAQ×7, Nabijgelegen plaatsen)
   into React section components, styled with `data-mode="verbouwen"` tokens.
4. **URL preservation:** current slugs are served at repo root as `/[stad].html`; target is
   `/verbouwen/[stad]`. Add `next.config` redirects `/[stad].html → /verbouwen/[stad]` (and
   `/[stad] → /verbouwen/[stad]`) so any indexed/legacy links survive. Keep the exact 50
   slugs from the array.

**Doorway-page / thin-content risk (called out in both specs, §7.4 + sectieplan warning):**
the 50 pages today are 50× the *same* template with only positioning/wijken/nearby swapped —
prices, services, FAQ, and (Unsplash) imagery are identical. Google flags exactly this as
doorway pages. Mitigation baked into the plan:
- Keep the **unique** `positioning` paragraph (real, per-city) prominent.
- Fill the three PLACEHOLDER city sections (woningtype-context, lokale richtprijzen,
  regio-projecten) with **owner-supplied or open-data-seeded** uniqueness, or
- If the owner can't supply uniqueness soon, **collapse to one `/verbouwen/werkgebied`**
  page with a plaatsenlijst (the specs' explicit fallback) and keep individual pages
  `noindex` until they earn their content. Flag this as an owner decision (§7).

**The 7 (→8) diensten.** `diensten.html` already carries per-specialisme copy + vanaf-prijzen
and the city template carries an 8-service grid. Map the site-mapping's 7 canonical ruimtes
(keuken / badkamer / toilet / woonkamer / slaapkamer / zolder / volledige-woning) onto the
existing services, driven by a `diensten.ts` array (whitelist for `[dienst]`), reusing the
existing descriptions + prices. Sections with no per-ruimte content (voor&na, per-ruimte FAQ,
ruimte-specifiek hero beeld) get `<ContentGap>`. Build the template once, generate statically.

---

## 5. Webshop reality check

**No product data exists in this repo.** Concretely, that blocks:

| Blocked surface | Why | Phasing |
|---|---|---|
| PLP (`/badkamer/*`, `/sale`, `/nieuw`, `/merken/[merk]`, `/shop/alles`) | No products, no facets, no `SELECT groep` taxonomy (sectieplan §A) | Build filter/grid/sort **shell** against a typed `Product[]` interface returning `[]` → renders an empty-state + `<ContentGap>`. Wire real feed later, zero UI rework |
| PDP (`/p/[id]`) | No product records, images, specs, variants | Build template against the interface; render `<ContentGap>` until feed exists. Montage-checkbox stays PLACEHOLDER (montageprijs model unknown) |
| Maatwerk-configurator (`/raamdecoratie/[product]`) | **No plissé products, no price matrix (product × montagewijze × stofgroep × maatstap → prijs), no swatches, no photos.** Sectieplan calls this "het grootste contentgat van het hele project" | Build the stepper UI shell + `PriceTicker` against a `configuratorSpec` interface; hard-block on the price matrix. Single biggest data dependency |
| Cart / checkout (`/cart`, `/checkout`, `/verlanglijst`) | No cart state, no line items, no payment (iDEAL/CC), no order backend | Build UI shells only; do **not** wire fake payments. PLACEHOLDER for kortingscode, montage-inplanstap, postcodecheck |

**Rule so the shop tak isn't fake:** define the data contracts now
(`types/product.ts`, `types/configurator.ts`), build every shop surface as a real component
against those contracts, and have them render honest empty-states + `<ContentGap>` when the
data source returns nothing. When the owner delivers (a) a product/catalog feed, (b) the
raamdecoratie price matrix, and (c) owned product/interior media, the shop lights up without
structural rework. Until then the shop is visibly "coming soon", not counterfeit.

**Two blocking shop deliverables to request from the owner up front:** the catalog feed
(with `groep` taxonomy) and the raamdecoratie price matrix spreadsheet.

---

## 6. Phased sequence (starts at fase 3; 1+2 done)

Backbone = site-mapping §12, annotated with the **content reality** of this repo. Because
verbouwen content is real and shop content is absent, the phases are kept in spec order but
each is tagged **[CONTENT-READY]** (buildable with real content now) or
**[SHELL-ONLY]** (structure + placeholder until data arrives). **Recommended execution order:
front-load the [CONTENT-READY] verbouwen phases (7-10, 12) and do the [SHELL-ONLY] shop
phases (3-6, 11) in parallel or after**, since they deliver visible, real value fastest.

| Fase | Deliverable | Consumes (real content) | Tag |
|---|---|---|---|
| **3** | `ShopHeader` (3-laags) + mega-menu + `SearchBar` (§4) | Nav labels only; mega-menu categories are placeholders (no taxonomy) | [SHELL-ONLY] |
| **4** | `/shop` homepage, all blocks as swappable components (§5) | Montage/showroom/verbouwen-brug blocks reuse verbouwen copy + `footer-project.jpg`; product/sale/merk/inspiratie blocks → `<ContentGap>` | [SHELL-ONLY] |
| **5** | PLP shell: `FilterSidebar`, `FilterChips`, `SortSelect`, `ProductGrid`, pagination — against `Product[]` interface | none (empty-state) | [SHELL-ONLY] |
| **6** | PDP shell `/p/[id]` incl. montage-optie + shop→verbouwen brug | Verbouwen-brug copy EXISTING; product data → `<ContentGap>` | [SHELL-ONLY] |
| **7** | `VerbouwHeader` (aannemersmodel, sticky CTA, mobiele actiebalk) + `/verbouwen` herindeling (§7.2) | `index.html` beloftes; `diensten.html` specialismen/fases; `prijzen.html` tiers; `over-ons.html` stats; lead-quiz → hero-intake via `api/advies` | **[CONTENT-READY]** |
| **8** | 7-8 dienstpagina's `/verbouwen/diensten/[dienst]` via `diensten.ts` template | `diensten.html` copy + prices; city dienst blurbs; werkwijze | **[CONTENT-READY]** (per-ruimte foto's/voor-na/FAQ = gaps) |
| **9** | `/verbouwen/intake` multi-step wizard + `/intake/bedankt` | `index.html` quiz + budget/timing; `api/advies`(+`upload-url` Blob); 7 ruimte-tegels; "binnen 2 werkdagen" | **[CONTENT-READY]** |
| **10** | `/verbouwen/projecten`, `/verbouwen/kosten`, `/verbouwen/reviews` | Kosten tiers EXISTING (+kostenindicator NEW-from-data); projecten/reviews → `<ContentGap>` (no owned photos/reviews) | Mixed (kosten CONTENT-READY; projecten/reviews SHELL-ONLY) |
| **11** | Maatwerk-configurator `/raamdecoratie/[product]` (§6.4) | none — **hard-blocked on price matrix**; build UI shell only | [SHELL-ONLY] |
| **12** | Stad × dienst **fase A** (10 steden × 3 klussen = 30 pages), whitelist-gated | `steden.ts` + `diensten.ts` combined; hand-edited uniqueness | **[CONTENT-READY]** (uniqueness still needs owner input) |

**Plus fase 13 — reconciliation & launch prep (new, recommended):** resolve the
contact-info conflict site-wide (§7), migrate the 50 city pages + redirects (§4), fill
`(info)` legal/service pages, replace hot-linked Unsplash imagery with owned/licensed media,
generate sitemaps + structured data (Service/AreaServed/LocalBusiness/FAQPage/BreadcrumbList),
and the Vercel preset switch (§8).

**Total: 11 phases (fase 3 → fase 13).**

---

## 7. Open decisions & content gaps (owner input)

**Blocking gaps (a surface cannot be truthfully built without these):**
1. **Raamdecoratie price matrix** (product × montagewijze × stofgroep × maatstap → prijs, plus option surcharges) → the entire configurator (fase 11).
2. **Webshop product/catalog feed** (with `groep` taxonomy per sectieplan §A) → all shop PLP/PDP/`/shop`/merken/sale/nieuw.
3. **Montageprijs model** (vast bedrag / percentage / op aanvraag) → decides whether PDP montage is a cart-line or a lead form.
4. **Real project photos, voor & na, min. 6** → `/verbouwen/projecten`, dienstpagina's, homepage voor&na, inspiratie. (Current project imagery is hot-linked Unsplash — not usable in production.)
5. **Owned media generally** — every hero/section image on the static site is a hot-linked Unsplash URL; the `/wk/*.mp4` videos the sectieplan assumes **do not exist here**. Splitscreen panel videos (`home-split-video-*`) included.

**Strongly recommended (else sections stay empty):**
6. Team photos + names (stat says 28 vakmensen; zero faces on site) → `/verbouwen/vakmensen`, homepage team.
7. **Garantie — resolve the conflict:** `prijzen.html` FAQ says "5 jr constructief / 2 jr afwerking"; the city-page FAQ says "tot 10 jr constructief / 5 jr installaties". These contradict → owner must state the real terms → `/verbouwen/garantie`.
8. Reviews with a real source (only the "9.4" number exists) → `/verbouwen/reviews`, PDP reviews.
9. Merkverhaal / bedrijfsverhaal for `/` (`home-merkverhaal`) — note `over-ons.html` already has a usable "sinds 2010, 28 vakmensen" story that can seed this.
10. Blog articles (none in repo) → `/blog`; legal copy (voorwaarden/privacy/cookies are `#` stubs).

**Consolidated §13 decisions (from site-mapping):** verbouwtak-merknaam; shared vs webshop-only account; `/shop` vs `/webshop` URL; whether categories beyond badkamer arrive (affects mega-menu breadth); montageprijs model (dup of #3); intake formulier-vs-WhatsApp-first; reviews systeem (eigen/Trustpilot/Google).

### Contact-info conflict — must be resolved before launch
The repo is internally inconsistent, and it disagrees with the specs:

| | Specs (sectieplan) | Existing repo (`footer`/`contact.html`) | Already in new scaffold |
|---|---|---|---|
| Showroom/adres | **Showroom Leerdam**, Laantje van Van Iperen 26b, 4142 ER | **Amsterdam-Duivendrecht**, Joop Geesinkweg 201, 1114 AB | Topbar says **Leerdam**; `Footer.tsx` says **Amsterdam** |
| WhatsApp | **wa.me/31615623995** | **wa.me/31650424683** (+ tel +31 30 207 23 88) | `page.tsx` topbar uses **31615623995**; `Footer.tsx` uses **31650424683** |

This is registered as `topbar-showroom-whatsapp-discrepantie` in `content-gaps.json`. **The
new build has already shipped both variants in different components** (splitscreen topbar =
Leerdam/…3995; Footer = Amsterdam/…4683), so this must be reconciled to one source of truth
(a single `contact.ts`) before any page ships. **Owner decides which is current.**

---

## 8. Deploy note

The Vercel project `woonklasse-redesign` (`.vercel/project.json`) is currently configured for
the **static-site preset** — it serves the legacy root `.html` files, and `next.config.mjs`
explicitly notes those pages are "NOT served by Next.js". Building/previewing the App Router
app requires the **Next.js framework preset** (build command `next build`, output the Next
build, not static file serving).

**Recommendation:** create a **separate Vercel project** (or a dedicated preview branch with
its own project) using the **Next.js preset** for the redesign, and leave the current static
production project untouched until the new app reaches parity. This keeps production static
and stable while the Next.js redesign is previewable end-to-end. Flip the domain over only at
launch. (Note: another agent is editing this repo concurrently — do not change Vercel/git
config as part of this planning task; this is a launch-time action item.)

---

## Appendix — design-token reconciliation (minor)

The static site's aesthetic (`styles.css`, README) is warm/luxury: `--ink #1a1a1a`,
`--taupe #ada89e` (large fields), `--gold #2a2e33` accent, Advent Pro + Inter. The new
`app/tokens.css` keeps Advent Pro + Inter but shifts accents to a neutral **anthracite**
palette (`--wk-accent #2a2e33`, `--wk-anthracite`). When porting existing verbouwen copy,
decide whether to keep the taupe/gold warmth for the verbouwen mode (matches site-mapping §9
"Verbouwen = warmer, donkerdere secties toegestaan") or fully adopt the anthracite tokens.
Low-risk, but settle it before fase 7 so the verbouwen tak reads consistently.
