import { netFloorArea } from "./floor-plans";
export type House = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  footprint: number;
  usable: number;
  width: number;
  depth: number;
  floors: 1 | 2;
  bedrooms: number;
  bathrooms: number;
  roof: "Dwuspadowy" | "Płaski";
  terrace: boolean;
  style: "Skandynawski" | "Nowoczesna stodoła" | "Minimalistyczny";
  facade: string;
  layout: string;
  audience: string;
  benefits: string[];
  note: string;
  published: boolean;
  image: string;
  alternate: string;
  plan: string;
  imageStatus: "concept-render" | "illustration";
};
const concepts = [
  {
    name: "MINI 35",
    slug: "mini-35",
    tagline: "Mały dom. Wielka swoboda.",
    footprint: 43.2,
    usable: 27,
    width: 7.5,
    depth: 5.76,
    floors: 1,
    bedrooms: 1,
    bathrooms: 1,
    style: "Minimalistyczny",
    facade: "Pionowa deska modrzewiowa i grafitowa stolarka",
    layout:
      "Strefa dzienna z aneksem, kompaktowa sypialnia, łazienka z prysznicem oraz wejście z miejscem na szafę.",
    audience: "Dla jednej osoby lub pary, która ceni prostotę.",
    note: "Sypialnia jest kompaktowa; miejsce do pracy przewidziano w strefie dziennej.",
  },
  {
    name: "NATURA 45",
    slug: "natura-45",
    tagline: "Bliżej natury, bliżej siebie.",
    footprint: 45,
    usable: 36,
    width: 9,
    depth: 5,
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    style: "Skandynawski",
    facade: "Jasne drewno świerkowe i ciemne obróbki",
    layout:
      "Salon z kuchnią, sypialnia główna, mała sypialnia gościnna lub gabinet, łazienka i komunikacja.",
    audience: "Dla pary potrzebującej dodatkowego pokoju.",
    note: "Druga sypialnia jest pokojem jednoosobowym; nie zakładamy dwóch pełnych sypialni dwuosobowych.",
  },
  {
    name: "CLASSIC 55",
    slug: "classic-55",
    tagline: "Proporcje, które zostają na lata.",
    footprint: 55,
    usable: 45,
    width: 10,
    depth: 5.5,
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    style: "Skandynawski",
    facade: "Naturalny modrzew i jasny tynk na wybranych fragmentach",
    layout:
      "Dwie sypialnie w cichej części domu, otwarta kuchnia z jadalnią, salon, łazienka i wiatrołap.",
    audience: "Dla małej rodziny lub pary pracującej z domu.",
    note: "Powierzchnia użytkowa zależy od grubości przegród i projektu instalacji.",
  },
  {
    name: "KOMFORT 60",
    slug: "komfort-60",
    tagline: "Codzienność w dobrym rytmie.",
    footprint: 60,
    usable: 50,
    width: 10,
    depth: 6,
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    style: "Skandynawski",
    facade: "Pionowy modrzew naturalny, grafitowa stolarka i dach na rąbek",
    layout:
      "Salon z jadalnią otwarty na ogród, aneks kuchenny, dwie sypialnie, łazienka i wejście z szafą.",
    audience: "Dla pary lub rodziny z jednym dzieckiem.",
    note: "Taras jest elementem opcjonalnym, nieuwzględnionym w podanej powierzchni zabudowy.",
  },
  {
    name: "RODZINNY 65",
    slug: "rodzinny-65",
    tagline: "Każdy ma swój kawałek domu.",
    footprint: 65,
    usable: 55,
    width: 10,
    depth: 6.5,
    floors: 1,
    bedrooms: 3,
    bathrooms: 1,
    style: "Skandynawski",
    facade: "Deska naturalna z fragmentami jasnej okładziny",
    layout:
      "Trzy niewielkie sypialnie w tylnej części, wspólna strefa dzienna z aneksem, łazienka oraz krótki korytarz.",
    audience: "Dla rodziny preferującej mniejsze pokoje i wspólny salon.",
    note: "Dwie sypialnie dziecięce zakładają łóżka pojedyncze; dla większych pokoi polecamy wariant dwusypialniany.",
  },
  {
    name: "OPTIMA 70",
    slug: "optima-70",
    tagline: "Przestrzeń dobrze przemyślana.",
    footprint: 70,
    usable: 60,
    width: 10,
    depth: 7,
    floors: 1,
    bedrooms: 3,
    bathrooms: 1,
    style: "Minimalistyczny",
    facade: "Jasne drewno, grafitowy parapet i płaski dach ze spadkiem ukrytym za attyką",
    layout:
      "Salon z kuchnią i jadalnią, trzy sypialnie, łazienka, wiatrołap i wnęka techniczna.",
    audience: "Dla rodziny potrzebującej trzech oddzielnych pokoi.",
    note: "Wielkość pomieszczenia technicznego należy dobrać do wybranego źródła ciepła.",
  },
  {
    name: "SMART",
    slug: "smart-48",
    tagline: "Więcej możliwości na małej działce.",
    footprint: 40.0,
    usable: 61,
    width: 8,
    depth: 5.0,
    floors: 2,
    bedrooms: 2,
    bathrooms: 1,
    style: "Minimalistyczny",
    facade: "Pionowa deska i antracytowe detale",
    layout:
      "Parter: salon, kuchnia, łazienka i schody. Poddasze: dwie sypialnie i komunikacja.",
    audience: "Dla pary lub małej rodziny, która chce oddzielić strefę nocną.",
    note: "Orientacyjna powierzchnia użytkowa poddasza uwzględnia skosy; wysokości i schody wymagają projektu.",
  },
  {
    name: "FAMILY PLUS",
    slug: "family-plus-55",
    tagline: "Miejsce na kolejny rozdział.",
    footprint: 44.0,
    usable: 72,
    width: 8,
    depth: 5.5,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    style: "Skandynawski",
    facade: "Modrzew naturalny i grafitowa blacha",
    layout:
      "Parter: pokój do pracy lub sypialnia, salon z kuchnią, łazienka i schody. Poddasze: dwie sypialnie oraz mała łazienka.",
    audience: "Dla rodziny szukającej elastycznego układu.",
    note: "Pokój na parterze jest kompaktowy. Dwie łazienki zakładają wspólny pion instalacyjny.",
  },
  {
    name: "STODOŁA",
    slug: "stodola-60",
    tagline: "Prosta forma. Wyjątkowy charakter.",
    footprint: 44.52,
    usable: 78,
    width: 8.4,
    depth: 5.3,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    style: "Nowoczesna stodoła",
    facade: "Ciemna deska, naturalny modrzew przy wejściu i dach na rąbek",
    layout:
      "Parter: salon, aneks, mały pokój i łazienka. Poddasze: dwie sypialnie i druga łazienka.",
    audience: "Dla osób ceniących czystą formę i dom z poddaszem.",
    note: "Wariant 2–3 sypialni: pokój na parterze może powiększyć salon. Nie przewidujemy otwartej antresoli w wariancie 3 sypialni.",
  },
  {
    name: "MAX",
    slug: "max-70",
    tagline: "Dom, który mieści Twoje plany.",
    footprint: 44.72,
    usable: 94,
    width: 8.6,
    depth: 5.2,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    style: "Nowoczesna stodoła",
    facade: "Naturalne drewno, grafitowa blacha i ciemna stolarka",
    layout:
      "Parter: salon z kuchnią, pokój, łazienka i schody. Poddasze: dwie sypialnie, łazienka i hol.",
    audience: "Dla rodziny potrzebującej pokoju do pracy na parterze.",
    note: "Trzy pokoje sypialne: pokój na parterze można przeznaczyć na gabinet. Poddasze wymaga sprawdzenia wysokości pod skosami.",
  },
] as const;
export const houses: House[] = concepts.map((h, i) => ({
  ...h,
  id: `DOM-${String(i + 1).padStart(2, "0")}`,
  roof: h.slug === "optima-70" ? "Płaski" : "Dwuspadowy",
  usable: netFloorArea(h),
  terrace: !["mini-35", "smart-48"].includes(h.slug),
  description: `${h.name} to koncepcja drewnianego domu szkieletowego o powierzchni zabudowy ${h.footprint} m². ${h.layout} Zwarta bryła pozwala świadomie zaplanować przestrzeń, a naturalne materiały tworzą spokojne tło codzienności. Rozmieszczenie okien i orientację strefy dziennej należy dopasować do konkretnej działki.`,
  benefits: [
    "Zwarta, czytelna bryła",
    "Naturalne materiały elewacyjne",
    h.floors === 1
      ? "Wszystkie pomieszczenia na jednym poziomie"
      : "Oddzielona strefa dzienna i nocna",
    "Możliwość dopasowania do działki",
  ],
  published: true,
  image: `/images/houses/${h.slug}/${h.slug === "optima-70" ? "flat-front" : "exterior"}.webp`,
  alternate: `/images/houses/${h.slug}/${h.slug === "optima-70" ? "flat-rear" : "alternate"}.webp`,
  plan: `/images/houses/${h.slug}/plan.svg`,
  imageStatus: "concept-render",
}));
export const publishedHouses = houses.filter((h) => h.published);
export const disclaimer =
  "Przedstawione wizualizacje i układy funkcjonalne mają charakter koncepcyjny. Realizacja wymaga przygotowania odpowiedniej dokumentacji projektowej oraz dostosowania budynku do warunków działki i obowiązujących przepisów.";
