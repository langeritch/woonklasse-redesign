import gaps from "@/content-gaps.json";

type Gap = {
  id: string;
  vraag: string;
  pagina?: string;
  sectie?: string;
  blokkerend?: boolean;
};

/** Single, shared placeholder photo used for EVERY content gap on the site. */
export const PLACEHOLDER_SRC = "/assets/placeholder.svg";

/**
 * ContentGap — hard rule from the sectieplan.
 *
 * Owner requirement (overrides earlier "hide in production" behaviour):
 * EVERYWHERE there is a content gap we render the SAME high-visibility
 * placeholder photo — in BOTH development AND production — so it is
 * impossible to miss where the owner still needs to add his own content.
 * The gap's `vraag` (question) and `id` are shown with it. Never invent
 * copy, stats, reviews, names, prices or use lorem/real stock imagery.
 *
 * Every gap is also registered in /content-gaps.json at the repo root.
 *
 * Variants:
 *  - "block" (default): a self-contained section-width block.
 *  - "fill": absolutely fills its nearest positioned ancestor (used inside
 *    the splitscreen panel media area). The parent must be position:relative.
 */
export default function ContentGap({
  id,
  vraag,
  variant = "block",
}: {
  id: string;
  /** Optional inline override; falls back to the question in content-gaps.json */
  vraag?: string;
  variant?: "block" | "fill";
}) {
  const registered = (gaps as Gap[]).find((g) => g.id === id);
  const question = vraag ?? registered?.vraag ?? "(geen vraag geregistreerd)";
  const blokkerend = registered?.blokkerend ?? false;

  return (
    <figure
      className={`wk-gap wk-gap--${variant}`}
      role="group"
      aria-label={`Ontbrekende content: ${id}`}
    >
      {/* Intentional <img>: the placeholder is a static SVG that must render
          identically in dev and prod without next/image optimisation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="wk-gap__img"
        src={PLACEHOLDER_SRC}
        alt={question}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="wk-gap__caption">
        <span className="wk-gap__tag">
          Content gap · {id}
          {blokkerend ? " · BLOKKEREND" : ""}
        </span>
        <span className="wk-gap__vraag">{question}</span>
      </figcaption>
    </figure>
  );
}
