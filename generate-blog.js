// ============================================================
// Blog generator for the Woonklasse redesign (static site).
//
//   node generate-blog.js
//
// - Renders a full article page (blog-<slug>.html) for every post in
//   blog-data.js that has a `content` block.
// - Rebuilds the blog index (blog.html) from ALL posts.
// - Refreshes the blog URLs in sitemap.xml.
//
// Guardrails:
//   - Throws if any post contains an em-dash. House rule: never use them.
//   - Writes nothing for posts without `content` (their HTML is hand-written);
//     they still appear on the index + sitemap via their card metadata.
// ============================================================

const fs = require('fs');
const path = require('path');
const { POSTS, AUTHOR } = require('./blog-data');

const SITE = 'https://woonklasse.nl';
const OUT = __dirname;
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// ---------- helpers ----------
const fileFor = (slug) => `blog-${slug}.html`;
const urlFor = (slug) => `${SITE}/blog-${slug}`;

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Escape text for safe HTML, then convert markdown links [tekst](href) -> <a>.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function inline(s) {
  return esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function assertNoEmDash(post) {
  const blob = JSON.stringify(post);
  if (blob.includes('\u2014')) {
    throw new Error(`Em-dash gevonden in post "${post.slug}". Vervang door komma, punt of "tot".`);
  }
}

// ---------- shared chrome ----------
const NAV = `
<header class="site-header" id="siteHeader">
  <a class="logo-block" href="index.html" aria-label="Woonklasse home">
    <img src="assets/woonklasse-logo-dark.png" alt="Woonklasse" class="logo-block__img" width="160" height="160"/>
  </a>
  <nav class="nav" aria-label="Hoofdmenu">
    <a href="diensten.html">Diensten</a>
    <a href="faq.html">FAQ</a>
    <a href="projecten.html">Projecten</a>
    <a href="blog.html">Blog</a>
    <a href="over-ons.html">Over ons</a>
    <a href="contact.html">Contact</a>
  </nav>
</header>`;

// Getokeniseerde footer, 1-op-1 gelijk aan de overige pagina's op main, zodat
// build.js de {{footer.*}} tokens vult en de footer CMS-bewerkbaar blijft.
const FOOTER = `
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__brand">
      <img src="assets/woonklasse-logo-white.png" alt="Woonklasse" class="footer__brand-img" width="120" height="120"/>
      <span class="footer__wordmark">Woonklasse</span>
    </div>
    <p style="font-family: var(--body); color: rgba(255,255,255,0.7); max-width: 36ch; margin: -40px 0 50px; font-size: 14.5px;" data-cms-key="footer.tagline">{{footer.tagline}}</p>
    <div class="footer__cols">
      <div>
        <a href="index.html">Home</a>
        <a href="diensten.html">Diensten</a>
        <a href="faq.html">FAQ</a>
        <a href="projecten.html">Projecten</a>
        <a href="blog.html">Blog</a>
        <a href="over-ons.html">Over ons</a>
        <a href="contact.html">Contact</a>
      </div>
      <div>
        <a href="mailto:{{footer.email}}" data-cms-key="footer.email">{{footer.email}}</a>
        <a href="tel:{{footer.phoneHref}}" data-cms-key="footer.phoneDisplay">{{footer.phoneDisplay}}</a>
        <a href="{{footer.whatsappUrl}}" data-cms-key="footer.whatsappUrl">WhatsApp</a>
        <span data-cms-key="footer.address">{{footer.address}}</span>
      </div>
      <div>
        <span style="opacity: 0.6; font-size: 12px;">Zusterbedrijf</span>
        <a href="https://badkamerstijl.nl" target="_blank" rel="noopener" class="footer__bks" aria-label="Badkamerstijl"><img src="assets/badkamerstijl-logo.svg" alt="Badkamerstijl" class="footer__bks-logo" width="116" height="48"/></a>
      </div>
    </div>
    <div class="footer__legal">
      <span data-cms-key="footer.copyright">{{footer.copyright}}</span>
      <span class="sep">|</span>
      <a href="privacy.html">Privacybeleid</a>
      <span class="sep">|</span>
      <a href="voorwaarden.html">Algemene voorwaarden</a>
    </div>
    <p class="footer__credit" data-cms-key="footer.kvk">{{footer.kvk}}</p>
  </div>
</footer>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Advent+Pro:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<link rel="icon" type="image/png" href="/assets/favicon.png"/>
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="stylesheet" href="styles.css"/>`;

// Zelfde scripts als de rest van de site, inclusief de datareaches traffic-ping.
const SCRIPTS = `<script defer src="/_vercel/insights/script.js"></script>
<script src="script.js"></script>
<script id="wk-track">(function(){if(window.parent!==window)return;try{fetch("https://datareaches.com/api/track/woonklasse",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({path:location.pathname+location.search,referrer:document.referrer}),keepalive:true,mode:"cors"}).catch(function(){});}catch(e){}})();</script>`;

// ---------- article rendering ----------
function renderSection(sec) {
  let html = `\n      <h2>${esc(sec.heading)}</h2>`;
  for (const p of sec.paragraphs || []) html += `\n      <p>${inline(p)}</p>`;
  if (sec.list) {
    const tag = sec.list.ordered ? 'ol' : 'ul';
    html += `\n      <${tag}>`;
    for (const li of sec.list.items) html += `\n        <li>${inline(li)}</li>`;
    html += `\n      </${tag}>`;
  }
  if (sec.callout) {
    html += `\n      <div class="article__callout">\n        <h3>${esc(sec.callout.title)}</h3>\n        <p>${inline(sec.callout.body)}</p>\n      </div>`;
  }
  return html;
}

function renderRelated(slugs) {
  const items = (slugs || [])
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter(Boolean)
    .map((p) => `\n          <li><a href="${fileFor(p.slug)}">${esc(p.title)}</a></li>`)
    .join('');
  if (!items) return '';
  return `\n      <div class="article__related">\n        <h2>Lees ook</h2>\n        <ul>${items}\n        </ul>\n      </div>`;
}

function articleJsonLd(post) {
  const c = post.content;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': urlFor(post.slug) },
    headline: post.title,
    description: post.metaDescription,
    image: `${SITE}/${post.image.src}`,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: { '@type': 'Person', name: AUTHOR.name, jobTitle: AUTHOR.role },
    publisher: { '@type': 'Organization', name: 'Woonklasse', logo: { '@type': 'ImageObject', url: `${SITE}/assets/woonklasse-logo-dark.png` } },
    articleSection: post.category,
    keywords: (post.keywords || []).join(', '),
  });
}

