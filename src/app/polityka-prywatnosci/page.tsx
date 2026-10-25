import { PageIntro } from "@/components/page-intro";
import { site } from "@/content/site";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "Polityka prywatności",
    "Zasady przetwarzania danych z formularza zapytania, odbiorcy danych i prawa użytkownika. Dokument przygotowawczy do uzupełnienia przez administratora.",
    "/polityka-prywatnosci",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Polityka prywatności"
        title="Twoje dane. Jasne zasady."
        description="Informacje o danych przekazywanych przez formularz zapytania. Wersja robocza z 25 października 2026 r."
      />
      <article className="shell article-content">
        <div className="legal-status">
          Dokument wymaga uzupełnienia danych administratora i przeglądu
          prawnego przed uruchomieniem strony oraz przyjmowaniem rzeczywistych
          zapytań. Nie jest deklaracją pełnej zgodności prawnej.
        </div>
        <h2>1. Administrator danych</h2>
        <p>
          {site.legalName || "Pełna nazwa administratora: do uzupełnienia."}{" "}
          {site.address || "Adres siedziby: do uzupełnienia."}{" "}
          {site.nip ? `NIP: ${site.nip}.` : "NIP: do uzupełnienia."} Kontakt w
          sprawie danych:{" "}
          {site.email || "adres e-mail do uzupełnienia przed publikacją"}.
        </p>
        <h2>2. Jakie dane i w jakim celu?</h2>
        <p>
          Formularz obejmuje imię, adres e-mail, telefon, województwo, wybraną
          koncepcję, powierzchnię, zakres prac i dobrowolnie podaną treść. Służą
          odpowiedzi na zapytanie i przygotowaniu ustaleń dotyczących
          potencjalnej współpracy. Nie podawaj danych szczególnych kategorii ani
          informacji o innych osobach.
        </p>
        <h2>3. Podstawa prawna i dobrowolność</h2>
        <p>
          Formularz przewiduje zgodę na przetwarzanie danych w celu odpowiedzi
          (art. 6 ust. 1 lit. a RODO). Gdy kontakt dotyczy działań przed
          zawarciem umowy na Twoje żądanie, zastosowanie może mieć art. 6 ust. 1
          lit. b RODO. Właściwą podstawę, jej zakres i treść zgody administrator
          musi potwierdzić przed uruchomieniem. Podanie danych jest dobrowolne,
          ale niezbędne do obsługi formularza.
        </p>
        <h2>4. Odbiorcy i przekazywanie danych</h2>
        <p>
          W konfiguracji przewidziano dostawcę hostingu, usługę pocztową Resend
          oraz usługę limitowania ruchu Upstash Redis. Lista faktycznie użytych
          podmiotów, umowy powierzenia, regiony przechowywania i podstawa
          ewentualnego przekazania poza EOG wymagają potwierdzenia. Dane
          formularza nie są zapisywane w publicznych logach aplikacji. Dostawca
          hostingu może przetwarzać techniczne dane żądania zgodnie ze swoją
          konfiguracją.
        </p>
        <h2>5. Okres przechowywania</h2>
        <p>
          Administrator musi ustalić i wpisać konkretny okres przechowywania
          korespondencji przed uruchomieniem formularza, z uwzględnieniem celu
          kontaktu, obowiązków prawnych i ewentualnych roszczeń. Licznik żądań w
          usłudze ochrony formularza wygasa po 15 minutach. Aplikacja nie tworzy
          bazy zgłoszeń.
        </p>
        <h2>6. Twoje prawa</h2>
        <p>
          W granicach przewidzianych prawem możesz żądać dostępu do danych, ich
          sprostowania, usunięcia, ograniczenia przetwarzania lub przeniesienia.
          Jeżeli przetwarzanie opiera się na zgodzie, możesz ją wycofać bez
          wpływu na zgodność wcześniejszego przetwarzania. Prawo sprzeciwu
          przysługuje w przypadkach przewidzianych RODO. Możesz złożyć skargę do
          Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).
        </p>
        <h2>7. Automatyzacja i bezpieczeństwo</h2>
        <p>
          Nie przewidziano profilowania ani automatycznych decyzji wywołujących
          skutki prawne. Formularz wykorzystuje walidację, ukryte pole
          antyspamowe oraz limity żądań. Zabezpieczenia infrastruktury i dostęp
          do skrzynki pocztowej pozostają obowiązkiem operatora.
        </p>
        <h2>8. Kontakt i aktualizacje</h2>
        <p>
          Przed publikacją należy potwierdzić aktualność tego dokumentu, dane
          kontaktowe i rzeczywisty przepływ danych. Zmiany usług wymagają
          ponownego przeglądu informacji.
        </p>
      </article>
    </>
  );
}
