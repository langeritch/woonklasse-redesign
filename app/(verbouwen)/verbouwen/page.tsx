import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Woonklasse Verbouwen — Verbouwen zonder zorgen",
  description:
    "Complete verbouwingen met eigen vakmensen. Vaste prijsafspraken, ontwerp en uitvoering onder één dak.",
};

/**
 * /verbouwen — aannemers-homepage. FASE 1/2 scaffold only: mode="verbouwen"
 * landing target for the splitscreen. The full herindeling (hero+intake,
 * vertrouwensbalk, diensten, voor/na, werkwijze, …) is fase 7 (§7.2).
 * The existing static verbouwen pages remain on disk (see report/migration note).
 */
export default function VerbouwenHome() {
  return (
    <main className="wk-container" style={{ paddingBlock: "var(--wk-section-y)" }}>
      <p className="wk-story__eyebrow">Woonklasse Verbouwen</p>
      <h1 style={{ fontSize: "clamp(28px,4vw,52px)", margin: "0 0 20px" }}>
        Verbouwen zonder zorgen
      </h1>
      <p style={{ maxWidth: "52ch", color: "var(--wk-muted)", lineHeight: 1.6 }}>
        Complete verbouwingen met eigen vakmensen, vaste prijsafspraken en
        ontwerp en uitvoering onder één dak. De volledige aannemers-homepage
        wordt in fase 7 gebouwd; dit is het instappunt vanuit het splitscreen.
      </p>
    </main>
  );
}
