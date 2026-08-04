import ModeSwitcher from "../components/ModeSwitcher";
import Footer from "../components/Footer";

/**
 * (verbouwen) route group — data-mode="verbouwen" (roomy tokens, §9).
 * Fase 1 scaffold: minimal two-layer header hosting the ModeSwitcher + Footer.
 * The full VerbouwHeader (aannemersmodel, sticky CTA) is fase 7.
 */
export default function VerbouwenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-mode="verbouwen">
      <header className="wk-modehead">
        <a
          className="wk-modehead__logo"
          href="/verbouwen"
          aria-label="Woonklasse Verbouwen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/woonklasse-logo-dark.png" alt="Woonklasse Verbouwen" />
        </a>
        <div className="wk-modehead__meta">
          <span>Werkgebied heel Nederland</span>
          <ModeSwitcher current="verbouwen" />
        </div>
      </header>

      {children}

      <Footer />
    </div>
  );
}
