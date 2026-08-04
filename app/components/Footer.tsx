/**
 * Footer — shared across all modes. Content reproduced 1-on-1 from the existing
 * static site footer (sectieplan: Footer = [BESTAAT], "huidige footer 1-op-1").
 * Do not rewrite the copy here without new input from the team.
 */
export default function Footer() {
  return (
    <footer className="wk-footer">
      <div className="wk-footer__inner wk-container">
        <div className="wk-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/woonklasse-logo-white.png"
            alt="Woonklasse"
            className="wk-footer__brand-img"
            width={120}
            height={120}
          />
          <span className="wk-footer__wordmark">Woonklasse</span>
        </div>
        <p className="wk-footer__tagline">
          Jouw droomwoning begint hier. Kwaliteit, vakmanschap en persoonlijke
          aandacht in elk project.
        </p>

        <div className="wk-footer__cols">
          <div>
            <a href="/">Home</a>
            <a href="/verbouwen">Verbouwen</a>
            <a href="/shop">Webshop</a>
            <a href="/projecten">Projecten</a>
            <a href="/over-ons">Over ons</a>
            <a href="/contact">Contact</a>
          </div>
          <div>
            <a href="mailto:info@woonklasse.nl">info@woonklasse.nl</a>
            <a href="tel:+31302072388">+31 30 207 23 88</a>
            <a href="https://wa.me/31650424683">WhatsApp</a>
            <span>
              Joop Geesinkweg 201
              <br />
              1114 AB Amsterdam-Duivendrecht
            </span>
          </div>
          <div>
            <span className="wk-footer__label">Zusterbedrijf</span>
            <a href="#">Badkamerstijl →</a>
          </div>
        </div>

        <div className="wk-footer__legal">
          <span>© 2026 Woonklasse. Alle rechten voorbehouden.</span>
          <span className="wk-footer__sep">|</span>
          <a href="/privacybeleid">Privacybeleid</a>
          <span className="wk-footer__sep">|</span>
          <a href="/algemene-voorwaarden">Algemene voorwaarden</a>
        </div>
        <p className="wk-footer__credit">KVK 85409146 · BTW NL004092100B36</p>
      </div>
    </footer>
  );
}
