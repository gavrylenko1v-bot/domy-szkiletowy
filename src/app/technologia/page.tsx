import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { metadata } from "@/lib/seo";
import { stages } from "@/content/site";
import { ArrowUpRight } from "@/components/icons";
export const generateMetadata = () =>
  metadata(
    "Technologia drewnianych domów szkieletowych",
    "Konstrukcja, izolacja, dach, fundamenty i energooszczędność domu drewnianego. Poznaj zasady, które warto omówić przed rozpoczęciem budowy.",
    "/technologia",
  );
const topics = [
  [
    "Konstrukcja ścian",
    "Szkielet z drewna konstrukcyjnego przenosi obciążenia zgodnie z projektem. Klasa, wilgotność drewna, przekroje, usztywnienie i łączniki muszą wynikać z obliczeń. Okładziny i warstwy ściany dobiera się jako kompletny system.",
  ],
  [
    "Izolacja i szczelność",
    "Izolacja cieplna, warstwa kontroli pary wodnej, wiatroizolacja i wentylowana elewacja pełnią różne funkcje. Ważna jest ciągłość warstw oraz analiza wilgotnościowa. Grubość i rodzaj izolacji ustala projektant.",
  ],
  [
    "Dach i ochrona przed wodą",
    "Geometria dachu, pokrycie, obróbki, odwodnienie i wentylacja muszą współpracować. Dach dwuspadowy jest punktem wyjścia naszych koncepcji; konstrukcję należy dobrać do lokalnych obciążeń śniegiem i wiatrem.",
  ],
  [
    "Energoefektywność bez obietnic na skróty",
    "Zapotrzebowanie na energię zależy od przegród, stolarki, mostków cieplnych, wentylacji i źródła ciepła. Nie deklarujemy parametrów U, EP ani standardu pasywnego bez dokumentacji i obliczeń.",
  ],
  [
    "Fundament dopasowany do gruntu",
    "Płyta fundamentowa, ławy lub inne rozwiązanie wymagają oceny warunków gruntowo-wodnych i projektu. Izolacje, połączenie z drewnianą konstrukcją i przepusty instalacyjne planuje się przed rozpoczęciem prac.",
  ],
  [
    "Instalacje i komfort użytkowania",
    "Ogrzewanie, wentylację, elektrykę i wodę planuje się razem z konstrukcją. Ochrona akustyczna, bezpieczeństwo pożarowe oraz serwisowalność instalacji wymagają świadomego doboru rozwiązań.",
  ],
];
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Technologia"
        title="Naturalny materiał. Przemyślany system."
        description="Dobry dom szkieletowy to więcej niż drewno. To właściwe połączenie konstrukcji, izolacji, instalacji i starannego wykonania."
      />
      <section className="shell editorial-grid">
        <div className="editorial-image">
          <Image
            src="/images/houses/classic-55/exterior.webp"
            fill
            sizes="(max-width: 650px) 100vw, 50vw"
            alt="Koncepcja CLASSIC 55 z naturalną drewnianą elewacją"
          />
        </div>
        <div>
          <span className="eyebrow">KAŻDA WARSTWA MA ZNACZENIE</span>
          <h2>
            Komfort zaczyna się
            <br />
            <span>od detalu.</span>
          </h2>
          <p>
            Układ warstw musi odpowiadać projektowi, a nie uniwersalnemu
            schematowi z internetu. Poniższa lista opisuje funkcje, nie
            zatwierdzoną specyfikację ściany.
          </p>
          <ol className="technology-layers">
            <li>Wykończenie wnętrza i przestrzeń instalacyjna</li>
            <li>Kontrola przepływu powietrza i pary wodnej</li>
            <li>Konstrukcja oraz izolacja termiczna</li>
            <li>Warstwa chroniąca przed wiatrem i wodą</li>
            <li>Szczelina wentylacyjna i elewacja</li>
          </ol>
        </div>
      </section>
      <section className="shell content-cards">
        {topics.map(([title, body], i) => (
          <article key={title}>
            <span className="eyebrow">0{i + 1} / TECHNOLOGIA</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="process-section">
        <div className="shell">
          <span className="eyebrow">DOBRZE ZAPLANOWANY PROCES</span>
          <h2>Od potrzeb do odbioru.</h2>
          <div className="process-grid">
            {stages.map(([name, body], i) => (
              <article key={name}>
                <span className="step-number">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="shell legal-notice">
        <p>
          Opis ma charakter informacyjny. Parametry, materiały, terminy i
          odpowiedzialność wykonawcy wymagają potwierdzenia w projekcie,
          specyfikacji oraz umowie.
        </p>
        <Link href="/kontakt#wycena" className="text-link">
          Porozmawiajmy o Twoich potrzebach <ArrowUpRight size={17} />
        </Link>
      </section>
    </>
  );
}
