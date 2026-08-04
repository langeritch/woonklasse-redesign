/**
 * UspBar — shared USP strip (§3 sectie 4, §5 blok 12).
 * Content is [BESTAAT]: taken verbatim from the live site.
 */
const DEFAULT_USPS = [
  "14 dagen bedenktijd",
  "Veilig betalen",
  "300+ merken",
  "Snelle levering",
];

export default function UspBar({ items = DEFAULT_USPS }: { items?: string[] }) {
  return (
    <section className="wk-usp" aria-label="Onze beloftes">
      <ul className="wk-usp__list wk-container">
        {items.map((usp) => (
          <li key={usp} className="wk-usp__item">
            <span aria-hidden="true" className="wk-usp__dot">·</span>
            {usp}
          </li>
        ))}
      </ul>
    </section>
  );
}
