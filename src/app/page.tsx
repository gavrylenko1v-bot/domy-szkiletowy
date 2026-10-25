import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Layers3,
  Sun,
  Ruler,
} from "@/components/icons";
import { HouseCard } from "@/components/house-card";
import { FAQ } from "@/components/faq";
import { LeadForm } from "@/components/lead-form";
import { publishedHouses } from "@/content/houses";
import { packages, stages } from "@/content/site";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "Nowoczesne domy szkieletowe dopasowane do Ciebie",
    "Koncepcje domów drewnianych do 70 m² powierzchni zabudowy. Poznaj projekty parterowe i z poddaszem, technologię i możliwości indywidualnej wyceny.",
    "/",
  );
export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-topline">
          <span className="eyebrow">
            <span className="tiny-dot" /> NATURALNIE. PO TWOJEMU.
          </span>
          <span className="hero-edition">ARCHITEKTURA DOBREGO ŻYCIA / 01</span>
        </div>
        <div className="hero-heading">
          <h1>
            Nowoczesne domy szkieletowe
            <br className="desktop-break" />{" "}
            <span>dopasowane do Twoich potrzeb.</span>
          </h1>
          <div className="hero-aside">
            <p>
              Naturalne materiały. Przemyślana przestrzeń.
              <br />
              Odkryj koncepcję domu, w którym
              <br className="desktop-break" /> zacznie się Twój nowy rozdział.
            </p>
            <Link href="/projekty" className="text-link">
              Poznaj nasze podejście <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/hero.webp"
            alt="Koncepcyjna wizualizacja KOMFORT 60: drewniany dom w otoczeniu zieleni"
            fill
            priority
            sizes="100vw"
            className="hero-photo"
          />
          <div className="hero-shade" />
          <div className="hero-image-label">
            <span className="tiny-dot" /> TWOJE MIEJSCE. BLIŻEJ NATURY.
          </div>
          <div className="hero-bottom">
            <div>
              <span className="hero-model">KOMFORT 60</span>
              <p>
                60 m² zabudowy <span>·</span> 2 sypialnie <span>·</span> Dom
                parterowy
              </p>
              <small>
                Wizualizacja koncepcyjna. Rozwiązania wymagają weryfikacji.
              </small>
            </div>
            <Link
              href="/projekty/komfort-60"
              className="hero-round"
              aria-label="Zobacz projekt KOMFORT 60"
            >
              <ArrowUpRight size={30} />
            </Link>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/projekty">
              Zobacz projekty <ArrowUpRight size={18} />
            </Link>
            <Link className="button white-button" href="#wycena">
              Zapytaj o wycenę <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-foot">
          <span>MNIEJ ZBĘDNYCH METRÓW. WIĘCEJ ŻYCIA.</span>
          <span>
            Przewiń i poznaj możliwości <span aria-hidden="true">↓</span>
          </span>
        </div>
      </section>
      <section className="intro-strip shell">
        <div className="section-kicker">
          <span className="eyebrow">01 / FILOZOFIA DOMU</span>
          <p>
            Dobry dom zaczyna się
            <br />
            od dobrych pytań.
          </p>
        </div>
        <div className="intro-copy">
          <h2>
            Nie chodzi o większy dom.
            <br />
            Chodzi o <span>lepszą przestrzeń do życia.</span>
          </h2>
          <p>
            Poranna kawa z widokiem na ogród. Światło wpadające do salonu.
            Miejsce na to, co naprawdę ważne. Zobacz, jak prosta architektura i
            drewno mogą stworzyć Twój dom.
          </p>
          <div className="value-row">
            <span>
              <Leaf size={21} />
              Naturalne materiały
            </span>
            <span>
              <Ruler size={21} />
              Przemyślane metry
            </span>
            <span>
              <Sun size={21} />
              Bliskość natury
            </span>
          </div>
        </div>
      </section>
      <section className="projects-section">
        <div className="shell">
          <div className="section-title">
            <div>
              <span className="eyebrow">02 / ZNAJDŹ SWOJĄ PRZESTRZEŃ</span>
              <h2>
                Mały metraż.
                <br />
                <span>Duże możliwości.</span>
              </h2>
            </div>
            <div className="section-title-aside">
              <p>
                Od pierwszego własnego miejsca
                <br />
                po dom dla całej rodziny.
              </p>
              <Link href="/projekty" className="text-link">
                Wszystkie projekty <span className="count-pill">10</span>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="house-grid">
            {["mini-35", "komfort-60", "stodola-60"].map((slug) => (
              <HouseCard
                key={slug}
                house={publishedHouses.find((h) => h.slug === slug)!}
              />
            ))}
          </div>
          <p className="catalog-note">
            Podane metraże oznaczają powierzchnię zabudowy. Wszystkie projekty
            są koncepcyjne.
          </p>
        </div>
      </section>
      <section className="technology-section shell">
        <div className="technology-image">
          <Image
            src="/images/houses/natura-45/exterior.webp"
            alt="Koncepcja NATURA 45 — naturalne materiały elewacji"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <span className="image-note">DREWNO. ŚWIATŁO. SPOKÓJ.</span>
        </div>
        <div className="technology-copy">
          <span className="eyebrow">03 / NATURALNIE DOBRA TECHNOLOGIA</span>
          <h2>
            Lekka konstrukcja.
            <br />
            <span>Solidne podstawy.</span>
          </h2>
          <p>
            Dom szkieletowy to system, w którym liczy się każdy detal: suche
            drewno konstrukcyjne, ciągłość izolacji i starannie zaprojektowane
            połączenia.
          </p>
          <div className="tech-feature">
            <Layers3 size={24} />
            <div>
              <h3>Przegrody zaprojektowane jako całość</h3>
              <p>
                Materiały dobierane do projektu, klimatu i warunków użytkowania.
              </p>
            </div>
          </div>
          <div className="tech-feature">
            <Leaf size={24} />
            <div>
              <h3>Drewno w centrum koncepcji</h3>
              <p>Naturalny materiał i przemyślana ochrona przed wilgocią.</p>
            </div>
          </div>
          <Link className="button outline" href="/technologia">
            Poznaj technologię <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="process-section">
        <div className="shell">
          <div className="section-title">
            <div>
              <span className="eyebrow">04 / OD POMYSŁU DO DOMU</span>
              <h2>
                Jasna droga.
                <br />
                <span>Krok po kroku.</span>
              </h2>
            </div>
            <p>
              Najpierw Twoje potrzeby.
              <br />
              Potem konkretne rozwiązania.
            </p>
          </div>
          <div className="process-grid">
            {stages.map(([name, text], i) => (
              <article key={name}>
                <span className="step-number">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="shell packages-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">05 / ZAKRES DOPASOWANY DO CIEBIE</span>
            <h2>
              Ty wybierasz,
              <br />
              <span>na jakim etapie dołączysz.</span>
            </h2>
          </div>
          <p>
            Dokładną specyfikację i cenę
            <br />
            ustalamy w indywidualnej ofercie.
          </p>
        </div>
        <div className="package-grid">
          {packages.map((p, i) => (
            <article key={p.name}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <ul>
                {p.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link href="#wycena" className="text-link">
                Porozmawiajmy o zakresie <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="quote-section" id="wycena">
        <div className="shell quote-grid">
          <div className="quote-copy">
            <span className="eyebrow">06 / ZACZNIJMY OD ROZMOWY</span>
            <h2>
              Jak wygląda
              <br />
              Twój wymarzony
              <br />
              <span>dom?</span>
            </h2>
            <p>
              Wybierz koncepcję i powiedz nam, czego potrzebujesz. To pierwszy
              krok do indywidualnej wyceny.
            </p>
            <div className="quote-detail">
              <span>01</span>
              <p>Wybierasz dom i zakres prac.</p>
            </div>
            <div className="quote-detail">
              <span>02</span>
              <p>Opisujesz działkę i swoje potrzeby.</p>
            </div>
            <div className="quote-detail">
              <span>03</span>
              <p>Ustalamy możliwości i kolejne kroki.</p>
            </div>
            <p className="fine">
              Bez automatycznych, orientacyjnych cen.
              <br />
              Każda działka i każdy dom to osobna historia.
            </p>
          </div>
          <div className="quote-form-panel">
            <h3>Porozmawiajmy o Twoim projekcie</h3>
            <p className="form-subtitle">
              Kilka szczegółów pomoże przygotować odpowiedź.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>
      <section className="shell faq-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">07 / DOBRZE WIEDZIEĆ</span>
            <h2>
              Masz pytania?
              <br />
              <span>Zacznij tutaj.</span>
            </h2>
          </div>
          <Link href="/faq" className="text-link">
            Wszystkie odpowiedzi <ArrowRight size={17} />
          </Link>
        </div>
        <FAQ limit={5} />
      </section>
    </>
  );
}
