#!/usr/bin/env node
/**
 * Woonklasse city-page generator (Saba Stones design language).
 * Run:  node generate-cities.js
 */

const fs = require('fs');
const path = require('path');

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1521783593447-5702b9bfd267',
  'https://images.unsplash.com/photo-1710883734891-93709398496d',
  'https://images.unsplash.com/photo-1708111776235-990d08c84658',
  'https://images.unsplash.com/photo-1746439318854-4a8bc02a03ba',
  'https://images.unsplash.com/photo-1601086540476-7d9fa9dd6023',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
];
const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1677268357140-146d5c15307d',
  'https://images.unsplash.com/photo-1651045358038-0bdb639d21d5',
  'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f',
  'https://images.unsplash.com/photo-1587582423116-ec07293f0395',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
];
const img = (base, w = 1200) => `${base}?w=${w}&q=80&auto=format&fit=crop`;

const CITIES = [
  { slug: 'amsterdam',          name: 'Amsterdam',          wijken: ['Centrum', 'Oud-Zuid', 'IJburg', 'De Pijp'],                       nearby: ['amstelveen', 'haarlem', 'zaanstad', 'almere'],                positioning: 'In de stad is elke vierkante meter kostbaar en is er weinig ruimte voor fouten. Wij kennen het werk hier, van krappe aanrijroutes tot buren die dichtbij wonen, en houden je woning leefbaar tijdens de bouw.' },
  { slug: 'rotterdam',          name: 'Rotterdam',          wijken: ['Centrum', 'Kralingen', 'Hillegersberg', 'Delfshaven'],            nearby: ['schiedam', 'vlaardingen', 'spijkenisse', 'dordrecht'],        positioning: 'Van naoorlogse portiek-flat tot vooroorlogs herenhuis in Kralingen, Rotterdamse renovaties vragen specifieke kennis van fundering, casco en geluidsoverdracht.' },
  { slug: 'den-haag',           name: 'Den Haag',           wijken: ['Centrum', 'Scheveningen', 'Benoordenhout', 'Loosduinen'],         nearby: ['delft', 'rijswijk', 'zoetermeer', 'leiden'],                  positioning: 'Of het nu om een herenhuis in Benoordenhout gaat of een appartement nabij Scheveningen, we werken vaak met monumentale en jaren-30 panden en kennen het Haagse welstandsbeleid.' },
  { slug: 'utrecht',            name: 'Utrecht',            wijken: ['Centrum', 'Wittevrouwen', 'Oog in Al', 'Leidsche Rijn'],          nearby: ['amersfoort', 'zeist', 'veenendaal', 'hilversum'],             positioning: 'Van smalle binnenstadspanden in Wittevrouwen tot strakke nieuwbouw in Leidsche Rijn, Utrechtse projecten vragen om creatieve oplossingen en strakke uitvoering.' },
  { slug: 'eindhoven',          name: 'Eindhoven',          wijken: ['Centrum', 'Stratum', 'Strijp', 'Tongelre'],                       nearby: ['helmond', 'tilburg', 'den-bosch', 'venlo'],                   positioning: 'Het ontwerp van Eindhovense woningen vraagt om gevoel voor architectuur, van klassieke villa\'s in Stratum tot industrieel-strakke lofts in Strijp.' },
  { slug: 'tilburg',            name: 'Tilburg',            wijken: ['Centrum', 'Reeshof', 'Goirke', 'Oud-Noord'],                      nearby: ['breda', 'eindhoven', 'den-bosch', 'oss'],                     positioning: 'Tilburgse renovaties variëren van karakteristieke arbeidershuizen in Goirke tot ruime gezinswoningen in Reeshof. Wij brengen jouw woning naar deze tijd, met respect voor de oorsprong.' },
  { slug: 'groningen',          name: 'Groningen',          wijken: ['Centrum', 'Helpman', 'Oosterpark', 'Vinkhuizen'],                 nearby: ['leeuwarden', 'emmen', 'assen', 'drachten'],                   positioning: 'Wij werken regelmatig in Groningen, van studentenhuisvesting in het centrum tot gezinswoningen in Helpman. Aardbevingsbestendig bouwen is voor ons standaard.' },
  { slug: 'almere',             name: 'Almere',             wijken: ['Almere Stad', 'Almere Buiten', 'Almere Haven', 'Almere Poort'],   nearby: ['amsterdam', 'lelystad', 'amstelveen', 'zaanstad'],            positioning: 'Almere is jong en groeit hard. Veel woningen uit de jaren \'80 en \'90 zijn toe aan een grondige opfris. Wij specialiseren ons in energetische renovaties die comfort en waarde toevoegen.' },
  { slug: 'breda',              name: 'Breda',              wijken: ['Centrum', 'Ginneken', 'Belcrum', 'Princenhage'],                  nearby: ['tilburg', 'roosendaal', 'oss', 'dordrecht'],                  positioning: 'Bredase woningen kennen veel diversiteit, van karakterpanden in Ginneken tot moderne nieuwbouw in Belcrum. We werken al jaren in de regio.' },
  { slug: 'nijmegen',           name: 'Nijmegen',           wijken: ['Centrum', 'Lent', 'Hatert', 'Nijmegen-Oost'],                     nearby: ['arnhem', 'ede', 'oss', 'venlo'],                              positioning: 'In het oudste deel van Nederland vragen Nijmeegse panden om respect voor het verleden en oog voor het nu. Wij brengen die balans bij elke renovatie.' },
  { slug: 'apeldoorn',          name: 'Apeldoorn',          wijken: ['Centrum', 'Zevenhuizen', 'Berg en Bos', 'Apeldoorn-Zuid'],        nearby: ['deventer', 'zwolle', 'ede', 'arnhem'],                        positioning: 'Apeldoorn ligt prachtig aan de Veluwe. Veel projecten draaien om verbouwingen van karakterwoningen en jaren-30 huizen met behoud van originele details.' },
  { slug: 'haarlem',            name: 'Haarlem',            wijken: ['Centrum', 'Schalkwijk', 'Haarlem-Noord', 'Spaarndammerbuurt'],   nearby: ['zaanstad', 'haarlemmermeer', 'amsterdam', 'alkmaar'],         positioning: 'Haarlem heeft een rijk historisch centrum waar monumentenzorg vaak een rol speelt. Wij weten hoe je een 17e-eeuws pand bewoonbaar maakt zonder de ziel weg te halen.' },
  { slug: 'arnhem',             name: 'Arnhem',             wijken: ['Centrum', 'Spijkerkwartier', 'Klarendal', 'Velperweg'],           nearby: ['nijmegen', 'ede', 'apeldoorn', 'deventer'],                   positioning: 'Het glooiende Arnhem vraagt om ervaring met hoogteverschillen, kelders en bijzondere kapconstructies. Onze ploeg kent de stad door en door.' },
  { slug: 'enschede',           name: 'Enschede',           wijken: ['Centrum', 'Lonneker', 'Stadsveld', 'Glanerbrug'],                 nearby: ['hengelo', 'almelo', 'deventer', 'zwolle'],                    positioning: 'Twentse degelijkheid past goed bij onze werkwijze: heldere afspraken, geen poespas, een woning die generaties meegaat.' },
  { slug: 'amersfoort',         name: 'Amersfoort',         wijken: ['Centrum', 'Soesterkwartier', 'Vathorst', 'Schothorst'],          nearby: ['utrecht', 'zeist', 'hilversum', 'ede'],                       positioning: 'Van karakterwoningen in het Soesterkwartier tot ruime gezinshuizen in Vathorst, onze ploeg rijdt vanuit Leerdam zonder reiskosten naar je toe.' },
  { slug: 'zaanstad',           name: 'Zaanstad',           wijken: ['Zaandam', 'Wormerveer', 'Krommenie', 'Koog aan de Zaan'],         nearby: ['amsterdam', 'haarlem', 'alkmaar', 'purmerend'],               positioning: 'Zaanse houten huizen vragen specialistisch onderhoud en renovatie. Wij hebben ervaring met traditionele bouwmethoden in combinatie met moderne installaties.' },
  { slug: 'haarlemmermeer',     name: 'Haarlemmermeer',     wijken: ['Hoofddorp', 'Nieuw-Vennep', 'Badhoevedorp', 'Zwanenburg'],        nearby: ['haarlem', 'amsterdam', 'amstelveen', 'leiden'],               positioning: 'De Haarlemmermeer combineert dorpse rust met snelle verbindingen naar Schiphol en Amsterdam. We renoveren hier veel jaren-70 woningen tot moderne gezinshuizen.' },
  { slug: 'den-bosch',          name: 'Den Bosch',          wijken: ['Centrum', 'Vughterpoort', 'Maaspoort', 'Engelen'],                nearby: ['oss', 'tilburg', 'eindhoven', 'breda'],                       positioning: 'Bossche binnenstadspanden zijn vaak monumentaal. We werken nauw samen met monumentenzorg en welstand voor strakke uitkomsten met behoud van karakter.' },
  { slug: 'zoetermeer',         name: 'Zoetermeer',         wijken: ['Centrum', 'Meerzicht', 'Rokkeveen', 'Buytenwegh'],                nearby: ['den-haag', 'leiden', 'gouda', 'delft'],                       positioning: 'Veel Zoetermeerse woningen zijn nu 40+ jaar oud en toe aan een grondige opfris. Wij combineren modern wooncomfort met efficiënte uitvoering.' },
  { slug: 'zwolle',             name: 'Zwolle',             wijken: ['Centrum', 'Assendorp', 'Stadshagen', 'Holtenbroek'],              nearby: ['apeldoorn', 'deventer', 'lelystad', 'emmen'],                 positioning: 'Zwolse hanzepanden vragen om vakmanschap met respect voor historie. We werken hier al jaren samen met monumentenzorg en lokale toeleveranciers.' },
  { slug: 'leiden',             name: 'Leiden',             wijken: ['Centrum', 'Mors', 'Stevenshof', 'Vogelwijk'],                     nearby: ['den-haag', 'delft', 'alphen-aan-den-rijn', 'katwijk'],        positioning: 'Leidens historische centrum heeft veel 17e-eeuwse panden met scheve vloeren en bijzondere constructies. Wij hebben de ervaring om dat type project succesvol op te leveren.' },
  { slug: 'maastricht',         name: 'Maastricht',         wijken: ['Centrum', 'Wyck', 'Sint Pieter', 'Boschstraatkwartier'],          nearby: ['heerlen', 'sittard-geleen', 'venlo', 'helmond'],              positioning: 'Maastrichtse panden combineren Bourgondische allure met monumentale eisen. We werken hier met sterke lokale partners om alles strak op te leveren.' },
  { slug: 'dordrecht',          name: 'Dordrecht',          wijken: ['Centrum', 'Dubbeldam', 'Sterrenburg', 'Krispijn'],                nearby: ['spijkenisse', 'rotterdam', 'breda', 'gorinchem'],             positioning: 'Dordrechtse pakhuispanden en herenhuizen vragen specialistische aanpak: fundering, kelders en historisch metselwerk zijn ons werk.' },
  { slug: 'ede',                name: 'Ede',                wijken: ['Centrum', 'Veldhuizen', 'Bennekom', 'Lunteren'],                  nearby: ['arnhem', 'veenendaal', 'amersfoort', 'wageningen'],           positioning: 'Edese woningen variëren van karakterhuizen op de Veluwezoom tot strakke nieuwbouw. Wij brengen elk project naar het juiste niveau.' },
  { slug: 'alphen-aan-den-rijn',name: 'Alphen aan den Rijn',wijken: ['Centrum', 'Ridderveld', 'Kerk en Zanen', 'Aarlanderveen'],         nearby: ['leiden', 'gouda', 'zoetermeer', 'leiderdorp'],                positioning: 'In Alphen renoveren we veel jaren-80 en jaren-90 gezinswoningen, vaak met energiebesparende ingrepen die het comfort fors verhogen.' },
  { slug: 'leeuwarden',         name: 'Leeuwarden',         wijken: ['Centrum', 'Huizum', 'Bilgaard', 'Camminghaburen'],                nearby: ['groningen', 'emmen', 'drachten', 'sneek'],                    positioning: 'Friese degelijkheid vraagt geen poeha, wel kwaliteit. Onze Leeuwardense projecten kenmerken zich door strakke planning en heldere uitvoering.' },
  { slug: 'alkmaar',            name: 'Alkmaar',            wijken: ['Centrum', 'Overdie', 'Oudorp', 'Daalmeer'],                       nearby: ['haarlem', 'zaanstad', 'hoorn', 'purmerend'],                  positioning: 'Alkmaarse panden in het centrum zijn vaak monumentaal. We werken zorgvuldig met welstandscommissie en behouden de oorspronkelijke uitstraling.' },
  { slug: 'emmen',              name: 'Emmen',              wijken: ['Centrum', 'Bargeres', 'Angelslo', 'Emmermeer'],                   nearby: ['groningen', 'zwolle', 'assen', 'hoogeveen'],                  positioning: 'In Emmen renoveren we veel jaren-70 en jaren-80 woningen tot moderne energiezuinige gezinshuizen, met oog voor de typisch Drentse bouwwijze.' },
  { slug: 'westland',           name: 'Westland',           wijken: ['Naaldwijk', 's-Gravenzande', 'Wateringen', 'Honselersdijk'],      nearby: ['den-haag', 'delft', 'rotterdam', 'vlaardingen'],              positioning: 'Westlandse woningen vragen vaak om praktische oplossingen. Wij kennen het werk hier en houden rekening met de specifieke ondergrond en bebouwingsvoorschriften.' },
  { slug: 'delft',              name: 'Delft',              wijken: ['Centrum', 'Tanthof', 'Hof van Delft', 'Voorhof'],                 nearby: ['den-haag', 'rijswijk', 'rotterdam', 'leiden'],                positioning: 'Delftse grachtenpanden en jaren-30 huizen zijn ons specialisme. We combineren oude details met modern wooncomfort.' },
  { slug: 'deventer',           name: 'Deventer',           wijken: ['Centrum', 'Voorstad', 'Borgele', 'Keizerslanden'],                nearby: ['zwolle', 'apeldoorn', 'arnhem', 'zutphen'],                   positioning: 'Deventer hanzepanden zijn vaak monumentaal. Wij werken volgens de eisen van monumentenzorg en houden de uitvoering strak.' },
  { slug: 'sittard-geleen',     name: 'Sittard-Geleen',     wijken: ['Sittard-Centrum', 'Geleen', 'Born', 'Stadbroek'],                 nearby: ['heerlen', 'maastricht', 'venlo', 'roermond'],                 positioning: 'In Zuid-Limburg werken we vaak aan karakterwoningen met natuursteen en mergel. Bewerking en restauratie zijn ons werk.' },
  { slug: 'helmond',            name: 'Helmond',            wijken: ['Centrum', 'Brouwhuis', 'Stiphout', 'Dierdonk'],                   nearby: ['eindhoven', 'tilburg', 'venlo', 'den-bosch'],                 positioning: 'Helmondse woningen variëren van karakterpanden in Stiphout tot moderne nieuwbouw in Brandevoort. Wij doen ze allebei.' },
  { slug: 'venlo',              name: 'Venlo',              wijken: ['Centrum', 'Blerick', 'Tegelen', 'Belfeld'],                       nearby: ['roermond', 'sittard-geleen', 'helmond', 'eindhoven'],         positioning: 'Limburgse woningen in Venlo kennen vaak een rijke geschiedenis. Onze ploeg combineert moderne technieken met respect voor de regionale bouwstijl.' },
  { slug: 'hilversum',          name: 'Hilversum',          wijken: ['Centrum', 'Kerkelanden', 'Hilversumse Meent', 'Hoog-Anna'],       nearby: ['amersfoort', 'utrecht', 'almere', 'amsterdam'],               positioning: 'Hilversumse villa\'s en jaren-30 woningen: uitgesproken architectuur die om uitgesproken vakwerk vraagt. Daar zijn wij voor.' },
  { slug: 'oss',                name: 'Oss',                wijken: ['Centrum', 'Schadewijk', 'Krinkelhoek', 'Ruwaard'],                nearby: ['den-bosch', 'nijmegen', 'tilburg', 'breda'],                  positioning: 'Osse woningen, vaak gebouwd in jaren \'70 en \'80, zijn nu rijp voor een grondige opwaardering. Wij specialiseren ons in deze fase van renovatie.' },
  { slug: 'amstelveen',         name: 'Amstelveen',         wijken: ['Centrum', 'Westwijk', 'Buitenveldert', 'Bovenkerk'],              nearby: ['amsterdam', 'haarlemmermeer', 'haarlem', 'zaanstad'],         positioning: 'Amstelveense gezinswoningen vragen om strakke uitvoering en oog voor detail. Onze ploeg rijdt vanuit Leerdam naar je toe, zonder reiskosten.' },
  { slug: 'heerlen',            name: 'Heerlen',            wijken: ['Centrum', 'Heerlerheide', 'Hoensbroek', 'Welten'],                nearby: ['maastricht', 'sittard-geleen', 'venlo', 'kerkrade'],          positioning: 'In Heerlen werken we vaak met mijnbouwgeschiedenis in de ondergrond. Wij houden rekening met fundering en zettingsproblemen, ook bij grootschalige renovaties.' },
  { slug: 'roosendaal',         name: 'Roosendaal',         wijken: ['Centrum', 'Tolberg', 'Westrand', 'Kalsdonk'],                     nearby: ['breda', 'dordrecht', 'bergen-op-zoom', 'tilburg'],            positioning: 'Roosendaalse woningen kennen veel variatie, van karakterpanden in het centrum tot moderne wijken aan de rand. Wij doen ze allebei.' },
  { slug: 'purmerend',          name: 'Purmerend',          wijken: ['Centrum', 'Weidevenne', 'Overwhere', 'Wheermolen'],               nearby: ['zaanstad', 'amsterdam', 'hoorn', 'alkmaar'],                  positioning: 'Veel Purmerendse woningen zijn aan een tweede leven toe. Wij specialiseren ons in totale opfris-renovaties met behoud van indeling.' },
  { slug: 'schiedam',           name: 'Schiedam',           wijken: ['Centrum', 'Nieuwland', 'Groenoord', 'Kethel'],                    nearby: ['rotterdam', 'vlaardingen', 'spijkenisse', 'delft'],           positioning: 'Schiedamse historie zit in de stenen. Wij werken vaak met oude panden waar monumentenzorg en moderne installaties samen moeten komen.' },
  { slug: 'spijkenisse',        name: 'Spijkenisse',        wijken: ['Centrum', 'Akkers', 'Sterrenkwartier', 'Maaswijk'],               nearby: ['rotterdam', 'schiedam', 'vlaardingen', 'dordrecht'],          positioning: 'In Spijkenisse renoveren we veel jaren-70 woningen tot energiezuinige gezinshuizen. Wij kennen het type bouw en de oplossingen.' },
  { slug: 'vlaardingen',        name: 'Vlaardingen',        wijken: ['Centrum', 'Holy', 'Vettenoordsepolder', 'Westwijk'],              nearby: ['schiedam', 'rotterdam', 'spijkenisse', 'delft'],              positioning: 'Vlaardinger woningen zijn vaak naoorlogs, een goed moment voor een totale opfris met moderne isolatie en nieuwe installaties.' },
  { slug: 'hoorn',              name: 'Hoorn',              wijken: ['Centrum', 'Risdam', 'Grote Waal', 'Kersenboogerd'],               nearby: ['alkmaar', 'purmerend', 'zaanstad', 'amsterdam'],              positioning: 'Hoornse koopmanshuizen in het centrum zijn ons specialisme: historische kwaliteit met modern comfort, zonder concessies aan beide.' },
  { slug: 'gouda',              name: 'Gouda',              wijken: ['Centrum', 'Goverwelle', 'Bloemendaal', 'Korte Akkeren'],          nearby: ['alphen-aan-den-rijn', 'zoetermeer', 'rotterdam', 'leiden'],   positioning: 'Goudse binnenstadspanden vragen vaak om monumententechnische ingrepen. Daar hebben we de ervaring en de partners voor.' },
  { slug: 'lelystad',           name: 'Lelystad',           wijken: ['Centrum', 'Atolwijk', 'Boswijk', 'Punter'],                       nearby: ['almere', 'zwolle', 'hilversum', 'amsterdam'],                 positioning: 'Lelystad is een jonge stad waar veel woningen toe zijn aan hun eerste grote renovatie. Wij brengen ze in één keer naar deze tijd.' },
  { slug: 'katwijk',            name: 'Katwijk',            wijken: ['Centrum', 'Katwijk aan den Rijn', 'Rijnsburg', 'Valkenburg'],     nearby: ['leiden', 'den-haag', 'alphen-aan-den-rijn', 'haarlemmermeer'],positioning: 'Aan de kust werken we vaak met zoute lucht en specifieke isolatie-eisen. Wij kennen de materialen en methodes die hier het beste werken.' },
  { slug: 'zeist',              name: 'Zeist',              wijken: ['Centrum', 'Den Dolder', 'Austerlitz', 'Huis ter Heide'],          nearby: ['utrecht', 'amersfoort', 'veenendaal', 'hilversum'],           positioning: 'Zeistse villa\'s en landhuizen vragen om vakmanschap dat overeenkomt met de allure van de woning. Daar leveren wij voor.' },
  { slug: 'veenendaal',         name: 'Veenendaal',         wijken: ['Centrum', 'Veenendaal-Oost', 'Petenbos', 'Salamander'],           nearby: ['ede', 'amersfoort', 'utrecht', 'arnhem'],                     positioning: 'Veenendaalse woningen, degelijk gebouwd in de jaren \'70 en \'80, verdienen een renovatie die nog vijftig jaar meegaat. Daar staan we voor.' },
  { slug: 'rijswijk',           name: 'Rijswijk',           wijken: ['Centrum', 'Steenvoorde', 'Stationskwartier', 'Te Werve'],         nearby: ['den-haag', 'delft', 'zoetermeer', 'rotterdam'],               positioning: 'Rijswijkse jaren-30 woningen en flats kennen we goed. Wij brengen ze naar deze tijd met behoud van de oorspronkelijke charme.' },
];

