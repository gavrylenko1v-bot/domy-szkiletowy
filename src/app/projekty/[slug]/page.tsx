import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedHouses, disclaimer } from "@/content/houses";
import { metadata, JsonLd } from "@/lib/seo";
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
        `${h.tagline} Koncepcja domu: ${h.bedrooms} ${h.bedrooms === 1 ? "sypialnia" : "sypialnie"}, ok. ${h.usable} m² powierzchni użytkowej. Sprawdź układ i zapytaj o indywidualną wycenę.`,
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
  const specs = [
    ["Powierzchnia zabudowy", `${h.footprint} m²`],
    ["Powierzchnia użytkowa", `ok. ${h.usable} m²`],
    ["Wymiary zewnętrzne", `${h.width} × ${h.depth} m`],
    ["Sypialnie", h.bedrooms],
    ["Łazienki", h.bathrooms],
    ["Kondygnacje", h.floors === 1 ? "Parter" : "Parter + poddasze"],
    ["Dach", h.roof],
    ["Styl", h.style],
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
            {
              src: h.plan,
              alt: `${h.name} — schemat stref, nie rzut budowlany`,
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
            <p className="notice">
              To schemat stref w obrysie {h.width} × {h.depth} m. Nie
              przedstawia zatwierdzonych wymiarów pokoi, okien, drzwi ani
              instalacji. Schody i skosy wymagają indywidualnego opracowania.
            </p>
            <a
              href={h.plan}
              target="_blank"
              rel="noopener"
              className="text-link"
            >
              Otwórz schemat w pełnym rozmiarze <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="plan-image">
            <Image
              src={h.plan}
              alt={`Schemat koncepcyjny stref ${h.name}, obrys ${h.width} na ${h.depth} m`}
              width={850}
              height={h.floors === 2 ? 1250 : 730}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
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
