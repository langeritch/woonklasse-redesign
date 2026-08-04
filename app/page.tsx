import "./(entry)/split-entry.css";
import SplitEntry from "./(entry)/SplitEntry";
import UspBar from "./components/UspBar";
import Footer from "./components/Footer";
import ContentGap from "./components/ContentGap";

/**
 * `/` — Splitscreen entry (§3 anatomy).
 * Top bar → splitscreen hero (two real <a> panels) → scroll hint → USP-bar →
 * brand-story → uitgelicht → shared footer. NEVER auto-redirects.
 */
export default function EntryPage() {
  return (
    <>
      <div className="wk-entry">
        {/* 1 — minimal top bar */}
        <header className="wk-entry-bar">
          <a className="wk-entry-bar__logo" href="/" aria-label="Woonklasse home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/woonklasse-logo-dark.png" alt="Woonklasse" width={160} height={160} />
          </a>
          <div className="wk-entry-bar__meta">
            <span>Showroom Leerdam</span>
            <a href="https://wa.me/31615623995">WhatsApp</a>
          </div>
        </header>

        {/* 2 — splitscreen hero + resume quick-link (client) */}
        <SplitEntry />
      </div>

      {/* 3 — scroll hint */}
      <div className="wk-scrollhint">
        <span className="wk-scrollhint__arrow" aria-hidden="true">
          ↓
        </span>
        Of scroll verder — dit is Woonklasse
      </div>

      {/* 4 — USP bar */}
      <UspBar />

      {/* 5 — brand story (H1 lives here per §3 SEO note). Copy is [INPUT NODIG]. */}
      <section className="wk-story wk-container" aria-labelledby="wk-story-h1">
        <div className="wk-story__inner">
          <p className="wk-story__eyebrow">Woonklasse</p>
          <h1 id="wk-story-h1">Alles voor je huis</h1>
          <ContentGap id="home-merkverhaal" />
        </div>
      </section>

      {/* 6 — uitgelicht: 4 producten (gap, geen productfeed) + 1 verbouwproject */}
      <section className="wk-featured" aria-label="Uitgelicht">
        <div className="wk-container">
          <div className="wk-featured__head">
            <h2>Uitgelicht</h2>
          </div>

          {/* 4 producten — no product/sale feed exists in this repo yet */}
          <ContentGap id="home-uitgelicht-producten" />

          {/* 1 verbouwproject — real repo asset */}
          <article className="wk-featured__project">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/footer-project.jpg" alt="Uitgevoerd verbouwproject van Woonklasse" />
            <div className="wk-featured__project-body">
              <p className="wk-panel__eyebrow" style={{ opacity: 0.85 }}>
                Verbouwen
              </p>
              <h3>Verbouwen zonder zorgen</h3>
              <p>
                Ontwerp en uitvoering onder één dak, met vaste prijsafspraken en
                eigen vakmensen.
              </p>
              <a className="wk-linkcta" href="/verbouwen">
                Bekijk Woonklasse Verbouwen →
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* 7 — shared footer */}
      <Footer />
    </>
  );
}