const cityBySlug = Object.fromEntries(CITIES.map(c => [c.slug, c]));

// Switched to PNG <img> tags. STROKE placeholder is repurposed as variant marker:
// "#0a0a0a" → dark logo (header), "#ffffff" → white logo (footer).
const LOGO_SVG = `<img src="assets/woonklasse-logo-VARIANT.png" alt="Woonklasse" class="VARIANT_CLASS" width="VARIANT_W" height="VARIANT_H"/>`;
const logoFor = (where) => where === 'footer'
  ? LOGO_SVG.replace('VARIANT', 'white').replace('VARIANT_CLASS', 'footer__brand-img').replace('VARIANT_W', '120').replace('VARIANT_H', '120')
  : LOGO_SVG.replace('VARIANT', 'dark').replace('VARIANT_CLASS', 'logo-block__img').replace('VARIANT_W', '160').replace('VARIANT_H', '160');

const HEAD = (title, desc, slug, cityName) => `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="canonical" href="https://woonklasse.nl/${slug}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="theme-color" content="#1a1a1a"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Woonklasse"/>
<meta property="og:locale" content="nl_NL"/>
<meta property="og:url" content="https://woonklasse.nl/${slug}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="https://woonklasse.nl/assets/og-image.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image" content="https://woonklasse.nl/assets/og-image.jpg"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"GeneralContractor","@id":"https://woonklasse.nl/#business","name":"Woonklasse","image":"https://woonklasse.nl/assets/og-image.jpg","logo":"https://woonklasse.nl/assets/woonklasse-logo-dark.png","url":"https://woonklasse.nl/","telephone":"+31302072388","email":"info@woonklasse.nl","priceRange":"€€","address":{"@type":"PostalAddress","streetAddress":"Laantje van Van Iperen 26","postalCode":"4142 ER","addressLocality":"Leerdam","addressCountry":"NL"},"areaServed":{"@type":"City","name":"${cityName}"},"vatID":"NL004092100B36","knowsLanguage":"nl"}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Advent+Pro:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<link rel="icon" type="image/png" href="/assets/favicon.png"/>
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"/>
<link rel="preconnect" href="https://images.unsplash.com"/>
<link rel="manifest" href="/site.webmanifest"/>
<meta property="og:image:alt" content="Badkamer opgeleverd door Woonklasse"/>
<link rel="stylesheet" href="styles.css"/>
</head>
<body>`;