function renderArticle(post) {
  const c = post.content;
  const body = (c.sections || []).map(renderSection).join('');
  const introExtra = (c.intro || []).map((p) => `\n      <p>${inline(p)}</p>`).join('');
  const conclusion = (c.conclusion || []).map((p) => `\n      <p>${inline(p)}</p>`).join('');
  const ogImg = `${SITE}/${post.image.src}`;
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(post.metaTitle || post.title)}</title>
<meta name="description" content="${esc(post.metaDescription)}"/>
<link rel="canonical" href="${urlFor(post.slug)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="theme-color" content="#1a1a1a"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="Woonklasse"/>
<meta property="og:locale" content="nl_NL"/>
<meta property="og:url" content="${urlFor(post.slug)}"/>
<meta property="og:title" content="${esc(post.title)}"/>
<meta property="og:description" content="${esc(post.metaDescription)}"/>
<meta property="og:image" content="${ogImg}"/>
<meta property="og:image:alt" content="${esc(post.heroAlt)}"/>
<meta property="article:published_time" content="${post.date}"/>${post.updatedDate ? `\n<meta property="article:modified_time" content="${post.updatedDate}"/>` : ''}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(post.title)}"/>
<meta name="twitter:description" content="${esc(post.metaDescription)}"/>
<meta name="twitter:image" content="${ogImg}"/>
${FONTS}
<script type="application/ld+json">
${articleJsonLd(post)}
</script>
</head>
<body>
${NAV}

<section class="section" style="background:#fff; padding-top: clamp(120px, 16vw, 200px);">
  <div class="section__inner" style="max-width: 820px;">
    <article class="article">
      <p class="article__kicker"><a href="blog.html" style="color:inherit; text-decoration:none;">Blog</a> · ${esc(post.category)}</p>
      <h1 class="section-title" style="margin-bottom: 20px;">${esc(post.title)}</h1>
      <div class="article__meta">
        <span>${esc(AUTHOR.name)}</span><span class="dot"></span>
        <span>${formatDate(post.date)}</span><span class="dot"></span>
        <span>${post.readingTime} min lezen</span>
      </div>

      <img src="${post.image.src}" alt="${esc(post.heroAlt)}" class="article__hero" width="${post.image.w}" height="${post.image.h}" loading="lazy"/>

      <p class="article__lead">${inline(c.lead)}</p>${introExtra}
${body}

      <h2>Conclusie</h2>${conclusion}
${renderRelated(c.relatedSlugs)}

      <a href="contact.html" class="link-underline" style="margin-top: 44px; display:inline-block;">${esc(c.ctaLabel || 'Vraag een vrijblijvende opname aan')}</a>
    </article>
  </div>
</section>
${FOOTER}

