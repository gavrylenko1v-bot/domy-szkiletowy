import Link from "next/link";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { metadata } from "@/lib/seo";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/icons";
export const generateMetadata = () =>
  metadata(
    "O nas — podejście do domów szkieletowych",
    "Poznaj podejście do naturalnych materiałów, funkcjonalnych koncepcji i przejrzystej rozmowy o budowie domu. Informacje firmowe są w przygotowaniu.",
    "/o-nas",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="O nas"
        title="Dom zaczyna się od Ciebie."
        description="Od sposobu, w jaki lubisz spędzać poranki. Od tego, ile potrzebujesz ciszy. Od ludzi, z którymi chcesz dzielić codzienność."
      />
      <section className="shell editorial-grid">
        <div>
          <span className="eyebrow">NASZE PODEJŚCIE</span>
          <h2>
            Prostota, która
            <br />
            <span>robi miejsce na życie.</span>
          </h2>
          <p>{site.about}</p>
          <p>
            Pokazujemy możliwości, wyraźnie oddzielając wizję od zatwierdzonej
            dokumentacji. Nie podajemy automatycznych cen ani parametrów,
            których nie potwierdza projekt.
          </p>
          <Link href="/projekty" className="text-link">
            Odkryj koncepcje domów <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="editorial-image">
          <Image
            src="/images/houses/komfort-60/exterior.webp"
            fill
            sizes="(max-width: 650px) 100vw, 50vw"
            alt="Drewniany dom KOMFORT 60 — wizja przestrzeni blisko natury"
          />
        </div>
      </section>
      <section className="shell content-cards">
        {[
          [
            "Uważna rozmowa",
            "Dobór koncepcji zaczyna się od potrzeb, działki i realnego budżetu, a nie od gotowej obietnicy.",
          ],
          [
            "Przejrzyste ustalenia",
            "Zakres usług, odpowiedzialność za dokumentację, specyfikacja materiałów i harmonogram wymagają pisemnego potwierdzenia.",
          ],
          [
            "Szacunek do miejsca",
            "Orientację domu, okna i taras dopasowuje się do światła, sąsiedztwa i warunków konkretnej działki.",
          ],
          [
            "Fakty zamiast deklaracji",
            "Informacje o zespole, doświadczeniu, realizacjach i certyfikatach opublikujemy po ich potwierdzeniu przez właściciela.",
          ],
        ].map(([title, body], i) => (
          <article key={title}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="shell article-content">
        <h2>Informacje o firmie</h2>
        <div className="legal-status">
          VERTEX I.S.O to marka firmy specjalizującej się w domach szkieletowych
          do 70 m² powierzchni zabudowy. Dane rejestrowe, opis zespołu,
          rzeczywisty zakres usług i obszar realizacji wymagają uzupełnienia
          oraz zatwierdzenia.
        </div>
        <p>
          {site.legalName || "Pełna nazwa firmy: w przygotowaniu."}
          <br />
          {site.nip ? `NIP: ${site.nip}` : "NIP: w przygotowaniu."}
          <br />
          {site.address || "Adres siedziby: w przygotowaniu."}
        </p>
        <p>{site.serviceArea}</p>
      </section>
    </>
  );
}