const HEADER = `
<header class="site-header" id="siteHeader">
  <a class="logo-block" href="index.html" aria-label="Woonklasse home">${logoFor('header')}</a>
  <nav class="nav" aria-label="Hoofdmenu">
    <a href="diensten.html">Diensten</a>
    <a href="prijzen.html">Prijzen</a>
    <a href="projecten.html">Projecten</a>
    <a href="over-ons.html">Over ons</a>
    <a href="contact.html">Contact</a>
  </nav>
</header>`;

const FOOTER = `
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__brand">
      ${logoFor('footer')}
      <span class="footer__wordmark">Woonklasse</span>
    </div>
    <p style="font-family: var(--body); color: rgba(255,255,255,0.7); max-width: 36ch; margin: -40px 0 50px; font-size: 14.5px;">Jouw droomwoning begint hier. Kwaliteit, vakmanschap en persoonlijke aandacht in elk project.</p>
    <div class="footer__cols">
      <div>
        <a href="index.html">Home</a>
        <a href="diensten.html">Diensten</a>
        <a href="prijzen.html">Prijzen</a>
        <a href="projecten.html">Projecten</a>
        <a href="over-ons.html">Over ons</a>
        <a href="contact.html">Contact</a>
      </div>
      <div>
        <a href="mailto:info@woonklasse.nl">info@woonklasse.nl</a>
        <a href="tel:+31302072388">+31 30 207 23 88</a>
        <a href="https://wa.me/31650424683">WhatsApp</a>
        <span>Laantje van Van Iperen 26<br/>4142 ER Leerdam</span>
      </div>
      <div>
        <span style="opacity: 0.6; font-size: 12px;">Zusterbedrijf</span>
        <a href="https://badkamerstijl.nl" target="_blank" rel="noopener">Badkamerstijl →</a>
      </div>
    </div>
    <div class="footer__legal">
      <span>© 2026 Woonklasse. Alle rechten voorbehouden.</span>
      <span class="sep">|</span>
      <a href="privacy.html">Privacybeleid</a>
      <span class="sep">|</span>
      <a href="voorwaarden.html">Algemene voorwaarden</a>
    </div>
    <p class="footer__credit">KVK 85409146 · BTW NL004092100B36</p>
  </div>
</footer>
<script defer src="/_vercel/insights/script.js"></script>
<script src="script.js"></script>
</body>
</html>`;

