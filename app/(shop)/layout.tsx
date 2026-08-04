import ModeSwitcher from "../components/ModeSwitcher";
import UspBar from "../components/UspBar";
import Footer from "../components/Footer";

/**
 * (shop) route group — data-mode="shop" (compact tokens, §9).
 * Fase 1 scaffold: minimal header hosting the ModeSwitcher + shared UspBar +
 * Footer. The full IKEA-model ShopHeader/mega-menu is fase 3.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-mode="shop">
      <header className="wk-modehead">
        <a className="wk-modehead__logo" href="/shop" aria-label="Woonklasse webshop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/woonklasse-logo-dark.png" alt="Woonklasse" />
        </a>
        <div className="wk-modehead__meta">
          <span>Showroom Leerdam</span>
          <ModeSwitcher current="shop" />
        </div>
      </header>

      {children}

      <UspBar />
      <Footer />
    </div>
  );
}
