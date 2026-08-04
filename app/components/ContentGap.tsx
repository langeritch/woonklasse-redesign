import gaps from "@/content-gaps.json";

type Gap = {
  id: string;
  vraag: string;
  pagina?: string;
  sectie?: string;
  blokkerend?: boolean;
};

/**
 * ContentGap — hard rule from the sectieplan.
 *
 * In development it renders a visible yellow block with the open question so
 * the team can see exactly what content is missing. In production it renders
 * NOTHING (the section is skipped entirely). Never invent copy, stats,
 * reviews, names, prices or use lorem/stock imagery in its place.
 *
 * Every gap is also registered in /content-gaps.json at the repo root.
 */
export default function ContentGap({
  id,
  vraag,
}: {
  id: string;
  /** Optional inline override; falls back to the question in content-gaps.json */
  vraag?: string;
}) {
  if (process.env.NODE_ENV === "production") return null;

  const registered = (gaps as Gap[]).find((g) => g.id === id);
  const question = vraag ?? registered?.vraag ?? "(geen vraag geregistreerd)";

  return (
    <div
      role="note"
      aria-label={`Ontbrekende content: ${id}`}
      style={{
        margin: "24px auto",
        maxWidth: "var(--wk-max)",
        border: "2px dashed #b58900",
        background: "#fff8dc",
        color: "#5b4a00",
        borderRadius: 8,
        padding: "20px 24px",
        fontFamily: "var(--wk-body)",
      }}
    >
      <strong style={{ display: "block", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Content gap · {id}
        {registered?.blokkerend ? " · BLOKKEREND" : ""}
      </strong>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{question}</p>
      <p style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.7 }}>
        Alleen zichtbaar in development. In productie wordt deze sectie volledig overgeslagen.
      </p>
    </div>
  );
}
