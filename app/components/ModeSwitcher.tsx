import Link from "next/link";

/**
 * ModeSwitcher — the discrete link in L1 of each header that jumps to the
 * other world. Small, textual, never competing with the cart/CTA (§4 / §7.1).
 */
export default function ModeSwitcher({ current }: { current: "shop" | "verbouwen" }) {
  const to =
    current === "shop"
      ? { href: "/verbouwen", label: "Verbouwen" }
      : { href: "/shop", label: "Webshop" };

  return (
    <Link
      href={to.href}
      className="wk-mode-switcher"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--wk-display)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: 12,
        color: "var(--wk-muted)",
      }}
    >
      <span aria-hidden="true">⇄</span>
      {to.label}
    </Link>
  );
}
