import Link from "next/link";
import { PlanViewer } from "@/components/plan-viewer";
import { notFound } from "next/navigation";
import { publishedHouses, disclaimer } from "@/content/houses";
import { metadata, JsonLd } from "@/lib/seo";
import { houseDetails, areaFormat } from "@/content/house-details";
import { packages } from "@/content/site";
import { site } from "@/content/site";
import { Gallery } from "@/components/gallery";
import { LeadForm } from "@/components/lead-form";
import { StickyQuote } from "@/components/sticky-quote";
import { HouseCard } from "@/components/house-card";
import { ArrowUpRight, Check } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedHouses.map((h) => ({ slug: h.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = publishedHouses.find((h) => h.slug === slug);
  return h
    ? metadata(
        `${h.name} — dom szkieletowy ${h.footprint} m² zabudowy`,
        `${h.tagline} Koncepcja domu: ${h.bedrooms} ${h.bedrooms === 1 ? "sypialnia" : "sypialnie"}, ok. ${h.usable} m² podłóg netto. Sprawdź układ i zapytaj o indywidualną wycenę.`,
        `/projekty/${h.slug}`,
        h.image,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = publishedHouses.find((h) => h.slug === slug);
  if (!h) notFound();
  const details = houseDetails(h);
  const specs = [
    ["Powierzchnia zabudowy", `${h.footprint} m²`],
    ["Powierzchnia podłóg netto", `ok. ${h.usable} m²`],
    ["Wymiary zewnętrzne", `${h.width} × ${h.depth} m`],
    ["Sypialnie", h.bedrooms],
    ["Łazienki", h.bathrooms],
    ["Kondygnacje", h.floors === 1 ? "Parter" : "Parter + poddasze"],
    ["Dach", h.roof],
    ["Styl", h.style],
    ["Powierzchnia całkowita — szacunek", `${details.gross} m²`],
    ["Pokoje (z salonem)", details.roomCount],
    ["Nachylenie dachu", details.roofPitch],
  ];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Projekty",
              item: `${site.website}/projekty`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: h.name,
              item: `${site.website}/projekty/${h.slug}`,
            },
          ],
        }}
      />
      <section className="shell project-top">
        <div className="breadcrumb">
          <Link href="/">Strona główna</Link>
          <span>/</span>
          <Link href="/projekty">Projekty</Link>
          <span>/</span>
          <span>{h.name}</span>
        </div>
        <div className="project-heading">
          <div>
            <span className="eyebrow">KONCEPCJA / {h.id}</span>
            <h1>
              {h.name}
              <span>.</span>
            </h1>
            <p>{h.tagline}</p>
          </div>
          <Link href="#wycena" className="button">
            Zapytaj o wycenę tego domu <ArrowUpRight size={18} />
          </Link>
        </div>
        <Gallery
          name={h.name}
          images={[
            { src: h.image, alt: `${h.name} — widok główny, koncepcja` },
            { src: h.alternate, alt: `${h.name} — drugi widok koncepcyjny` },
            ...(h.roof === "Płaski" ? [] : [
              ["garden", "widok od ogrodu"],
              ["terrace", "widok z tarasu"],
              ["side", "elewacja boczna"],
              ["aerial", "widok z góry"],
              ["living", "wnętrze salonu"],
              ["kitchen", "wnętrze kuchni"],
              ["bedroom", "wnętrze sypialni"],
            ]).map(([file, label]) => ({src: `/images/houses/${h.slug}/${file}.webp`, alt: `${h.name} — ${label}, wizualizacja koncepcyjna`})),
            {
              src: h.plan,
              alt: `${h.name} — rzut koncepcyjny z wymiarami`,
            },
          ]}
        />
        <div className="project-specs">
          {specs.slice(0, 4).map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="shell project-body">
        <div>
          <span className="eyebrow">DOM PO TWOJEMU</span>
          <h2>
            Przestrzeń na
            <br />
            <span>Twoją codzienność.</span>
          </h2>
          <p>{h.description}</p>
          <p>{h.audience}</p>
          <div className="notice">{h.note}</div>
          <h3>Co wyróżnia tę koncepcję?</h3>
          <ul className="benefit-list">
            {h.benefits.map((b) => (
              <li key={b}>
                <Check size={18} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <aside className="spec-panel">
          <span className="eyebrow">PASZPORT KONCEPCJI</span>
          <h3>Najważniejsze szczegóły</h3>
          <dl>
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p>
            <strong>Elewacja</strong>
            <br />
            {h.facade}
          </p>
          <p className="fine">
            Wartości orientacyjne. Bez zatwierdzonej dokumentacji technicznej i
            charakterystyki energetycznej.
          </p>
        </aside>
      </section>
      <section className="plan-section">
        <div className="shell plan-grid">
          <div>
            <span className="eyebrow">FUNKCJA PRZEDE WSZYSTKIM</span>
            <h2>
              Każdy metr
              <br />
              <span>ma znaczenie.</span>
            </h2>
            <p>{h.layout}</p>
            <p className="fine">Wizualizacje pokazują charakter architektury. Rzut jest propozycją funkcjonalną; dokładne rozmieszczenie otworów należy skoordynować w dokumentacji.</p>
            <p className="notice">
              Rzut koncepcyjny: ściany, otwory, wyposażenie i pola podłóg z jednego modelu geometrycznego.
              Powierzchnie netto nie są obmiarem użytkowym według normy; na poddaszu nie odjęto skosów.
              Dokumentację do budowy przygotowuje uprawniony projektant.
            </p>
            <a href={h.plan} target="_blank" rel="noopener" className="text-link">
              Pobierz komplet rzutów SVG <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="plan-image">
            <PlanViewer name={h.name} slug={h.slug} floors={h.floors} />
          </div>
        </div>
      </section>
      <section className="shell room-schedule" aria-labelledby="room-heading">
        <span className="eyebrow">PROGRAM POWIERZCHNIOWY</span>
        <h2 id="room-heading">Miejsce na codzienność.</h2>
        <p>Powierzchnie wynikają z wymiarów w świetle ścian pokazanych na rzucie. Suma nie obejmuje ścian i otworu schodowego. Na poddaszu podano pola podłóg przed korektą za skosy; to nie jest obmiar powierzchni użytkowej według normy.</p>
        <table>
          <caption>{h.name} — bilans podłóg netto</caption>
          <thead><tr><th scope="col">Pomieszczenie / strefa</th><th scope="col">Poziom</th><th scope="col">Powierzchnia</th></tr></thead>
          <tbody>{details.rooms.map((r, i) => <tr key={i}><th scope="row">{r.name}</th><td>{r.level === 0 ? "Parter" : "Poddasze"}</td><td>{areaFormat(r.area)} m²</td></tr>)}</tbody>
          <tfoot><tr><th colSpan={2} scope="row">Razem — podłogi netto</th><td>{areaFormat(details.rooms.reduce((sum,r) => sum + r.area, 0))} m²</td></tr></tfoot>
        </table>
        <p className="notice">Zabudowy: {h.footprint} m² — zewnętrzny obrys {h.width} × {h.depth} m. Podłogi netto: {areaFormat(h.usable)} m² — suma pomieszczeń po odjęciu ścian i otworu schodowego. Taras rozlicza się oddzielnie. Powierzchnię użytkową z uwzględnieniem skosów określi projektant.</p>
      </section>
      <section className="shell project-options">
        <span className="eyebrow">MATERIAŁY I MOŻLIWOŚCI</span>
        <h2>Twój dom. Twój charakter.</h2>
        <div className="content-cards">{details.finishes.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div>
        <div className="content-cards">
          <article><h3>Konstrukcja</h3><p>{details.structure}</p></article>
          <article><h3>Taras i ogród</h3><p>{details.terrace}</p></article>
          <article><h3>Światło we wnętrzu</h3><p>{details.glazing}</p></article>
        </div>
        <h3>Co można omówić z projektantem?</h3>
        <ul className="benefit-list">{details.changes.map((change) => <li key={change}><Check size={18} />{change}</li>)}</ul>
      </section>
      <section className="shell project-options">
        <span className="eyebrow">ZAKRES DO UZGODNIENIA</span>
        <h2>Wybierz punkt wyjścia.</h2>
        <p>Poniższe warianty pomagają przygotować zapytanie. Wiążący zakres, materiały i odpowiedzialność stron określa indywidualna oferta oraz umowa.</p>
        <div className="content-cards">{packages.map((pack) => <article key={pack.name}><h3>{pack.name}</h3><p>{pack.description}</p><ul>{pack.items.map((item) => <li key={item}>{item}</li>)}</ul><Link className="text-link" href="#wycena">Zapytaj o indywidualną wycenę <ArrowUpRight size={18}/></Link></article>)}</div>
      </section>
      <section className="shell legal-notice">
        <p>{disclaimer}</p>
        <p>
          Powierzchnia zabudowy do 70 m² sama w sobie nie przesądza o
          dopuszczalnym trybie budowy.
        </p>
      </section>
      <section id="wycena" className="quote-section">
        <div className="shell quote-grid">
          <div className="quote-copy">
            <span className="eyebrow">TWÓJ KOLEJNY KROK</span>
            <h2>
              {h.name}
              <br />
              <span>w Twojej historii.</span>
            </h2>
            <p>
              Opowiedz o swojej działce i potrzebach. W zapytaniu automatycznie
              dołączymy numer i nazwę tej koncepcji.
            </p>
          </div>
          <div className="quote-form-panel">
            <h3>Zapytaj o {h.name}</h3>
            <LeadForm projectId={h.id} />
          </div>
        </div>
      </section>
      <section className="shell related-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">WARTO PORÓWNAĆ</span>
            <h2>Inne możliwości.</h2>
          </div>
          <Link href="/projekty" className="text-link">
            Wszystkie projekty <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="house-grid">
          {publishedHouses
            .filter((x) => x.id !== h.id)
            .sort(
              (a, b) =>
                Math.abs(a.footprint - h.footprint) -
                Math.abs(b.footprint - h.footprint),
            )
            .slice(0, 3)
            .map((x) => (
              <HouseCard key={x.id} house={x} />
            ))}
        </div>
      </section>
      <StickyQuote name={h.name} />
    </>
  );
}