const cityTemplate = (city, idx) => {
  const heroImg = img(HERO_IMAGES[idx % HERO_IMAGES.length], 2000);
  const storyImg = img(HERO_IMAGES[(idx + 1) % HERO_IMAGES.length], 1000);
  const projectImgs = [
    img(PROJECT_IMAGES[idx % PROJECT_IMAGES.length], 900),
    img(PROJECT_IMAGES[(idx + 2) % PROJECT_IMAGES.length], 900),
    img(PROJECT_IMAGES[(idx + 4) % PROJECT_IMAGES.length], 900),
  ];
  const lastWijk = city.wijken[city.wijken.length - 1];
  const wijkenSentence = city.wijken.slice(0, -1).join(', ') + ' en ' + lastWijk;
  const nearbyChips = city.nearby
    .map(slug => cityBySlug[slug])
    .filter(Boolean)
    .map(c => `<a class="city-chip" href="${c.slug}.html">Verbouwen in ${c.name}</a>`)
    .join('\n      ');

  return `${HEAD(
    `Verbouwen in ${city.name} | Woonklasse`,
    `Renovatie en verbouwing in ${city.name} door eigen vakmensen. Eén aanspreekpunt, vaste prijs, op tijd opgeleverd.`,
    city.slug,
    city.name
  )}
${HEADER}

<section class="hero">
  <div class="hero__media"><img src="${heroImg}" alt="Renovatie project in ${city.name}"/></div>
  <div class="hero__overlay" aria-hidden="true"></div>
  <div class="hero__inner">
    <p class="hero__sub" style="margin-bottom: 18px; letter-spacing: 0.18em;">Verbouwen in ${city.name}</p>
    <h1 class="hero__title">Verbouwen in<br/>${city.name}<br/><em>zonder verrassingen</em></h1>
    <p class="hero__sub">Renovatie en verbouwing door eigen vakmensen.</p>
    <div class="hero__actions">
      <a href="contact.html" class="link-underline link-underline--light">Offerte aanvragen</a>
      <a href="tel:+31302072388" class="link-underline link-underline--light">+31 30 207 23 88</a>
    </div>
  </div>
</section>

<section class="story">
  <div class="story__deco" aria-hidden="true"></div>
  <div class="story__grid">
    <div class="story__text">
      <p style="font-family: var(--display); text-transform: uppercase; letter-spacing: 0.18em; font-size: 13px; color: var(--taupe); margin: 0 0 18px;">Over ${city.name}</p>
      <h2 class="section-title">We kennen het werk hier.</h2>
      <p class="body-caps" style="margin-top: 32px;">${city.positioning}</p>
      <p class="body-caps" style="margin-top: 20px;">Of je nu woont in ${wijkenSentence}, onze projectleider komt graag bij je langs voor een vrijblijvend gesprek.</p>
      <a href="contact.html" class="link-underline" style="margin-top:32px;">Plan een gesprek</a>
    </div>
    <div class="story__media"><img loading="lazy" decoding="async" src="${storyImg}" alt="${city.name} woning"/></div>
  </div>
</section>

<!-- Vier beloftes -->
<section class="services">
  <div class="services__head">
    <h2 class="section-title section-title--light">Vier beloftes voor ${city.name}</h2>
  </div>
  <div class="services__list">
    <div class="service-row"><span class="service-row__num">01</span><span class="service-row__title">Eén vast aanspreekpunt</span><span class="service-row__toggle">+</span><p class="service-row__body">Van eerste gesprek tot oplevering altijd dezelfde persoon. Eén projectleider die jouw woning kent.</p></div>
    <div class="service-row"><span class="service-row__num">02</span><span class="service-row__title">Vaste prijs vooraf</span><span class="service-row__toggle">+</span><p class="service-row__body">Scherpe vaste prijs via ons eigen leveranciersnetwerk. Geen tussenpersonen, geen verborgen meerwerk.</p></div>
    <div class="service-row"><span class="service-row__num">03</span><span class="service-row__title">Op tijd opgeleverd</span><span class="service-row__toggle">+</span><p class="service-row__body">Afspraak is afspraak, ook de opleverdatum staat vast. Vaste planning, vast team, vaste oplevering.</p></div>
    <div class="service-row"><span class="service-row__num">04</span><span class="service-row__title">15+ jaar track record</span><span class="service-row__toggle">+</span><p class="service-row__body">Bewezen ervaring in bouw en sanitair. 200+ opgeleverde projecten. We weten wat we doen en wat er kan misgaan.</p></div>
  </div>
</section>

<!-- Diensten in [stad] -->
<section class="section">
  <div class="section__inner">
    <p style="font-family: var(--display); text-transform: uppercase; letter-spacing: 0.18em; font-size: 13px; color: var(--taupe); margin: 0 0 18px;">Diensten in ${city.name}</p>
    <h2 class="section-title" style="margin-bottom: 50px;">Wat we voor je kunnen doen.</h2>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--line);">
      <div style="padding: 28px 24px 28px 0; border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Totaal renovatie &amp; nieuwbouw</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Casco-aanpak van je hele woning in ${city.name}, van sloop tot sleutelklaar.</p></div>
      <div style="padding: 28px 24px 28px 24px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Sanitair specialist</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Luxe badkamers met eigen sanitairspecialisten en Saninet 3D-ontwerp op locatie.</p></div>
      <div style="padding: 28px 24px 28px 0; border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Woningonderhoud</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Periodiek onderhoud, kleine reparaties en servicecontracten voor je ${city.name}-woning.</p></div>
      <div style="padding: 28px 24px 28px 24px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Keukens</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Maatwerk keukenontwerp inclusief apparatuur, werkbladen en installatie.</p></div>
      <div style="padding: 28px 24px 28px 0; border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Dakwerk</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Platte en hellende daken, dakkapellen, loodwerk en dakisolatie.</p></div>
      <div style="padding: 28px 24px 28px 24px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Schilderwerk</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Binnen- en buitenschilderwerk met hoogwaardige verven door eigen ploeg.</p></div>
      <div style="padding: 28px 24px 28px 0; border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Loodgieterwerk</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Eigen gecertificeerde loodgieters voor water, gas, CV en ventilatie.</p></div>
      <div style="padding: 28px 24px 28px 24px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line);"><h3 style="font-family: var(--display); font-weight: 500; font-size: 22px; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px;">Elektra</h3><p style="margin:0; color: var(--muted); font-size: 14.5px;">Groepenkast, bedrading en NEN-1010 keuring door eigen installateurs.</p></div>
    </div>
  </div>
</section>

<!-- Prijzen in [stad] - city-specifieke tiers -->
<section class="section" style="background: var(--cream-soft, #faf6ee);">
  <div class="section__inner">
    <p style="font-family: var(--display); text-transform: uppercase; letter-spacing: 0.18em; font-size: 13px; color: var(--taupe); margin: 0 0 18px;">Prijzen in ${city.name}</p>
    <h2 class="section-title" style="margin-bottom: 50px;">Welk budget past bij jouw project?</h2>
    <div class="tiers">
      <div class="tier"><h3>Budget</h3><p class="tier__range">€8.000 – €25.000</p><p class="tier__price">Vanaf €8.000</p><ul><li>Compleet nieuwe badkamer</li><li>Keuken installatie</li><li>Toilet inclusief tegels</li><li>Schilder- en stucwerk</li></ul><a href="contact.html" class="link-underline">Offerte aanvragen</a></div>
      <div class="tier"><h3>Standaard</h3><p class="tier__range">€25.000 – €60.000</p><p class="tier__price">Vanaf €25.000</p><ul><li>Volledige verdieping renoveren</li><li>Luxe badkamer met natuursteen</li><li>Open keuken met maatwerk</li><li>3D-ontwerp inbegrepen</li></ul><a href="contact.html" class="link-underline">Meest gekozen</a></div>
      <div class="tier"><h3>Premium</h3><p class="tier__range">€60.000 – €150.000</p><p class="tier__price">Vanaf €60.000</p><ul><li>Compleet huis casco strippen</li><li>Twee badkamers + sanitair</li><li>Maatwerk interieur</li><li>Vergunningstraject inbegrepen</li></ul><a href="contact.html" class="link-underline">Offerte aanvragen</a></div>
      <div class="tier"><h3>Maatwerk</h3><p class="tier__range">€150.000+</p><p class="tier__price">Op aanvraag</p><ul><li>Nieuwbouw of villa</li><li>Volledige uit- of opbouw</li><li>Monumentaal pand restaureren</li><li>Dedicated bouwteam</li></ul><a href="contact.html" class="link-underline">Plan gesprek</a></div>
    </div>
    <p style="font-family: var(--body); font-size: 13px; color: var(--muted); max-width: 64ch; margin: 32px 0 0; line-height: 1.5;">Indicatie excl. BTW. Werkelijke kosten hangen af van bouwkundige staat, vergunningen, materiaalkeuzes en regio.</p>
  </div>
</section>

<!-- Recente projecten in [stad] -->
<section class="projects">
  <div class="projects__head"><h2 class="section-title">Recent werk uit ${city.name}</h2></div>
  <div class="projects__track">
    <a class="proj-card proj-card--offset-1" href="projecten.html"><div class="proj-card__img"><img loading="lazy" decoding="async" src="${projectImgs[0]}" alt="Renovatie ${city.wijken[0]}"/></div><p class="proj-card__name">Stadswoning ${city.wijken[0]}</p><p class="proj-card__num">01</p></a>
    <a class="proj-card proj-card--offset-3 proj-card--bg-black" href="projecten.html"><div class="proj-card__img"><img loading="lazy" decoding="async" src="${projectImgs[1]}" alt="Badkamer ${city.wijken[1]}"/></div><p class="proj-card__name">Masterbadkamer ${city.wijken[1]}</p><p class="proj-card__num">02</p></a>
    <a class="proj-card proj-card--offset-2" href="projecten.html"><div class="proj-card__img"><img loading="lazy" decoding="async" src="${projectImgs[2]}" alt="Keuken ${city.wijken[2]}"/></div><p class="proj-card__name">Open keuken ${city.wijken[2]}</p><p class="proj-card__num">03</p></a>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="cta__deco" aria-hidden="true"></div>
  <div class="cta__inner">
    <h2 class="cta__title">Verbouwingsplannen in <em>${city.name}</em>?</h2>
    <a href="contact.html" class="link-underline">Plan een gesprek</a>
  </div>
</section>

<!-- FAQ - stad-specifiek -->
<section class="section section--taupe">
  <div class="section__inner">
    <h2 class="section-title section-title--light" style="margin-bottom:50px;">Veelgestelde vragen over ${city.name}</h2>
    <div class="faq">
      <details><summary>Werken jullie ook in ${city.wijken[0]} en omliggende wijken?</summary><div>Ja, we zijn actief in heel ${city.name}, inclusief ${wijkenSentence}. Onze projectleider komt graag bij je langs voor een vrijblijvend gesprek.</div></details>
      <details><summary>Hoe lang duurt een renovatie in ${city.name}?</summary><div>Voor een eenvoudige badkamer of toilet rekenen we 2 tot 4 weken. Een complete verdieping duurt 6 tot 10 weken. Een totaalrenovatie van een woning duurt 3 tot 6 maanden. We geven vooraf een vaste planning.</div></details>
      <details><summary>Wat kost een verbouwing in ${city.name}?</summary><div>Een eenvoudige badkamer start vanaf €8.000. Een volledige verdieping zit meestal tussen €25.000 en €60.000. Een totaalrenovatie van een woning loopt vaak tussen €60.000 en €150.000. Voor nieuwbouw of villa-renovatie maken we maatwerk.</div></details>
      <details><summary>Verzorgen jullie ook de vergunning in ${city.name}?</summary><div>Ja. We werken samen met architect en constructeur en kennen het ${city.name}-omgevingsloket. Het vergunningstraject kunnen we volledig uit handen nemen, inclusief welstand bij monumenten.</div></details>
      <details><summary>Werken jullie met een vaste prijs?</summary><div>Ja. Na het definitieve ontwerp ontvang je een vaste prijsopgave. Meerwerk gebeurt alleen na schriftelijke goedkeuring en blijft uitzondering, geen regel.</div></details>
      <details><summary>Kan ik in mijn woning blijven wonen tijdens de verbouwing?</summary><div>Voor een enkele kamer of badkamer kan dat meestal prima. Bij een totaalrenovatie adviseren we tijdelijk elders te wonen. We bespreken dit altijd vooraf.</div></details>
      <details><summary>Welke garantie krijg ik op het werk?</summary><div>Tot 10 jaar garantie op constructieve onderdelen en 5 jaar op installaties. Sanitairartikelen volgen de fabrikantgarantie. Bij Maatwerk-projecten ontvang je een garantieboek bij oplevering.</div></details>
    </div>
  </div>
</section>

<!-- Nearby cities -->
<section class="section section--taupe" style="padding-top: 0;">
  <div class="section__inner">
    <h2 class="section-title section-title--light" style="margin-bottom:48px;">Ook actief in de omgeving</h2>
    <div class="cities-grid">
      ${nearbyChips}
    </div>
  </div>
</section>

${FOOTER}`;
};

const outDir = __dirname;
let written = 0;
CITIES.forEach((city, idx) => {
  fs.writeFileSync(path.join(outDir, `${city.slug}.html`), cityTemplate(city, idx));
  written++;
});
console.log(`Generated ${written} city pages in ${outDir}`);
