# Woonklasse

Statische website voor Woonklasse — hoogwaardige renovaties, luxe badkamers en complete woningverbouwingen.

## Structuur

- **6 hoofdpagina's** — `index.html`, `diensten.html`, `prijzen.html`, `projecten.html`, `over-ons.html`, `contact.html`
- **50 stadspagina's** — gegenereerd uit `generate-cities.js` (Amsterdam tot Rijswijk)
- **Shared design system** — `styles.css`, `script.js`, `assets/`
- **Content tools** — `content-editor.html` (interactieve editor) + `content-brief.md` (markdown brief)

## Design system

- **Typografie**: Advent Pro (display, ALL CAPS) + Inter (body)
- **Kleuren**: `--ink #1a1a1a` · `--taupe #ada89e` (groot vlak) · `--gold #2a2e33` (accent details)
- **Style**: minimal, architectonisch, sharp edges, drop-shadows op cards

## Lokaal draaien

Open `index.html` direct in een browser via `file://`. Geen build step nodig.

Voor de stadspagina's regenereren:

```bash
node generate-cities.js
```

## Content updaten

Open `content-editor.html` in de browser:
- Browse alle copy per pagina
- Vul nieuwe tekst in alleen waar je wil wijzigen (auto-save)
- Klik **↓ Exporteer wijzigingen** voor een `.json` en `.md` download
- Stuur het bestand terug voor een batch-update over alle 56 pagina's

## Pagina's

### Hoofdpagina's
| URL | Inhoud |
|---|---|
| `/` | Homepage met hero, 3-stappen lead quiz, services, projecten |
| `/diensten` | 9 specialismen + 4-stappen aanpak (Context · Compositie · Emotie · Ambacht) |
| `/prijzen` | 4 budgetcategorieën (Basis €500 – Maatwerk €50k+) |
| `/projecten` | 5 realisaties met beschrijvingen |
| `/over-ons` | Verhaal + 5 waarden + statistieken |
| `/contact` | Formulier + bezoekadres + openingstijden |

### Stadspagina's
Per stad een unieke landingspagina met city-specifieke positioning, wijken, projecten en FAQ:
Amsterdam · Rotterdam · Den Haag · Utrecht · Eindhoven · Tilburg · Groningen · Almere · Breda · Nijmegen · Apeldoorn · Haarlem · Arnhem · Enschede · Amersfoort · Zaanstad · Haarlemmermeer · Den Bosch · Zoetermeer · Zwolle · Leiden · Maastricht · Dordrecht · Ede · Alphen aan den Rijn · Leeuwarden · Alkmaar · Emmen · Westland · Delft · Deventer · Sittard-Geleen · Helmond · Venlo · Hilversum · Oss · Amstelveen · Heerlen · Roosendaal · Purmerend · Schiedam · Spijkenisse · Vlaardingen · Hoorn · Gouda · Lelystad · Katwijk · Zeist · Veenendaal · Rijswijk

## Contact

- **info@woonklasse.nl** · **+31 30 207 23 88** · **WhatsApp +31 6 5042 4683**
- Joop Geesinkweg 201, 1114 AB Amsterdam-Duivendrecht
- KVK 85409146 · BTW NL004092100B36