${SCRIPTS}
</body>
</html>
`;
}

// ---------- index rendering ----------
function renderCard(post) {
  return `      <a class="blog-card" href="${fileFor(post.slug)}">
        <img class="blog-card__img" src="${post.image.src}" alt="${esc(post.heroAlt)}" width="${post.image.w}" height="${post.image.h}" loading="lazy"/>
        <div class="blog-card__body">
          <p class="blog-card__cat">${esc(post.category)}</p>
          <h2 class="blog-card__title">${esc(post.title)}</h2>
          <p class="blog-card__excerpt">${esc(post.excerpt)}</p>
          <div class="blog-card__meta"><span>${formatDate(post.date)}</span><span class="dot"></span><span>${post.readingTime} min lezen</span></div>
        </div>
      </a>`;
}

function indexJsonLd(posts) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog`,
    name: 'Woonklasse Blog',
    description: 'Praktische gidsen over verbouwen, renoveren en verduurzamen.',
    publisher: { '@type': 'Organization', name: 'Woonklasse', logo: { '@type': 'ImageObject', url: `${SITE}/assets/woonklasse-logo-dark.png` } },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: urlFor(p.slug), datePublished: p.date })),
  });
}

function renderIndex(posts) {
  const cards = posts.map(renderCard).join('\n\n');
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Blog | Woonklasse</title>
<meta name="description" content="Praktische gidsen over verbouwen, renoveren en verduurzamen. Realistische kosten, vergunningen, subsidies en eerlijk advies voor woningeigenaren."/>
<link rel="canonical" href="${SITE}/blog"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="theme-color" content="#1a1a1a"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Woonklasse"/>
<meta property="og:locale" content="nl_NL"/>
<meta property="og:url" content="${SITE}/blog"/>
<meta property="og:title" content="Blog | Woonklasse"/>
<meta property="og:description" content="Praktische gidsen over verbouwen, renoveren en verduurzamen voor woningeigenaren."/>
<meta property="og:image" content="${SITE}/assets/og-image.jpg"/>
<meta property="og:image:alt" content="Woonklasse blog over verbouwen en renoveren"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Blog | Woonklasse"/>
<meta name="twitter:description" content="Praktische gidsen over verbouwen, renoveren en verduurzamen voor woningeigenaren."/>
<meta name="twitter:image" content="${SITE}/assets/og-image.jpg"/>
${FONTS}
<script type="application/ld+json">
${indexJsonLd(posts)}
</script>
</head>
<body>
${NAV}

<section class="section" style="background:#fff; padding-top: clamp(140px, 18vw, 220px);">
  <div class="section__inner">
    <p style="font-family: var(--display); text-transform: uppercase; letter-spacing: 0.18em; font-size: 13px; color: var(--gold); margin: 0 0 18px;">Blog</p>
    <h1 class="section-title" style="margin-bottom: 16px;">Kennis en advies over verbouwen</h1>
    <p style="color: var(--muted); font-size: 16px; line-height: 1.7; max-width: 60ch; margin: 0 0 56px;">Praktische gidsen over kosten, vergunningen, subsidies en verduurzaming. Geschreven vanuit twintig jaar bouwpraktijk, zodat je beter voorbereid aan je project begint.</p>

    <div class="blog-grid">
${cards}
    </div>
  </div>
</section>
${FOOTER}

${SCRIPTS}
</body>
</html>
`;
}

// ---------- sitemap ----------
function updateSitemap(posts) {
  const file = path.join(OUT, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf8');
  // Drop existing blog URLs (index + articles), then re-insert a fresh block.
  xml = xml.replace(/^\s*<url><loc>[^<]*\/blog[^<]*<\/loc>.*<\/url>\n/gm, '');
  const lines = [`  <url><loc>${SITE}/blog</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`];
  for (const p of posts) {
    lines.push(`  <url><loc>${urlFor(p.slug)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  }
  const block = lines.join('\n') + '\n';
  // Insert right before the closing tag.
  xml = xml.replace('</urlset>', block + '</urlset>');
  fs.writeFileSync(file, xml);
}

// ---------- run ----------
function main() {
  POSTS.forEach(assertNoEmDash);
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  let rendered = 0;
  for (const post of POSTS) {
    if (!post.content) continue;
    fs.writeFileSync(path.join(OUT, fileFor(post.slug)), renderArticle(post));
    rendered++;
  }
  fs.writeFileSync(path.join(OUT, 'blog.html'), renderIndex(sorted));
  updateSitemap(sorted);

  console.log(`Blog gegenereerd: ${rendered} artikel(en) gerenderd, ${sorted.length} op de index, sitemap bijgewerkt.`);
  console.log('Posts (nieuw -> oud):');
  sorted.forEach((p) => console.log(`  ${p.date}  ${post_marker(p)}  ${p.slug}`));
}
function post_marker(p) { return p.content ? '[gegenereerd]' : '[handmatig] '; }

main();
