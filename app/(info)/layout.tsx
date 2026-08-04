import Footer from "../components/Footer";

/**
 * (info) route group — neutral/shared pages (contact, klantenservice, blog,
 * over-ons, juridisch). Neutral header, default tokens (mode inherited from
 * referrer/shop later). No page lives here yet in fase 1/2; the layout is the
 * fundament for those shared pages (fase 3+).
 */
export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-mode="shop">
      <header className="wk-modehead">
        <a className="wk-modehead__logo" href="/" aria-label="Woonklasse home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/woonklasse-logo-dark.png" alt="Woonklasse" />
        </a>
      </header>

      {children}

      <Footer />
    </div>
  );
}
