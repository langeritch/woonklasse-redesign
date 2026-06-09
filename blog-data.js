// ============================================================
// Blog data: single source of truth for the Woonklasse blog.
//
// Each entry in POSTS describes one article. Two kinds:
//  1) Card-only (no `content`): the article HTML already exists as a
//     hand-written file (blog-<slug>.html). We only keep its card metadata
//     here so the index + sitemap stay complete.
//  2) Full (with `content`): generate-blog.js renders the full article page
//     from this data.
//
// Rules enforced by generate-blog.js:
//  - NEVER use em-dashes anywhere in a post. The build throws if it finds one.
//  - Write in je-vorm, gericht op woningeigenaren.
//  - Internal links use markdown form: [tekst](pagina.html)
//
// To add a post: append an object with `content` and run `node generate-blog.js`.
// ============================================================

const AUTHOR = { name: 'Sander van Woonklasse', role: 'Hoofd projectleider' };

const POSTS = [
  // ---------- NEW (full content, rendered by the generator) ----------
  {
    slug: 'subsidies-verduurzaming-woning-2026',
    title: 'Subsidies voor je woning in 2026: ISDE, SVVE en gemeentelijke regelingen',
    metaTitle: 'Subsidies woning 2026: ISDE, SVVE en lokale regelingen | Woonklasse',
    metaDescription:
      'Welke subsidies kun je als woningeigenaar in 2026 krijgen voor isolatie, een warmtepomp of verduurzaming? ISDE, SVVE, gemeentelijke regelingen en de energiebespaarlening.',
    excerpt:
      'ISDE, SVVE, gemeentelijke potjes en de energiebespaarlening: welke subsidies kun je als woningeigenaar in 2026 stapelen, en hoe vraag je ze aan?',
    category: 'Subsidies',
    date: '2026-03-09',
    readingTime: 8,
    image: { src: 'assets/blog/subsidies.webp', w: 2200, h: 1467 },
    heroAlt: 'Verduurzaamde woning waarvoor subsidie beschikbaar is',
    keywords: ['subsidie verduurzaming', 'ISDE 2026', 'SVVE subsidie', 'isolatie subsidie', 'energiebespaarlening', 'gemeentelijke subsidie'],
    content: {
      lead: 'Verduurzamen kost geld, maar je hoeft het lang niet allemaal zelf te betalen. In 2026 zijn er meerdere subsidies en leningen die je als woningeigenaar kunt combineren, van isolatie tot een warmtepomp. Het lastige is vooral het overzicht: landelijk, gemeentelijk en via het Warmtefonds loopt het door elkaar heen.',
      intro: [
        'We zetten de belangrijkste regelingen voor 2026 op een rij, leggen uit wat je ongeveer terugkrijgt en hoe je ze slim stapelt. De bedragen zijn indicatief, want voorwaarden en budgetten veranderen per jaar.',
      ],
      sections: [
        {
          heading: 'ISDE: de belangrijkste landelijke subsidie',
          paragraphs: [
            'De Investeringssubsidie Duurzame Energie (ISDE) is voor de meeste woningeigenaren het startpunt. Je krijgt een vast bedrag per maatregel: voor een warmtepomp, een zonneboiler en voor isolatie. De hoogte hangt af van het type maatregel en, bij isolatie, van het aantal vierkante meters.',
          ],
          list: {
            items: [
              'Warmtepomp: indicatief €2.250 tot €5.000, afhankelijk van type en vermogen.',
              'Zonneboiler: €600 tot €2.500.',
              'Isolatie: een vast bedrag per m² voor vloer, spouwmuur, dak of glas.',
            ],
          },
          callout: {
            title: 'Stapelvoordeel',
            body: 'Voer je twee of meer isolatiemaatregelen kort na elkaar uit, dan verdubbelt het subsidiebedrag per maatregel vaak. Het loont dus om isolatie te bundelen in plaats van jaar na jaar los aan te pakken.',
          },
        },
        {
          heading: "SVVE: voor VvE's en grotere ingrepen",
          paragraphs: [
            "De Subsidie verduurzaming en onderhoud voor VvE's (SVVE) is bedoeld voor appartementeigenaren die via hun Vereniging van Eigenaren verduurzamen. Naast isolatie en installaties vergoedt de SVVE ook energieadvies, een meerjarenonderhoudsplan en procesbegeleiding. Woon je in een appartement, dan loopt jouw subsidie vaak via deze regeling in plaats van via de ISDE.",
          ],
        },
        {
          heading: 'Gemeentelijke en provinciale regelingen',
          paragraphs: [
            'Bovenop de landelijke regelingen heeft bijna elke gemeente een eigen potje, bijvoorbeeld voor een energieonderzoek, een groen dak of het afkoppelen van regenwater. Die bedragen zijn kleiner, maar je kunt ze vaak stapelen op de ISDE.',
            'Het aanbod verschilt sterk per regio. In gemeenten als [Utrecht](utrecht.html), [Amsterdam](amsterdam.html) en [Eindhoven](eindhoven.html) zijn de regelingen doorgaans ruimer dan in kleinere gemeenten. Check altijd de actuele regeling op de site van je eigen gemeente, want de potjes zijn vaak op als het budget op is.',
          ],
        },
        {
          heading: 'Lenen met voordeel: het Warmtefonds',
          paragraphs: [
            'Kun of wil je niet alles ineens betalen? Via het Nationaal Warmtefonds leen je tegen een lage rente voor energiebesparende maatregelen, de Energiebespaarlening. Voor huishoudens met een lager inkomen geldt soms zelfs 0% rente. Dit is geen subsidie, maar het maakt een grote verduurzaming wel een stuk haalbaarder.',
          ],
        },
        {
          heading: 'Hoe vraag je het slim aan?',
          paragraphs: [
            'De volgorde luistert nauw. Voor de ISDE geldt dat je de subsidie pas ná installatie aanvraagt, met de factuur en het bewijs van de erkende installateur. Vraag je te vroeg of te laat aan, dan loop je het mis.',
          ],
          list: {
            ordered: true,
            items: [
              'Bepaal eerst welke maatregelen je woning nodig heeft, het liefst op basis van een energieadvies.',
              'Check welke landelijke, gemeentelijke en provinciale regelingen je kunt combineren.',
              'Laat het werk uitvoeren door een erkende vakman en bewaar alle facturen en bewijzen.',
              'Dien de aanvraag in binnen de termijn die per regeling geldt, meestal binnen 12 of 24 maanden na uitvoering.',
            ],
          },
          callout: {
            title: 'Wij regelen het mee',
            body: 'Bij energetische verbouwingen verzorgen wij het subsidietraject standaard mee: we adviseren over de maatregelen, leveren de juiste bewijsstukken en helpen met de aanvraag. Zo weet je zeker dat je niets misloopt.',
          },
        },
        {
          heading: 'Reken het door vóór je begint',
          paragraphs: [
            'Subsidies bepalen mede wat een verstandige investering is. Een maatregel die zonder subsidie pas in twintig jaar rendeert, kan met subsidie en het lage 9% BTW-tarief op arbeid binnen tien jaar uit. Bekijk daarom altijd het netto plaatje, niet alleen de bruto investering.',
            'Op onze [prijspagina](prijzen.html) reken je de bandbreedtes door, van losse maatregelen tot een complete energetische renovatie. En in ons artikel over [energiezuinig verbouwen](blog-energiezuinig-verbouwen-subsidies-2026.html) lees je welke maatregelen zich het snelst terugverdienen.',
          ],
        },
      ],
      conclusion: [
        'Voor woningeigenaren is er in 2026 meer mogelijk dan veel mensen denken: ISDE voor de meeste maatregelen, SVVE voor appartementen, lokale potjes erbovenop en een gunstige lening via het Warmtefonds. Het grootste risico is niet dat je te weinig krijgt, maar dat je een regeling mist door de verkeerde volgorde.',
        'Wil je weten welke subsidies voor jouw woning en plan gelden? [Vraag een vrijblijvende opname aan](contact.html), dan rekenen we het samen met je door.',
      ],
      ctaLabel: 'Vraag een vrijblijvende opname aan',
      relatedSlugs: ['energiezuinig-verbouwen-subsidies-2026', 'wat-kost-een-verbouwing-2026'],
    },
  },
  {
    slug: 'omgevingsvergunning-verbouwen-2026',
    title: 'Omgevingsvergunning bij verbouwen: wanneer wel, wanneer niet',
    metaTitle: 'Omgevingsvergunning verbouwen 2026: wanneer nodig? | Woonklasse',
    metaDescription:
      'Wanneer heb je een omgevingsvergunning nodig en wanneer mag je vergunningvrij bouwen? Dakkapel, aanbouw, draagmuur en welstand helder uitgelegd voor 2026.',
    excerpt:
      'Dakkapel, aanbouw of een muur weghalen: wanneer mag het vergunningvrij en wanneer heb je een omgevingsvergunning nodig? Een helder overzicht voor 2026.',
    category: 'Vergunningen',
    date: '2026-02-23',
    readingTime: 7,
    image: { src: 'assets/blog/vergunningen.webp', w: 2000, h: 1334 },
    heroAlt: 'Verbouwing waarvoor een omgevingsvergunning nodig kan zijn',
    keywords: ['omgevingsvergunning', 'vergunningvrij bouwen', 'dakkapel vergunning', 'aanbouw vergunning', 'omgevingswet'],
    content: {
      lead: 'Mag ik zomaar een dakkapel plaatsen, een muur weghalen of aanbouwen? Het is de vraag die bijna elke verbouwing opent. Sinds de Omgevingswet in 2024 is ingegaan is het systeem veranderd, maar de hoofdregel is gelijk gebleven: veel kleine ingrepen mogen vergunningvrij, grotere ingrepen niet.',
      intro: [
        'In dit artikel leggen we uit wanneer je een omgevingsvergunning nodig hebt, wat je vergunningvrij mag doen en hoe je een aanvraag het slimst aanpakt. Zo voorkom je een bouwstop of een dwangsom achteraf.',
      ],
      sections: [
        {
          heading: 'Wat is een omgevingsvergunning?',
          paragraphs: [
            'De omgevingsvergunning is sinds 2024 de centrale vergunning voor bouwen, verbouwen en ruimtelijke ingrepen. Je vraagt hem aan via het landelijke Omgevingsloket. Eén aanvraag kan meerdere onderdelen bevatten, bijvoorbeeld bouwen en het afwijken van het omgevingsplan van de gemeente.',
            'De gemeente toetst je aanvraag aan twee dingen: de technische bouwregels (constructie, brandveiligheid, ventilatie) en de ruimtelijke regels (past het bouwwerk binnen het omgevingsplan en de welstandseisen). Bij monumenten of beschermde stadsgezichten komt daar een extra toets bij.',
          ],
        },
        {
          heading: 'Wanneer mag je vergunningvrij bouwen?',
          paragraphs: [
            'Een flink deel van de verbouwingen aan en achter je woning mag zonder vergunning, mits je binnen de regels blijft. De belangrijkste voorwaarden gaan over de hoogte, de afstand tot de erfgrens en het oppervlak dat je bijbouwt.',
          ],
          list: {
            items: [
              'Een aanbouw of bijgebouw aan de achterkant, binnen de maxima voor hoogte en oppervlak en op het achtererfgebied.',
              'Interne verbouwingen die de draagconstructie niet raken, zoals een nieuwe keuken of badkamer.',
              'Zonnepanelen op een schuin dak, in het vlak van het dak.',
              'Gewoon onderhoud, zoals schilderwerk, een nieuwe dakbedekking of kozijnen in dezelfde maatvoering.',
            ],
          },
          callout: {
            title: 'Let op',
            body: 'Vergunningvrij betekent niet regelvrij. Je moet je nog steeds houden aan het Besluit bouwwerken leefomgeving (Bbl) en aan het burenrecht. Een constructieve berekening blijft bij een draagmuurdoorbraak verplicht, ook zonder vergunning.',
          },
        },
        {
          heading: 'Wanneer heb je wél een vergunning nodig?',
          paragraphs: [
            'Zodra je het silhouet van de woning verandert aan de voorkant, fors uitbreidt of de bestemming wijzigt, is de kans groot dat je een vergunning nodig hebt. Denk aan:',
          ],
          list: {
            items: [
              'Een dakkapel aan de voorzijde of op een naar de weg gekeerd dakvlak.',
              'Een aanbouw of opbouw die groter is dan de vergunningvrije maxima.',
              'Het samenvoegen of splitsen van woningen.',
              'Wijzigingen aan een monument of in een beschermd stadsgezicht.',
              'Een dakterras of balkon dat zicht geeft op de buren.',
            ],
          },
        },
        {
          heading: 'Welstand en het omgevingsplan',
          paragraphs: [
            'Ook als je bouwwerk vergunningplichtig is, betekent dat niet automatisch dat het niet mag. De gemeente kijkt of je plan past binnen het omgevingsplan en, in veel gemeenten, of het voldoet aan de welstandseisen. In een stad als [Amsterdam](amsterdam.html) of [Utrecht](utrecht.html) is dat beleid strikter dan in veel kleinere gemeenten.',
            'Een goed voorbereide aanvraag met nette tekeningen en een onderbouwing scheelt weken doorlooptijd. Wij verzorgen dat traject vaak mee, inclusief de constructieberekening en de afstemming met de gemeente.',
          ],
        },
        {
          heading: 'Doorlooptijd en kosten van een aanvraag',
          paragraphs: [
            'Voor een reguliere aanvraag geldt een beslistermijn van acht weken, die de gemeente eenmaal met zes weken mag verlengen. Voor complexe gevallen, zoals monumenten, geldt een langere procedure van een halfjaar. Reken dus ruim voordat de bouw moet starten.',
            'De kosten bestaan uit leges (een gemeentelijk tarief, vaak een percentage van de bouwsom) en de kosten voor tekenwerk en constructieberekeningen. Samen ligt dat voor een gemiddelde aanbouw al snel tussen €1.500 en €4.000. Die post hoort vanaf het begin thuis in je [verbouwingsbudget](prijzen.html).',
          ],
        },
      ],
      conclusion: [
        'De hoofdregel is simpel: kleine ingrepen aan de achterkant mogen vaak vergunningvrij, alles wat het aanzicht of de constructie raakt niet. Bij twijfel check je het Omgevingsloket of vraag je het ons gewoon even.',
        'Wij brengen voor elk project in kaart wat vergunningvrij kan en wat niet, en regelen de aanvraag als die nodig is. [Vraag een vrijblijvende opname aan](contact.html) en we nemen het met je door.',
      ],
      ctaLabel: 'Vraag een vrijblijvende opname aan',
      relatedSlugs: ['wat-kost-een-verbouwing-2026', 'energiezuinig-verbouwen-subsidies-2026'],
    },
  },

  // ---------- EXISTING (card-only; HTML is hand-written) ----------
  {
    slug: 'energiezuinig-verbouwen-subsidies-2026',
    title: 'Energiezuinig verbouwen in 2026: subsidies, terugverdientijd en de nieuwe BENG-eisen',
    excerpt:
      'ISDE-subsidie, BENG-eisen, warmtepompen en isolatie: wat verdient zich écht terug en welke maatregel is een schijnbesparing?',
    category: 'Duurzaamheid',
    date: '2026-02-09',
    readingTime: 9,
    image: { src: 'assets/blog/energiezuinig-verbouwen.webp', w: 2200, h: 1467 },
    heroAlt: 'Energiezuinig gerenoveerde woning door Woonklasse',
  },
  {
    slug: 'keuken-renovatie-trends-2026',
    title: 'Keuken renovatie 2026: trends, kosten en de valkuilen om te vermijden',
    excerpt:
      'Wat zijn de keukentrends voor 2026, wat kost een nieuwe keuken écht en welke vijf valkuilen kosten je maanden vertraging?',
    category: 'Keuken',
    date: '2026-01-26',
    readingTime: 7,
    image: { src: 'assets/blog/keuken-renovatie.webp', w: 2000, h: 1333 },
    heroAlt: 'Moderne keuken gerealiseerd door Woonklasse',
  },
  {
    slug: 'wat-kost-een-verbouwing-2026',
    title: 'Wat kost een verbouwing in 2026? Een complete budgetgids',
    excerpt:
      'Realistische m²-prijzen, BTW-tarieven, verborgen budgetposten en de zeven valkuilen die je verbouwingsbudget laten exploderen.',
    category: 'Budget & kosten',
    date: '2026-01-12',
    readingTime: 8,
    image: { src: 'assets/blog/verbouwing-kosten.webp', w: 2000, h: 1334 },
    heroAlt: 'Verbouwing van een woning door Woonklasse',
  },
];

module.exports = { POSTS, AUTHOR };
