import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webshop — Woonklasse",
  description:
    "Badkamer, sanitair en raamdecoratie op maat uit 300+ merken.",
};

/**
 * /shop — webshop-homepage. FASE 1/2 scaffold only: this is the mode="shop"
 * landing target for the splitscreen. The full IKEA-model homepage (hero,
 * categorie-tegels, sale-feed, montage-blok, …) is fase 4 (§5).
 */
export default function ShopHome() {
  return (
    <main className="wk-container" style={{ paddingBlock: "var(--wk-section-y)" }}>
      <p className="wk-story__eyebrow">Webshop</p>
      <h1 style={{ fontSize: "clamp(28px,4vw,48px)", margin: "0 0 16px" }}>
        Shop je interieur
      </h1>
      <p style={{ maxWidth: "48ch", color: "var(--wk-muted)", lineHeight: 1.6 }}>
        Badkamer, sanitair en raamdecoratie op maat uit 300+ merken. De
        volledige webshop-homepage wordt in fase 4 gebouwd; dit is het
        instappunt vanuit het splitscreen.
      </p>
    </main>
  );
}
